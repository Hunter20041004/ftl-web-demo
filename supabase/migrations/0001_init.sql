-- 內容表：每張都是「可篩選欄位 + data jsonb（前台形狀）」。
-- 共用欄位：status（draft/published）、deleted_at（軟刪除）、created_at/updated_at/updated_by。

create extension if not exists pgcrypto;

create table if not exists admins (
  email text primary key,
  added_by text,
  added_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end $$;

create table if not exists settings (
  id text primary key,
  data jsonb not null,
  status text not null default 'published' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  semester text not null,
  week int not null,
  date date not null,
  kind text not null check (kind in ('lecture','workshop','reading','social','school')),
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);
create index if not exists events_semester_week on events (semester, week);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('job','scholarship','program','book')),
  deadline date,
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists projects (
  id text primary key,
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists papers (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists weekly_issues (
  id uuid primary key default gen_random_uuid(),
  vol int not null unique,
  range_start date not null,
  range_end date not null,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists weekly_stories (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references weekly_issues (id) on delete cascade,
  position int not null check (position between 1 and 3),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text,
  unique (issue_id, position)
);

-- updated_at 觸發器
do $$
declare t text;
begin
  foreach t in array array['settings','events','resources','projects','papers','partners','weekly_issues','weekly_stories'] loop
    execute format('drop trigger if exists %I_updated on %I', t, t);
    execute format('create trigger %I_updated before update on %I for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- RLS：只有 admins 名單內的登入者可以讀寫；service role 不受 RLS 限制（給 pull-content 用）
do $$
declare t text;
begin
  foreach t in array array['admins','settings','events','resources','projects','papers','partners','weekly_issues','weekly_stories'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists admin_all on %I', t);
    execute format('create policy admin_all on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Storage：media bucket 公開讀，寫入限管理員
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select using (bucket_id = 'media');
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects for all to authenticated
  using (bucket_id = 'media' and is_admin()) with check (bucket_id = 'media' and is_admin());
