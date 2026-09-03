import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';
import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';
import yunguyoImg from '../../assets/yunguyo.jpg';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  imagen: string | null;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  useSEO(SEO.categorias);

  useEffect(() => {
    const cargarCategorias = async () => {
      if (!supabase) {
        setCargando(false);
        return;
      }

      const { data } = await supabase
        .from('categorias')
        .select('id, nombre, slug, imagen')
        .order('nombre');

      setCategorias(data || []);
      setCargando(false);
    };

    cargarCategorias();
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Categorías</h1>

        {cargando ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-32 rounded-lg"
              />
            ))}
          </div>
        ) : categorias.length === 0 ? (
          <p className="text-gray-600">No hay categorías disponibles</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`${ROUTES.CATEGORIAS}/${categoria.slug}`}
                className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                {categoria.imagen ? (
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <img
                    src={yunguyoImg}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <span className="w-full text-center text-white font-medium p-3">
                    {categoria.nombre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
