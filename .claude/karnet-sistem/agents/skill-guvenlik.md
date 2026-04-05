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

## Mevcut Güvenlik Altyapısı

```
CVE-2025-29927  → middleware.ts'de x-middleware-subrequest bloke
RLS             → Tüm Supabase tablolarında aktif
Audit log       → audit_logs tablosu, client erişimi yok
Token denylist  → Çıkışta revokeAllUserTokens() çağrılıyor
Rate limiting   → Upstash Redis, tüm endpoint'lerde
Ownership       → lib/security/ownership.ts
SSRF koruması   → Google Sheets import sadece docs.google.com kabul eder
Admin koruması  → lib/supabase/admin.ts sadece repositories/ ve cron
PayTR bypass    → /api/paytr/ middleware auth'u bypass eder (KASITLI)
Webhook bypass  → /api/webhook/marketplace middleware bypass (KASITLI — Trendyol server-to-server)
Bulk delete     → user_id kontrolü var (Supabase .in() + .eq('user_id'))
```

## Webhook Güvenlik Notları (2026-04-06 Eklendi)

```
/api/webhook/marketplace:
  - Middleware bypass VAR (KASITLI — Trendyol server-to-server POST)
  - Basic Auth doğrulaması webhook route'ta yapılıyor
  - seller_id'den user_id eşleşmesi DB'den (createAdminClient service'te)
  - Idempotency: aynı body hash 1000 webhook içinde dedup
  - Her durumda 200 döner (Trendyol retry mekanizması için)
```

## Öğrendiklerim

- PayTR /api/paytr/ route'larının middleware bypass etmesi KASITLI
- audit_logs tablosunda client policy olmaması KASITLI
- CVE-2025-29927: middleware.ts'de bloke edildi — KALDIRMA
- **Webhook /api/webhook/marketplace middleware bypass KASITLI** — Trendyol cookie göndermez
- **Bulk delete endpoint'te user_id kontrolü şart** — .in('id', ids).eq('user_id', userId)
- **Webhook event'lerinde seller_id → user_id eşleşmesi** zorunlu (başkasının verisine erişim riski)

## Asla Yapma

- CSS/UI'da tek satır bile DB/API kodu geçirsem BLOK koymamak
- PayTR bypass'ını "güvenlik açığı" olarak raporlamak (KASITLI)
- Webhook bypass'ını "güvenlik açığı" olarak raporlamak (KASITLI)
- audit_logs'a client policy eklemek
- Migration'ı kendim çalıştırmak
- Bulk delete'te user_id kontrolü olmadan silme
