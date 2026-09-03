# Phase 5: Página Explorar + Búsqueda + Filtros

## Objective

Página principal de descubrimiento con búsqueda y filtros.

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind only
- `.opencode/skills/learning-book/lessons/architecture.md` — File organization
- `.opencode/skills/learning-book/lessons/supabase.md` — Supabase conventions

## Files to Create

### 1. `src/components/TarjetaEmprendimiento.tsx`

```tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  categorias: { nombre: string } | null;
}

interface Props {
  emprendimiento: Emprendimiento;
}

export default function TarjetaEmprendimiento({ emprendimiento }: Props) {
  return (
    <Link
      to={`${ROUTES.EXPLORAR}/${emprendimiento.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {emprendimiento.imagen_principal ? (
        <img
          src={emprendimiento.imagen_principal}
          alt={emprendimiento.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
      )}
      <div className="p-4">
        {emprendimiento.categorias && (
          <span className="text-xs font-medium text-blue-600 uppercase">
            {emprendimiento.categorias.nombre}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          {emprendimiento.nombre}
        </h3>
        {emprendimiento.descripcion && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {emprendimiento.descripcion}
          </p>
        )}
      </div>
    </Link>
  );
}
```

### 2. `src/components/FiltrosCategorias.tsx`

```tsx
interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Props {
  categorias: Categoria[];
  categoriaSeleccionada: string | null;
  onSeleccionar: (id: string | null) => void;
}

export default function FiltrosCategorias({
  categorias,
  categoriaSeleccionada,
  onSeleccionar,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSeleccionar(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          categoriaSeleccionada === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          type="button"
          onClick={() => onSeleccionar(categoria.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categoriaSeleccionada === categoria.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
```

## Files to Modify

### 3. `src/pages/public/Explorar.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TarjetaEmprendimiento from '../../components/TarjetaEmprendimiento';
import FiltrosCategorias from '../../components/FiltrosCategorias';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  categorias: { nombre: string } | null;
}

export default function Explorar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(searchParams.get('q') || '');

  const categoriaSeleccionada = searchParams.get('categoria');

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase) {
        setCargando(false);
        return;
      }

      const [catsRes, empsRes] = await Promise.all([
        supabase.from('categorias').select('id, nombre, slug').order('nombre'),
        supabase
          .from('emprendimientos')
          .select(
            'id, nombre, slug, descripcion, imagen_principal, categorias(nombre)'
          ),
      ]);

      setCategorias(catsRes.data || []);
      setEmprendimientos(empsRes.data || []);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  const emprendimientosFiltrados = emprendimientos.filter((emp) => {
    const coincideBusqueda = busqueda
      ? emp.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        emp.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      : true;

    const coincideCategoria = categoriaSeleccionada
      ? true // TODO: filter by categoria_id when we have it
      : true;

    return coincideBusqueda && coincideCategoria;
  });

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (busqueda) {
      params.set('q', busqueda);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleSeleccionarCategoria = (id: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (id) {
      params.set('categoria', id);
    } else {
      params.delete('categoria');
    }
    setSearchParams(params);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setSearchParams({});
  };

  const tieneFiltros = busqueda || categoriaSeleccionada;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Explorar</h1>

        <form onSubmit={handleBusqueda} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar emprendimientos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </form>

        <div className="mb-6">
          <FiltrosCategorias
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onSeleccionar={handleSeleccionarCategoria}
          />
        </div>

        {tieneFiltros && (
          <div className="mb-6">
            <button
              type="button"
              onClick={limpiarFiltros}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          </div>
        )}

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg" />
                <div className="mt-4 space-y-2">
                  <div className="bg-gray-200 h-4 w-1/4 rounded" />
                  <div className="bg-gray-200 h-6 w-3/4 rounded" />
                  <div className="bg-gray-200 h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : emprendimientosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron emprendimientos
            </p>
            {tieneFiltros && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprendimientosFiltrados.map((emprendimiento) => (
              <TarjetaEmprendimiento
                key={emprendimiento.id}
                emprendimiento={emprendimiento}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## E2E Tests

### 4. Create `e2e/explore.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Explore', () => {
  test('page loads with businesses', async ({ page }) => {
    await page.goto('/explorar');
    await expect(page.locator('h1:text("Explorar")')).toBeVisible();
    await expect(
      page.locator('input[placeholder="Buscar emprendimientos..."]')
    ).toBeVisible();
  });

  test('search filters results', async ({ page }) => {
    await page.goto('/explorar');
    await page.fill(
      'input[placeholder="Buscar emprendimientos..."]',
      'restaurante'
    );
    await page.click('button:text("Buscar")');
    await expect(page).toHaveURL(/q=restaurante/);
  });

  test('category filter works', async ({ page }) => {
    await page.goto('/explorar');
    const botonesFiltro = page.locator('button:text("Todas")');
    await expect(botonesFiltro).toBeVisible();
  });

  test('clear filters resets view', async ({ page }) => {
    await page.goto('/explorar?q=test');
    const botonLimpiar = page.locator('button:text("Limpiar filtros")');
    if (await botonLimpiar.isVisible()) {
      await botonLimpiar.click();
      await expect(page).toHaveURL('/explorar');
    }
  });
});
```

## Validation

- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] All 21 tests pass
- [ ] Prettier formatting applied
- [ ] No secrets committed

## Commit Plan

### Commit 1: feat(explore): add search, filters and business cards

**Files:** src/components/TarjetaEmprendimiento.tsx, src/components/FiltrosCategorias.tsx, src/pages/public/Explorar.tsx

### Commit 2: test(e2e): add explore page tests

**Files:** e2e/explore.spec.ts

### Commit 3: docs: add phase 5 plan

**Files:** docs/phases/phase-5-explore/plan.md, docs/phases/phase-5-explore/commit-plan.md
