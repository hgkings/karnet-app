-- Migration to create email_logs table for tracking Resend emails

create table if not exists public.email_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    to_email text not null,
    template text not null,
    subject text not null,
    status text check (status in ('sent', 'failed')),
    provider text default 'resend',
    provider_message_id text,
    error text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.email_logs enable row level security;

-- Policy: Users can view their own email logs
create policy "Users can view own email logs"
    on public.email_logs for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy: Authenticated users can insert logs (for testing endpoints mainly)
-- However, since the email sending is typically done via a secure backend endpoint using service_role,
-- we might not strictly need an INSERT policy for authenticated users.
-- But we're adding it just in case the client needs to log something directly (not recommended for secrets).
-- It's better to keep INSERT restricted to Service Role or tightly controlled authenticated inserts.
create policy "Users can insert own email logs"
   on public.email_logs for insert
   to authenticated
   with check (auth.uid() = user_id);

-- Indexing for performance
create index if not exists idx_email_logs_user_id on public.email_logs(user_id);
create index if not exists idx_email_logs_created_at on public.email_logs(created_at desc);
