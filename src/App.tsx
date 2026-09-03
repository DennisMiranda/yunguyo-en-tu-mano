import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ROUTES } from './lib/routes';
import Layout from './components/Layout';
import Inicio from './pages/public/Inicio';
import Explorar from './pages/public/Explorar';
import EmprendimientoDetalle from './pages/public/EmprendimientoDetalle';
import Categorias from './pages/public/Categorias';
import CategoriaDetalle from './pages/public/CategoriaDetalle';
import Nosotros from './pages/public/Nosotros';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import CategoriasAdmin from './pages/admin/Categorias';
import CategoriaForm from './pages/admin/CategoriaForm';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Inicio />} />
            <Route path={ROUTES.EXPLORAR} element={<Explorar />} />
            <Route
              path={ROUTES.EMPRENDIMIENTO_DETALLE}
              element={<EmprendimientoDetalle />}
            />
            <Route path={ROUTES.CATEGORIAS} element={<Categorias />} />
            <Route
              path={ROUTES.CATEGORIA_DETALLE}
              element={<CategoriaDetalle />}
            />
            <Route path={ROUTES.NOSOTROS} element={<Nosotros />} />
          </Route>
          <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="categorias/nueva" element={<CategoriaForm />} />
            <Route path="categorias/:id/editar" element={<CategoriaForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
