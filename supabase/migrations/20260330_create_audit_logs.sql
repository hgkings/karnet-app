-- Audit logs tablosu — tum guvenlik olaylarini kaydeder
-- Sadece service_role ile yazilir, client erisimine kapali

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  trace_id text,
  metadata jsonb DEFAULT '{}',
  ip text DEFAULT 'unknown',
  created_at timestamptz DEFAULT now()
);

-- Index: action + created_at ile hizli sorgulama
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS: client erisimine tamamen kapali (sadece service_role)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- No policies = no client access
