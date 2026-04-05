# 🧠 SHARED MEMORY — AGENTLAR ARASI ORTAK HAFIZA

Bu dosyayı her agent görev başında okur.
Max 20 kayıt. Limit dolunca [NORMAL] olanlar silinir.

## Aktif Kayıtlar

[KRİTİK] [2026-04-06] [Trendyol] → Trendyol sipariş satırında line.productId YOKTUR! line.barcode, line.productName, line.stockCode kullan.
[KRİTİK] [2026-04-06] [Trendyol] → Buybox API işe yaramaz — kaldırıldı. Hep kendi verisini döner.
[KRİTİK] [2026-04-06] [Trendyol] → Claims API gerçek yapı: items[].orderLine.productName, claimLines DEĞİL.
[KRİTİK] [2026-04-06] [Trendyol] → Webhook URL'de "trendyol" kelimesi GEÇEMEZ (domain + path dahil). Path: /api/webhook/marketplace
[KRİTİK] [2026-04-06] [Trendyol] → Hakediş sadece sipariş teslim edildikten sonra oluşur — 0 görünmesi normal olabilir.
[KRİTİK] [2026-04-06] [Geliştirici] → Yeni profil alanı = 6 katman güncellemesi (migration, types, validator, auth, service, interface).
[KRİTİK] [2026-04-06] [UI/CSS] → Input component'te text-foreground VAR — ayrıca ekleme (dark mode fix).
[ÖNEMLİ] [2026-04-06] [Trendyol] → Rate limit: genel 2000/dk (eski 50/10sn ÇOK DÜŞÜKTÜ).
[ÖNEMLİ] [2026-04-06] [Trendyol] → Barcode eşleşmesi case-insensitive olmalı — toLowerCase() şart.
[ÖNEMLİ] [2026-04-06] [Trendyol] → Sipariş sayarken blacklist kullan (Cancelled/Returned hariç tut), whitelist DEĞİL.
[ÖNEMLİ] [2026-04-06] [Geliştirici] → Stock API monthlySales alanı eklendi — sipariş verisi de dönüyor.
[ÖNEMLİ] [2026-04-06] [Geliştirici] → sync-products barcode'u inputs JSONB'ye de yazmalı (frontend eşleşmesi için).
[NORMAL] [2026-04-06] [UI/CSS] → Dashboard max-w-6xl → max-w-full yapıldı.
[NORMAL] [2026-04-06] [UI/CSS] → colSpan kolon ekleyince güncellenmalı.
[NORMAL] [2026-04-06] [Geliştirici] → Toplu silme: bulk-delete endpoint, Supabase .in() ile tek sorgu.

---

## Limit Kuralı
- Max 20 kayıt
- Dolunca: [NORMAL] sil, [ÖNEMLİ] decisions.md'ye taşı, [KRİTİK] asla silme
