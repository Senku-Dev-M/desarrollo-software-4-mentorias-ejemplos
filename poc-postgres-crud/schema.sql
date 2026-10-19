-- Dashboard > SQL Editor > New query > Run.
create table if not exists public.poc_users (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 100),
  email text not null unique check (char_length(email) between 3 and 200)
);

-- Este POC conecta como postgres; el navegador no accede a la Data API.
alter table public.poc_users enable row level security;
revoke all on public.poc_users from anon, authenticated;
