# ✅ CHECKLİST — COMMIT ATILMADAN ÖNCE DOLDURULUR

Bu dosya her commit öncesi doldurulur.
Tamamlanmadan commit atılamaz.
Şef bu dosyayı kontrol eder — eksik varsa geri gönderir.

## Son Görevin Checklist'i

**Görev:** *(görev adı)*
**Agent:** *(hangi agent)*
**Tarih:** *(tarih saat)*

### Zorunlu Kontroller

**Katman İzolasyonu:**
- [ ] CSS/UI dosyalarında DB, API, business logic YOK
- [ ] components/ içinde repositories/ import YOK
- [ ] app/ içinde createAdminClient() YOK

**Güvenlik:**
- [ ] .env'e dokunulmadı
- [ ] Migration çalıştırılmadı
- [ ] Yeni endpoint'te requireAuth() veya requireAdmin() VAR
- [ ] Input Zod ile validate ediliyor
- [ ] Güvenlik agent'ı taramayı tamamladı ✅/❌

**Kalite:**
- [ ] npm run build → GEÇTI ✅ / HATA ❌
- [ ] npm run typecheck → GEÇTI ✅ / HATA ❌
- [ ] Türkçe metinler doğru
- [ ] Değişiklik minimum (gereksiz satır yok)

**Dosyalar:**
- [ ] Skill dosyası güncellendi (değerli bilgi varsa)
- [ ] changelog.md güncellendi
- [ ] results.md güncellendi
- [ ] shared-memory.md güncellendi (paylaşılacak bilgi varsa)
- [ ] locks.md temizlendi
- [ ] queue.md güncellendi

**Commit:**
- [ ] Commit mesajı formatına uygun: [agent-adı] ne yaptı — skill güncellendi
- [ ] Push YAPILMADI (Hilmi onaylayacak)

### Şef'in Kalite Kontrolü

- [ ] Tüm checkler tamamlandı
- [ ] Build ve typecheck geçti
- [ ] Güvenlik taraması temiz
- [ ] Hilmi'ye sunmaya hazır

---

*(Her commit için bu template'i sıfırla ve yeniden doldur)*
