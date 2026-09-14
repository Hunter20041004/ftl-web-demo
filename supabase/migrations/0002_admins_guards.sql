-- 管理員名單的資料庫層保護：email 一律小寫；不能刪掉最後一位管理員（避免把大家鎖在門外）。
create or replace function admins_normalize() returns trigger language plpgsql as $$
begin
  new.email = lower(trim(new.email));
  return new;
end $$;
drop trigger if exists admins_normalize on admins;
create trigger admins_normalize before insert or update on admins for each row execute function admins_normalize();

create or replace function admins_keep_last() returns trigger language plpgsql as $$
begin
  if (select count(*) from admins) <= 1 then
    raise exception '至少要保留一位管理員';
  end if;
  return old;
end $$;
drop trigger if exists admins_keep_last on admins;
create trigger admins_keep_last before delete on admins for each row execute function admins_keep_last();

update admins set email = lower(trim(email));
