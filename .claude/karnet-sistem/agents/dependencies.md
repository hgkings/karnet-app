# 🔗 DEPENDENCIES — HANGİ DOSYA HANGİSİNE BAĞLI

Bir dosyayı değiştirmeden önce buraya bak.
"Bunu değiştirirsem ne kırılır?" sorusunu cevaplar.

## Kritik Bağımlılıklar

### lib/supabase/admin.ts
→ Bağımlı: repositories/ içindeki tüm dosyalar, cron job'lar
→ Dikkat: "Hilmi onayı olmadan değiştirilemez" — çok dikkatli ol

### lib/api/helpers.ts
→ Bağımlı: app/api/ altındaki TÜM route'lar
→ requireAuth, requireAdmin, callGatewayV1Format, callGatewayWithSuccess, resolveConnectionId, errorResponse
→ Dikkat: Bu dosyayı değiştirirsen tüm API route'lar etkilenir

### lib/gateway/service.bridge.ts ve global.service.ts
→ Bağımlı: Tüm servisler ve API route'ları
→ Dikkat: Değiştirme — sadece oku

### services/registry.ts
→ Bağımlı: Tüm servisler buraya kayıtlı olmalı
→ Yeni servis eklenirse buraya kayıt şart

### middleware.ts
→ Bağımlı: Tüm route'lar (PayTR hariç)
→ CVE-2025-29927 fix burada — dokunma

### tailwind.config.ts
→ Bağımlı: Tüm Tailwind class'ları
→ Değişirse tüm UI etkilenir

### components.json (shadcn)
→ Bağımlı: components/ui/ altındaki tüm bileşenler
→ Dikkat: Değiştirirsen shadcn bileşenleri bozulabilir

### config/navigation.ts
→ Bağımlı: Sidebar, Navbar, tüm nav bileşenleri
→ Türkçe metin değişikliği burada yapılır

### config/pricing.ts
→ Bağımlı: Pricing sayfası, PayTR entegrasyonu, plan kontrolleri
→ Fiyat değişikliği burada yapılır

## Marketplace Bağımlılıkları

### app/api/marketplace/trendyol/*
→ Bağımlı: lib/api/helpers (resolveConnectionId, callGatewayWithSuccess)
→ DB: marketplace_connections, trendyol_webhook_events

### app/api/marketplace/hepsiburada/*
→ Bağımlı: lib/api/helpers (resolveConnectionId, callGatewayWithSuccess)
→ DB: marketplace_connections, hb_products, hb_orders

## Değişiklik Öncesi Kontrol

Bir dosyayı değiştirmeden önce sor:
1. Bu dosyaya kim bağımlı?
2. O bağımlı dosyalar etkilenir mi?
3. Build + typecheck bunu yakalar mı?
4. Etkilenecek sayfaları test ettim mi?

---

*(Yeni bağımlılıklar keşfedildikçe buraya eklenir)*
