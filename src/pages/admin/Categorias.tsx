import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TablaAdmin from '../../components/TablaAdmin';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  emprendimientos_count?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = any;

const columnas = [
  { nombre: 'Nombre' },
  { nombre: 'Descripción' },
  { nombre: 'Emprendimientos' },
  { nombre: 'Acciones', align: 'right' as const },
];

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

    const categoriasConCount = (data || []).map((cat: SupabaseRow) => ({
      id: cat.id,
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion,
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
    <div className="space-y-4">
      <div className="pb-2">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </Link>
      </div>
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

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="bg-white rounded-lg shadow-sm p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {categoria.nombre}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {categoria.descripcion || 'Sin descripción'}
                </p>
              </div>
              <span className="ml-3 shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {categoria.emprendimientos_count || 0} emprendimientos
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
              <Link
                to={`/admin/categorias/${categoria.id}/editar`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Link>
              <button
                type="button"
                onClick={() =>
                  handleEliminar(categoria.id, categoria.nombre)
                }
                disabled={eliminando === categoria.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <TablaAdmin columnas={columnas}>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
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
        </TablaAdmin>
      </div>

      {categorias.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
          No hay categorías. Crea una nueva para comenzar.
        </div>
      )}
    </div>
  );
}
