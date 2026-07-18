-- tâche 9 (correctif) : contrainte FK manquante sur contract_notes.created_by,
-- nécessaire pour que PostgREST résolve l'embed `author:users(id, nom)` utilisé
-- par contractNotes.service.ts. Aucune autre table du projet n'embed `users`
-- via `created_by` (ailleurs c'est un uuid nu, jamais relu comme relation), ce
-- besoin n'existait donc pas avant cette tâche. `created_by` est toujours posé
-- à `auth.uid()` par `set_audit_columns()`, qui correspond à `public.users.id`.
alter table public.contract_notes
  add constraint contract_notes_created_by_fkey
  foreign key (created_by) references public.users (id);
