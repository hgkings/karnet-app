# Kârnet — Claude Code Kuralları

## KRİTİK: Ödeme Sistemi Koruma Altında

Aşağıdaki dosyalar **sahibin açık onayı olmadan kesinlikle değiştirilemez.**
Bu dosyalara dokunmadan önce kullanıcıya sor ve onay al.

### 🔒 Korunan Dosyalar

```
app/api/paytr/callback/route.ts
app/api/paytr/create-payment/route.ts
app/api/verify-payment/route.ts
app/basari/page.tsx
```

### Neden Korunuyor?

Bu dosyalar uzun süre hata ayıklama gerektiren kritik ödeme akışını oluşturur.
Yanlış bir değişiklik tüm ödeme sistemini bozar.

---

## Ödeme Sistemi — Nasıl Çalışır (Değiştirme)

### Akış

```
1. Kullanıcı "Pro Al" tıklar
2. POST /api/paytr/create-payment
   → 96 karakter güvenli token üretir (48 random byte)
   → token + token_expires_at (15 dk) payments tablosuna kaydedilir
   → PayTR Link API'ye POST → link URL döner
   → { paymentId, paymentUrl, token } frontend'e döner
3. Frontend → PayTR linki yeni sekmede açar
4. Frontend → /basari?paymentId=X&token=Y sayfasına yönlendirir
5. Kullanıcı PayTR'da ödeme yapar
6. PayTR → POST https://www.xn--krnet-3qa.com/api/paytr/callback
   → Hash doğrulama: HMAC-SHA256(callback_id + merchant_oid + salt + status + total_amount, merchant_key)
   → payments.status = 'paid'
   → profiles.plan = 'pro', is_pro = true
7. /basari sayfası her 5s'de GET /api/verify-payment?token=X çeker
   → token geçerli + payments.status = 'paid' ise success döner
   → Kullanıcıya "🎉 Pro Aktif!" gösterilir
```

### Hash Formülü (MUTLAKA BU FORMÜL KULLANILMALI)

```typescript
// PayTR Link API callback hash — id/link_id alanı BOŞ gelir, callback_id kullanılır
const hashStr = callback_id + merchant_oid + merchantSalt + status + total_amount;
const expectedHash = crypto.createHmac('sha256', merchantKey).update(hashStr).digest('base64');
```

### Vercel Environment Variables (Değiştirme)

| Değişken | Değer | Açıklama |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://www.xn--krnet-3qa.com` | Ana uygulama URL'i |
| `PAYTR_CALLBACK_URL` | `https://www.xn--krnet-3qa.com` | PayTR callback domain (www zorunlu) |
| `PAYTR_MERCHANT_ID` | gizli | PayTR mağaza ID |
| `PAYTR_MERCHANT_KEY` | gizli | PayTR imzalama anahtarı |
| `PAYTR_MERCHANT_SALT` | gizli | PayTR salt değeri |
| `SUPABASE_SERVICE_ROLE_KEY` | gizli | Supabase admin erişimi |

> ⚠️ `www.xn--krnet-3qa.com` olmadan PayTR callback gelmiyor.
> Bare domain (`xn--krnet-3qa.com`) Vercel tarafından www'ye redirect edilir,
> PayTR bu redirect'i takip etmez → callback hiç gelmez.

### Supabase — Kritik Kolonlar

**payments tablosu:**
- `token` TEXT — 96 karakter hex güvenlik tokeni
- `token_expires_at` TIMESTAMPTZ — 15 dakika sonra sona erer
- `status` — `created` | `paid` | `expired` | `failed`
- `provider_order_id` — PayTR callback_id (UUID hyphensiz)

**profiles tablosu:**
- `plan` — `free` | `pro` | `pro_monthly` | `pro_yearly` | `admin`
- `is_pro` BOOLEAN
- `pro_until` TIMESTAMPTZ

---

## Genel Kurallar

- Deploy için `git push origin main` yeterli — Vercel otomatik deploy eder
- Ödeme akışında değişiklik gerekiyorsa önce kullanıcıya açıkla ve onay al
- Admin paneli: `/admin` — sadece `profiles.plan = 'admin'` olan kullanıcılar erişebilir
- Test için `PAYTR_TEST_PRICE` env var ile fiyat override yapılabilir (kuruş cinsinden değil, TL)
