import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../lib/routes';
import logo from '../assets/logo.png';

const NAV_LINKS = [
  { label: 'Explorar', href: ROUTES.EXPLORAR },
  { label: 'Categorías', href: ROUTES.CATEGORIAS },

] as const;

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ubicacion = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src={logo} alt="Yunguyo en tu mano" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium ${
                  ubicacion.pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
          >
            {menuAbierto ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {menuAbierto && (
          <div className="md:hidden pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block py-2 text-sm font-medium ${
                  ubicacion.pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
