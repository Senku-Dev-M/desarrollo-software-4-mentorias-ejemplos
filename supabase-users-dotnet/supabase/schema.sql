-- Ejecutar en Supabase Dashboard -> SQL Editor.
-- El frontend no recibe permisos directos: solo el backend C# usa la secret key.

create table if not exists public.user_profiles (
  id uuid primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null unique check (char_length(email) <= 200),
  avatar_path text,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

revoke all on table public.user_profiles from anon, authenticated;
grant select, insert, update, delete on table public.user_profiles to service_role;

-- El Dashboard puede crear esta función al activar RLS automático.
-- Es un trigger administrativo: no debe poder invocarse desde la API pública.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'user-avatars',
  'user-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No se crean políticas públicas en storage.objects.
-- La secret key del backend omite RLS; anon y authenticated no tienen acceso.
