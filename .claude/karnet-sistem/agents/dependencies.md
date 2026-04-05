# 🔗 DEPENDENCIES — HANGİ DOSYA HANGİSİNE BAĞLI

Bir dosyayı değiştirmeden önce buraya bak.

## Kritik Bağımlılıklar

### lib/supabase/admin.ts
→ Bağımlı: repositories/, cron job'lar, webhook handler (service'te)
→ Dikkat: "Hilmi onayı olmadan değiştirilemez"

### lib/api/helpers.ts
→ Bağımlı: app/api/ altındaki TÜM route'lar
→ requireAuth, requireAdmin, callGatewayV1Format, callGatewayWithSuccess, resolveConnectionId, errorResponse

### lib/gateway/service.bridge.ts ve global.service.ts
→ Bağımlı: Tüm servisler ve API route'ları
→ Dikkat: Değiştirme — sadece oku

### middleware.ts
→ Bağımlı: Tüm route'lar
→ Bypass'lar: /api/paytr/, /api/webhook/marketplace
→ CVE-2025-29927 fix burada — dokunma

### components/ui/input.tsx
→ Bağımlı: TÜM input alanları (proje genelinde)
→ text-foreground eklendi — dark mode fix
→ Değiştirirsen tüm input'lar etkilenir

### components/dashboard/products-table.tsx
→ Bağımlı: app/products/page.tsx, app/dashboard/page.tsx
→ StockItem interface burada tanımlı — değişirse her iki sayfayı güncelle
→ colSpan: kolon ekleyince güncelle!

### StockItem interface (products-table.tsx)
→ Kullanıldığı yerler:
  - components/dashboard/products-table.tsx (tanım)
  - app/products/page.tsx (stockMap oluşturma + Map type)
  - app/dashboard/page.tsx (stockMap oluşturma)
→ Yeni alan ekleyince 3 dosyayı güncelle

### Profil Alanı Ekleme Zinciri (6 dosya)
→ supabase/migrations/ → SQL
→ lib/db/types.ts → ProfileRow
→ types/index.ts → User
→ lib/validators/schemas/user.schema.ts → UpdateProfileSchema
→ lib/auth.ts → mapProfileRow()
→ services/user.logic.ts → UserProfile interface + getProfile
→ BİRİ EKSİK = ALAN KAYBOLUR

## Marketplace Bağımlılıkları

### app/api/marketplace/trendyol/*
→ Bağımlı: lib/api/helpers (resolveConnectionId, callGatewayWithSuccess)
→ DB: marketplace_connections, marketplace_secrets

### app/api/marketplace/trendyol/stock/route.ts
→ Bağımlı: fetchProducts + fetchOrders (trendyol.api.ts)
→ StockItem interface'i bu route'un response'una bağlı
→ monthlySales alanı sipariş verisinden geliyor

### app/api/webhook/marketplace/route.ts
→ Bağımlı: middleware bypass + Basic Auth doğrulama
→ handleTrendyolWebhook service metodu
→ trendyol_webhook_events tablosu + notifications tablosu

## Dashboard Bağımlılıkları (5 paralel API çağrısı)

### app/dashboard/page.tsx
→ /api/marketplace/trendyol → bağlantı durumu
→ /api/marketplace/trendyol/stock → stok + fiyat + satış + fotoğraf
→ /api/marketplace/trendyol/order-summary → sipariş kartı
→ /api/marketplace/trendyol/daily-profit → grafik
→ /api/marketplace/trendyol/finance → pazaryeri istatistikleri

---

*(Yeni bağımlılıklar keşfedildikçe buraya eklenir)*
