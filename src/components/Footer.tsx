import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/routes';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">© 2026 Yunguyo en tu mano</div>
          <nav className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to={ROUTES.EXPLORAR}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Explorar
            </Link>
            <Link
              to={ROUTES.CATEGORIAS}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Categorías
            </Link>

          </nav>
        </div>
      </div>
    </footer>
  );
}
