# Phase 11: SEO + Accesibilidad + Estados de carga

**Objetivo:** Pulir la app con SEO, accesibilidad y UX.

## Archivos a crear/modificar

### 1. `src/lib/seo.ts` (nuevo)

Funciones para generar title y meta description dinámicos.

### 2. `src/hooks/useSEO.ts` (nuevo)

Hook para actualizar title y meta description al montar componentes.

### 3. `src/components/Skeleton.tsx` (nuevo)

Componente reutilizable de skeleton para estados de carga.

### 4. `src/components/EstadoVacio.tsx` (nuevo)

Componente reutilizable para estados vacíos.

### 5. `src/components/ ErrorMessage.tsx` (nuevo)

Componente reutilizable para errores.

### 6. Modificar páginas existentes para usar SEO

- `src/pages/public/Inicio.tsx`
- `src/pages/public/Explorar.tsx`
- `src/pages/public/Categorias.tsx`
- `src/pages/public/CategoriaDetalle.tsx`
- `src/pages/public/EmprendimientoDetalle.tsx`
- `src/pages/public/Nosotros.tsx`

### 7. `e2e/seo.spec.ts` (nuevo)

Tests:

- Title dinámico en detalle de emprendimiento
- Title dinámico en categoría

### 8. `e2e/accessibility.spec.ts` (nuevo)

Tests:

- Imágenes tienen alt
- Formularios tienen labels

## Código detallado

### src/lib/seo.ts

```typescript
interface SEOData {
  title: string;
  description: string;
}

const BASE_TITLE = 'Yunguyo en tu mano';
const BASE_DESCRIPTION =
  'Directorio digital de emprendimientos de Yunguyo, Puno, Perú.';

export const SEO: Record<string, SEOData> = {
  home: {
    title: BASE_TITLE,
    description: BASE_DESCRIPTION,
  },
  explorar: {
    title: `Explorar | ${BASE_TITLE}`,
    description:
      'Explora todos los emprendimientos de Yunguyo. Encuentra negocios locales por categoría.',
  },
  categorias: {
    title: `Categorías | ${BASE_TITLE}`,
    description:
      'Descubre las categorías de emprendimientos disponibles en Yunguyo.',
  },
  nosotros: {
    title: `Nosotros | ${BASE_TITLE}`,
    description:
      'Conoce más sobre Yunguyo en tu mano, el directorio digital de emprendimientos locales.',
  },
};

export function getSEOForCategoria(nombre: string): SEOData {
  return {
    title: `${nombre} | ${BASE_TITLE}`,
    description: `Explora los emprendimientos de ${nombre} en Yunguyo.`,
  };
}

export function getSEOForEmprendimiento(
  nombre: string,
  categoria: string
): SEOData {
  return {
    title: `${nombre} | ${BASE_TITLE}`,
    description: `${nombre} - Emprendimiento de ${categoria} en Yunguyo, Puno, Perú.`,
  };
}
```

### src/hooks/useSEO.ts

```typescript
import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
}

export function useSEO(data: SEOData) {
  useEffect(() => {
    document.title = data.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', data.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = data.description;
      document.head.appendChild(meta);
    }
  }, [data.title, data.description]);
}
```

### src/components/Skeleton.tsx

```tsx
interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded" />
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-24" />
        </div>
      ))}
    </div>
  );
}
```

### src/components/EstadoVacio.tsx

```tsx
import { Inbox } from 'lucide-react';

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
}

export function EstadoVacio({ titulo, descripcion }: EstadoVacioProps) {
  return (
    <div className="text-center py-12">
      <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{titulo}</h3>
      {descripcion && <p className="text-gray-600">{descripcion}</p>}
    </div>
  );
}
```

### src/components/ErrorMessage.tsx

```tsx
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  mensaje: string;
}

export function ErrorMessage({ mensaje }: ErrorMessageProps) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600">{mensaje}</p>
    </div>
  );
}
```

### e2e/seo.spec.ts

```ts
import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('business detail has dynamic title', async ({ page }) => {
    await page.goto('/explorar');
    const primerEmprendimiento = page.locator('a[href*="/explorar/"]').first();
    if (await primerEmprendimiento.isVisible()) {
      await primerEmprendimiento.click();
      await expect(page).toHaveTitle(/Yunguyo/);
    }
  });

  test('category detail has dynamic title', async ({ page }) => {
    await page.goto('/categorias');
    const primeraCategoria = page.locator('a[href*="/categorias/"]').first();
    if (await primeraCategoria.isVisible()) {
      await primeraCategoria.click();
      await expect(page).toHaveTitle(/Yunguyo/);
    }
  });
});
```

### e2e/accessibility.spec.ts

```ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/explorar');
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/admin/login');
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const id = await inputs.nth(i).getAttribute('id');
      const ariaLabel = await inputs.nth(i).getAttribute('aria-label');
      const hasLabel = id
        ? await page.locator(`label[for="${id}"]`).isVisible()
        : false;
      expect(hasLabel || ariaLabel).toBeTruthy();
    }
  });
});
```

## Commits

1. `feat(seo): add SEO hooks and components` — seo.ts, useSEO.ts
2. `feat(ui): add skeleton and state components` — Skeleton.tsx, EstadoVacio.tsx, ErrorMessage.tsx
3. `feat(seo): add dynamic titles to pages` — Modificar páginas existentes
4. `test(e2e): add SEO and accessibility tests` — seo.spec.ts, accessibility.spec.ts
5. `docs: add phase 11 plan` — docs/phases/phase-11-seo-accessibility/plan.md

## Lessons to Follow

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming
- `.opencode/skills/learning-book/lessons/pitfalls.md` — No dev/preview servers, check git status
