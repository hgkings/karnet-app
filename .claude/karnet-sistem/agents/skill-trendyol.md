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
**Trendyol API her zaman docs'tan doğrulanmalı — varsayım yapma.**

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başla

## Zorunlu Düşünme Adımları

```
PROBLEM : Hangi Trendyol endpoint'i sorun çıkarıyor?
SEBEP   : connectionId mi yok? Gateway method mu yanlış? API mı down? Alan adları mı farklı?
ETKİ    : Başka hangi feature'ı etkiliyor?
ÇÖZÜM A : [hızlı düzeltme]
ÇÖZÜM B : [kalıcı çözüm]
SEÇİM   : En az yan etki yaratanı seç
RİSK    : Production'daki veriyi etkiler mi?
```

## Trendyol API Rate Limitleri (Resmi Docs — 2026-04-06 Doğrulanmış)

| Endpoint | Limit | Not |
|---|---|---|
| Ürün Filtreleme | 2000 req/dk | Genel rate limiter bunu kullanır |
| Ürün Aktarma | 1000 req/dk | |
| Ürün Güncelleme | 1000 req/dk | |
| Stok/Fiyat | NO LIMIT | 15dk dedup |
| Ürün Silme | 100 req/dk | |
| Sipariş | 1000 req/dk | |
| Marka/Kategori | 50 req/dk | |
| Adres | 1 req/saat | |

## Trendyol API Tarih Kısıtlamaları

| Endpoint | Max Aralık | Max Geçmiş | Format |
|---|---|---|---|
| Sipariş | 2 hafta | 1 ay | millisecond timestamp GMT+3 |
| Hakediş (Settlement) | 15 gün | ? | millisecond timestamp |
| Claims | 13 gün pencere | ? | millisecond timestamp |

## Sipariş Satırı Alanları (Docs Doğrulaması — 2026-04-06)

```
line.barcode           → "8683772071724" (VAR!)
line.productName       → "Kuş ve Çiçek Desenli Tepsi..." (VAR!)
line.stockCode         → "111111" (VAR!)
line.contentId         → 1239111111 (VAR!)
line.quantity          → 1
line.lineUnitPrice     → 498.90
line.lineGrossAmount   → 498.90
line.commission        → 13
line.vatRate           → 20.00
line.orderLineItemStatusName → "Delivered" (satır bazlı durum)
```

**DİKKAT: line.productId YOKTUR!** Eski kod bunu arıyordu — yanlıştı.

## Ürün API Alanları (V1 — Docs Doğrulaması)

```
p.id                → hash string "1f8eef1aeef3cbfaad2f0ec207945d9f" (URL için KULLANMA!)
p.productContentId  → sayısal 42733553 (URL fallback için)
p.productUrl        → "https://www.trendyol.com/..." (direkt kullan)
p.barcode           → barkod
p.stockCode         → satıcı stok kodu
p.title             → ürün başlığı
p.salePrice         → satış fiyatı
p.quantity          → stok miktarı
p.images[0].url     → ürün fotoğrafı
```

## Kârnet'teki Trendyol Route'ları

| Route | Method | Gateway Method | Notlar |
|---|---|---|---|
| /api/marketplace/trendyol/sync-products | POST | syncTrendyolProducts | Otomatik sipariş sync tetikler |
| /api/marketplace/trendyol/sync-orders | POST | syncTrendyolOrders | body: {days} |
| /api/marketplace/trendyol/normalize | POST | normalizeTrendyol | |
| /api/marketplace/trendyol/normalize-orders | POST | normalizeTrendyolOrders | |
| /api/marketplace/trendyol/unsupplied-orders | GET | getTrendyolUnsuppliedOrders | |
| /api/marketplace/trendyol/claims | GET | getTrendyolClaims | ?gun=30 |
| /api/marketplace/trendyol/finance | GET | getTrendyolFinance | ?gun=30 veya ?startDate=&endDate= |
| /api/marketplace/trendyol/enrich | POST | enrichAnalysesWithRealData | body: {days}, default 90 |
| /api/marketplace/trendyol/stock | GET | (direkt route) | Stok + fiyat + fotoğraf + satış adedi |
| /api/marketplace/trendyol/order-count | GET | getOrderCount | ?gun=30, hafif sayaç |
| /api/marketplace/trendyol/order-summary | GET | getOrderSummary | Dashboard sipariş kartı |
| /api/marketplace/trendyol/daily-profit | GET | getDailyProfit | Dashboard grafik verisi |
| /api/marketplace/trendyol/webhook-register | POST | registerTrendyolWebhook | |
| /api/webhook/marketplace | POST | handleTrendyolWebhook | "trendyol" kelimesi YOK |

## Webhook Kuralları

- URL'de "trendyol", "dolap", "localhost" GEÇEMEZ (domain + path dahil)
- Webhook path: /api/webhook/marketplace (eski: /api/marketplace/trendyol/webhook)
- Max 15 webhook per seller
- Auth: BASIC_AUTHENTICATION (apiKey:apiSecret)
- Middleware bypass zorunlu (PayTR gibi)

## Claims API Gerçek Yapısı (Docs Doğrulaması)

```
content[].items[].orderLine.productName  ← ürün adı
content[].items[].orderLine.barcode      ← barkod
content[].items[].orderLine.price        ← tutar
content[].items[].claimItems[].customerClaimItemReason.name ← iade sebebi
content[].items[].claimItems[].claimItemStatus.name         ← durum
```

**ESKİ (YANLIŞ):** content[].claimLines[].productName, content[].claimIssueReasonText

## Hakediş API Notları

- transactionType zorunlu: Sale, Return (İngilizce gönder)
- Response'ta Türkçe dönüyor: "Satış", "İade"
- Hakediş sadece sipariş teslim edildikten sonra oluşur
- Max 15 gün tarih aralığı

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- **Buybox API işe yaramaz** — her zaman kendi verinizi döner. Kaldırıldı.
- **Sipariş satırında barcode/productName VAR** — line.productId YOK, aramayın
- **Barcode eşleşmesi case-sensitive** — her zaman toLowerCase() kullan
- **Beklemedeki siparişler (Awaiting) de satış** — whitelist yerine blacklist kullan
- **Webhook URL'de path de kontrol ediliyor** — sadece domain değil
- **Ürün V1 id = hash string** — URL için productUrl veya productContentId kullan
- **Claims API yapısı docs'tan farklı** — items[].orderLine, claimLines değil
- **Hakediş sipariş teslim olmadan oluşmaz** — 0 görünmesi normal olabilir
- **Rate limiter çok düşüktü** — 50/10sn → 2000/dk (docs'a göre düzeltildi)
- **Stock API'ye sipariş verisi de eklendi** — monthlySales alanı
- **sync-products barcode'u inputs JSONB'ye de yazmalı** — frontend eşleşmesi için
- **Fuzzy eşleşme kısa isimler için (%50, min 1 kelime)** — "moon s" gibi

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- callGatewayV1Format kullanmak (marketplace = callGatewayWithSuccess)
- connectionId'yi user input'tan almak
- ?gun yerine ?days yazmak
- line.productId aramak (YOK — line.barcode, line.productName, line.contentId kullan)
- p.id'yi URL oluşturmak için kullanmak (hash string — productUrl veya productContentId kullan)
- Barcode eşleşmesinde case-sensitive karşılaştırma yapmak
- Sipariş sayarken whitelist kullanmak (Awaiting atlanır — blacklist kullan)
- Webhook URL'de "trendyol" kelimesi bırakmak (path dahil!)
- Trendyol API alan adlarını tahmin etmek (HER ZAMAN docs'tan doğrula)
- Claims API'de claimLines aramak (items[].orderLine kullan)
- Migration çalıştırmak
