import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function CategoriaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (id) {
      const cargarCategoria = async () => {
        if (!supabase) return;
        const { data } = await supabase
          .from('categorias')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setNombre(data.nombre);
          setDescripcion(data.descripcion || '');
        }
        setCargando(false);
      };
      cargarCategoria();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const slugGenerado = generarSlug(nombre);

    if (esEdicion && id) {
      await supabase
        ?.from('categorias')
        .update({
          nombre,
          slug: slugGenerado,
          descripcion: descripcion || null,
        })
        .eq('id', id);
    } else {
      await supabase?.from('categorias').insert({
        nombre,
        slug: slugGenerado,
        descripcion: descripcion || null,
      });
    }

    setGuardando(false);
    navigate('/admin/categorias');
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
        {esEdicion ? 'Editar categoría' : 'Nueva categoría'}
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
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            onClick={() => navigate('/admin/categorias')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
