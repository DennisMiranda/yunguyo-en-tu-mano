# Phase 8: Panel Admin - Categorías

## Objective

CRUD de categorías en el admin.

## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming, Tailwind only
- `.opencode/skills/learning-book/lessons/architecture.md` — File organization
- `.opencode/skills/learning-book/lessons/supabase.md` — Supabase conventions

## Files to Create

### 1. `src/pages/admin/Categorias.tsx`

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  emprendimientos_count?: number;
}

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const cargarCategorias = async () => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    const { data } = await supabase
      .from('categorias')
      .select('*, emprendimientos(count)')
      .order('nombre');

    const categoriasConCount = (data || []).map((cat) => ({
      ...cat,
      emprendimientos_count: cat.emprendimientos?.[0]?.count || 0,
    }));

    setCategorias(categoriasConCount);
    setCargando(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleEliminar = async (id: string, nombre: string) => {
    const categoria = categorias.find((c) => c.id === id);
    if (
      categoria?.emprendimientos_count &&
      categoria.emprendimientos_count > 0
    ) {
      alert('No se puede eliminar una categoría con emprendimientos asociados');
      return;
    }

    if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) {
      return;
    }

    setEliminando(id);
    await supabase?.from('categorias').delete().eq('id', id);
    await cargarCategorias();
    setEliminando(null);
  };

  if (cargando) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-10 w-48 rounded" />
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
        <Link
          to="/admin/categorias/nueva"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Emprendimientos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td className="px-6 py-4">
                  {categoria.imagen ? (
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                      📦
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {categoria.nombre}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {categoria.descripcion || '-'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {categoria.emprendimientos_count || 0}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    to={`/admin/categorias/${categoria.id}/editar`}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      handleEliminar(categoria.id, categoria.nombre)
                    }
                    disabled={eliminando === categoria.id}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categorias.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No hay categorías. Crea una nueva para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}
```

### 2. `src/pages/admin/CategoriaForm.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CategoriaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenExistente, setImagenExistente] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (id) {
      const cargarCategoria = async () => {
        if (!supabase) return;
        const { data } = await supabase
          .from('categorias')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setNombre(data.nombre);
          setSlug(data.slug);
          setDescripcion(data.descripcion || '');
          setImagenExistente(data.imagen);
        }
        setCargando(false);
      };
      cargarCategoria();
    }
  }, [id]);

  const generarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNombreChange = (value: string) => {
    setNombre(value);
    if (!esEdicion) {
      setSlug(generarSlug(value));
    }
  };

  const subirImagen = async (file: File): Promise<string | null> => {
    if (!supabase) return null;
    const fileName = `categorias/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('imagenes')
      .upload(fileName, file);
    if (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
    const { data } = supabase.storage.from('imagenes').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    let urlImagen = imagenExistente;
    if (imagen) {
      urlImagen = await subirImagen(imagen);
    }

    const datos = {
      nombre,
      slug,
      descripcion: descripcion || null,
      imagen: urlImagen,
    };

    if (esEdicion && id) {
      await supabase?.from('categorias').update(datos).eq('id', id);
    } else {
      await supabase?.from('categorias').insert([datos]);
    }

    setGuardando(false);
    navigate('/admin/categorias');
  };

  if (cargando) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 h-10 w-48 rounded" />
        <div className="bg-gray-200 h-64 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => handleNombreChange(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Seleccionar imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {(imagen || imagenExistente) && (
              <div className="relative">
                <img
                  src={imagen ? URL.createObjectURL(imagen) : imagenExistente!}
                  alt="Preview"
                  className="h-20 w-20 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagen(null);
                    setImagenExistente(null);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={guardando}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/categorias')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
```

## Files to Modify

### 3. `src/App.tsx`

Add admin category routes:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Layout from './components/Layout';
import Inicio from './pages/public/Inicio';
import Explorar from './pages/public/Explorar';
import EmprendimientoDetalle from './pages/public/EmprendimientoDetalle';
import Categorias from './pages/public/Categorias';
import CategoriaDetalle from './pages/public/CategoriaDetalle';
import Nosotros from './pages/public/Nosotros';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import CategoriasAdmin from './pages/admin/Categorias';
import CategoriaForm from './pages/admin/CategoriaForm';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Inicio />} />
            <Route path={ROUTES.EXPLORAR} element={<Explorar />} />
            <Route
              path={ROUTES.EMPRENDIMIENTO_DETALLE}
              element={<EmprendimientoDetalle />}
            />
            <Route path={ROUTES.CATEGORIAS} element={<Categorias />} />
            <Route
              path={ROUTES.CATEGORIA_DETALLE}
              element={<CategoriaDetalle />}
            />
            <Route path={ROUTES.NOSOTROS} element={<Nosotros />} />
          </Route>
          <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="categorias/nueva" element={<CategoriaForm />} />
            <Route path="categorias/:id/editar" element={<CategoriaForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

## E2E Tests

### 4. Create `e2e/admin-categories.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Admin Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', 'admin@yunguyo.pe');
    await page.fill('input[type="password"]', 'Yunguyo2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('categories list loads correctly', async ({ page }) => {
    await page.goto('/admin/categorias');
    await expect(page.locator('h2:text("Categorías")')).toBeVisible();
  });

  test('create new category button works', async ({ page }) => {
    await page.goto('/admin/categorias');
    await page.click('a:text("Nueva categoría")');
    await expect(page.locator('h2:text("Nueva categoría")')).toBeVisible();
  });
});
```

## Validation

- [ ] All files created/modified
- [ ] TypeScript compiles without errors
- [ ] All 29 tests pass
- [ ] Prettier formatting applied
- [ ] No secrets committed

## Commit Plan

### Commit 1: feat(admin-categories): add categories CRUD

**Files:** src/pages/admin/Categorias.tsx, src/pages/admin/CategoriaForm.tsx, src/App.tsx

### Commit 2: test(e2e): add admin categories tests

**Files:** e2e/admin-categories.spec.ts

### Commit 3: docs: add phase 8 plan

**Files:** docs/phases/phase-8-admin-categories/plan.md, docs/phases/phase-8-admin-categories/commit-plan.md
