create table emprendimientos (
  id bigserial primary key,
  nombre text not null,
  categoria_id bigint not null references categorias(id) on delete restrict,
  descripcion text,
  imagen_principal text,
  galeria text[] default '{}',
  whatsapp text,
  google_maps text,
  horario jsonb,
  created_at timestamptz default now() not null
);

alter table emprendimientos enable row level security;

-- Public read access
create policy "Public can read emprendimientos"
  on emprendimientos for select
  using (true);

-- Authenticated users can CRUD
create policy "Authenticated can insert emprendimientos"
  on emprendimientos for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated can update emprendimientos"
  on emprendimientos for update
  using (auth.role() = 'authenticated');

create policy "Authenticated can delete emprendimientos"
  on emprendimientos for delete
  using (auth.role() = 'authenticated');
