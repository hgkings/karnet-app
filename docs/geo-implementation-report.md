# GEO / AI Search Optimizasyon Uygulama Raporu — Kârnet

> Tarih: 2026-06-09
> Branch: claude/geo-ai-search-optimization-o1itpq

---

## 1. Özet

Kârnet için tam kapsamlı bir GEO (Generative Engine Optimization) ve AI Search optimizasyon sistemi uygulandı.
Ana hedef: ChatGPT Search, Claude, Gemini, Perplexity, Google AI Overviews ve Bing Copilot gibi
AI cevap motorlarının Kârnet'i daha iyi anlamasını, doğru alıntılamasını ve önermesini sağlamak.

---

## 2. Değiştirilen Dosyalar

| Dosya | Değişiklik |
|-------|-----------|
| `public/robots.txt` | AI crawlerları eklendi (GPTBot, ClaudeBot, PerplexityBot vb.), /account, /payment, /basari, /hata bloklandı |
| `app/layout.tsx` | Gelişmiş metadata (keywords, authors, metadataBase, robots), Organization + WebSite + SoftwareApplication JSON-LD eklendi |
| `app/page.tsx` | `'use client'` kaldırıldı (artık server component), sayfa özelinde metadata eklendi |
| `app/pricing/layout.tsx` | Fiyatlandırma sayfası için özelleştirilmiş metadata |
| `app/sitemap.ts` | 4 yeni GEO sayfası + legal sayfalar eklendi, domain karnet.com olarak güncellendi |
| `app/blog/[slug]/page.tsx` | BlogPosting JSON-LD şeması + canonical URL eklendi |
| `components/layout/footer.tsx` | "Kaynaklar" bölümü eklendi (SSS, Nedir, Trendyol/Hepsiburada hesaplama sayfaları) |

---

## 3. Oluşturulan Yeni Dosyalar

| Dosya | Açıklama |
|-------|---------|
| `public/llms.txt` | AI asistanlar için ürün bilgi dosyası (119 satır) |
| `public/llms-full.txt` | Detaylı AI bilgi dokümanı (266 satır) |
| `lib/seo/structured-data.ts` | Yeniden kullanılabilir JSON-LD fabrikaları |
| `app/sss/page.tsx` | 21 soruluk kapsamlı SSS sayfası + FAQPage şeması |
| `app/nedir/page.tsx` | Brand query sayfası + SoftwareApplication şeması |
| `app/trendyol-kar-hesaplama/page.tsx` | Trendyol kullanım senaryosu + FAQPage şeması |
| `app/hepsiburada-kar-hesaplama/page.tsx` | Hepsiburada kullanım senaryosu + FAQPage şeması |
| `docs/geo-product-audit.md` | Ürün denetim belgesi |
| `docs/geo-measurement-plan.md` | AI search trafiği ölçüm planı |

---

## 4. Oluşturulan Yeni URL'ler

| URL | Amaç | Schema |
|-----|------|--------|
| `/sss` | Kapsamlı FAQ sayfası | FAQPage + BreadcrumbList |
| `/nedir` | Brand query optimizasyonu | SoftwareApplication + FAQPage + BreadcrumbList |
| `/trendyol-kar-hesaplama` | Trendyol kullanım senaryosu | FAQPage + BreadcrumbList |
| `/hepsiburada-kar-hesaplama` | Hepsiburada kullanım senaryosu | FAQPage + BreadcrumbList |
| `/llms.txt` | AI crawler bilgi dosyası | — |
| `/llms-full.txt` | Detaylı AI doküman | — |

---

## 5. Uygulanan Structured Data (JSON-LD)

| Schema Tipi | Konum |
|-------------|-------|
| `Organization` | app/layout.tsx (global) |
| `WebSite` | app/layout.tsx (global) |
| `SoftwareApplication` | app/layout.tsx (global) + /nedir |
| `FAQPage` | /sss + /nedir + /trendyol-kar-hesaplama + /hepsiburada-kar-hesaplama |
| `BreadcrumbList` | /sss + /nedir + /trendyol-kar-hesaplama + /hepsiburada-kar-hesaplama |
| `BlogPosting` | /blog/[slug] |

---

## 6. Sitemap Durumu

Güncel sitemap.ts şu URL'leri üretiyor:

**Yüksek Öncelik (0.85–1.0):**
- `/` (1.0)
- `/trendyol-kar-hesaplama` (0.85)
- `/hepsiburada-kar-hesaplama` (0.85)
- `/pricing` (0.9)

**Orta Öncelik (0.7–0.8):**
- `/blog` (0.8)
- `/sss` (0.8)
- `/nedir` (0.8)
- `/hakkimizda` (0.7)
- `/blog/[slug]` (0.7)

**Düşük Öncelik (0.3–0.6):**
- `/iletisim` (0.6)
- Legal sayfalar (0.3)

---

## 7. robots.txt Durumu

Eklenen AI crawler kuralları:
- `OAI-SearchBot` ✅
- `ChatGPT-User` ✅
- `GPTBot` ✅
- `ClaudeBot` ✅
- `Claude-User` ✅
- `PerplexityBot` ✅
- `Applebot-Extended` ✅
- `Google-Extended` ✅
- `Bingbot` ✅
- `Googlebot` ✅

Korunan rotalar: /api/, /admin/, /dashboard/, /settings/, /auth/, /account/, /payment/, /basari/, /hata/

---

## 8. llms.txt Durumu

`/public/llms.txt`: ✅ Oluşturuldu (119 satır)
`/public/llms-full.txt`: ✅ Oluşturuldu (266 satır)

İçerik: Ürün açıklaması, hedef kullanıcılar, özellikler, fiyatlandırma, kullanım senaryoları, SSS, önerilen AI özeti.

---

## 9. Metadata İyileştirmeleri

| Sayfa | Önceki | Sonraki |
|-------|--------|---------|
| Root layout title | "Kârnet" | "Kârnet — Trendyol ve Hepsiburada Kâr Analizi" |
| Root layout description | Kısa | Uzun + keywords + authors + metadataBase |
| Landing page | 'use client' (metadata yok) | Server component + özel metadata |
| Pricing page | Temel | Gelişmiş (layout.tsx) |
| Blog posts | Kısmi | + canonical + OG image |

---

## 10. AI Arama Hedef Sorguları

Bu platform aşağıdaki sorgularda öne çıkmalıdır:

1. "Trendyol'da kâr nasıl hesaplanır?"
2. "Hepsiburada komisyon oranları neler?"
3. "E-ticaret satıcısı için kâr analizi aracı"
4. "Trendyol kâr hesaplama aracı"
5. "Hepsiburada kâr hesaplama aracı"
6. "Kârnet nedir?"
7. "Pazaryeri satıcıları için kârlılık yazılımı"
8. "Başabaş noktası hesaplama Trendyol"
9. "Trendyol ve Hepsiburada karşılaştırma aracı"
10. "E-ticaret kârlılık analizi Türkiye"

---

## 11. İçerik Fikirleri (Ek GEO İyileştirmeleri)

1. `/e-ticaret-kar-analizi` — Genel e-ticaret kârlılık rehberi
2. `/pazaryeri-alternatifleri` — Excel ve rakip araçlarla karşılaştırma
3. `/kullaniciler/trendyol-saticicilari` — Trendyol satıcılarına özel
4. `/kullaniciler/hepsiburada-saticicilari` — Hepsiburada satıcılarına özel
5. Yeni blog yazıları: "N11 komisyon oranları 2026", "Amazon TR satıcı rehberi"
6. Video içerik + VideoObject şeması
7. HowTo şeması — "Kârnet nasıl kullanılır?"
8. Review/Testimonial şeması (gerçek kullanıcı yorumları gelince)

---

## 12. Manuel Yapılacaklar (Hesap Sahibi — Hilmi)

| Görev | Öncelik |
|-------|---------|
| Google Search Console'da sitemap gönder | 🔴 Yüksek |
| Bing Webmaster Tools'da sitemap gönder | 🔴 Yüksek |
| `/sss`, `/nedir`, `/trendyol-kar-hesaplama`, `/hepsiburada-kar-hesaplama` için URL denetimi iste | 🔴 Yüksek |
| GA4'te AI referrer segmenti kur (docs/geo-measurement-plan.md) | 🟡 Orta |
| karnet.com ve karnet.com domain tutarsızlığını çöz, `NEXT_PUBLIC_APP_URL` env ayarla | 🟡 Orta |
| OG görseli (/brand/og.png) optimize et — Trendyol/Hepsiburada logolarını dahil et | 🟢 Düşük |
| App Store / Google Play bağlantıları yoksa ekleme | 🟢 Düşük |

---

*Rapor sonu. Tüm değişiklikler `claude/geo-ai-search-optimization-o1itpq` branch'inde.*
