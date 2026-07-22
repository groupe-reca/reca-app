-- intervention_items : une ligne par client de la route au moment de la création de
-- l'intervention. C'est LA table que la future app terrain RECA Operator devra lire/écrire —
-- elle doit donc être auto-suffisante (statut/notes/temps/code problème stockés ici même).
-- adresse/latitude/longitude ne sont PAS dupliquées ici : résolues par jointure
-- client_id -> clients au moment de la lecture (routeMetrics.service.ts/routesMap.service.ts
-- font déjà ce choix pour Routes) — source de vérité unique, jamais recopiée.
create table public.intervention_items (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references public.interventions (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  -- Traçabilité de la ligne route_clients d'origine, pour audit seulement — jamais relue
  -- pour résoudre l'ordre ou les coordonnées (voir ordre ci-dessous). on delete set null :
  -- si le client est retiré de la route plus tard, l'historique de l'intervention survit.
  route_client_id uuid references public.route_clients (id) on delete set null,
  -- Copié depuis route_clients.ordre AU MOMENT de la création de l'intervention : un
  -- réordonnancement ultérieur de la route ne doit jamais réécrire rétroactivement l'ordre
  -- d'une intervention déjà en cours/terminée.
  ordre integer not null default 0,
  statut text not null default 'planifiee'
    check (statut in ('planifiee', 'en_cours', 'terminee', 'a_reprendre')),
  notes text,
  code_probleme text,
  heure_debut timestamptz,
  heure_fin timestamptz,
  -- Secondes plutôt qu'interval : ce sont des durées courtes mesurées/saisies (pas des
  -- plages calendaires), un entier est directement additionnable/formattable côté UI sans
  -- parsing d'interval Postgres ; duree_estimee sur routes reste un interval car c'est une
  -- estimation de longue durée dérivée de Mapbox Directions, cas différent.
  temps_deplacement_secondes integer,
  temps_intervention_secondes integer,
  -- --- Préparation sync RECA Operator (architecture seulement, aucune sync réelle ce sprint) ---
  -- Horodatage de la dernière synchronisation réussie avec un appareil RECA Operator (null
  -- tant qu'aucune sync n'a jamais eu lieu) — distinct de updated_at (qui bouge à CHAQUE
  -- écriture, y compris depuis cette UI web, pas seulement depuis une sync mobile).
  date_synchronisation timestamptz,
  -- Horodatage "dernière mise à jour" tel que rapporté PAR L'APPAREIL terrain (peut être
  -- antérieur à updated_at en cas de sync différée/hors-ligne) — distinct de updated_at qui
  -- est l'horodatage serveur faisant foi.
  derniere_maj_appareil timestamptz,
  -- Compteur de version pour la résolution de conflits d'écriture concurrente lors d'une
  -- future vraie sync (dernier writer gagne aujourd'hui, ce champ prépare un writer optimiste).
  version integer not null default 1,
  -- Identifiant généré côté appareil (UUID local), distinct de id (clé primaire serveur) —
  -- permet à un appareil de créer une ligne hors-ligne puis de la faire correspondre sans
  -- collision lors d'une sync différée. Nullable : jamais peuplé par cette UI web.
  uuid_appareil uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_intervention_items_intervention on public.intervention_items (intervention_id, ordre);
create index idx_intervention_items_client on public.intervention_items (client_id);

alter table public.intervention_items enable row level security;

create trigger trg_intervention_items_audit
  before insert or update on public.intervention_items
  for each row execute function set_audit_columns();

create policy intervention_items_select_authenticated
  on public.intervention_items for select to authenticated
  using (deleted_at is null or created_by = auth.uid() or public.current_user_role() = 'administrateur');

create policy intervention_items_insert_authenticated
  on public.intervention_items for insert to authenticated
  with check (created_by = auth.uid());

create policy intervention_items_update_authenticated
  on public.intervention_items for update to authenticated
  using (true)
  with check (true);
