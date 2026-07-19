-- Correctif RLS : la policy SELECT stricte (`deleted_at is null`) sur les tables
-- de notes empêchait le soft-delete lui-même de passer (Postgres a besoin de
-- pouvoir « voir » la ligne mise à jour pour valider l'UPDATE, même sans
-- RETURNING explicite côté client) — confirmé en reproduisant l'échec (403,
-- "new row violates row-level security policy") sur une note toute neuve,
-- pas seulement une note ancienne : modifier le texte d'une note fonctionnait
-- (deleted_at reste null après), mais poser deleted_at échouait systématiquement,
-- même pour l'auteur administrateur de la note.
-- Élargie pour que l'auteur ou un administrateur voie toujours sa propre ligne,
-- supprimée ou non — le filtre `deleted_at is null` appliqué côté application
-- (listClientNotes/listContractNotes) continue de masquer les notes supprimées
-- de l'UI normale, cet élargissement ne change donc rien à l'affichage réel.
drop policy client_notes_select_authenticated on public.client_notes;

create policy client_notes_select_authenticated
  on public.client_notes for select to authenticated
  using (deleted_at is null or created_by = auth.uid() or public.current_user_role() = 'administrateur');

-- Même correctif préventif sur contract_notes (tâche 9) : identique en tout point,
-- jamais déclenché jusqu'ici faute d'UI de suppression, mais latent.
drop policy contract_notes_select_authenticated on public.contract_notes;

create policy contract_notes_select_authenticated
  on public.contract_notes for select to authenticated
  using (deleted_at is null or created_by = auth.uid() or public.current_user_role() = 'administrateur');
