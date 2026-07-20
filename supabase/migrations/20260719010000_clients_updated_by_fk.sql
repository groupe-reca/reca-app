-- Fiche client : contrainte FK manquante sur clients.updated_by, nécessaire pour
-- que PostgREST résolve l'embed `updated_by_user:users(id, nom)` ("Dernière
-- modification"). Même piège que contract_notes.created_by (tâche 9) —
-- posée ici de manière proactive plutôt qu'en correctif après coup.
alter table public.clients
  add constraint clients_updated_by_fkey
  foreign key (updated_by) references public.users (id);
