create table categorias (
  id bigserial primary key,
  nombre text not null,
  descripcion text,
  imagen text,
  created_at timestamptz default now() not null
);

alter table categorias enable row level security;

-- Public read access
create policy "Public can read categorias"
  on categorias for select
  using (true);

-- Authenticated users can CRUD
create policy "Authenticated can insert categorias"
  on categorias for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated can update categorias"
  on categorias for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can delete categorias"
  on categorias for delete
  using (auth.role() = 'authenticated');
