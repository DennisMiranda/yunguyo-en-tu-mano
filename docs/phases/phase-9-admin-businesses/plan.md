# Phase 9: Panel Admin - Emprendimientos

**Objetivo:** CRUD de emprendimientos en el admin.

## Archivos a crear/modificar

### 1. `src/pages/admin/Emprendimientos.tsx` (nuevo)

Listado de emprendimientos con imagen, nombre, categoría y acciones.

### 2. `src/pages/admin/EmprendimientoForm.tsx` (nuevo)

Formulario para crear/editar emprendimientos con:

- Campos: nombre, slug, descripción, categoría (select dinámico)
- Upload imagen principal
- Upload galería múltiple
- Campo WhatsApp
- Campo Google Maps (textarea)
- Gestión de horario (checkbox por día + apertura/cierre)

### 3. `src/App.tsx` (modificar)

Agregar rutas:

- `/admin/emprendimientos` → Emprendimientos
- `/admin/emprendimientos/nuevo` → EmprendimientoForm
- `/admin/emprendimientos/:id/editar` → EmprendimientoForm

### 4. `e2e/admin-businesses.spec.ts` (nuevo)

Tests:

- Listado carga correctamente
- Crear emprendimiento nuevo
- Editar emprendimiento existente

## Código detallado

### Emprendimientos.tsx

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  categoria_id: string;
  categoria_nombre?: string;
  whatsapp: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = any;

export default function EmprendimientosAdmin() {
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const cargarEmprendimientos = async () => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    const { data } = await supabase
      .from('emprendimientos')
      .select('*, categorias(nombre)')
      .order('nombre');

    const emprendimientosConCategoria = (data || []).map(
      (emp: SupabaseRow) => ({
        id: emp.id,
        nombre: emp.nombre,
        slug: emp.slug,
        descripcion: emp.descripcion,
        imagen_principal: emp.imagen_principal,
        categoria_id: emp.categoria_id,
        categoria_nombre: emp.categorias?.nombre,
        whatsapp: emp.whatsapp,
      })
    );

    setEmprendimientos(emprendimientosConCategoria);
    setCargando(false);
  };

  useEffect(() => {
    cargarEmprendimientos();
  }, []);

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar el emprendimiento "${nombre}"?`)) {
      return;
    }

    setEliminando(id);
    await supabase?.from('emprendimientos').delete().eq('id', id);
    await cargarEmprendimientos();
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
        <h2 className="text-2xl font-bold text-gray-900">Emprendimientos</h2>
        <Link
          to="/admin/emprendimientos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo emprendimiento
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
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                WhatsApp
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {emprendimientos.map((emprendimiento) => (
              <tr key={emprendimiento.id}>
                <td className="px-6 py-4">
                  {emprendimiento.imagen_principal ? (
                    <img
                      src={emprendimiento.imagen_principal}
                      alt={emprendimiento.nombre}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                      📦
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {emprendimiento.nombre}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {emprendimiento.categoria_nombre || '-'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {emprendimiento.whatsapp || '-'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    to={`/admin/emprendimientos/${emprendimiento.id}/editar`}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      handleEliminar(emprendimiento.id, emprendimiento.nombre)
                    }
                    disabled={eliminando === emprendimiento.id}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {emprendimientos.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No hay emprendimientos. Crea uno nuevo para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}
```

### EmprendimientoForm.tsx

```tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Categoria {
  id: string;
  nombre: string;
}

interface HorarioDia {
  activo: boolean;
  apertura: string;
  cierre: string;
}

const DIAS_SEMANA = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];

const DIAS_LABELS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
};

export default function EmprendimientoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [googleMaps, setGoogleMaps] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenExistente, setImagenExistente] = useState<string | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [galeriaExistente, setGaleriaExistente] = useState<string[]>([]);
  const [horario, setHorario] = useState<Record<string, HorarioDia>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarCategorias = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('categorias')
        .select('id, nombre')
        .order('nombre');
      if (data) {
        setCategorias(data);
      }
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (id) {
      const cargarEmprendimiento = async () => {
        if (!supabase) return;
        const { data } = await supabase
          .from('emprendimientos')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setNombre(data.nombre);
          setSlug(data.slug);
          setDescripcion(data.descripcion || '');
          setCategoriaId(data.categoria_id);
          setWhatsapp(data.whatsapp || '');
          setGoogleMaps(data.google_maps || '');
          setImagenExistente(data.imagen_principal);
          setGaleriaExistente(data.galeria || []);
          if (data.horario && typeof data.horario === 'object') {
            setHorario(data.horario as Record<string, HorarioDia>);
          }
        }
        setCargando(false);
      };
      cargarEmprendimiento();
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
    const fileName = `emprendimientos/${Date.now()}_${file.name}`;
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

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = e.target.files;
    if (archivos) {
      const nuevosArchivos = Array.from(archivos);
      setGaleria((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  const removerGaleriaExistente = (index: number) => {
    setGaleriaExistente((prev) => prev.filter((_, i) => i !== index));
  };

  const removerGaleriaNueva = (index: number) => {
    setGaleria((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDia = (dia: string) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        activo: !prev[dia]?.activo,
        apertura: prev[dia]?.apertura || '09:00',
        cierre: prev[dia]?.cierre || '18:00',
      },
    }));
  };

  const actualizarHorario = (
    dia: string,
    campo: 'apertura' | 'cierre',
    valor: string
  ) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    let urlImagen = imagenExistente;
    if (imagen) {
      urlImagen = await subirImagen(imagen);
    }

    const urlsGaleria = [...galeriaExistente];
    for (const archivo of galeria) {
      const url = await subirImagen(archivo);
      if (url) urlsGaleria.push(url);
    }

    const horarioLimpio: Record<string, HorarioDia> = {};
    for (const dia of DIAS_SEMANA) {
      if (horario[dia]?.activo) {
        horarioLimpio[dia] = {
          activo: true,
          apertura: horario[dia].apertura,
          cierre: horario[dia].cierre,
        };
      }
    }

    const datos = {
      nombre,
      slug,
      descripcion: descripcion || null,
      categoria_id: categoriaId,
      whatsapp: whatsapp || null,
      google_maps: googleMaps || null,
      imagen_principal: urlImagen,
      galeria: urlsGaleria,
      horario: Object.keys(horarioLimpio).length > 0 ? horarioLimpio : null,
    };

    if (esEdicion && id) {
      await supabase?.from('emprendimientos').update(datos).eq('id', id);
    } else {
      await supabase?.from('emprendimientos').insert(datos);
    }

    setGuardando(false);
    navigate('/admin/emprendimientos');
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
        {esEdicion ? 'Editar emprendimiento' : 'Nuevo emprendimiento'}
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
            Categoría *
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
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
            WhatsApp
          </label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="59170123456"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps (iframe embed)
          </label>
          <textarea
            value={googleMaps}
            onChange={(e) => setGoogleMaps(e.target.value)}
            rows={3}
            placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen principal
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Galería de imágenes
          </label>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {galeriaExistente.map((url, index) => (
                <div key={`existente-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`Galería ${index + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removerGaleriaExistente(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {galeria.map((archivo, index) => (
                <div key={`nueva-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(archivo)}
                    alt={`Nueva ${index + 1}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removerGaleriaNueva(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
              <Plus className="h-4 w-4" />
              <span className="text-sm">Agregar imágenes</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGaleriaChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horario
          </label>
          <div className="space-y-3">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="flex items-center gap-4">
                <label className="flex items-center gap-2 w-32">
                  <input
                    type="checkbox"
                    checked={horario[dia]?.activo || false}
                    onChange={() => toggleDia(dia)}
                    className="rounded"
                  />
                  <span className="text-sm">{DIAS_LABELS[dia]}</span>
                </label>
                {horario[dia]?.activo && (
                  <>
                    <input
                      type="time"
                      value={horario[dia]?.apertura || '09:00'}
                      onChange={(e) =>
                        actualizarHorario(dia, 'apertura', e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="time"
                      value={horario[dia]?.cierre || '18:00'}
                      onChange={(e) =>
                        actualizarHorario(dia, 'cierre', e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </>
                )}
              </div>
            ))}
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
            onClick={() => navigate('/admin/emprendimientos')}
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

### App.tsx (modificaciones)

```tsx
// Agregar import
import EmprendimientosAdmin from './pages/admin/Emprendimientos';
import EmprendimientoForm from './pages/admin/EmprendimientoForm';

// Agregar rutas dentro del AdminLayout
<Route path="emprendimientos" element={<EmprendimientosAdmin />} />
<Route path="emprendimientos/nuevo" element={<EmprendimientoForm />} />
<Route path="emprendimientos/:id/editar" element={<EmprendimientoForm />} />
```

### e2e/admin-businesses.spec.ts

```ts
import { test, expect } from '@playwright/test';

test.describe('Admin Businesses', () => {
  test('businesses page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/emprendimientos');
    expect(response?.status()).toBeLessThan(500);
  });

  test('new business page is accessible', async ({ page }) => {
    const response = await page.goto('/admin/emprendimientos/nuevo');
    expect(response?.status()).toBeLessThan(500);
  });
});
```

## Commits

1. `feat(admin-businesses): add businesses CRUD` — Emprendimientos.tsx, EmprendimientoForm.tsx, App.tsx
2. `test(e2e): add admin businesses tests` — e2e/admin-businesses.spec.ts
3. `docs: add phase 9 plan` — docs/phases/phase-9-admin-businesses/plan.md

## Lessons to Follow

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming
- `.opencode/skills/learning-book/lessons/pitfalls.md` — No dev/preview servers, check git status
