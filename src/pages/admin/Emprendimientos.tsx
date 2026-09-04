import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import yunguyoImg from '../../assets/yunguyo.jpg';
import TablaAdmin from '../../components/TablaAdmin';
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

const columnas = [
  { nombre: 'Imagen' },
  { nombre: 'Nombre' },
  { nombre: 'Categoría' },
  { nombre: 'WhatsApp' },
  { nombre: 'Acciones', align: 'right' as const },
];

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
      <div className="flex justify-between items-center md:gap-none gap-6">
        <h2 className="md:text-2xl text-xl font-bold text-gray-900">Emprendimientos</h2>
        <Link
          to="/admin/emprendimientos/nuevo"
          className="flex items-center gap-2 md:px-4 md:py-2 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo emprendimiento
        </Link>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {emprendimientos.map((emprendimiento) => (
          <div
            key={emprendimiento.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex gap-3 p-4">
              <img
                src={
                  emprendimiento.imagen_principal?.startsWith('http')
                    ? emprendimiento.imagen_principal
                    : yunguyoImg
                }
                alt={emprendimiento.nombre}
                className="h-16 w-16 rounded object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {emprendimiento.nombre}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {emprendimiento.categoria_nombre || 'Sin categoría'}
                </p>
                {emprendimiento.whatsapp && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    WA: {emprendimiento.whatsapp}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-3 pt-1 border-t border-gray-100">
              <Link
                to={`/admin/emprendimientos/${emprendimiento.id}/editar`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Link>
              <button
                type="button"
                onClick={() =>
                  handleEliminar(emprendimiento.id, emprendimiento.nombre)
                }
                disabled={eliminando === emprendimiento.id}
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
          {emprendimientos.map((emprendimiento) => (
            <tr key={emprendimiento.id}>
              <td className="px-6 py-4">
                {emprendimiento.imagen_principal && emprendimiento.imagen_principal.startsWith('http') ? (
                  <img
                    src={emprendimiento.imagen_principal}
                    alt={emprendimiento.nombre}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <img
                    src={yunguyoImg}
                    alt={emprendimiento.nombre}
                    className="h-12 w-12 rounded object-cover"
                  />
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
        </TablaAdmin>
      </div>

      {emprendimientos.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
          No hay emprendimientos. Crea uno nuevo para comenzar.
        </div>
      )}
    </div>
  );
}
