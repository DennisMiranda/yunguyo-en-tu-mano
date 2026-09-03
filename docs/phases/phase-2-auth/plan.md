# Phase 2: Auth + Login Admin

## Objective

Configure Supabase Auth for admin authentication with protected routes and login page.

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/architecture.md` — Project structure patterns
- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants, dependency injection
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind styling
- `.opencode/skills/learning-book/lessons/pitfalls.md` — Common mistakes to avoid
- `.opencode/skills/learning-book/lessons/implementation-preview.md` — Show preview before coding

## Tasks

### 1. Create Route Constants

**File:** `src/lib/routes.ts`

```typescript
export const ROUTES = {
  HOME: '/',
  EXPLORAR: '/explorar',
  CATEGORIAS: '/categorias',
  NOSOTROS: '/nosotros',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_CATEGORIAS: '/admin/categorias',
  ADMIN_EMPRENDIMIENTOS: '/admin/emprendimientos',
  ADMIN_USUARIOS: '/admin/usuarios',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
```

### 2. Create Auth Context

**File:** `src/lib/auth.tsx`

```tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3. Create Login Page

**File:** `src/pages/admin/Login.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { ROUTES } from '../../lib/routes';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate(ROUTES.ADMIN);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Yunguyo en tu mano
        </h1>
        <p className="text-center text-gray-600 mb-8">Acceso administrativo</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 4. Create Admin Layout

**File:** `src/pages/admin/Layout.tsx`

```tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { ROUTES } from '../../lib/routes';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Panel Administrativo
          </h1>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

### 5. Create Admin Dashboard (Placeholder)

**File:** `src/pages/admin/Dashboard.tsx`

```tsx
import { useAuth } from '../../lib/auth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Categorías
        </button>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Emprendimientos
        </button>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
```

### 6. Update App.tsx with Routes

**File:** `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';

function PublicHome() {
  return (
    <div className="p-8">
      <h1>Yunguyo en tu mano</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.HOME} element={<PublicHome />} />
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

### 7. Install react-router-dom

```bash
bun add react-router-dom
```

### 8. Create E2E Tests

**File:** `e2e/admin-login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Login', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('text=Acceso administrativo')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.bg-red-50')).toBeVisible();
  });

  test('access /admin without session redirects to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });
});
```

## File Structure After Implementation

```
src/
├── lib/
│   ├── supabase.ts
│   ├── database.types.ts
│   ├── auth.tsx
│   └── routes.ts
├── pages/
│   └── admin/
│       ├── Login.tsx
│       ├── Layout.tsx
│       └── Dashboard.tsx
├── App.tsx (updated)
├── main.tsx
├── ...

e2e/
├── admin-login.spec.ts
├── ...
```

## Validation

- [ ] Route constants created (no string literals)
- [ ] Auth context created
- [ ] Login page functional
- [ ] Protected routes work
- [ ] Redirect to login when unauthenticated
- [ ] Spanish labels used
- [ ] Tailwind styling applied
- [ ] E2E tests pass
- [ ] Prettier formatted

## Dependencies

- Phase 1: Supabase setup ✅

## Related Issues

- Phase 3: Header + Navigation (depends on auth state)
