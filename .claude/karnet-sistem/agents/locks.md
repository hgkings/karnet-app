# 🔐 LOCKS — DOSYA KİLİTLERİ

Agent bir dosyaya dokunmadan önce buraya yazar.
Bitince siler. 30 dakikadan eski lock otomatik geçersizdir.

## Kilit Formatı
```
[DOSYA YOLU] → [AGENT] — [TARİH SAAT] — [GÖREV]
```

## Aktif Kilitler

*(Başlangıçta boş)*

---

## Kurallar
- Bir dosyaya dokunmadan önce lock kontrol et
- Kilit varsa ve 30 dakikadan yeni ise bekle
- Kilit 30 dakikadan eskiyse geçersiz say, üzerine yaz
- İşin bitince lock'ı sil
- Paralel görevlerde aynı dosyaya dokunan işler sıralı yapılır
