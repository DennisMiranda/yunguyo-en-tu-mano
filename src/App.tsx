import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Layout from './components/Layout';
import Inicio from './pages/public/Inicio';
import Explorar from './pages/public/Explorar';
import Categorias from './pages/public/Categorias';
import Nosotros from './pages/public/Nosotros';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Inicio />} />
            <Route path={ROUTES.EXPLORAR} element={<Explorar />} />
            <Route path={ROUTES.CATEGORIAS} element={<Categorias />} />
            <Route path={ROUTES.NOSOTROS} element={<Nosotros />} />
          </Route>
          <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
