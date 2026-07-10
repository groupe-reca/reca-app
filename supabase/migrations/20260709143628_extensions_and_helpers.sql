-- Extensions
create extension if not exists "pgcrypto";

-- Reusable audit trigger applied to every business table (doc 04 "Audit").
-- Sets created_at/created_by on insert, updated_at/updated_by on every insert or update.
create or replace function set_audit_columns()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
    new.created_by := auth.uid();
  end if;
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
