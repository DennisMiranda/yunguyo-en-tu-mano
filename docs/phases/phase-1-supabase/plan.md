# Phase 1: Supabase + Modelo de datos + RLS

## Objective

Configure Supabase, create database tables, relationships, security policies, and demo data.

## Tasks

### 1. Install Dependencies

```bash
bun add @supabase/supabase-js
```

### 2. Environment Variables

Create `.env.example`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Create `.env` with real values (gitignored).

### 3. Create Supabase Client

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### 4. Create Database Types

**File:** `src/lib/database.types.ts`

Auto-generated from Supabase or manually typed:

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: number;
          nombre: string;
          descripcion: string | null;
          imagen: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          descripcion?: string | null;
          imagen?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          descripcion?: string | null;
          imagen?: string | null;
          created_at?: string;
        };
      };
      emprendimientos: {
        Row: {
          id: number;
          nombre: string;
          categoria_id: number;
          descripcion: string | null;
          imagen_principal: string | null;
          galeria: string[];
          whatsapp: string | null;
          google_maps: string | null;
          horario: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          nombre: string;
          categoria_id: number;
          descripcion?: string | null;
          imagen_principal?: string | null;
          galeria?: string[];
          whatsapp?: string | null;
          google_maps?: string | null;
          horario?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          nombre?: string;
          categoria_id?: number;
          descripcion?: string | null;
          imagen_principal?: string | null;
          galeria?: string[];
          whatsapp?: string | null;
          google_maps?: string | null;
          horario?: Json | null;
          created_at?: string;
        };
      };
    };
  };
}
```

### 5. Create Migrations

**Directory:** `supabase/migrations/`

#### 001_create_categorias.sql

```sql
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
```

#### 002_create_emprendimientos.sql

```sql
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
```

### 6. Create Seed Data

**File:** `supabase/seed.sql`

```sql
-- Categorias
insert into categorias (nombre, descripcion, imagen) values
  ('Turismo', 'Descubre los destinos y experiencias turísticas de Yunguyo', null),
  ('Gastronomía', 'Sabores y restaurantes típicos del altiplano', null),
  ('Artesanía', 'Artesanías locales con tradición andina', null),
  ('Productos', 'Productos locales y del altiplano', null),
  ('Servicios', 'Servicios para residentes y visitantes', null);

-- Emprendimientos
insert into emprendimientos (nombre, categoria_id, descripcion, whatsapp, horario) values
  ('Restaurante El Lago', 1, 'Gastronomía típica con vista al Lago Titicaca', '51999111222', '{"lunes":{"activo":true,"abre":"09:00","cierra":"18:00"},"martes":{"activo":true,"abre":"09:00","cierra":"18:00"},"miercoles":{"activo":false},"jueves":{"activo":true,"abre":"09:00","cierra":"18:00"},"viernes":{"activo":true,"abre":"09:00","cierra":"18:00"},"sabado":{"activo":true,"abre":"10:00","cierra":"16:00"},"domingo":{"activo":false}}'),
  ('Sabores del Altiplano', 2, 'Restaurantes de comida tradicional altoandina', '51999333444', null),
  ('Artesanías Titicaca', 3, 'Artesanías en lana y cerámica', '51999555666', null),
  ('Textiles Yunguyo', 3, 'Tejidos artesanales con patrones ancestrales', '51999777888', null),
  ('Productos del Altiplano', 4, 'Quinua, maca y productos orgánicos', '51999999000', null),
  ('Turismo Andino Yunguyo', 1, 'Tours y experiencias turísticas', '51999112233', null);
```

### 7. Configure Storage (Manual via Supabase Dashboard)

Create buckets:

- `imagenes` (public)
  - `categorias/` — category images
  - `emprendimientos/` — business images

RLS policies for storage:

- Public: read access to `imagenes` bucket
- Authenticated: upload/delete access to `imagenes` bucket

### 8. Update .gitignore

Add:

```
.env
.env.local
supabase/.temp
```

### 9. Create E2E Test

**File:** `e2e/supabase-connection.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Supabase Connection', () => {
  test('supabase client is configured', async ({ page }) => {
    await page.goto('/');

    const supabaseUrl = await page.evaluate(() => {
      return (
        import.meta.env?.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
      );
    });

    expect(supabaseUrl).toBeTruthy();
  });

  test('can query categorias table', async ({ request }) => {
    // This test requires env vars to be set
    // Skip in CI if not configured
    test.skip(!process.env.VITE_SUPABASE_URL, 'Supabase not configured');

    const response = await request.get(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/categorias?select=*&limit=1`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ''}`,
        },
      }
    );

    expect(response.status()).toBe(200);
  });
});
```

## File Structure After Implementation

```
src/
├── lib/
│   ├── supabase.ts
│   └── database.types.ts
├── ...

supabase/
├── migrations/
│   ├── 001_create_categorias.sql
│   └── 002_create_emprendimientos.sql
├── seed.sql

e2e/
├── supabase-connection.spec.ts
├── ...

.env.example
.env (gitignored)
```

## Validation

- [ ] Supabase client created and exported
- [ ] Database types generated/matched
- [ ] Migrations created and valid SQL
- [ ] RLS policies configured correctly
- [ ] Seed data in Spanish
- [ ] .env.example created
- [ ] .env gitignored
- [ ] E2E test passes
- [ ] Prettier formatted

## Dependencies

- None (this is the foundation phase)

## Related Issues

- Phase 0: Playwright setup ✅
- Phase 2: Auth + Login (depends on this phase)
