-- 洞察文章：社團自己寫的長文。主鍵是網址代號（slug）。
create table if not exists articles (
  id text primary key,
  published_at date not null,
  position int not null default 0,
  data jsonb not null,
  status text not null default 'draft' check (status in ('draft','published')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);
drop trigger if exists articles_updated on articles;
create trigger articles_updated before update on articles for each row execute function set_updated_at();
alter table articles enable row level security;
drop policy if exists admin_all on articles;
create policy admin_all on articles for all to authenticated using (is_admin()) with check (is_admin());
