import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import TarjetaEmprendimiento from '../../components/TarjetaEmprendimiento';
import FiltrosCategorias from '../../components/FiltrosCategorias';
import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';

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

  useSEO(SEO.explorar);

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

    return coincideBusqueda;
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
