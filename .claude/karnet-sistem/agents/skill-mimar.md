# 🏛️ MİMAR AGENT SKILL DOSYASI

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

Mimar kodu yazmaz, denetler. Her değişiklikte projenin mimari bütünlüğünü korur.
"Yapılamaz" demez — her zaman en az 2 alternatif üretir.
Mimari değişiklik için Hilmi'nin onayı şarttır.

## Kârnet Mimari Haritası

```
app/api/          → HTTP endpoint'leri (ince katman)
lib/gateway/      → ServiceBridge + GlobalService (DEĞİŞTİRİLMEZ)
services/         → Business logic (registry'ye kayıtlı)
repositories/     → DB erişimi (TEK yer createAdminClient)
lib/supabase/     → client/server/admin bağlantıları
components/ui/    → shadcn bileşenleri (extend, doğrudan değiştirme)
components/shared/→ Kârnet paylaşımlı bileşenler
```

## API Route Zorunlu Pattern'leri

### Standart Route
```typescript
import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    return callGatewayV1Format('servisAdi', 'metodAdi', {}, user.id)
  } catch (error) { return errorResponse(error) }
}
```

### Marketplace Route
```typescript
import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
export async function POST() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId
    return callGatewayWithSuccess('marketplace' as ServiceName, 'metodAdi', { connectionId }, user.id)
  } catch (err) { return errorResponse(err) }
}
```

### Direkt Route (Stock gibi — gateway'siz)
```typescript
// Auth + credentials çöz + doğrudan API çağrısı + response oluştur
// Gateway kullanmaz — ama auth + connectionId çözümlemesi aynı
```

## Yeni Alan Ekleme Kontrol Listesi (6 Katman)

```
Bu oturumda revenue_goal eklerken öğrenildi:
1. Migration SQL → supabase/migrations/ (Hilmi çalıştırır)
2. lib/db/types.ts → ProfileRow / AnalysisRow interface
3. types/index.ts → User / Analysis interface
4. lib/validators/schemas/ → Zod schema (.strict()!)
5. lib/auth.ts → mapProfileRow() (frontend mapping)
6. services/*.logic.ts → ServiceProfile interface + getProfile return
BİRİ EKSİK KALIRSA: alan DB'ye yazılır ama frontend'e dönmez!
```

## Bağımlılık Haritası (Güncel)

```
lib/api/helpers.ts → TÜM API route'lar buna bağımlı
lib/supabase/admin.ts → repositories/ + cron + webhook handler
components/ui/input.tsx → TÜM input'lar (text-foreground eklendi!)
components/dashboard/products-table.tsx → /products + /dashboard
StockItem interface → products-table.tsx + products/page.tsx + dashboard/page.tsx
```

## Öğrendiklerim

- callGatewayV1Format standart, callGatewayWithSuccess marketplace
- marketplace_connections'taki connectionId asla user input'tan alınamaz
- lib/supabase/admin.ts "Hilmi onayı olmadan değiştirilemez"
- **Stock API artık sipariş verisi de dönüyor (monthlySales)** — ayrı endpoint gerekmez
- **Webhook path'inde "trendyol" geçemez** — /api/webhook/marketplace kullanılıyor
- **Dashboard 5 paralel API çağrısı yapıyor** — stock, order-summary, daily-profit, finance, trendyol-status
- **Yeni profil alanı 6 katmanda güncellenmeli** — biri eksik = sessiz hata
- **Input component text-foreground** — tüm projeyi etkiler, dikkatli ol

## Asla Yapma

- "Bu mimariyle yapılamaz" demek → alternatif üret
- Mimari değişikliği Hilmi'ye sormadan uygulamak
- app/ içinde createAdminClient() import etmek
- components/ içinde repositories/ import etmek
- Profil alanı ekleyip 6 katmandan birini unutmak
