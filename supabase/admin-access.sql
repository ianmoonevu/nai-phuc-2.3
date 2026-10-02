-- Run once in Supabase SQL Editor after creating the Auth user.
-- Replace ONLY the UUID below. No password belongs in this file.
-- This transaction changes permissions, not website content.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
revoke all on private.site_admins from public, anon, authenticated;
do $$
declare admin_id uuid := 'REPLACE_WITH_AUTH_USER_UUID'::uuid;
begin
  if not exists (select 1 from auth.users where id=admin_id and email_confirmed_at is not null) then
    raise exception 'Create and confirm the Auth user first.';
  end if;
  insert into private.site_admins(user_id) values(admin_id) on conflict do nothing;
end $$;

create or replace function public.is_site_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from private.site_admins where user_id=(select auth.uid())); $$;
revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to anon, authenticated;

do $$
declare t text; p record;
begin
  foreach t in array array['site_branding','projects','articles','media_items','epc_partners','about_page_info','about_info','epc_section_config','consultation_requests','consultations'] loop
    if to_regclass(format('public.%I',t)) is null then continue; end if;
    execute format('alter table public.%I enable row level security',t);
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I',p.policyname,t);
    end loop;
    execute format('grant select,insert,update,delete on public.%I to anon,authenticated',t);
    execute format('create policy admin_access on public.%I for all to authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()))',t);
    -- Restrictive gates also resist an accidental reapplication of legacy permissive policies.
    execute format('create policy admin_update_gate on public.%I as restrictive for update to anon,authenticated using ((select public.is_site_admin())) with check ((select public.is_site_admin()))',t);
    execute format('create policy admin_delete_gate on public.%I as restrictive for delete to anon,authenticated using ((select public.is_site_admin()))',t);
    if t in ('consultation_requests','consultations') then
      execute format('create policy private_read_gate on public.%I as restrictive for select to anon,authenticated using ((select public.is_site_admin()))',t);
      execute format('create policy visitor_submit on public.%I for insert to anon,authenticated with check (coalesce(status,''new'')=''new'' and coalesce(data->>''status'',''new'')=''new'')',t);
    else
      execute format('create policy public_read on public.%I for select to anon,authenticated using (true)',t);
      execute format('create policy admin_insert_gate on public.%I as restrictive for insert to anon,authenticated with check ((select public.is_site_admin()))',t);
    end if;
  end loop;
end $$;

drop policy if exists "Public Access media bucket" on storage.objects;
drop policy if exists hoki_media_read on storage.objects;
drop policy if exists hoki_media_admin on storage.objects;
drop policy if exists hoki_media_insert_gate on storage.objects;
drop policy if exists hoki_media_update_gate on storage.objects;
drop policy if exists hoki_media_delete_gate on storage.objects;
create policy hoki_media_read on storage.objects for select to anon,authenticated using (bucket_id='media');
create policy hoki_media_admin on storage.objects for all to authenticated using (bucket_id='media' and (select public.is_site_admin())) with check (bucket_id='media' and (select public.is_site_admin()));
create policy hoki_media_insert_gate on storage.objects as restrictive for insert to anon,authenticated with check (bucket_id<>'media' or (select public.is_site_admin()));
create policy hoki_media_update_gate on storage.objects as restrictive for update to anon,authenticated using (bucket_id<>'media' or (select public.is_site_admin())) with check (bucket_id<>'media' or (select public.is_site_admin()));
create policy hoki_media_delete_gate on storage.objects as restrictive for delete to anon,authenticated using (bucket_id<>'media' or (select public.is_site_admin()));
commit;
