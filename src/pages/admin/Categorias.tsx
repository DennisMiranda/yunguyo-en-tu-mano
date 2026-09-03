import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import yunguyoImg from '../../assets/yunguyo.jpg';
import TablaAdmin from '../../components/TablaAdmin';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  emprendimientos_count?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = any;

const columnas = [
  { nombre: 'Imagen' },
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
      imagen: cat.imagen,
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

      <TablaAdmin columnas={columnas}>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td className="px-6 py-4">
              {categoria.imagen && categoria.imagen.startsWith('http') ? (
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="h-12 w-12 rounded object-cover"
                />
              ) : (
                <img
                  src={yunguyoImg}
                  alt={categoria.nombre}
                  className="h-12 w-12 rounded object-cover"
                />
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
      </TablaAdmin>

      {categorias.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
          No hay categorías. Crea una nueva para comenzar.
        </div>
      )}
    </div>
  );
}
