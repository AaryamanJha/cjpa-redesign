-- CJPA portal prototype sync table.
-- Run this in Supabase SQL Editor before setting NEXT_PUBLIC_SUPABASE_* env vars.

create table if not exists public.portal_records (
  collection text not null,
  record_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (collection, record_id)
);

create or replace function public.set_portal_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_portal_records_updated_at on public.portal_records;

create trigger set_portal_records_updated_at
before update on public.portal_records
for each row
execute function public.set_portal_records_updated_at();

alter table public.portal_records enable row level security;

-- Prototype-only policies. Because the current portal uses mock CJPA IDs instead
-- of Supabase Auth, these policies allow browser clients with the anon key to
-- read and write shared portal data. Tighten this before storing sensitive data.
drop policy if exists "cjpa portal read" on public.portal_records;
drop policy if exists "cjpa portal insert" on public.portal_records;
drop policy if exists "cjpa portal update" on public.portal_records;
drop policy if exists "cjpa portal delete" on public.portal_records;

create policy "cjpa portal read"
on public.portal_records
for select
to anon
using (true);

create policy "cjpa portal insert"
on public.portal_records
for insert
to anon
with check (true);

create policy "cjpa portal update"
on public.portal_records
for update
to anon
using (true)
with check (true);

create policy "cjpa portal delete"
on public.portal_records
for delete
to anon
using (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'portal_records'
  ) then
    alter publication supabase_realtime add table public.portal_records;
  end if;
end $$;

