-- Migration: username login, score history, profile features
-- Run in Supabase SQL Editor if you already applied the initial schema.sql

-- Score history (logged on each new personal best)
create table if not exists public.score_history (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  difficulty text not null,
  streak integer not null check (streak > 0),
  achieved_at timestamptz not null default now(),
  constraint valid_history_difficulty check (
    difficulty in (
      'beginner', 'intermediate', 'intermediate_plus',
      'advanced', 'advanced_plus', 'pro', 'jazz'
    )
  )
);

create index if not exists score_history_user_date_idx
  on public.score_history (user_id, achieved_at desc);

alter table public.score_history enable row level security;

drop policy if exists "Users read own score history" on public.score_history;
create policy "Users read own score history"
  on public.score_history for select using (auth.uid() = user_id);

-- Resolve email from username for login (username + password)
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

-- Upsert score + log history when beating personal best
create or replace function public.upsert_leaderboard_score(p_difficulty text, p_best_streak integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_best integer;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select best_streak into v_old_best
  from public.leaderboard_scores
  where user_id = auth.uid() and difficulty = p_difficulty;

  insert into public.leaderboard_scores (user_id, difficulty, best_streak)
  values (auth.uid(), p_difficulty, p_best_streak)
  on conflict (user_id, difficulty)
  do update set
    best_streak = greatest(leaderboard_scores.best_streak, excluded.best_streak),
    updated_at = now();

  if p_best_streak > coalesce(v_old_best, 0) then
    insert into public.score_history (user_id, difficulty, streak)
    values (auth.uid(), p_difficulty, p_best_streak);
  end if;
end;
$$;

grant execute on function public.upsert_leaderboard_score(text, integer) to authenticated;
