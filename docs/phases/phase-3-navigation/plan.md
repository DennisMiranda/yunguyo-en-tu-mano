# Phase 3: Header + Navegación Pública

## Objective

Header responsive con navegación pública.

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind only
- `.opencode/skills/learning-book/lessons/architecture.md` — File organization

## Dependencies

```bash
bun add lucide-react
```

## Files to Create

### 1. `src/components/Header.tsx`

```tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../lib/routes';

const NAV_LINKS = [
  { label: 'Explorar', href: ROUTES.EXPLORAR },
  { label: 'Categorías', href: ROUTES.CATEGORIAS },
  { label: 'Nosotros', href: ROUTES.NOSOTROS },
] as const;

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ubicacion = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
            Yunguyo
          </Link>

          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium ${
                  ubicacion.pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            {menuAbierto ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2 text-sm font-medium ${
                  ubicacion.pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
```

### 2. `src/components/Footer.tsx`

```tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">© 2026 Yunguyo en tu mano</div>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to={ROUTES.EXPLORAR}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Explorar
            </Link>
            <Link
              to={ROUTES.CATEGORIAS}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Categorías
            </Link>
            <Link
              to={ROUTES.NOSOTROS}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Nosotros
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

### 3. `src/components/Layout.tsx`

```tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### 4. `src/pages/public/Inicio.tsx`

```tsx
export default function Inicio() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Yunguyo en tu mano</h1>
      <p className="mt-4 text-gray-600">
        Directorio de emprendimientos locales
      </p>
    </div>
  );
}
```

### 5. `src/pages/public/Explorar.tsx`

```tsx
export default function Explorar() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Explorar</h1>
    </div>
  );
}
```

### 6. `src/pages/public/Categorias.tsx`

```tsx
export default function Categorias() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
    </div>
  );
}
```

### 7. `src/pages/public/Nosotros.tsx`

```tsx
export default function Nosotros() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Nosotros</h1>
    </div>
  );
}
```

## Files to Modify

### 8. `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Layout from './components/Layout';
import Inicio from './pages/public/Inicio';
import Explorar from './pages/public/Explorar';
import Categorias from './pages/public/Categorias';
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

### 9. Update `e2e/navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    const criticalErrors = errors.filter(
      (e) => !e.includes('supabaseUrl is required')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('has expected routes defined in plan', async ({ page }) => {
    const routes = ['/', '/explorar', '/categorias', '/nosotros'];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(500);
    }
  });

  test('header shows all links on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('nav a')).toHaveCount(3);
  });

  test('hamburger menu opens and closes on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const botonMenu = page.locator('button[aria-label="Menú"]');
    await expect(botonMenu).toBeVisible();
    await botonMenu.click();
    await expect(page.locator('nav a')).toHaveCount(3);
    await botonMenu.click();
  });

  test('click on logo navigates to home', async ({ page }) => {
    await page.goto('/explorar');
    await page.click('a:text("Yunguyo")');
    await expect(page).toHaveURL('/');
  });

  test('navigation between routes works', async ({ page }) => {
    await page.click('a:text("Explorar")');
    await expect(page).toHaveURL('/explorar');
    await page.click('a:text("Categorías")');
    await expect(page).toHaveURL('/categorias');
    await page.click('a:text("Nosotros")');
    await expect(page).toHaveURL('/nosotros');
  });
});
```

## Validation

- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] All 9 tests pass
- [ ] Prettier formatting applied
- [ ] No secrets committed

## Commit Plan

### Commit 1: build: add lucide-react

**Files:** package.json, bun.lock

### Commit 2: feat(layout): add header, footer and public layout

**Files:** src/components/Header.tsx, src/components/Footer.tsx, src/components/Layout.tsx

### Commit 3: feat(pages): add public page placeholders

**Files:** src/pages/public/Inicio.tsx, src/pages/public/Explorar.tsx, src/pages/public/Categorias.tsx, src/pages/public/Nosotros.tsx, src/App.tsx

### Commit 4: test(e2e): add header and navigation tests

**Files:** e2e/navigation.spec.ts
