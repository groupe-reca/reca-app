-- users: synchronized with auth.users (doc 04 "users").
-- Not covered by set_audit_columns(): rows are created solely via the
-- handle_new_auth_user trigger below, not through the app's normal CRUD path.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'employe' check (role in ('administrateur', 'employe')),
  actif boolean not null default true,
  derniere_connexion timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.users enable row level security;

-- Provisions a public.users row (role defaults to 'employe') whenever a new
-- Supabase Auth account is created. An administrateur promotes the role later.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Role lookup used by every table's RLS policies. SECURITY DEFINER avoids
-- recursive RLS evaluation when a policy needs to know the caller's role.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;
