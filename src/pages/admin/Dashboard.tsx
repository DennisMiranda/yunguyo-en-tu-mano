import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Briefcase } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [categoriasCount, setCategoriasCount] = useState(0);
  const [emprendimientosCount, setEmprendimientosCount] = useState(0);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      if (!supabase) return;

      const [catRes, empRes] = await Promise.all([
        supabase.from('categorias').select('id', { count: 'exact', head: true }),
        supabase.from('emprendimientos').select('id', { count: 'exact', head: true }),
      ]);

      setCategoriasCount(catRes.count || 0);
      setEmprendimientosCount(empRes.count || 0);
    };

    cargarEstadisticas();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/admin/categorias')}
          className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="p-3 bg-blue-100 rounded-lg">
            <Folder className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{categoriasCount}</p>
            <p className="text-sm text-gray-600">Categorías</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin/emprendimientos')}
          className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="p-3 bg-green-100 rounded-lg">
            <Briefcase className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{emprendimientosCount}</p>
            <p className="text-sm text-gray-600">Emprendimientos</p>
          </div>
        </button>
      </div>

      <button
        onClick={signOut}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
