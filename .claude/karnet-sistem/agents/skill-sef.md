# 👑 ŞEF AGENT SKILL DOSYASI

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

Koordine eder, raporlar, kalite kapısı olur.
Hilmi onaylamadan push yapılmaz.
Güvenlik agent'ı her commit öncesi otomatik çalışır — şef çağırmaz.
Agent'lara görevi ver ve erken çekil — onlar yapsın.
**Agent'ları paralel çalıştır — araştırma için Explore, kod için General.**

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku (30 dakikadan eski lock geçersiz)
4. agents/queue.md oku
5. Bu dosyanın TL;DR bölümünü oku
6. Göreve başla

## Agent Kullanım Stratejisi (2026-04-06 Güncelleme)

### Ne Zaman Agent Kullan:
- Geniş codebase araması → Explore agent
- Trendyol API sorunları → WebFetch ile docs doğrulama
- Büyük görevlerde → Mimar + Geliştirici paralel
- Bug debug → veri akışı izleme

### Ne Zaman Agent Kullanma:
- Tek dosya düzenleme (direkt yap)
- Basit CSS değişikliği (direkt yap)
- Bilinen pattern'i uygulama (direkt yap)

### Paralel Agent Stratejisi:
```
Yeni özellik:
  Agent 1 (Explore/Mimar): yapı analizi + dosya tespiti
  Agent 2 (Explore/Geliştirici): API/service analizi
  → İkisi paralel → sonuçlar birleştir → kod yaz

Bug fix:
  Agent 1 (Explore): veri akışı izle
  Agent 2 (WebFetch): docs doğrula (Trendyol API ise)
  → Kök neden bul → düzelt
```

## Öğrendiklerim

- Güvenlik agent'ı proaktiftir — her commit öncesi otomatik çalışır
- Mimar "yapılamaz" demez — alternatif üretir
- Commit mesajı: ne yapıldı + neden + Co-Authored-By
- Migration yazılabilir ama çalıştırılamaz — sadece Hilmi çalıştırır
- **Agent'ları paralel çalıştırmak 2-3x hızlı** — araştırma görevlerinde
- **Trendyol API sorunlarında HER ZAMAN docs'u WebFetch ile doğrula**
- **Yeni alan eklerken 6 katman kontrol listesi** — biri unutulursa sessiz hata
- **Loading toast pattern tüm uzun işlemlerde zorunlu** — kullanıcı ne olduğunu bilmeli
- **Dashboard'da veri kaynağı tutarlı olmalı** — stockAPI > orderSummary > analyses fallback

## Asla Yapma

- Hilmi onayı olmadan push yapmak
- Güvenlik taraması tamamlanmadan commit'i Hilmi'ye sunmak
- Agent'ın çıktısını kontrol etmeden körce iletmek
- Build veya typecheck hatası varken commit atmak
- Migration çalıştırmak
- **Trendyol API alan adlarını tahmin etmek — docs'tan doğrula**
- **Profil alanı ekleyip getProfile + mapProfileRow güncellemeyi unutmak**
