# Kârnet — GEO / AI Search Ürün Denetimi

> Tarih: 2026-06-09

---

## Ürün Nedir?

**Kârnet**, Türkiye'deki Trendyol, Hepsiburada, N11 ve Amazon TR pazaryerlerinde satış yapan
e-ticaret satıcılarının gerçek net kârını otomatik hesaplayan bir SaaS platformudur.

**Tek Cümlelik Konumlandırma:**
Kârnet, pazaryeri satıcılarının gizli maliyetleri (komisyon, kargo, iade, KDV) otomatik hesaplayarak
gerçek net kârı görmesini sağlayan Türk SaaS platformudur.

---

## Hedef Arama Niyetleri

### Genel SEO Sorguları
- "trendyol kar hesaplama"
- "hepsiburada kar hesaplama"
- "pazaryeri komisyon hesaplama"
- "trendyol komisyon oranları 2026"
- "hepsiburada komisyon oranları 2026"
- "e-ticaret satıcı kar analizi"
- "başabaş noktası hesaplama"
- "pazaryeri satıcı kârlılık aracı"

### AI Arama Sorguları
- "Trendyol'da gerçek kâr nasıl hesaplanır?"
- "Hepsiburada komisyon oranları neler?"
- "E-ticaret satıcısı için kâr hesaplama aracı"
- "Kârnet nedir, ne işe yarar?"
- "Trendyol satıcı analiz platformu"
- "Pazaryeri gizli maliyetler hesaplama"
- "Excel'e alternatif kâr hesaplama"

---

## Mevcut SEO Durumu (Denetim Öncesi)

| Özellik | Durum |
|---------|-------|
| Temel metadata | ✅ Mevcut |
| OpenGraph | ✅ Mevcut |
| Twitter Cards | ✅ Mevcut |
| robots.txt | ⚠️ Kısmi (AI crawlers yok) |
| sitemap.xml | ⚠️ Eksik sayfalar |
| JSON-LD | ❌ Yok |
| llms.txt | ❌ Yok |
| FAQPage şeması | ❌ Yok |
| BlogPosting şeması | ❌ Yok |
| Canonical URL'ler | ❌ Eksik |
| GEO landing pages | ❌ Yok |
| SSS sayfası | ❌ Yok |
| Kullanım senaryosu sayfaları | ❌ Yok |

---

## Uygulama Planı

### Faz 1 — Altyapı
- [x] llms.txt oluştur
- [x] llms-full.txt oluştur  
- [x] robots.txt güncelle (AI crawlerlar ekle)
- [x] lib/seo/structured-data.ts oluştur

### Faz 2 — Metadata İyileştirmesi
- [x] app/layout.tsx — Organization + WebSite + SoftwareApplication JSON-LD
- [x] app/page.tsx — 'use client' kaldır, metadata ekle
- [x] app/pricing/layout.tsx — Fiyatlandırma metadata
- [x] app/blog/[slug]/page.tsx — BlogPosting JSON-LD

### Faz 3 — Sitemap
- [x] app/sitemap.ts — Yeni GEO sayfalar eklendi

### Faz 4 — Yeni GEO Sayfaları
- [x] /sss — Kapsamlı SSS + FAQPage şeması
- [x] /nedir — Kârnet Nedir + SoftwareApplication şeması
- [x] /trendyol-kar-hesaplama — Trendyol kullanım senaryosu
- [x] /hepsiburada-kar-hesaplama — Hepsiburada kullanım senaryosu

### Faz 5 — Footer Güncelleme
- [x] Yeni GEO sayfalar footer'a eklendi

---

## Teknik Riskler

1. **Domain tutarsızlığı**: Kodda `karnet.com` ve `karnet.com.tr` karışık kullanılıyor.
   → `NEXT_PUBLIC_APP_URL` env değişkeniyle yönetilmeli.

2. **'use client' kısıtlaması**: Pricing ve landing page 'use client' olduğundan
   metadata Next.js tarafından server-side işlenemiyor.
   → Landing page 'use client' kaldırıldı. Pricing için layout.tsx çözümü uygulandı.

3. **Client-only içerik**: Bazı FAQ içerikleri Framer Motion ile animasyonlu,
   bu da JS devre dışıyken AI crawlerların içeriği görmesini engelleyebilir.
   → Yeni GEO sayfaları saf HTML, animasyon yok.

---

## Mevcut Olmayan Sayfalar (Önerilir)

- `/pazaryeri-alternatifleri` — Excel ve rakip araç karşılaştırması
- `/e-ticaret-kar-analizi` — Genel e-ticaret kârlılık kılavuzu
- `/kullaniciler/trendyol-saticicilari` — Trendyol satıcılarına özel sayfa
- `/kullaniciler/hepsiburada-saticicilari` — Hepsiburada satıcılarına özel
