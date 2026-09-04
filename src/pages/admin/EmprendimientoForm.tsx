import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Plus, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Json } from '../../lib/database.types';

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
          setDescripcion(data.descripcion || '');
          setCategoriaId(data.categoria_id);
          setWhatsapp(data.whatsapp || '');
          setGoogleMaps(data.google_maps || '');
          setImagenExistente(data.imagen_principal);
          setGaleriaExistente(data.galeria || []);
          if (data.horario && typeof data.horario === 'object') {
            const horarioLimpio: Record<string, HorarioDia> = {};
            const raw = data.horario as Record<string, HorarioDia>;
            for (const dia of DIAS_SEMANA) {
              if (raw[dia]?.activo) {
                horarioLimpio[dia] = raw[dia];
              }
            }
            setHorario(horarioLimpio);
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

  const convertirGoogleMapsAEmbed = (url: string): string => {
    if (!url) return '';

    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
    }

    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      const lat = qMatch[1];
      const lng = qMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
    }

    const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      const lat = llMatch[1];
      const lng = llMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
    }

    const centerMatch = url.match(/[?&]center=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (centerMatch) {
      const lat = centerMatch[1];
      const lng = centerMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d100!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`;
    }

    return '';
  };

  const handleGoogleMapsChange = (value: string) => {
    setGoogleMaps(value);
  };

  const urlEmbedGenerada = googleMaps ? convertirGoogleMapsAEmbed(googleMaps) : '';

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

    const slugGenerado = generarSlug(nombre);
    const mapaEmbed = convertirGoogleMapsAEmbed(googleMaps);

    const datos: {
      nombre: string;
      slug: string;
      descripcion: string | null;
      categoria_id: string;
      whatsapp: string | null;
      google_maps: string | null;
      imagen_principal: string | null;
      galeria: string[];
      horario: Json | null;
    } = {
      nombre,
      slug: slugGenerado,
      descripcion: descripcion || null,
      categoria_id: categoriaId,
      whatsapp: whatsapp || null,
      google_maps: mapaEmbed || googleMaps || null,
      imagen_principal: urlImagen,
      galeria: urlsGaleria,
      horario:
        Object.keys(horarioLimpio).length > 0
          ? (horarioLimpio as unknown as Json)
          : null,
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
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate('/admin/emprendimientos')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </button>
      </div>
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
            onChange={(e) => setNombre(e.target.value)}
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
            Google Maps
          </label>
          <input
            type="url"
            value={googleMaps}
            onChange={(e) => handleGoogleMapsChange(e.target.value)}
            placeholder="https://www.google.com/maps/place/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">
            Pegá el link de Google Maps del negocio
          </p>
          {urlEmbedGenerada && (
            <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={urlEmbedGenerada}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vista previa del mapa"
              />
            </div>
          )}
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
              <div key={dia} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
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
                  <div className="flex items-center gap-2 pl-7 md:pl-0">
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
                  </div>
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
