# 🇹🇷 İÇERİK AGENT SKILL DOSYASI

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

Kârnet'teki tüm Türkçe metinleri denetler ve düzeltirim.
Kullanıcıya İngilizce sistem mesajı gösterilemez.
Terminoloji tablosuna uy — projeye özel kelimeler var.

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başla

## Kârnet Terminoloji Tablosu (Değiştirilemez)

| Doğru | Yanlış / Yasak |
|---|---|
| Kârnet | KarNet, Karnet (logo hariç) |
| Pazaryeri | Marketplace |
| Sipariş | Order |
| Ürün | Product, Item |
| Stok | Envanter, Stock |
| Fiyat | Price (fiyat bağlamında) |
| Hakediş | Finance, Ödeme (bu ekran için) |
| Analiz | Analysis |
| Kâr Marjı | Margin |
| Entegrasyon | Integration |
| Güncelleme | Update |
| Bağlantı | Connection |
| Başabaş | Break-even |
| Nakit Planı | Cash flow, Cash plan |
| Komisyon | Commission |
| İade | Return |

## Navigasyon Metinleri (Değiştirilemez)

config/navigation.ts'den gelir:
Dashboard, Yeni Analiz, Ürünler, Başabaş, Nakit Planı, Pazaryeri, Hakediş, Premium, Profil, Destek, Ayarlar, PDF Rapor, CSV İçe Aktar, Fiyatlandırma

## Kullanıcı Mesajı Tonları

**Hata mesajı** — kısa, net, çözüm öner:
```
✅ "Bağlantı kurulamadı. Lütfen tekrar deneyin."
✅ "Doğrulama hatası"
✅ "Bu alan zorunludur."
❌ "An error occurred" (İngilizce YASAK)
❌ "Beklenmeyen bir sistem hatası nedeniyle işlem tamamlanamadı" (çok uzun)
```

**Başarı mesajı** — olumlu, kısa:
```
✅ "Stok güncellendi."
✅ "Analiz kaydedildi."
✅ "Bağlantı kuruldu."
```

**Yükleme** — üç nokta:
```
✅ "Yükleniyor..."
❌ "Lütfen bekleyiniz" (resmi ve gereksiz)
❌ "Lütfen bekleyin." (nokta yok, üç nokta şart)
```

**Boş durum** — yönlendirici:
```
✅ "Henüz sipariş yok."
✅ "İlk analizinizi oluşturmak için 'Yeni Analiz'e tıklayın."
```

## Türkçe Yazım Kuralları

**Büyük harf:**
- İ/i ayrımı: büyük = İ, küçük = i
- İlk harf büyük: "İlk analiz" (i değil İ)

**Bitişik/ayrı yazım:**
- "her şey" (ayrı — "herşey" yanlış)
- "bir şey" (ayrı — "birşey" yanlış)
- "hiçbir şey" (ayrı)

**Fiiller:**
- "tıklayın" (tıklayınız değil)
- "bekleyin" (bekleyiniz değil)
- "gidin" (gidiniz değil)

## Tarama Alanları

```
app/                    → sayfa başlıkları, açıklama metinleri
components/             → buton, label, tooltip metinleri
lib/email/templates/    → e-posta şablonları
lib/validators/schemas/ → Zod hata mesajları (Türkçe olmalı)
API response'ları       → { error: 'Türkçe mesaj' }
```

## E-posta Şablonları

Provider: Brevo SMTP (smtp-relay.brevo.com)
From: "Kârnet" karnet.destek@gmail.com
Tone: Samimi ama profesyonel
Buton metni eylem bildirmeli: "E-postamı Doğrula", "Planı Yenile", "Panele Git"

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- Kârnet'te "Hakediş" finance ekranının adı — "Ödeme" veya "Finance" yazılmaz
- Plan adları: Ücretsiz, Başlangıç, Profesyonel (free/starter/pro'nun Türkçe karşılıkları)
- Starter: 399₺/ay, 3990₺/yıl — Pro: 799₺/ay, 7990₺/yıl
- CSV İçe Aktar (büyük İ — "CSV Ice Aktar" yanlış, quick-actions-bar.tsx'de hata var)

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- Kullanıcıya İngilizce sistem mesajı göstermek
- Terminoloji tablosuna uymamak (örn: "marketplace" yazıp "pazaryeri" yazmamak)
- "bekleyiniz", "tıklayınız" gibi aşırı resmi fiil kullanmak
- İ/i büyük-küçük harf hatasını görmezden gelmek
