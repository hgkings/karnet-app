-- Expand plan CHECK constraints to support 3-tier system (free, starter, pro)

-- 1. profiles.plan: add starter, starter_monthly, starter_yearly, pro_monthly, pro_yearly, admin
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'starter', 'starter_monthly', 'starter_yearly', 'pro', 'pro_monthly', 'pro_yearly', 'admin'));

-- 2. payments.plan: add starter_monthly, starter_yearly
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_plan_check;
ALTER TABLE payments ADD CONSTRAINT payments_plan_check
  CHECK (plan IN ('pro_monthly', 'pro_yearly', 'starter_monthly', 'starter_yearly'));
