-- Minimum fix for username login — run this in Supabase SQL Editor

create or replace function public.get_email_for_username(p_username text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select u.email
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(p.username) = lower(trim(p_username))
  limit 1;
$$;

grant execute on function public.get_email_for_username(text) to anon, authenticated;
