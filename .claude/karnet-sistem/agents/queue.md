# 📋 QUEUE — GÖREV SIRASI

Max 20 kayıt. Sadece görev adı ve durum — detay değil.
Dolunca eski tamamlananlar silinir.

## Durum Kodları
```
⏳ BEKLIYOR   → henüz başlanmadı
🔄 DEVAM      → şu an yapılıyor
✅ TAMAMLANDI → bitti, commit atıldı
❌ HATA       → başarısız, tekrar denenecek
```

## Aktif Görevler

*(Başlangıçta boş)*

## Tamamlanan Son Görevler

*(Başlangıçta boş)*

---

## Limit Kuralı
- Max 20 kayıt (aktif + tamamlanan toplam)
- Dolunca en eski tamamlananlar silinir
- Detay queue'ya girmez — görev adı + durum yeterli
