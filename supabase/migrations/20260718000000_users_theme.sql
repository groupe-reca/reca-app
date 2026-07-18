-- Préférence de thème clair/sombre par utilisateur (Optimisation UI v3).
-- Sombre par défaut (voir aussi `index.html`, classe `dark` posée sur `<html>`).
alter table public.users
  add column theme text not null default 'sombre' check (theme in ('clair', 'sombre'));

-- La policy `users_update_admin` réserve l'UPDATE de `public.users` aux
-- administrateurs (un employe ne peut pas modifier sa propre ligne, y compris
-- son thème). Plutôt que d'élargir cette policy à `id = auth.uid()` (ce qui
-- permettrait à n'importe quel employe de modifier aussi son propre `role`),
-- on expose une RPC dédiée, restreinte à la seule colonne `theme`.
create or replace function public.update_own_theme(new_theme text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if new_theme not in ('clair', 'sombre') then
    raise exception 'invalid theme: %', new_theme;
  end if;

  update public.users set theme = new_theme where id = auth.uid();
end;
$$;

grant execute on function public.update_own_theme(text) to authenticated;
