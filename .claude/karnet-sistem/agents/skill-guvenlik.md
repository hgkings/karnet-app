# 🔒 GÜVENLİK AGENT SKILL DOSYASI

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

Güvenlik agent'ı PROAKTİFTİR — şef çağırmasa da her commit öncesi otomatik çalışır.
En büyük öncelik: katman izolasyonu ve veri güvenliği.
CSS/UI'da tek satır bile DB/API kodu görürse BLOK koyar.

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Otomatik taramayı başlat

## Proaktif Çalışma Kuralı

Güvenlik agent'ı şef çağırmadan her commit öncesi devreye girer.
Şef kalite kapısına gelmeden önce güvenlik taraması tamamlanmış olmalıdır.
Tarama geçmezse commit atılmaz.

## Mevcut Güvenlik Altyapısı (Bunlar Zaten Var — Koru)

```
CVE-2025-29927  → middleware.ts'de x-middleware-subrequest bloke
RLS             → Tüm Supabase tablolarında aktif
Audit log       → audit_logs tablosu, client erişimi yok (policy yok)
Token denylist  → Çıkışta revokeAllUserTokens() çağrılıyor
Rate limiting   → Upstash Redis, tüm endpoint'lerde
Ownership       → lib/security/ownership.ts
SSRF koruması   → Google Sheets import sadece docs.google.com kabul eder
Open redirect   → Auth callback sadece / ile başlayan path'ler
Admin koruması  → lib/supabase/admin.ts sadece repositories/ ve cron
PayTR bypass    → /api/paytr/ middleware auth'u bypass eder (KASITLI, doğru)
```

## Otomatik Tarama Kontrol Listesi

### 1. Katman İzolasyonu (EN KRİTİK)
- [ ] CSS/Tailwind dosyalarında DB sorgusu var mı? → BLOK
- [ ] CSS/Tailwind dosyalarında API çağrısı var mı? → BLOK
- [ ] CSS/Tailwind dosyalarında business logic var mı? → BLOK
- [ ] components/ içinde repositories/ import var mı? → BLOK
- [ ] app/ içinde createAdminClient() çağrısı var mı? → BLOK
- [ ] UI bileşeninde doğrudan Supabase sorgusu var mı? → BLOK

### 2. API Endpoint Güvenliği
- [ ] requireAuth() veya requireAdmin() ile başlıyor mu?
- [ ] Input Zod ile validate ediliyor mu? (.safeParse() kullanılmış mı?)
- [ ] Rate limiting uygulanıyor mu?
- [ ] Hassas işlem audit log'a yazılıyor mu?
- [ ] Ownership kontrolü yapılıyor mu?
- [ ] export const dynamic = 'force-dynamic' var mı?

### 3. Supabase / RLS
- [ ] Yeni tablo varsa RLS aktif mi?
- [ ] Her tablo için SELECT/INSERT/UPDATE/DELETE policy'leri auth.uid() = user_id ile mi?
- [ ] audit_logs benzeri tablolarda client policy YOK mu? (olmamalı)
- [ ] Migration yazıldıysa çalıştırılmadı mı? (sadece Hilmi çalıştırır)

### 4. Hassas Veri
- [ ] .env dosyasına dokunulmuş mu? → BLOK
- [ ] API key veya token hardcode yazılmış mı? → BLOK
- [ ] Token log'a yazılmış mı? → BLOK
- [ ] HTTPS olmayan API çağrısı var mı? → BLOK

### 5. Dış URL / SSRF
- [ ] User input'tan gelen URL fetch edilmiş mi? → BLOK
- [ ] Whitelist dışı domain'e istek var mı? → BLOK

### 6. Test/Debug Endpoint'leri
- [ ] Yeni debug endpoint production'da kapalı mı?
- [ ] NODE_ENV === 'production' kontrolü var mı?

### 7. Marketplace Güvenliği
- [ ] connectionId her zaman resolveConnectionId() ile mi alınıyor?
- [ ] Başkasının connectionId'sine erişim riski var mı?
- [ ] rotate-keys sadece admin'e açık mı?

### 8. PayTR Güvenliği
- [ ] /api/paytr/ route'ları middleware bypass ediyor (KASITLI — doğru)
- [ ] test-callback production'da kapalı mı?
- [ ] Hash validation gateway'de yapılıyor mu?

## Bilinen Sorunlar (Takip Et)

- app/api/notifications/test-email/route.ts → getTestEmailTemplate() fonksiyon imzasıyla uyumsuz çağrılıyor
- app/api/debug/subscription/route.ts → Gateway'e migrate edilecek (TODO yorum var)

## Blok Seviyeleri

```
🔴 BLOK     → Commit atılmaz, düzeltilmeden ilerlenemez
🟠 ACİL     → Bu sprint düzelt
🟡 UYARI    → Teknik borç, takibe al
```

## Rapor Formatı

```
🔒 GÜVENLİK TARAMA RAPORU

BLOK — commit atılamaz:
🔴 [sorun] → [dosya] → [çözüm]

ACİL — bu sprint:
🟠 [sorun] → [çözüm]

UYARI — takip:
🟡 [sorun]

SONUÇ: Geçti ✅ / Geçmedi ❌
```

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- PayTR /api/paytr/ route'larının middleware bypass etmesi KASITLI — PayTR server-to-server POST gönderir, cookie yoktur
- audit_logs tablosunda client policy olmaması KASITLI — sadece service_role yazabilir
- CVE-2025-29927: Next.js middleware bypass açığı — x-middleware-subrequest header'ı ile middleware atlanabiliyordu, middleware.ts'de bloke edildi

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- CSS/UI'da tek satır bile DB/API kodu geçirsem BLOK koymamak
- PayTR bypass'ını "güvenlik açığı" olarak raporlamak (KASITLI, doğru)
- audit_logs'a client policy eklemek (client erişimine kapalı olması şart)
- Migration'ı kendim çalıştırmak (sadece Hilmi çalıştırır)
