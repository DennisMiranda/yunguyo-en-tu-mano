import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Clock, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ROUTES } from '../../lib/routes';
import TarjetaEmprendimiento from '../../components/TarjetaEmprendimiento';

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  galeria: string[] | null;
  whatsapp: string | null;
  google_maps: string | null;
  google_maps_url: string | null;
  horario: Record<string, { abre: string; cierra: string } | null> | null;
  categoria_id: string;
  categorias: { nombre: string; slug: string } | null;
}

interface EmprendimientoRelacionado {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  categorias: { nombre: string } | null;
}

const DIAS_SEMANA = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
] as const;

export default function EmprendimientoDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const [emprendimiento, setEmprendimiento] = useState<Emprendimiento | null>(
    null
  );
  const [relacionados, setRelacionados] = useState<EmprendimientoRelacionado[]>(
    []
  );
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(
    null
  );
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!supabase || !slug) {
        setCargando(false);
        return;
      }

      const { data: emp } = await supabase
        .from('emprendimientos')
        .select(
          'id, nombre, slug, descripcion, imagen_principal, galeria, whatsapp, google_maps, google_maps_url, horario, categoria_id, categorias(nombre, slug)'
        )
        .eq('slug', slug)
        .single();

      if (emp) {
        const empData = emp as Emprendimiento;
        setEmprendimiento(empData);
        setImagenSeleccionada(empData.imagen_principal);

        const { data: rels } = await supabase
          .from('emprendimientos')
          .select(
            'id, nombre, slug, descripcion, imagen_principal, categorias(nombre)'
          )
          .eq('categoria_id', empData.categoria_id)
          .neq('id', empData.id)
          .limit(3);

        setRelacionados((rels || []) as EmprendimientoRelacionado[]);
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
            <div className="bg-gray-200 h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!emprendimiento) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Emprendimiento no encontrado
          </h1>
          <Link
            to={ROUTES.EXPLORAR}
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Volver a explorar
          </Link>
        </div>
      </div>
    );
  }

  const galeria = emprendimiento.galeria || [];
  const todasLasImagenes = [emprendimiento.imagen_principal, ...galeria].filter(
    Boolean
  ) as string[];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={ROUTES.EXPLORAR} className="hover:text-gray-900">
            Explorar
          </Link>
          <ChevronRight className="h-4 w-4" />
          {emprendimiento.categorias && (
            <>
              <Link
                to={`${ROUTES.CATEGORIAS}/${emprendimiento.categorias.slug}`}
                className="hover:text-gray-900"
              >
                {emprendimiento.categorias.nombre}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-gray-900 font-medium">
            {emprendimiento.nombre}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {imagenSeleccionada ? (
              <img
                src={imagenSeleccionada}
                alt={emprendimiento.nombre}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🏪</span>
              </div>
            )}

            {todasLasImagenes.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {todasLasImagenes.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImagenSeleccionada(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      imagenSeleccionada === img
                        ? 'ring-2 ring-blue-500'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${emprendimiento.nombre} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {emprendimiento.categorias && (
              <span className="text-sm font-medium text-blue-600 uppercase">
                {emprendimiento.categorias.nombre}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {emprendimiento.nombre}
            </h1>

            {emprendimiento.descripcion && (
              <p className="text-gray-600 mt-4">{emprendimiento.descripcion}</p>
            )}

            {emprendimiento.horario && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Horario</h3>
                </div>
                <div className="space-y-1 text-sm">
                  {DIAS_SEMANA.map((dia) => {
                    const horario = emprendimiento.horario?.[dia];
                    return (
                      <div key={dia} className="flex justify-between">
                        <span className="capitalize text-gray-600">{dia}</span>
                        <span className="text-gray-900">
                          {horario
                            ? `${horario.abre} - ${horario.cierra}`
                            : 'Cerrado'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {emprendimiento.whatsapp && (
                <a
                  href={`https://wa.me/${emprendimiento.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </a>
              )}

              {emprendimiento.google_maps_url && (
                <a
                  href={emprendimiento.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  <MapPin className="h-5 w-5" />
                  Cómo llegar
                </a>
              )}
            </div>

            {emprendimiento.google_maps && (
              <div
                className="mt-6 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: emprendimiento.google_maps }}
              />
            )}
          </div>
        </div>

        {relacionados.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionados.map((rel) => (
                <TarjetaEmprendimiento key={rel.id} emprendimiento={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
