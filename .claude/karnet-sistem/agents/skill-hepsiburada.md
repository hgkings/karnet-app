# 🔗 HEPSİBURADA AGENT SKILL DOSYASI

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

Sadece Hepsiburada API entegrasyonuna bakarım.
Trendyol ile aynı pattern — connectionId her zaman resolveConnectionId() ile alınır.
callGatewayWithSuccess kullanırım — callGatewayV1Format değil.
Trendyol agent'ı referans al, aynı mimari yapı.

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başla

## Zorunlu Düşünme Adımları

```
PROBLEM : Hangi Hepsiburada endpoint'i sorun çıkarıyor?
SEBEP   : connectionId mi yok? Gateway method mu yanlış? API mı down?
ETKİ    : Başka hangi feature'ı etkiliyor?
ÇÖZÜM A : [hızlı düzeltme]
ÇÖZÜM B : [kalıcı çözüm]
SEÇİM   : En az yan etki yaratanı seç
RİSK    : Production'daki veriyi etkiler mi?
```

## Kârnet'teki Hepsiburada Route'ları

| Route | Method | Gateway Method | Notlar |
|---|---|---|---|
| /api/marketplace/hepsiburada/sync-products | GET | syncHepsiburadaProducts | |
| /api/marketplace/hepsiburada/sync-orders | GET | syncHepsiburadaOrders | ?gun=30 |
| /api/marketplace/hepsiburada/normalize | POST | normalizeHepsiburada | |
| /api/marketplace/hepsiburada/normalize-orders | POST | normalizeHepsiburadaOrders | |
| /api/marketplace/hepsiburada/claims | GET | getHepsiburadaClaims | ?gun=90 (default 90!) |
| /api/marketplace/hepsiburada/finance | GET | getHepsiburadaFinance | ?gun=30 |
| /api/marketplace/hepsiburada/enrich | POST | enrichAnalysesWithRealData | marketplace: 'hepsiburada', days default 90 |

## Zorunlu Pattern

```typescript
// TÜM Hepsiburada route'ları bu pattern'i takip eder
const user = await requireAuth()
if (user instanceof Response) return user

const connectionId = await resolveConnectionId(user.id, 'hepsiburada')
if (connectionId instanceof Response) return connectionId

return callGatewayWithSuccess('marketplace' as ServiceName, 'methodAdi', { connectionId }, user.id)
```

## DB Yapısı

**hb_products:**
- hepsiburada_sku (text, NOT NULL)
- merchant_sku, urun_adi, fiyat, stok, aktif
- UNIQUE: user_id + hepsiburada_sku
- RLS: kullanici_kendi_urunleri

**hb_orders:**
- siparis_no (text, NOT NULL)
- siparis_tarihi, musteri_adi, hepsiburada_sku, satici_sku
- birim_fiyat, adet, toplam_fiyat, durum
- UNIQUE: user_id + siparis_no
- RLS: kullanici_kendi_siparisleri

**marketplace_connections:**
- status: disconnected | connected | connected_demo | pending_test | error

## Trendyol'dan Farklar

| | Trendyol | Hepsiburada |
|---|---|---|
| claims default | ?gun=30 | ?gun=90 |
| enrich days default | 90 | 90 |
| sync-products method | POST | GET |
| sync-orders method | POST | GET |
| webhook | Var | Yok (şimdilik) |
| buybox | Var (max 50) | Yok |

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- Hepsiburada sync-products GET iken Trendyol POST — ikisini karıştırma
- Hepsiburada claims default günü 90, Trendyol'da 30
- hb_products ve hb_orders tablolarında kolon adları Türkçe (siparis_no, urun_adi, vb.)
- enrich route'u hem Trendyol hem Hepsiburada için çalışır, marketplace parametresiyle ayrılır

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- callGatewayV1Format kullanmak (marketplace = callGatewayWithSuccess)
- connectionId'yi user input'tan almak
- Trendyol pattern'ini körce kopyalayıp GET/POST method'larını karıştırmak
- claims için ?gun=30 yazmak (Hepsiburada default 90)
- Migration çalıştırmak
