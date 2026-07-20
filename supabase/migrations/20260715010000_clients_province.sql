-- tâche 7 : champ "province" caché du formulaire client, toujours "Qc" (RECA n'opère qu'au Québec)
alter table public.clients
  add column province text not null default 'Qc';
