export const ROUTES = {
  HOME: '/',
  EXPLORAR: '/explorar',
  EMPRENDIMIENTO_DETALLE: '/explorar/:slug',
  CATEGORIAS: '/categorias',
  CATEGORIA_DETALLE: '/categorias/:slug',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_CATEGORIAS: '/admin/categorias',
  ADMIN_EMPRENDIMIENTOS: '/admin/emprendimientos',
  ADMIN_USUARIOS: '/admin/usuarios',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
