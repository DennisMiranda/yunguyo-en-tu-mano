import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';
import TarjetaEmprendimiento from '../../components/TarjetaEmprendimiento';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
}

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
}

export default function CategoriaDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase || !slug) {
        setCargando(false);
        return;
      }

      const { data: cat } = await supabase
        .from('categorias')
        .select('id, nombre, slug, descripcion, imagen')
        .eq('slug', slug)
        .single();

      if (cat) {
        setCategoria(cat as Categoria);
        const catId = (cat as Categoria).id;
        const { data: emps } = await supabase
          .from('emprendimientos')
          .select('id, nombre, slug, descripcion, imagen_principal')
          .eq('categoria_id', catId)
          .order('nombre');

        setEmprendimientos(emps || []);
      }

      setCargando(false);
    };

    cargarDatos();
  }, [slug]);

  if (cargando) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-64 rounded" />
            <div className="bg-gray-200 h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!categoria) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Categoría no encontrada
          </h1>
          <Link
            to={ROUTES.CATEGORIAS}
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Volver a categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={ROUTES.CATEGORIAS} className="hover:text-gray-900">
            Categorías
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{categoria.nombre}</span>
        </nav>

        {categoria.imagen && (
          <div className="mb-6">
            <img
              src={categoria.imagen}
              alt={categoria.nombre}
              className="w-full h-48 md:h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoria.nombre}
        </h1>

        {categoria.descripcion && (
          <p className="text-gray-600 mb-8">{categoria.descripcion}</p>
        )}

        {emprendimientos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay emprendimientos en esta categoría
            </p>
            <Link
              to={ROUTES.EXPLORAR}
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              Explorar todos los emprendimientos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprendimientos.map((emprendimiento) => (
              <TarjetaEmprendimiento
                key={emprendimiento.id}
                emprendimiento={{
                  ...emprendimiento,
                  categorias: { nombre: categoria.nombre },
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
