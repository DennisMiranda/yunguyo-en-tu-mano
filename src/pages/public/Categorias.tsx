import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';
import { useSEO } from '../../hooks/useSEO';
import { SEO } from '../../lib/seo';
import { ArrowLeft } from 'lucide-react';
import { 
  ShoppingBag, 
  Compass, 
  Utensils, 
  Palette, 
  Wrench, 
  Smartphone, 
  ShoppingBasket, 
  Sparkles, 
  Home, 
  Printer, 
  Speaker,
  ArrowRight 
} from 'lucide-react';

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

  // Paleta de colores cíclica
  const categoryColors = [
    'var(--category-color-0)',
    'var(--category-color-1)',
    'var(--category-color-2)',
    'var(--category-color-3)',
    'var(--category-color-4)',
    'var(--category-color-5)',
    'var(--category-color-6)',
  ];

  // Función para obtener color cíclicamente
  const getCategoryColor = (index: number) => {
    return categoryColors[index % categoryColors.length];
  };

  // Mapeo de iconos basado en el nombre de la categoría
  const getCategoryIcon = (nombre: string) => {
    const lowerName = nombre.toLowerCase();
    if (lowerName.includes('ropa') || lowerName.includes('accesorios')) return ShoppingBag;
    if (lowerName.includes('turismo')) return Compass;
    if (lowerName.includes('gastronom') || lowerName.includes('comida')) return Utensils;
    if (lowerName.includes('artesan')) return Palette;
    if (lowerName.includes('servicio')) return Wrench;
    if (lowerName.includes('tecnolog') || lowerName.includes('tec')) return Smartphone;
    if (lowerName.includes('producto') || lowerName.includes('local')) return ShoppingBasket;
    if (lowerName.includes('belleza') || lowerName.includes('cuidado')) return Sparkles;
    if (lowerName.includes('hogar')) return Home;
    if (lowerName.includes('imprent') || lowerName.includes('librer')) return Printer;
    if (lowerName.includes('evento') || lowerName.includes('sonido')) return Speaker;
    return ShoppingBag; // Icono por defecto
  };

  // Descripciones para las categorías
  const getCategoryDescription = (nombre: string) => {
    const lowerName = nombre.toLowerCase();
    if (lowerName.includes('ropa') || lowerName.includes('accesorios')) return 'Prendas, tejidos de alpaca y moda artesanal.';
    if (lowerName.includes('turismo')) return 'Lanchas y miradores.';
    if (lowerName.includes('gastronom') || lowerName.includes('comida')) return 'Trucha fresca y café.';
    if (lowerName.includes('artesan')) return 'Cerámica y filigrana.';
    if (lowerName.includes('servicio')) return 'Talleres y soporte.';
    if (lowerName.includes('tecnolog') || lowerName.includes('tec')) return 'Equipos y conectividad.';
    if (lowerName.includes('producto') || lowerName.includes('local')) return 'Quinua, quesos y miel.';
    if (lowerName.includes('belleza') || lowerName.includes('cuidado')) return 'Cosmética y bienestar.';
    if (lowerName.includes('hogar')) return 'Muebles y decoración.';
    if (lowerName.includes('imprent') || lowerName.includes('librer')) return 'Útiles y copias.';
    if (lowerName.includes('evento') || lowerName.includes('sonido')) return 'Música y fiestas.';
    return 'Explora esta categoría.';
  };

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
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
        <p className="text-gray-600 mb-6">
          Encuentra algo que te guste, cerca de ti.
        </p>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-40 rounded-lg"
              />
            ))}
          </div>
        ) : categorias.length === 0 ? (
          <p className="text-gray-600">No hay categorías disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categorias.map((categoria, index) => {
              const Icon = getCategoryIcon(categoria.nombre);
              const color = getCategoryColor(index);
              const description = getCategoryDescription(categoria.nombre);
              
              return (
                <Link
                  key={categoria.id}
                  to={`${ROUTES.CATEGORIAS}/${categoria.slug}`}
                  className="group relative rounded-lg overflow-hidden min-h-[180px]"
                  style={{ backgroundColor: color }}
                >
                  <div className="p-6 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {categoria.nombre}
                      </h3>
                      <p className="text-sm text-white/80">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
}
