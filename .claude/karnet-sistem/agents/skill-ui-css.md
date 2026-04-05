# 🎨 UI/CSS AGENT SKILL DOSYASI

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

## CSS/UI ALTIN KURALI — DÜNYA YANSA ÇİĞNENEMEZ

```
CSS ve UI dosyalarında:
→ DB sorgusu — KESİNLİKLE YASAK
→ API çağrısı — KESİNLİKLE YASAK
→ Business logic — KESİNLİKLE YASAK
→ Repositories import — KESİNLİKLE YASAK
→ Supabase sorgusu — KESİNLİKLE YASAK
```

## TL;DR — Her Görev Başında Önce Bunu Oku

UI/CSS agent sadece görseldir. DB, API, logic görmezden gelir.
cn() her zaman kullanılır — Tailwind class çakışması olmasın.
Dark mode her zaman test edilir.
Framer Motion = 'use client' şart.
**Emoji yok — sadece Lucide React SVG ikonlar (dashboard tasarım kuralı).**

## Görev Başı Kontrol Sırası
1. agents/shared-memory.md oku
2. agents/decisions.md oku
3. agents/locks.md oku
4. Bu dosyanın TL;DR bölümünü oku
5. Göreve başla

## UI Stack

```
Tailwind CSS  → 3.3.3, tailwind.config.ts
Radix UI      → @radix-ui/react-* primitive'ler
shadcn/ui     → components/ui/ klasörü, components.json
Framer Motion → ^12.38.0, animasyonlar
next-themes   → dark/light mode, ThemeProvider
Lucide React  → ikonlar
cn()          → lib/utils.ts (clsx + tailwind-merge)
```

## Kârnet Tasarım Sistemi

### Dashboard Tasarım Kuralları (2026-04 Yeniden Tasarım)
```
- Emoji YOK — sadece Lucide React SVG ikonlar
- Renk paleti: turuncu (brand), yeşil (pozitif), kırmızı (negatif), mavi (bilgi), gri (nötr)
- Tüm kartlar: rounded-xl, border border-border/40, bg-card
- Font: başlık text-sm font-semibold, alt metin text-xs text-muted-foreground
- Dark/light mode: text-foreground, bg-card, border-border (CSS variables)
- Hardcode renk KULLANMA — text-foreground, text-muted-foreground kullan
```

### Input Component — KRİTİK
```
components/ui/input.tsx → text-foreground EKLENDİ
Bu olmadan dark mode'da input değerleri görünmez (beyaz üstüne beyaz)
Tüm custom input class'larında text-foreground gereksiz — component'te var
```

### Kârnet Marka Renkleri
```
Turuncu → brand rengi (bg-orange-500, text-orange-500)
Gradient → eski (artık kullanılmıyor, dashboard'da düz renkler)
```

### Dashboard Layout
```
Container: max-w-full (eski max-w-6xl kaldırıldı — tablo sığmıyordu)
Sidebar: fixed w-60, md:pl-60
Navbar: fixed h-16, pt-16
```

### Tablo Kuralları (Products Table)
```
- min-w-[900px] ile yatay scroll
- Her kolona min-w belirlendi
- İşlem kolonu sticky right-0
- Checkbox kolonu w-10 px-3
- colSpan güncel tutulmalı (kolon ekleyince artır!)
```

### AccordionSection Component
```
components/shared/accordion-section.tsx
- Animasyonlu grid-rows geçişi
- Icon (emoji) + başlık + ChevronDown
- defaultOpen={false}
```

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- Dashboard layout: fixed navbar (h-16, pt-16) + fixed sidebar (w-60, md:pl-60) + scrollable main
- shadcn components.json: baseColor neutral, cssVariables true, rsc true
- cn() = clsx + tailwind-merge — birini çıkarırsan çalışmaz
- **Input component'e text-foreground eklendi** — dark mode'da TÜM input değerleri artık görünür
- **Dashboard max-w-6xl → max-w-full** — 9 kolonlu tablo sığmıyordu
- **Tablo kolon ekleyince colSpan güncelle** — "Sonuç bulunamadı" satırı yanlış genişlikte kalır
- **Sticky kolon: th ve td'ye aynı class** — bg-card + group-hover:bg-muted/10
- **SVG grafik: viewBox + preserveAspectRatio="none"** — responsive grafik için
- **Loading toast pattern: toast.loading → iş bitti → toast.dismiss → toast.success**
- **Checkbox seçim: selectedIds Set + toggleOne/toggleAll + bulk action bar**
- **Fuzzy eşleşme: kısa isimler (2+ harf, 1+ kelime, %50 eşik)** — "moon s" gibi ürünler

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- CSS/UI dosyasına DB, API veya business logic yazmak — BLOK
- cn() olmadan Tailwind class'larını birleştirmek
- dark: prefix'i unutmak — text-foreground/bg-card kullan
- Framer Motion'ı 'use client' olmadan kullanmak
- Hardcode renk kullanmak (gray-800 yerine text-foreground)
- Dashboard'da emoji kullanmak — sadece Lucide ikon
- Tablo genişliğini test etmeden bırakmak — 9+ kolon varsa min-w şart
- Input'a text-foreground eklemek (artık component'te var, gereksiz)
- colSpan'ı kolon ekleyince güncellemeyi unutmak
