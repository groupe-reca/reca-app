-- Module Interventions : une intervention est une exécution réelle et datée d'une route
-- (la route reste un gabarit permanent — voir route_id ci-dessous). Indépendant du module
-- Routes dans le menu ; routes.id n'est référencée qu'à la création (génération des
-- intervention_items) — l'app terrain future "RECA Operator" ne doit jamais lire `routes`
-- en direct, seulement `intervention_items` + ce parent `interventions`.
create sequence interventions_numero_seq;

create table public.interventions (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  route_id uuid not null references public.routes (id) on delete restrict,
  employee_id uuid references public.employees (id) on delete set null,
  equipment_id uuid references public.equipments (id) on delete set null,
  date date not null default current_date,
  heure_prevue time,
  heure_debut timestamptz,
  heure_fin timestamptz,
  statut text not null default 'planifiee'
    check (statut in ('planifiee', 'en_cours', 'terminee', 'terminee_avec_anomalies', 'annulee')),
  commentaires text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_interventions_route on public.interventions (route_id);
create index idx_interventions_date on public.interventions (date);

alter table public.interventions enable row level security;

create or replace function set_numero_intervention()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'INT-' || lpad(nextval('interventions_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_interventions_numero
  before insert on public.interventions
  for each row execute function set_numero_intervention();

create trigger trg_interventions_audit
  before insert or update on public.interventions
  for each row execute function set_audit_columns();

-- SELECT dès la création avec la variante élargie (deleted_at is null OR auteur OR admin) —
-- part directement sur la forme finale pour éviter le correctif en 2 migrations déjà vécu
-- sur client_notes/contract_notes.
create policy interventions_select_authenticated
  on public.interventions for select to authenticated
  using (deleted_at is null or created_by = auth.uid() or public.current_user_role() = 'administrateur');

create policy interventions_insert_authenticated
  on public.interventions for insert to authenticated
  with check (created_by = auth.uid());

-- Écriture (changement de statut/edit/annulation) ouverte à tout utilisateur authentifié —
-- pas seulement admin, contrairement à la boucle RLS générique — cohérent avec le fait que
-- Démarrer/Fermer/Annuler/Modifier sont des actions terrain quotidiennes, pas des actions
-- administratives (seule "Forcer la fermeture" est gated côté UI par le rôle ; le vrai gate
-- métier de fermeture reste applicatif ce sprint, cohérent avec l'absence de logique métier
-- en base ailleurs dans ce repo).
create policy interventions_update_authenticated
  on public.interventions for update to authenticated
  using (true)
  with check (true);
