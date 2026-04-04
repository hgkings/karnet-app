# 🏛️ DECISIONS — NEDEN BÖYLE YAPILDI

Önemli mimari ve güvenlik kararları burada kalıcı olarak saklanır.
Bu dosya sınırsızdır — kritik kararlar asla silinmez.
Her agent görev başında bu dosyayı okur.

## Kayıt Formatı
```
## [TARİH] [KARAR BAŞLIĞI]
Durum: [ne vardı / ne sorun çıktı]
Seçenekler: A, B, C
Seçilen: [hangisi ve neden]
Risk: [kabul edilen risk]
Karar veren: [Hilmi / Agent]
```

## Kalıcı Kararlar

### PayTR /api/paytr/ Middleware Bypass
Durum: PayTR server-to-server POST gönderir, cookie yoktur.
Seçilen: /api/paytr/ route'ları middleware auth'u bypass eder.
Risk: Yok — PayTR hash validation gateway'de yapılır.
Not: BU KASITLI. Güvenlik açığı değil. Değiştirme.

### audit_logs Client Policy Yok
Durum: audit_logs tablosunda hiç RLS policy yok.
Seçilen: Policy olmaması = client erişimi yok = sadece service_role yazabilir.
Risk: Yok — bu tasarım gereği.
Not: BU KASITLI. Client policy EKLEME.

### lib/supabase/admin.ts Koruması
Durum: Service role key çok güçlü, yanlış yerde kullanılırsa RLS bypass olur.
Seçilen: Sadece repositories/ ve cron kullanabilir. app/ ve components/ YASAK.
Risk: Yok — kural net.
Not: Dosyada "Hilmi onayı olmadan değiştirilemez" notu var.

### CSS/UI Katman İzolasyonu
Durum: UI'da DB/API kodu proje büyüdükçe güvenlik açığı yaratır, test edilemez hale gelir.
Seçilen: CSS/UI dosyalarında DB, API, business logic kesinlikle yasak.
Risk: Yok.
Not: DÜNYA YANSA ÇİĞNENEMEZ. Tüm agentların mutlak kuralı.

### Migration Çalıştırma Yetkisi
Durum: Yanlış migration geri alınamaz, production verisi silinebilir.
Seçilen: Migration yazılabilir ama çalıştırılamaz. Sadece Hilmi çalıştırır.
Risk: Yok.
Not: RLS değişikliği veya tablo silme varsa Hilmi double onay verir.

### CVE-2025-29927 Fix
Durum: Next.js middleware bypass açığı — x-middleware-subrequest header'ı ile middleware atlanabiliyordu.
Seçilen: middleware.ts'de x-middleware-subrequest ve x-middleware-invoke header'ları bloke edildi.
Risk: Yok.
Not: Kaldırma. Bu fix şart.

---

*(Yeni kararlar buraya eklenir — eski kararlar silinmez)*
