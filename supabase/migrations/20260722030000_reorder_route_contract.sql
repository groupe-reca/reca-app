-- Échange atomique de deux `ordre` adjacents au sein d'une même route (Monter/Descendre,
-- fiche Route). SECURITY INVOKER (par défaut) : la RLS s'applique normalement à l'appelant —
-- seul un administrateur peut réordonner, exactement comme un UPDATE direct de route_contracts.
-- Remplace l'ancien swapClientOrder() 2-appels non-transactionnel (route_clients v1).
create or replace function public.reorder_route_contract(p_route_contract_id uuid, p_direction text)
returns void
language plpgsql
as $$
declare
  v_route_id uuid;
  v_ordre integer;
  v_neighbor_id uuid;
  v_neighbor_ordre integer;
begin
  if p_direction not in ('up', 'down') then
    raise exception 'invalid direction: %', p_direction;
  end if;

  select route_id, ordre into v_route_id, v_ordre
  from public.route_contracts
  where id = p_route_contract_id and deleted_at is null;

  if v_route_id is null then
    raise exception 'route_contracts row not found or already removed: %', p_route_contract_id;
  end if;

  select id, ordre into v_neighbor_id, v_neighbor_ordre
  from public.route_contracts
  where route_id = v_route_id
    and deleted_at is null
    and ordre = (
      select case when p_direction = 'up'
        then max(ordre) filter (where ordre < v_ordre)
        else min(ordre) filter (where ordre > v_ordre)
      end
      from public.route_contracts
      where route_id = v_route_id and deleted_at is null
    );

  if v_neighbor_id is null then
    return; -- déjà en première/dernière position : no-op silencieux
  end if;

  update public.route_contracts set ordre = v_neighbor_ordre where id = p_route_contract_id;
  update public.route_contracts set ordre = v_ordre where id = v_neighbor_id;
end;
$$;

grant execute on function public.reorder_route_contract(uuid, text) to authenticated;
