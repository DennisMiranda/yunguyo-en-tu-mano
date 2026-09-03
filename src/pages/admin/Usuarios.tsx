import { useEffect, useState } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Usuario {
  id: string;
  email: string;
  role: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = any;

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [creando, setCreando] = useState(false);

  const cargarUsuarios = async () => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at');

    if (data) {
      const usuariosConEmail = data.map((u: SupabaseRow) => ({
        id: u.id,
        email: u.user_id,
        role: u.role,
      }));
      setUsuarios(usuariosConEmail);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEmail || !nuevaPassword) return;

    setCreando(true);

    const resultado = await supabase?.auth.admin.createUser({
      email: nuevoEmail,
      password: nuevaPassword,
      email_confirm: true,
    });

    if (resultado?.data?.user && !resultado?.error) {
      await supabase?.from('user_roles').insert({
        user_id: resultado.data.user.id,
        role: 'admin',
      });
      setNuevoEmail('');
      setNuevaPassword('');
      await cargarUsuarios();
    }

    setCreando(false);
  };

  const handleEliminar = async (id: string, email: string) => {
    if (usuarios.length <= 1) {
      alert('No se puede eliminar el último administrador');
      return;
    }

    if (!confirm(`¿Eliminar al administrador "${email}"?`)) {
      return;
    }

    setEliminando(id);
    await supabase?.from('user_roles').delete().eq('id', id);
    await cargarUsuarios();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Administradores</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Nuevo administrador
        </h3>
        <form onSubmit={handleCrear} className="flex gap-4">
          <input
            type="email"
            value={nuevoEmail}
            onChange={(e) => setNuevoEmail(e.target.value)}
            placeholder="admin@ejemplo.com"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Contraseña"
            required
            minLength={6}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={creando}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {creando ? 'Creando...' : 'Crear'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {usuario.email}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {usuario.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleEliminar(usuario.id, usuario.email)}
                    disabled={eliminando === usuario.id || usuarios.length <= 1}
                    className="inline-flex items-center p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            No hay administradores registrados.
          </div>
        )}
      </div>
    </div>
  );
}
