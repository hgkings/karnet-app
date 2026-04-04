# 🔗 TRENDYOL AGENT SKILL DOSYASI

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

Sadece Trendyol API entegrasyonuna bakarım.
connectionId her zaman resolveConnectionId() ile alınır — asla user input'tan.
callGatewayWithSuccess kullanırım — callGatewayV1Format değil.
Query param adları bazı route'larda Türkçe: ?gun=30 (gün).

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başla

## Zorunlu Düşünme Adımları

```
PROBLEM : Hangi Trendyol endpoint'i sorun çıkarıyor?
SEBEP   : connectionId mi yok? Gateway method mu yanlış? API mı down?
ETKİ    : Başka hangi feature'ı etkiliyor?
ÇÖZÜM A : [hızlı düzeltme]
ÇÖZÜM B : [kalıcı çözüm]
SEÇİM   : En az yan etki yaratanı seç
RİSK    : Production'daki veriyi etkiler mi?
```

## Kârnet'teki Trendyol Route'ları

| Route | Method | Gateway Method | Notlar |
|---|---|---|---|
| /api/marketplace/trendyol/sync-products | POST | syncTrendyolProducts | |
| /api/marketplace/trendyol/sync-orders | POST | syncTrendyolOrders | body: {days} |
| /api/marketplace/trendyol/normalize | POST | normalizeTrendyol | |
| /api/marketplace/trendyol/normalize-orders | POST | normalizeTrendyolOrders | |
| /api/marketplace/trendyol/unsupplied-orders | GET | getTrendyolUnsuppliedOrders | |
| /api/marketplace/trendyol/claims | GET | getTrendyolClaims | ?gun=30 |
| /api/marketplace/trendyol/buybox | GET | checkBuybox | MAX 50 ÜRÜN |
| /api/marketplace/trendyol/finance | GET | getTrendyolFinance | ?gun=30 veya ?startDate=&endDate= |
| /api/marketplace/trendyol/enrich | POST | enrichAnalysesWithRealData | body: {days}, default 90 |
| /api/marketplace/trendyol/webhook-register | POST | registerTrendyolWebhook | |

## Zorunlu Pattern

```typescript
// TÜM Trendyol route'ları bu pattern'i takip eder
const user = await requireAuth()
if (user instanceof Response) return user

const connectionId = await resolveConnectionId(user.id, 'trendyol')
if (connectionId instanceof Response) return connectionId

return callGatewayWithSuccess('marketplace' as ServiceName, 'methodAdi', { connectionId }, user.id)
```

## DB Yapısı

**marketplace_connections:**
- status: disconnected | connected | connected_demo | pending_test | error
- webhook_active: boolean

**trendyol_webhook_events:**
- event_type, seller_id, shipment_package_id, order_number, status, payload
- processed: boolean — false olanlar işlenmemiş
- RLS: kullanıcı sadece kendi event'lerini görür

## Sorun Giderme

### connectionId Response dönüyor
Kullanıcının Trendyol bağlantısı yok.
marketplace_connections tablosunda user_id + 'trendyol' kaydı var mı?
Yoksa: kullanıcıyı /marketplace sayfasına yönlendir.

### claims ?gun parametresi
Query param adı Türkçe: `?gun=30` — `?days=30` değil. Bu önemli.

### buybox limiti
Sadece eşleşmiş ürünler için çalışır. MAX 50 ÜRÜN. Aşarsa hata verir.

### finance tarih aralığı
`?gun=30` VEYA `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` — ikisi aynı anda kullanılmaz.

### sync-orders
Body'den `days` parse edilir, default 30. Empty body fine.

### Webhook URL
`${process.env.NEXT_PUBLIC_APP_URL}/api/marketplace/trendyol/webhook`

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- callGatewayWithSuccess marketplace route için, callGatewayV1Format standart route için — KESİNLİKLE karıştırma
- Query param adı bazı route'larda Türkçe: `gun` (gün için)
- buybox max 50 ürün sınırı var, aşınca hata verir
- connectionId user input'tan asla alınamaz — resolveConnectionId() zorunludur
- enrich route'u hem Trendyol hem Hepsiburada için çalışır, marketplace parametresiyle ayrılır

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- callGatewayV1Format kullanmak (marketplace = callGatewayWithSuccess)
- connectionId'yi user input'tan almak
- ?gun yerine ?days yazmak
- buybox'ı 50'den fazla ürünle çağırmak
- Migration çalıştırmak
