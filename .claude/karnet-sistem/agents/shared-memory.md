# 🧠 SHARED MEMORY — AGENTLAR ARASI ORTAK HAFIZA

Bu dosyayı her agent görev başında okur.
Bir agent önemli bir şey keşfederse buraya yazar, diğerleri de öğrenir.
Max 20 kayıt. Limit dolunca [NORMAL] olanlar silinir, [ÖNEMLİ] decisions.md'ye taşınır.

## Kayıt Formatı
```
[ETİKET] [TARİH] [AGENT] → [Keşif / Bilgi]
Etiket: [NORMAL] / [ÖNEMLİ] / [KRİTİK]
```

## Aktif Kayıtlar

*(Başlangıçta boş — agentlar zamanla doldurur)*

---

## Limit Kuralı
- Max 20 kayıt
- Dolunca: [NORMAL] sil, [ÖNEMLİ] decisions.md'ye taşı, [KRİTİK] asla silme
- Archive: agents/archive/shared-memory-[tarih].md
