# Phase 4: Homepage

## Objective

Página de inicio con hero, categorías y sección "Somos Yunguyo".

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind only
- `.opencode/skills/learning-book/lessons/architecture.md` — File organization
- `.opencode/skills/learning-book/lessons/supabase.md` — Supabase conventions

## Files to Create

### 1. `src/components/Hero.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ROUTES } from '../lib/routes';

export default function Hero() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`${ROUTES.EXPLORAR}?q=${encodeURIComponent(busqueda.trim())}`);
    }
  };

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Yunguyo en tu mano
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubre los mejores emprendimientos locales de Yunguyo
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
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
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
```

### 2. `src/components/ListadoCategorias.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../lib/routes';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imagen: string | null;
}

export default function ListadoCategorias() {
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

  if (cargando) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-32 rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categorias.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Explora por categoría
        </h2>
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
      </div>
    </section>
  );
}
```

### 3. `src/components/SomosYunguyo.tsx`

```tsx
export default function SomosYunguyo() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Somos Yunguyo
          </h2>
          <p className="text-gray-600 mb-4">
            Un directorio digital de emprendimientos locales de Yunguyo, Puno,
            Perú. Conectamos a la comunidad con los mejores negocios del lugar.
          </p>
          <p className="text-gray-600">
            Encuentra restaurantes, tiendas, servicios y mucho más.
          </p>
        </div>
      </div>
    </section>
  );
}
```

## Files to Modify

### 4. `src/pages/public/Inicio.tsx`

```tsx
import Hero from '../../components/Hero';
import ListadoCategorias from '../../components/ListadoCategorias';
import SomosYunguyo from '../../components/SomosYunguyo';

export default function Inicio() {
  return (
    <>
      <Hero />
      <ListadoCategorias />
      <SomosYunguyo />
    </>
  );
}
```

## E2E Tests

### 5. Create `e2e/homepage.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero is displayed correctly', async ({ page }) => {
    await expect(page.locator('h1:text("Yunguyo en tu mano")')).toBeVisible();
    await expect(
      page.locator('input[placeholder="Buscar emprendimientos..."]')
    ).toBeVisible();
    await expect(page.locator('button:text("Buscar")')).toBeVisible();
  });

  test('search redirects to /explorar with query', async ({ page }) => {
    await page.fill(
      'input[placeholder="Buscar emprendimientos..."]',
      'restaurante'
    );
    await page.click('button:text("Buscar")');
    await expect(page).toHaveURL(/\/explorar\?q=restaurante/);
  });

  test('categories load dynamically', async ({ page }) => {
    const seccionCategorias = page.locator('text=Explora por categoría');
    await expect(seccionCategorias).toBeVisible();
  });

  test('footer is displayed', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(
      page.locator('footer:text("© 2026 Yunguyo en tu mano")')
    ).toBeVisible();
  });
});
```

## Validation

- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] All 17 tests pass
- [ ] Prettier formatting applied
- [ ] No secrets committed

## Commit Plan

### Commit 1: feat(homepage): add hero, categories and about sections

**Files:** src/components/Hero.tsx, src/components/ListadoCategorias.tsx, src/components/SomosYunguyo.tsx, src/pages/public/Inicio.tsx

### Commit 2: test(e2e): add homepage tests

**Files:** e2e/homepage.spec.ts

### Commit 3: docs: add phase 4 plan

**Files:** docs/phases/phase-4-homepage/plan.md, docs/phases/phase-4-homepage/commit-plan.md
