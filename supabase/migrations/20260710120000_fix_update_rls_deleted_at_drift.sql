-- Fix: soft-deleting any row (setting deleted_at to a non-null value) failed
-- with a 42501 RLS violation for administrateur sessions, confirmed via
-- manual testing on both leads and quotes while building the Soumissions
-- module. The *_update_admin policy was NOT the cause (confirmed correct via
-- pg_policies) — the real cause is that PostgREST always issues its UPDATE
-- with a RETURNING clause internally (even under Prefer: return=minimal),
-- and Postgres requires the post-update row to satisfy the table's SELECT
-- policy for that RETURNING to succeed. Since *_select_authenticated only
-- allowed `deleted_at is null`, the row became invisible the instant
-- deleted_at was set, and Postgres raised a hard RLS error instead of just
-- omitting it. Fix: let administrateurs (the only role able to write/delete
-- per our RLS model) also see soft-deleted rows, so the post-update row
-- stays visible to them.
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
    execute format('drop policy if exists %I on public.%I;', t || '_select_authenticated', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (deleted_at is null or public.current_user_role() = ''administrateur'');',
      t || '_select_authenticated', t
    );
  end loop;
end $$;
