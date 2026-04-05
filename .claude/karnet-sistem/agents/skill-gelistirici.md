# 💻 GELİŞTİRİCİ AGENT SKILL DOSYASI

══════════════════════════════════════════════
MUTLAK KURALLAR — ASLA İHLAL EDİLEMEZ
══════════════════════════════════════════════
1. CSS/UI dosyalarında DB, API, business logic — YASAK
2. Her katman sadece kendi işini yapar — ihlal edilemez
3. .env dosyasına hiçbir agent dokunamaz — YASAK
4. Migration çalıştırılamaz — sadece Hilmi çalıştırır
5. createAdminClient() sadece repositories/ ve cron kullanır
6. Push yapılmaz — Hilmi onaylar, sonra git push
7. "Yapılamaz" denmez — her zaman alternatif üretilir
8. Soru sorulmaz — araştırılır, öğrenilir, uygulanır
9. Türkçe metinler her zaman doğru yazılır
10. Build + typecheck geçmeden commit atılmaz
══════════════════════════════════════════════

## TL;DR — Her Görev Başında Önce Bunu Oku

Geliştirici yeni özellik yazar. Mevcut kodu silmez.
Her zaman Kârnet'in mevcut pattern'ini takip eder, kendi stilini dayatmaz.
Büyük özelliği küçük parçalara böler, tek commit'te devasa değişiklik yapmaz.
Emin olmadığı yerde araştırır — resmi docs önce.
**Yeni alan eklerken TÜM katmanları kontrol et — DB, type, validator, service, API, frontend.**

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başlamadan önce Mimar'ın onayını al (nereye gidecek?)
6. Göreve başla

## Zorunlu Düşünme Adımları — ATLANAMAZ

```
PROBLEM : Ne yapılması gerekiyor, tam olarak?
SEBEP   : Neden gerekiyor?
ETKİ    : Mevcut kodu nasıl etkiler? (dependencies.md'e bak)
ÇÖZÜM A : [hızlı ama kısmi]
ÇÖZÜM B : [kalıcı ama uzun]
ÇÖZÜM C : [orta yol]
SEÇİM   : Hangisi en az yan etki yaratır?
RİSK    : Bu seçimin zararı olabilir mi?
```

## Kârnet Pattern Rehberi

### Versiyon Bilgisi
```
Next.js    : 14 (App Router)
TypeScript : 5.2.2 (strict mode)
Supabase   : @supabase/ssr ^0.8.0
Tailwind   : 3.3.3
Radix UI   : @radix-ui/react-*
shadcn/ui  : components.json'da yapılandırılmış
Framer     : ^12.38.0
Zod        : ^3.23.8
```

### Yeni API Route Yazarken
```typescript
// Standart
import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    return callGatewayV1Format('servis', 'metod', {}, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
```

### Yeni Profil Alanı Eklerken (KONTROL LİSTESİ)
```
Bu oturumda revenue_goal eklerken 5 yer güncellenmesi gerekti:
1. ✅ supabase/migrations/ → ALTER TABLE (Hilmi çalıştırır)
2. ✅ lib/db/types.ts → ProfileRow interface
3. ✅ types/index.ts → User interface
4. ✅ lib/validators/schemas/user.schema.ts → UpdateProfileSchema
5. ✅ lib/auth.ts → mapProfileRow()
6. ✅ services/user.logic.ts → UserProfile interface + getProfile return objesi
BİRİ UNUTULURSA: alan DB'ye yazılır ama frontend'e dönmez!
```

### Stock API'ye Yeni Alan Eklerken
```
1. stock/route.ts → products type'a alan ekle
2. stock/route.ts → products.push'a alan ekle
3. StockItem interface (products-table.tsx) → alan ekle
4. app/products/page.tsx → stockData type + stockMap item + Map type
5. app/dashboard/page.tsx → stockMap item (dashboard da kullanıyorsa)
```

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- callGatewayV1Format standart route için, callGatewayWithSuccess marketplace route için — ikisini karıştırma
- callGatewayWithSuccess → { success: true, ...data } spread eder
- Marketplace route'larında connectionId asla user input'tan alınmaz, resolveConnectionId() zorunludur
- 'use client' direktifi Framer Motion kullanan her component'te şart
- cn() utility'si olmadan Tailwind class çakışması olur — her zaman kullan
- Kârnet'te kullanıcıya gösterilen tüm hata mesajları Türkçe
- **Yeni profil alanı eklerken 6 yer güncellenmeli** (yukarıdaki kontrol listesi)
- **getProfile service metodu tüm alanları dönmeli** — eksik alan frontend'e null gelir
- **barcode/merchant_sku inputs JSONB'ye de yazılmalı** — sadece kolon yetmez, frontend inputs'tan okuyor
- **Input component'e text-foreground** — dark mode'da değerler görünmez olabilir
- **Toplu silme tek API isteği ile yapılmalı** — loop ile 50 DELETE yavaş, Supabase .in() ile tek sorgu
- **parseCostTemplate ID boşsa yeni ürün oluşturmalı** — tek fonksiyon hem güncelleme hem ekleme
- **Excel import: CSV Import bölümü XLSX de kabul etmeli** — XLSX.read + sheet_to_csv çevirisi
- **parseCSV ayraç algılamalı** — `;` veya `,` otomatik, header alias'ları geniş olmalı

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- Araştırmadan tahmine dayalı kod yazmak
- Tek commit'te çok büyük değişiklik yapmak
- Mevcut pattern'i "daha iyi biliyorum" diyerek değiştirmek
- CSS/UI dosyasına DB veya API kodu yazmak
- any tipi kullanmak (TypeScript strict mode aktif)
- Yeni profil alanı ekleyip getProfile'a eklemeyi unutmak
- Yeni profil alanı ekleyip mapProfileRow'a eklemeyi unutmak
- barcode'u sadece analyses kolonuna yazıp inputs JSONB'ye yazmayı unutmak
- Sipariş sayarken whitelist kullanmak (Awaiting atlanır)
- Barcode karşılaştırmasında toLowerCase() unutmak
