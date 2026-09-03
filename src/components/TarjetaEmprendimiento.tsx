import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

interface Emprendimiento {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_principal: string | null;
  categorias: { nombre: string } | null;
}

interface Props {
  emprendimiento: Emprendimiento;
}

export default function TarjetaEmprendimiento({ emprendimiento }: Props) {
  return (
    <Link
      to={`${ROUTES.EXPLORAR}/${emprendimiento.slug}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {emprendimiento.imagen_principal ? (
        <img
          src={emprendimiento.imagen_principal}
          alt={emprendimiento.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
      )}
      <div className="p-4">
        {emprendimiento.categorias && (
          <span className="text-xs font-medium text-blue-600 uppercase">
            {emprendimiento.categorias.nombre}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mt-1">
          {emprendimiento.nombre}
        </h3>
        {emprendimiento.descripcion && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {emprendimiento.descripcion}
          </p>
        )}
      </div>
    </Link>
  );
}
