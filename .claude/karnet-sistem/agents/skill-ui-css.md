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
→ DB'ye dokunan herhangi bir import — KESİNLİKLE YASAK
→ Repositories import — KESİNLİKLE YASAK
→ Supabase sorgusu — KESİNLİKLE YASAK

CSS'te sadece CSS'e ait şeyler olur.
UI'da sadece görsel, stil ve layout olur.
```

## TL;DR — Her Görev Başında Önce Bunu Oku

UI/CSS agent sadece görseldir. DB, API, logic görmezden gelir.
cn() her zaman kullanılır — Tailwind class çakışması olmasın.
Dark mode her zaman test edilir.
Framer Motion = 'use client' şart.

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

### Renkler (CSS Variables — Daima Bunları Kullan)
```
bg-background / text-foreground    → ana zemin/metin
bg-card / border-border            → kart ve kenarlar
text-muted-foreground              → ikincil metin
bg-primary / text-primary-foreground → marka rengi (mavi: #2563EB)
bg-destructive                     → hata kırmızı
```

### Kârnet Marka Renkleri
```
Amber/turuncu → logo rengi (#D97706 / #92400E)
Gradient      → linear-gradient(135deg, #D97706, #92400E)
```

### Zorunlu Pattern'ler
```tsx
// Class birleştirme — HER ZAMAN cn() kullan
className={cn('base-class', condition && 'conditional-class', className)}

// Kart yapısı
<div className="rounded-2xl border border-border/30 bg-card hover:border-border/60 transition-colors">

// Dashboard layout
// pt-16 (navbar) + md:pl-60 (sidebar) — unutulursa layout kayar

// Dark mode — HER ZAMAN dark: prefix ekle
className="text-gray-800 dark:text-gray-200"
// VEYA CSS variable kullan (tercih edilen)
className="text-foreground"
```

## Denetim Kontrol Listesi

### CSS/UI İzolasyonu (EN KRİTİK)
- [ ] Bu dosyada DB sorgusu var mı? → BLOK
- [ ] Bu dosyada API çağrısı var mı? → BLOK
- [ ] Bu dosyada business logic var mı? → BLOK
- [ ] repositories/ import var mı? → BLOK
- [ ] Supabase doğrudan import var mı? → BLOK

### Genel
- [ ] cn() kullanılıyor mu?
- [ ] dark: prefix veya CSS variable var mı?
- [ ] 'use client' gerekiyor mu? (hook veya event handler varsa evet)
- [ ] Framer Motion varsa 'use client' var mı?

### Responsive
- [ ] sm: (640px), md: (768px), lg: (1024px) test edildi mi?
- [ ] Dashboard'da md:pl-60 hesaba katıldı mı?
- [ ] Mobile'da overflow var mı?

### Bileşen Kullanımı
- [ ] shadcn bileşeni varken custom HTML yazılmış mı?
- [ ] asChild prop gerekiyor mu? (Link içinde Button)
- [ ] Disabled butonlar disabled prop ile mi?

### Erişilebilirlik
- [ ] İkon tek başına kullanılıyorsa aria-label var mı?
- [ ] Form alanı Label ile eşleştirilmiş mi?

## Sık Karşılaşılan Hatalar

**Dark mode'da görünmez metin:**
`text-gray-800` yerine `text-foreground` kullan

**Layout kayması:**
Dashboard'da pt-16 (navbar yüksekliği) + md:pl-60 (sidebar) unutulmuş

**Tailwind class çakışması:**
cn() kullanılmıyor

**Framer Motion Server Component'te:**
'use client' direktifi eksik

## Öğrendiklerim

*(Kural: "Bu bilgi 6 ay sonra da işime yarar mı?" → Evet → yaz)*

- Dashboard layout: fixed navbar (h-16, pt-16) + fixed sidebar (w-60, md:pl-60) + scrollable main
- Kârnet logo gradient: linear-gradient(135deg, #D97706, #92400E)
- shadcn components.json: baseColor neutral, cssVariables true, rsc true
- cn() = clsx + tailwind-merge — birini çıkarırsan çalışmaz

## Asla Yapma

*(Yapılan hatalar — bir daha tekrarlanmayacak)*

- CSS/UI dosyasına DB, API veya business logic yazmak — BLOK
- cn() olmadan Tailwind class'larını birleştirmek
- dark: prefix'i unutmak (dark mode kırılır)
- Framer Motion'ı 'use client' olmadan kullanmak
- CSS variable yerine hardcode renk kullanmak (theme değişince bozulur)
