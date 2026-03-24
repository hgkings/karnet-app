# Kârnet — Claude Code Mimari Kuralları

Bu dosya Kârnet projesinde çalışan tüm
AI agent'lar için bağlayıcı kurallardır.
Hiçbir kural hiçbir gerekçeyle çiğnenemez.

---

## MİMARİ YAPI

Kârnet katmanlı mimari kullanır.
Her katman sadece bir altındakiyle konuşur.
Katlamlar arası atlama KESİNLİKLE YASAKTIR.

```
UI Layer (app/ altındaki page.tsx ve components/)
  ↓ sadece fetch() ile API çağırır
API Layer (app/api/ altındaki route.ts dosyaları)
  ↓ sadece service fonksiyonlarını çağırır
Service Layer (services/ klasörü)
  ↓ sadece DAL fonksiyonlarını çağırır
DAL Layer (dal/ klasörü)
  ↓ tek DB erişim noktası
Supabase
```

---

## KLASÖR SORUMLULUKLARI

### `app/` — UI Layer
- Sadece veri gösterir, kullanıcıdan girdi alır
- Hiçbir SQL veya Supabase çağrısı içermez
- Hiçbir iş mantığı içermez
- Sadece `fetch('/api/...')` ile API'ye istek atar

### `app/api/` — API Layer
- Her route şunları yapar (sırasıyla):
  1. Session/token kontrolü
  2. Input validasyonu (zod ile)
  3. Service fonksiyonunu çağırır
  4. Sonucu döner
- Supabase'e direkt bağlanmaz
- İş mantığı içermez

### `services/` — Service Layer
- İş mantığının döndüğü tek yer
- Veriyi işler, dönüştürür, hesaplar
- DAL fonksiyonlarını çağırır
- Supabase'e direkt bağlanmaz
- HTTP request/response bilmez

### `dal/` — Data Access Layer
- Veritabanına dokunan TEK yer
- Sadece ham CRUD işlemleri
- İş mantığı içermez
- Supabase server client kullanır
- Her fonksiyon tek bir işlem yapar

### `lib/` — Yardımcı Fonksiyonlar
- Genel yardımcı fonksiyonlar
- Email, crypto, format vb.
- DB'ye bağlanmaz

---

## YASAK LİSTESİ

Aşağıdakiler KESİNLİKLE YASAKTIR:

### UI'da Yasak
```
❌ import { supabase } from '@/lib/supabaseClient'
   — UI dosyalarında Supabase import edilemez

❌ dangerouslySetInnerHTML={{ __html: data }}
   — Temizlenmemiş HTML basılamaz
   — Kullanılacaksa mutlaka DOMPurify ile temizle:
   dangerouslySetInnerHTML={{
     __html: DOMPurify.sanitize(data)
   }}

❌ await supabase.from('...').select()
   — UI'dan direkt DB sorgusu yapılamaz
```

### API Route'larda Yasak
```
❌ import { createAdminClient } from '@/lib/supabase'
   — Admin client sadece DAL'da kullanılır

❌ supabase.from('...').select(userInput)
   — Kullanıcı girdisi direkt sorguya giremez
   — Önce zod ile validate et

❌ if (!session) { // iş mantığı buraya }
   — İş mantığı API route'da olmaz, service'e taşı
```

### Service'te Yasak
```
❌ import { createServerClient } from '@supabase/ssr'
   — Supabase bağlantısı sadece DAL'da

❌ request.headers, NextResponse
   — HTTP katmanı bilgisi service'e girmez
```

### DAL'da Yasak
```
❌ if (price > 100) { discount = 0.1 }
   — İş mantığı DAL'a girmez

❌ createBrowserClient(...)
   — DAL sadece server client kullanır
```

### Her Yerde Yasak
```
❌ SUPABASE_SERVICE_ROLE_KEY
   — Sadece dal/ klasöründe kullanılabilir

❌ Kullanıcı girdisini doğrudan SQL'e geçirme
   — Her input zod ile validate edilmeli

❌ console.log(apiKey), console.log(password)
   — Secret'lar asla loglanmaz

❌ eval(), new Function()
   — Dinamik kod çalıştırma yasak
```

---

## KORUNAN DOSYALAR

Aşağıdaki dosyalara DOKUNULMAZ:
Claude Code bu dosyaları asla değiştiremez,
taşıyamaz veya silemez.

```
🔒 app/api/paytr/callback/route.ts
🔒 app/api/paytr/create-payment/route.ts
🔒 app/api/verify-payment/route.ts
🔒 app/api/paytr/test-callback/route.ts
🔒 middleware.ts
🔒 app/auth/callback/route.ts
```

---

## YENİ DOSYA EKLERKEN KURALLAR

### Yeni bir özellik eklenecekse:
1. DAL'a veri erişim fonksiyonu yaz
2. Service'e iş mantığı yaz
3. API route'a auth + validation yaz
4. UI'a fetch çağrısı yaz
5. Hiçbir adımı atlama

### Yeni API route eklenecekse:
```typescript
// Her API route bu şablona uyar:
export async function GET(request: Request) {
  // 1. Auth kontrol
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(
    { error: 'Unauthorized' }, { status: 401 }
  )

  // 2. Input validasyonu (POST/PATCH için)
  // const body = await request.json()
  // const validated = schema.parse(body)

  // 3. Service çağrısı
  const result = await someService.doSomething(user.id)

  // 4. Sonuç dön
  return NextResponse.json(result)
}
```

### Yeni DAL fonksiyonu eklenecekse:
```typescript
// dal/example.ts şablonu:
import { createAdminClient } from '@/lib/supabase-server-client'

export async function getExampleByUserId(userId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('example')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}
```

### Yeni Service fonksiyonu eklenecekse:
```typescript
// services/example.ts şablonu:
import * as exampleDal from '@/dal/example'

export async function processExample(userId: string) {
  const raw = await exampleDal.getExampleByUserId(userId)
  // İş mantığı burada
  return processed
}
```

---

## GÜVENLİK KURALLARI

### Input Validasyonu
- Tüm API route'ları zod schema kullanır
- Kullanıcı girdisi asla direkt DB'ye gitmez
- String'ler trim() ve length kontrolünden geçer

### HTML İçerik
- Kullanıcıdan gelen HTML mutlaka DOMPurify ile temizlenir
- Blog içerikleri render edilmeden önce sanitize edilir
- `dangerouslySetInnerHTML` kullanımı log'lanır

### Rate Limiting
- Auth endpoint'leri: 5 istek/dakika
- API endpoint'leri: 60 istek/dakika
- Aşım durumunda 429 döner

### Error Handling
- Hata mesajları stack trace içermez
- Production'da detaylı hata kullanıcıya gösterilmez
- Her hata server'da loglanır

---

## KARAR AKIŞI

Yeni bir değişiklik yapmadan önce:

```
Değişiklik nerede?
├── UI'da mı?
│   ├── Supabase import var mı? → HAYIR olmalı
│   └── dangerouslySetInnerHTML var mı?
│       → DOMPurify ile temizle
├── API'de mi?
│   ├── Auth kontrolü var mı? → EVET olmalı
│   └── Direkt DB çağrısı var mı? → HAYIR olmalı
├── Service'te mi?
│   └── HTTP veya DB kodu var mı? → HAYIR olmalı
└── DAL'da mı?
    └── İş mantığı var mı? → HAYIR olmalı
```

---

## ÖZET

| Katman | Dosya | Yapabilir | Yapamaz |
|--------|-------|-----------|---------|
| UI | app/page.tsx | fetch(), useState | Supabase, SQL |
| API | app/api/route.ts | Auth, Validation | DB, İş mantığı |
| Service | services/*.ts | İş mantığı | HTTP, DB |
| DAL | dal/*.ts | DB CRUD | İş mantığı, HTTP |

---

*Bu kurallar Kârnet projesinin güvenliği ve
sürdürülebilirliği için zorunludur.
Hiçbir gerekçeyle çiğnenemez.*
