# 🏛️ DECISIONS — NEDEN BÖYLE YAPILDI

Önemli mimari ve güvenlik kararları burada kalıcı olarak saklanır.
Bu dosya sınırsızdır — kritik kararlar asla silinmez.

## Kalıcı Kararlar

### PayTR /api/paytr/ Middleware Bypass
Durum: PayTR server-to-server POST gönderir, cookie yoktur.
Seçilen: /api/paytr/ route'ları middleware auth'u bypass eder.
Risk: Yok — PayTR hash validation gateway'de yapılır.
Not: BU KASITLI. Güvenlik açığı değil.

### audit_logs Client Policy Yok
Durum: audit_logs tablosunda hiç RLS policy yok.
Seçilen: Policy olmaması = client erişimi yok = sadece service_role yazabilir.
Not: BU KASITLI. Client policy EKLEME.

### lib/supabase/admin.ts Koruması
Durum: Service role key çok güçlü, yanlış yerde kullanılırsa RLS bypass olur.
Seçilen: Sadece repositories/ ve cron kullanabilir. app/ ve components/ YASAK.

### CSS/UI Katman İzolasyonu
Durum: UI'da DB/API kodu güvenlik açığı yaratır.
Seçilen: CSS/UI dosyalarında DB, API, business logic kesinlikle yasak.
Not: DÜNYA YANSA ÇİĞNENEMEZ.

### Migration Çalıştırma Yetkisi
Durum: Yanlış migration geri alınamaz, production verisi silinebilir.
Seçilen: Migration yazılabilir ama çalıştırılamaz. Sadece Hilmi çalıştırır.

### CVE-2025-29927 Fix
Durum: Next.js middleware bypass açığı.
Seçilen: middleware.ts'de x-middleware-subrequest ve x-middleware-invoke bloke edildi.
Not: Kaldırma. Bu fix şart.

### Trendyol Webhook Middleware Bypass (2026-04-06)
Durum: Trendyol server-to-server POST gönderir, cookie yoktur.
Seçilen: /api/webhook/marketplace middleware auth'u bypass eder.
Risk: Yok — Basic Auth webhook route'ta doğrulanır.
Not: BU KASITLI. PayTR bypass ile aynı mantık. Güvenlik açığı DEĞİL.

### Webhook URL Path Değişikliği (2026-04-06)
Durum: Trendyol webhook URL'de "trendyol" kelimesi geçmesini yasaklıyor (domain + path).
Seçilen: Eski /api/marketplace/trendyol/webhook → Yeni /api/webhook/marketplace
Risk: Eski endpoint korundu (geriye uyumluluk). Yeni kayıtlar yeni path kullanır.
Not: Trendyol API kısıtlaması — çözüm yok, path değişmeli.

### Buybox Özelliği Kaldırıldı (2026-04-06)
Durum: Trendyol Buybox API tüm ürünlerde kendi verisini dönüyordu (buyboxOrder=1, hasMultipleSeller=false).
Seçilen: Buybox özelliği tamamen kaldırıldı — API, service, UI, schema dahil.
Risk: Yok — zaten işe yaramıyordu.
Not: Trendyol API kısıtlaması. Gerçek rakip verisi gelmiyor.

### Sipariş Sayımında Blacklist Yaklaşımı (2026-04-06)
Durum: Whitelist ile (SOLD_STATUSES) Awaiting siparişler atlanıyordu.
Seçilen: Blacklist ile (EXCLUDED_STATUSES) sadece iptal/iade hariç tutulur.
Risk: Yok — Awaiting da bir satıştır.
Not: Cancelled, Returned, ReturnAccepted, ReturnedAndRefunded, UnSupplied hariç.

### Stock API'ye Sipariş Verisi Eklendi (2026-04-06)
Durum: Sipariş verisi ayrı endpoint gerekiyordu, eşleşme sorunları vardı.
Seçilen: Stock API (/api/marketplace/trendyol/stock) sipariş verisini de çekiyor (monthlySales).
Risk: API response büyüdü ama tek çağrı ile hem stok hem satış verisi geliyor.
Not: Barcode eşleşmesi stock API'de yapılıyor — en güvenilir eşleşme yöntemi.

### Dashboard Ciro Hedefi Profil Tablosunda (2026-04-06)
Durum: Ciro hedefi kullanıcı bazlı olmalı.
Seçilen: profiles.revenue_goal kolonu. Dashboard'dan düzenlenebilir (kalem ikonu).
Risk: Migration çalıştırılmalı. getProfile tüm alanları dönmeli.
Not: Sabit kodlanmış 60000 yerine user.revenue_goal kullanılıyor.

---

*(Yeni kararlar buraya eklenir — eski kararlar silinmez)*
