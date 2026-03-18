# KÂRNET — AI AGENT KURALLAR & KISITLAMALAR

> Bu dosya Claude Code ve Antigravity için bağlayıcı kurallardır.
> Herhangi bir görev başlamadan önce bu dosyayı oku ve kurallara uy.
> Kural ihlali yapma. Emin değilsen → SORU SOR.

---

## 0. ALTIN KURAL

**Senden istenmediği sürece mevcut çalışan kodu değiştirme.**
Bir şeyi düzeltmek için başka bir şeyi bozamazsın.
Her değişiklik öncesi: "Bu değişiklik başka bir şeyi bozar mı?" diye sor kendine.

---

## 1. DEĞİŞİKLİK KATEGORİLERİ

### 🟢 GÜVENLİ — Onay gerekmez
- Sadece görsel/UI değişikliği (renk, margin, metin)
- Yeni bir dosya oluşturmak (mevcut dosyalara dokunmadan)
- Yorum satırı eklemek
- `console.log` ekleyip kaldırmak

### 🟡 ONAY GEREK — Değişiklik öncesi kullanıcıya sor
- Mevcut bir fonksiyonun içini değiştirmek
- Bir component'e yeni prop eklemek
- Import/export yapısını değiştirmek
- Tip (TypeScript type/interface) değiştirmek
- `config/`, `contexts/`, `hooks/`, `utils/` altındaki dosyalar
- `middleware.ts`
- `tailwind.config.ts`
- `types/index.ts`

### 🔴 KESİNLİKLE YASAK — Asla yapma, sormadan bile teklif etme
- Aşağıdaki korunan dosyaları değiştirmek (bkz. Bölüm 2)
- Herhangi bir dosyayı **silmek**
- `package.json` bağımlılıklarını değiştirmek/kaldırmak
- Supabase migration veya tablo yapısını değiştirmek
- Environment variable adlarını değiştirmek
- Auth akışını refactor etmek
- Ödeme akışını (PayTR) refactor etmek

---

## 2. KORUNAN DOSYALAR 🔒

Bu dosyalara **kesinlikle dokunma.** Değişiklik gerekiyorsa kullanıcıya açıkla, onay bekle:

```
app/basari/page.tsx
app/api/paytr/callback/route.ts
app/api/paytr/create-payment/route.ts
app/api/verify-payment/route.ts
lib/supabaseClient.ts
lib/supabase-server-client.ts
lib/auth.ts
contexts/auth-context.tsx
middleware.ts
```

**Neden?** Bu dosyalar ödeme sistemi, kimlik doğrulama ve güvenlik altyapısını oluşturuyor. Hatalı bir değişiklik kullanıcıları kilitleyebilir veya ödeme akışını bozabilir.

---

## 3. SUPABASE KURALLARI

- `supabase/migrations/` klasörüne asla dokunma
- Yeni bir tablo veya kolon önermek istiyorsan → SQL'i yaz, çalıştırma, kullanıcıya sun
- RLS politikalarını değiştirme
- `service_role` key'ini yalnızca server-side dosyalarda kullan, client-side'a ekleme
- `NEXT_PUBLIC_` prefix'i olmayan env variable'ları asla frontend'e taşıma

---

## 4. DOSYA SİLME KURALI

**Hiçbir dosyayı silme.**
"Bu dosya kullanılmıyor" diye düşünsan bile silme.
Önce kullanıcıya bildir: hangi dosya, neden gereksiz olduğunu düşündüğünü açıkla.

---

## 5. BÜYÜK DEĞİŞİKLİKLER İÇİN ZORUNLU SÜREÇ

Eğer yapılacak değişiklik 3'ten fazla dosyayı etkiliyorsa:

1. **Önce rapor ver:** Hangi dosyalar etkilenecek, ne değişecek, neden
2. **Kullanıcının onayını bekle**
3. **Onay sonrası uygula**
4. **Özet sun:** Ne değişti, ne test edilmeli

Onay almadan uygulamaya geçme.

---

## 6. REFACTOR KURALLARI

- Çalışan kodu "daha temiz olsun" diye refactor etme
- İstek yoksa isimlendirmeyi (değişken, fonksiyon, dosya) değiştirme
- Bir komponenti parçalara bölme (split) → önce sor
- Dosya taşıma (move/rename) → önce sor

---

## 7. HATA ÇÖZÜMÜ KURALLARI

Bir bug'ı çözerken:
- Sadece hatalı kısmı düzelt, etrafındaki kodu değiştirme
- "Bu kodu da düzelteyim" diyerek kapsam genişletme
- Düzeltme öncesi: hangi dosya, hangi satır, neden hatalı → açıkla

---

## 8. KOD YAZMA STANDARTLARI

- **Dil:** TypeScript (JS yazma)
- **Stil:** Projedeki mevcut kod stiline uymak zorundasın
- **Component:** Fonksiyonel component kullan, class component yazma
- **Import:** Relatif import yollarını değiştirme (`@/` alias'ı koru)
- **CSS:** Tailwind kullan, inline style ekleme
- **Yorum:** Türkçe veya İngilizce tutarlı ol, ikisini karıştırma

---

## 9. ORTAM (ENVIRONMENT) KURALLARI

```
NEXT_PUBLIC_*     → Frontend'de kullanılabilir
Diğer tüm env'ler → Sadece server-side (API routes, server components)
```

- `.env.local` dosyasına dokunma
- Yeni env variable gerekiyorsa → kullanıcıya bildir, kendisi eklesin

---

## 10. MARKETPLACE API KURALLARI

- `lib/trendyol-api.ts` ve `lib/hepsiburada-api.ts` içindeki API key yönetimini değiştirme
- `api/marketplace/rotate-keys/route.ts` endpoint'ini değiştirme
- Marketplace senkronizasyon mantığını refactor etme

---

## ÖZET KARAR AKIŞI

```
Değişiklik yapacak mısın?
        ↓
Korunan dosya mı? (Bölüm 2)
  → EVET: DUR. Kullanıcıya açıkla, onay bekle.
  → HAYIR ↓
3'ten fazla dosya mı?
  → EVET: Önce rapor ver, onay al.
  → HAYIR ↓
🟡 kategoride mi? (Bölüm 1)
  → EVET: Önce sor.
  → HAYIR: Uygula.
```

---

> **Son not:** "Kullanıcı istemedi ama bence daha iyi olur" düşüncesiyle hiçbir değişiklik yapma.
> Görevin istenen şeyi yapmak, projeyi senin vizyonuna göre şekillendirmek değil.
