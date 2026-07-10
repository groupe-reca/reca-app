-- RLS policies (doc 04 "Sécurité"). Phase-1 shape decided with the project
-- owner: any authenticated user may read; only 'administrateur' may write.
-- No DELETE policy is created anywhere — with RLS enabled and no DELETE
-- policy, Postgres denies all physical deletes by default, enforcing the
-- soft-delete-only rule (doc 04 "Suppression") structurally rather than by
-- convention alone. Refining employe-specific read/write scopes is deferred
-- to when the Employés / "Application employé" module is actually designed.
do $$
declare
  t text;
begin
  foreach t in array array[
    'employees', 'leads', 'clients', 'quotes', 'contracts', 'invoices', 'payments',
    'routes', 'route_clients', 'equipments', 'employee_equipment',
    'route_assignments', 'intervention_logs', 'documents'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using (deleted_at is null);',
      t || '_select_authenticated', t
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.current_user_role() = ''administrateur'');',
      t || '_insert_admin', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.current_user_role() = ''administrateur'') with check (public.current_user_role() = ''administrateur'');',
      t || '_update_admin', t
    );
  end loop;
end $$;

-- users: everyone can read their own row (needed at login) or any row if
-- administrateur; only administrateur can change roles/actif.
create policy users_select_self_or_admin on public.users
  for select to authenticated
  using (id = auth.uid() or public.current_user_role() = 'administrateur');

create policy users_update_admin on public.users
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');

-- settings: singleton, readable by anyone authenticated, editable by admins only.
create policy settings_select_authenticated on public.settings
  for select to authenticated
  using (true);

create policy settings_update_admin on public.settings
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');
