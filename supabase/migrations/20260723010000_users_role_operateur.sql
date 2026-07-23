-- Ajout du rôle 'operateur' à la table users.
--
-- Contexte : l'application terrain RECA Operator réserve son accès aux opérateurs.
-- Le CHECK d'origine n'autorisait que 'administrateur' / 'employe' ; on l'élargit
-- pour permettre à un administrateur d'attribuer le rôle 'operateur'. current_user_role()
-- lit simplement users.role et n'a besoin d'aucune modification.

alter table public.users drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('administrateur', 'employe', 'operateur'));
