# Phase 6: Página de Categoría

## Objective

Detalle de categoría con sus emprendimientos.

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind only
- `.opencode/skills/learning-book/lessons/architecture.md` — File organization
- `.opencode/skills/learning-book/lessons/supabase.md` — Supabase conventions

## Files to Modify

### 1. `src/lib/routes.ts`

Add category detail route:

```typescript
export const ROUTES = {
  HOME: '/',
  EXPLORAR: '/explorar',
  CATEGORIAS: '/categorias',
  CATEGORIA_DETALLE: '/categorias/:slug',
  NOSOTROS: '/nosotros',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_CATEGORIAS: '/admin/categorias',
  ADMIN_EMPRENDIMIENTOS: '/admin/emprendimientos',
  ADMIN_USUARIOS: '/admin/usuarios',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
```

## Files to Create

### 2. `src/pages/public/CategoriaDetalle.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';
import TarjetaEmprendimiento from '../../components/TarjetaEmprendimiento';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
}

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
}

export default function CategoriaDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase || !slug) {
        setCargando(false);
        return;
      }

      const { data: cat } = await supabase
        .from('categorias')
        .select('id, nombre, slug, descripcion, imagen')
        .eq('slug', slug)
        .single();

      if (cat) {
        setCategoria(cat);
        const { data: emps } = await supabase
          .from('emprendimientos')
          .select('id, nombre, slug, descripcion, imagen_principal')
          .eq('categoria_id', cat.id)
          .order('nombre');

        setEmprendimientos(emps || []);
      }

      setCargando(false);
    };

    cargarDatos();
  }, [slug]);

  if (cargando) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-64 rounded" />
            <div className="bg-gray-200 h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Categoría no encontrada
          </h1>
          <Link
            to={ROUTES.CATEGORIAS}
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Volver a categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={ROUTES.CATEGORIAS} className="hover:text-gray-900">
            Categorías
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{categoria.nombre}</span>
        </nav>

        {categoria.imagen && (
          <div className="mb-6">
            <img
              src={categoria.imagen}
              alt={categoria.nombre}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoria.nombre}
        </h1>

        {categoria.descripcion && (
          <p className="text-gray-600 mb-8">{categoria.descripcion}</p>
        )}

        {emprendimientos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay emprendimientos en esta categoría
            </p>
            <Link
              to={ROUTES.EXPLORAR}
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              Explorar todos los emprendimientos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprendimientos.map((emprendimiento) => (
              <TarjetaEmprendimiento
                key={emprendimiento.id}
                emprendimiento={{
                  ...emprendimiento,
                  categorias: { nombre: categoria.nombre },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Update `src/pages/public/Categorias.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imagen: string | null;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCategorias = async () => {
      if (!supabase) {
        setCargando(false);
        return;
      }

      const { data } = await supabase
        .from('categorias')
        .select('id, nombre, slug, imagen')
        .order('nombre');

      setCategorias(data || []);
      setCargando(false);
    };

    cargarCategorias();
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Categorías</h1>

        {cargando ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-32 rounded-lg"
              />
            ))}
          </div>
        ) : categorias.length === 0 ? (
          <p className="text-gray-600">No hay categorías disponibles</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`${ROUTES.CATEGORIAS}/${categoria.slug}`}
                className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                {categoria.imagen ? (
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <span className="w-full text-center text-white font-medium p-3">
                    {categoria.nombre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Update `src/App.tsx`

Add category detail route:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Layout from './components/Layout';
import Inicio from './pages/public/Inicio';
import Explorar from './pages/public/Explorar';
import Categorias from './pages/public/Categorias';
import CategoriaDetalle from './pages/public/CategoriaDetalle';
import Nosotros from './pages/public/Nosotros';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Inicio />} />
            <Route path={ROUTES.EXPLORAR} element={<Explorar />} />
            <Route path={ROUTES.CATEGORIAS} element={<Categorias />} />
            <Route path={ROUTES.CATEGORIA_DETALLE} element={<CategoriaDetalle />} />
            <Route path={ROUTES.NOSOTROS} element={<Nosotros />} />
          </Route>
          <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## E2E Tests

### 5. Create `e2e/category.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Category', () => {
  test('category page shows businesses', async ({ page }) => {
    await page.goto('/categorias');
    await expect(page.locator('h1:text("Categorías")')).toBeVisible();
  });

  test('category detail shows breadcrumb', async ({ page }) => {
    await page.goto('/categorias');
    const primeraCategoria = page.locator('a[href*="/categorias/"]').first();
    if (await primeraCategoria.isVisible()) {
      await primeraCategoria.click();
      await expect(page.locator('text=Categorías')).toBeVisible();
    }
  });

  test('empty category shows message', async ({ page }) => {
    await page.goto('/categorias/categoria-inexistente');
    await expect(page.locator('text=Categoría no encontrada')).toBeVisible();
  });
});
```

## Validation

- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] All 24 tests pass
- [ ] Prettier formatting applied
- [ ] No secrets committed

## Commit Plan

### Commit 1: feat(category): add category detail page and listing

**Files:** src/lib/routes.ts, src/pages/public/CategoriaDetalle.tsx, src/pages/public/Categorias.tsx, src/App.tsx

### Commit 2: test(e2e): add category page tests

**Files:** e2e/category.spec.ts

### Commit 3: docs: add phase 6 plan

**Files:** docs/phases/phase-6-category/plan.md, docs/phases/phase-6-category/commit-plan.md
