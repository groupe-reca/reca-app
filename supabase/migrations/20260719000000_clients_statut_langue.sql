-- Fiche client (restyle mobile+desktop) : statut du client et langue de service.
alter table public.clients
  add column statut text not null default 'actif' check (statut in ('actif', 'inactif')),
  add column langue text not null default 'francais' check (langue in ('francais', 'anglais'));
