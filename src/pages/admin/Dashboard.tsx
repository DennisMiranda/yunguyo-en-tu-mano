import { useAuth } from '../../lib/auth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Categorías
        </button>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Emprendimientos
        </button>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
