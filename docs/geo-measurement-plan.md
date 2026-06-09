# GEO / AI Search Ölçüm Planı — Kârnet

> Tarih: 2026-06-09

---

## AI Search Trafiği Nasıl Takip Edilir?

### 1. Referrer Bazlı İzleme

AI chatbot'larından gelen trafik genellikle aşağıdaki referrer URL'leri ile gelir:

| Platform | Referrer Domain |
|----------|----------------|
| ChatGPT Search | `chat.openai.com`, `chatgpt.com` |
| Claude | `claude.ai` |
| Perplexity | `perplexity.ai` |
| Google Gemini | `gemini.google.com` |
| Bing Copilot | `copilot.microsoft.com`, `bing.com` |
| You.com | `you.com` |
| Phind | `phind.com` |
| Poe | `poe.com` |

### 2. GA4 Keşif Raporu

**Önerilen Filtreler:**
- Boyutlar: `Session source`, `Session medium`, `Page referrer`, `Landing page`
- Metrikler: Sessions, Engaged sessions, Conversions (signup)

**Özel Segment:**
```
Sayfa referrer içerir: chatgpt.com OR perplexity.ai OR claude.ai OR gemini.google.com OR copilot.microsoft.com
```

### 3. Sunucu Logları

Vercel'de log izleme ile aşağıdaki User-Agent'ları tespit edin:
- `GPTBot` — OpenAI crawler
- `ChatGPT-User` — ChatGPT kullanıcı ajanı
- `ClaudeBot` — Anthropic crawler
- `PerplexityBot` — Perplexity crawler
- `Google-Extended` — Google AI training/search

### 4. Vercel Analytics

`@vercel/analytics` paketi zaten kurulu. Web Vitals ve sayfa görüntülemeleri otomatik izleniyor.

---

## Takip Edilmesi Önerilen Dönüşüm Etkinlikleri

| Etkinlik | Açıklama |
|----------|----------|
| `signup_start` | /auth sayfasına ilk geliş |
| `signup_complete` | Kayıt tamamlama |
| `analysis_created` | İlk analiz oluşturma |
| `plan_upgrade` | Ücretli plana geçiş |
| `pdf_download` | PDF rapor indirme |

---

## GEO Sayfası Performans İzleme

Aşağıdaki sayfalar için haftalık trafik ve dönüşüm raporu önerilir:

- `/sss` — FAQPage şeması varsa Google AI Overviews'da görünebilir
- `/nedir` — Brand query hedefleri
- `/trendyol-kar-hesaplama` — Yüksek hacimli arama hedefi
- `/hepsiburada-kar-hesaplama` — Yüksek hacimli arama hedefi
- `/blog/*` — Uzun kuyruklu arama trafiği

---

## Manuel Yapılacaklar (Hesap Sahibi)

1. **Google Search Console** — Siteharitası gönder: `https://karnet.com/sitemap.xml`
2. **Bing Webmaster Tools** — Siteharitası gönder
3. **Google Search Console** — Yeni sayfalar için URL denetimi iste:
   - `/sss`
   - `/nedir`
   - `/trendyol-kar-hesaplama`
   - `/hepsiburada-kar-hesaplama`
4. **GA4** — Yukarıdaki segment ve etkinlikleri kur
5. **Vercel Logs** — AI bot crawl'larını kontrol et
