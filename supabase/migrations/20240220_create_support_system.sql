-- Create admin_users table for secure role management
create table if not exists public.admin_users (
  user_id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz default now()
);

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Only admins can see who is admin (or maybe no one needs to see except system)
-- For simplicity, let's allow authenticated users to read if they are admin? 
-- Actually, we just need the table to exist for the exists() check.
-- Let's allow users to read their own record to verify if they are admin.
create policy "Users can read own admin status"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- Create support_tickets table
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  subject text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_note text,
  attachment_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.support_tickets enable row level security;

-- Trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.support_tickets
  for each row
  execute procedure public.handle_updated_at();

-- Policies for support_tickets

-- 1. Insert: Authenticated users can create tickets for themselves
create policy "Users can insert own tickets"
  on public.support_tickets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 2. Select: Users see own, Admins see all
create policy "Users see own tickets, Admins see all"
  on public.support_tickets for select
  to authenticated
  using (
    auth.uid() = user_id 
    or 
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- 3. Update: 
-- Users can update own ticket (subject, message, category, priority) ONLY.
-- Admins can update any ticket (status, admin_note).
create policy "Users update own, Admins update all"
  on public.support_tickets for update
  to authenticated
  using (
    auth.uid() = user_id 
    or 
    exists (select 1 from public.admin_users where user_id = auth.uid())
  )
  with check (
    (auth.uid() = user_id) -- User Update Logic implied by app logic, but RLS restricts 'which rows'
    or
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- Storage Bucket Setup (This usually needs to be done via UI or specialized client, but adding SQL for reference)
-- insert into storage.buckets (id, name, public) values ('support-attachments', 'support-attachments', false);

-- Storage Policies (Mock SQL, needs to be applied in Storage section)
-- Policy: "Give users access to own folder 1uoh28_0" -> typical Supabase pattern
-- For this plan:
-- SELECT: auth.uid() = owner OR admin
-- INSERT: auth.uid() = owner
