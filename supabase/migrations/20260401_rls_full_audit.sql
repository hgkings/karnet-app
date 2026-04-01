-- ================================================================
-- RLS TAM DENETIM — Tum tablolar icin Row Level Security
-- Tarih: 2026-04-01
-- Ajan: Coder (Guvenlik Plani Asama 2)
-- ================================================================

-- 1. analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'analyses_select_own' AND tablename = 'analyses') THEN
    CREATE POLICY "analyses_select_own" ON analyses FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'analyses_insert_own' AND tablename = 'analyses') THEN
    CREATE POLICY "analyses_insert_own" ON analyses FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'analyses_update_own' AND tablename = 'analyses') THEN
    CREATE POLICY "analyses_update_own" ON analyses FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'analyses_delete_own' AND tablename = 'analyses') THEN
    CREATE POLICY "analyses_delete_own" ON analyses FOR DELETE USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS analyses_user_id_idx ON analyses(user_id);

-- 2. tickets (support)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tickets_select_own' AND tablename = 'tickets') THEN
    CREATE POLICY "tickets_select_own" ON tickets FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tickets_insert_own' AND tablename = 'tickets') THEN
    CREATE POLICY "tickets_insert_own" ON tickets FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tickets_update_own' AND tablename = 'tickets') THEN
    CREATE POLICY "tickets_update_own" ON tickets FOR UPDATE USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tickets_delete_own' AND tablename = 'tickets') THEN
    CREATE POLICY "tickets_delete_own" ON tickets FOR DELETE USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON tickets(user_id);

-- 3. notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'notifications_select_own' AND tablename = 'notifications') THEN
    CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'notifications_insert_own' AND tablename = 'notifications') THEN
    CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'notifications_update_own' AND tablename = 'notifications') THEN
    CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'notifications_delete_own' AND tablename = 'notifications') THEN
    CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

-- 4. marketplace_connections
ALTER TABLE marketplace_connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'mc_select_own' AND tablename = 'marketplace_connections') THEN
    CREATE POLICY "mc_select_own" ON marketplace_connections FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'mc_insert_own' AND tablename = 'marketplace_connections') THEN
    CREATE POLICY "mc_insert_own" ON marketplace_connections FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'mc_update_own' AND tablename = 'marketplace_connections') THEN
    CREATE POLICY "mc_update_own" ON marketplace_connections FOR UPDATE USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'mc_delete_own' AND tablename = 'marketplace_connections') THEN
    CREATE POLICY "mc_delete_own" ON marketplace_connections FOR DELETE USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS mc_user_id_idx ON marketplace_connections(user_id);

-- 5. commission_rates
ALTER TABLE commission_rates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cr_select_own' AND tablename = 'commission_rates') THEN
    CREATE POLICY "cr_select_own" ON commission_rates FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cr_insert_own' AND tablename = 'commission_rates') THEN
    CREATE POLICY "cr_insert_own" ON commission_rates FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cr_update_own' AND tablename = 'commission_rates') THEN
    CREATE POLICY "cr_update_own" ON commission_rates FOR UPDATE USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cr_delete_own' AND tablename = 'commission_rates') THEN
    CREATE POLICY "cr_delete_own" ON commission_rates FOR DELETE USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS cr_user_id_idx ON commission_rates(user_id);

-- 6. audit_logs — sadece kendi loglarini okuyabilir
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'audit_read_own' AND tablename = 'audit_logs') THEN
    CREATE POLICY "audit_read_own" ON audit_logs FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs(created_at DESC);

-- 7. profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own' AND tablename = 'profiles') THEN
    CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING ((SELECT auth.uid()) = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own' AND tablename = 'profiles') THEN
    CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING ((SELECT auth.uid()) = id);
  END IF;
END $$;

-- 8. payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'payments_select_own' AND tablename = 'payments') THEN
    CREATE POLICY "payments_select_own" ON payments FOR SELECT USING ((SELECT auth.uid()) = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
