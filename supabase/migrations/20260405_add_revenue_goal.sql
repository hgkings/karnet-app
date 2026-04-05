-- Aylık ciro hedefi — Dashboard'da kullanıcı düzenleyebilir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS revenue_goal numeric DEFAULT NULL;
