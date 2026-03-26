-- ============================================================
-- Hepsiburada — hb_products & hb_orders Tables
-- ============================================================

-- 1) hb_products
CREATE TABLE IF NOT EXISTS public.hb_products (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hepsiburada_sku     text NOT NULL,
    merchant_sku        text,
    urun_adi            text,
    fiyat               numeric(12,2),
    stok                integer,
    aktif               boolean DEFAULT true,
    guncelleme_tarihi   timestamptz DEFAULT now(),
    created_at          timestamptz DEFAULT now(),
    UNIQUE(user_id, hepsiburada_sku)
);

CREATE INDEX IF NOT EXISTS idx_hb_products_user_id
    ON public.hb_products(user_id);

ALTER TABLE public.hb_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kullanici_kendi_urunleri"
    ON public.hb_products FOR ALL
    USING (auth.uid() = user_id);


-- 2) hb_orders
CREATE TABLE IF NOT EXISTS public.hb_orders (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    siparis_no          text NOT NULL,
    siparis_tarihi      timestamptz,
    musteri_adi         text,
    hepsiburada_sku     text,
    satici_sku          text,
    birim_fiyat         numeric(12,2),
    adet                integer,
    toplam_fiyat        numeric(12,2),
    durum               text,
    created_at          timestamptz DEFAULT now(),
    UNIQUE(user_id, siparis_no)
);

CREATE INDEX IF NOT EXISTS idx_hb_orders_user_id
    ON public.hb_orders(user_id);

CREATE INDEX IF NOT EXISTS idx_hb_orders_siparis_tarihi
    ON public.hb_orders(siparis_tarihi DESC);

ALTER TABLE public.hb_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kullanici_kendi_siparisleri"
    ON public.hb_orders FOR ALL
    USING (auth.uid() = user_id);
