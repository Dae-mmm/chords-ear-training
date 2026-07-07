-- Ear Training Chords — Supabase schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (display name for leaderboards)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_length check (char_length(username) between 2 and 24),
  constraint username_format check (username ~ '^[a-zA-Z0-9_]+$')
);

-- Best streak per difficulty (stars)
create table if not exists public.leaderboard_scores (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  difficulty text not null,
  best_streak integer not null default 0 check (best_streak >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, difficulty),
  constraint valid_difficulty check (
    difficulty in (
      'beginner', 'intermediate', 'intermediate_plus',
      'advanced', 'advanced_plus', 'pro', 'jazz'
    )
  )
);

create index if not exists leaderboard_scores_difficulty_best_idx
  on public.leaderboard_scores (difficulty, best_streak desc);

-- Auto-create profile on signup (username from metadata or email prefix)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1)
  ));
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
  if char_length(base_username) < 2 then
    base_username := 'player';
  end if;
  base_username := left(base_username, 20);
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username)
  values (new.id, final_username);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Upsert score (only keeps the highest streak)
create or replace function public.upsert_leaderboard_score(p_difficulty text, p_best_streak integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.leaderboard_scores (user_id, difficulty, best_streak)
  values (auth.uid(), p_difficulty, p_best_streak)
  on conflict (user_id, difficulty)
  do update set
    best_streak = greatest(leaderboard_scores.best_streak, excluded.best_streak),
    updated_at = now();
end;
$$;

grant execute on function public.upsert_leaderboard_score(text, integer) to authenticated;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.leaderboard_scores enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Leaderboard is publicly readable" on public.leaderboard_scores;
create policy "Leaderboard is publicly readable"
  on public.leaderboard_scores for select using (true);

drop policy if exists "Users can insert own scores" on public.leaderboard_scores;
create policy "Users can insert own scores"
  on public.leaderboard_scores for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own scores" on public.leaderboard_scores;
create policy "Users can update own scores"
  on public.leaderboard_scores for update
  using (auth.uid() = user_id);

-- Leaderboard view (ranked)
create or replace view public.leaderboard_ranked as
select
  ls.difficulty,
  ls.user_id,
  p.username,
  ls.best_streak,
  ls.updated_at,
  rank() over (partition by ls.difficulty order by ls.best_streak desc, ls.updated_at asc) as rank
from public.leaderboard_scores ls
join public.profiles p on p.id = ls.user_id
where ls.best_streak > 0;

grant select on public.leaderboard_ranked to anon, authenticated;
