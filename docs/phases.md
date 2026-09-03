# Fases de Desarrollo - Yunguyo en tu mano

Cada fase incluye su feature y los tests e2e correspondientes. Playwright se configura primero como base.

---

## Fase 0: Setup de Playwright

**Objetivo:** Configurar el entorno de testing e2e antes de escribir código de la app.

**Tareas:**

- Instalar `@playwright/test`
- Crear `playwright.config.ts` ( baseURL, proyectos mobile/desktop, etc. )
- Crear estructura `tests/` con un test de smoke (`homepage.spec.ts`)
- Agregar scripts en `package.json`: `test`, `test:ui`, `test:headed`
- Verificar que el test de smoke pase (abrir `/`, verificar título)

**Tests e2e:**

- `tests/homepage.spec.ts` → la homepage carga correctamente
- `tests/navigation.spec.ts` → links del header responden (placeholder)

---

## Fase 1: Supabase + Modelo de datos + RLS

**Objetivo:** Configurar Supabase, crear tablas, relaciones y políticas de seguridad.

**Tareas:**

- Instalar `@supabase/supabase-js`
- Crear cliente Supabase (`src/lib/supabase.ts`)
- Crear migraciones: `categorias`, `emprendimientos`
- Configurar RLS:
  - Público: solo lectura
  - Admin: CRUD completo
- Crear datos demo (categorias + emprendimientos de ejemplo)
- Configurar Supabase Storage (buckets `categorias/`, `emprendimientos/`)

**Tests e2e:**

- `tests/supabase-connection.spec.ts` → verificar que Supabase responde (puede ser un health check básico)

---

## Fase 2: Auth + Login Admin

**Objetivo:** Autenticación de administradores con Supabase Auth.

**Tareas:**

- Configurar Supabase Auth (email/password)
- Crear página `/admin/login`
- Implementar protección de rutas admin
- Redirigir no autenticados al login
- Crear primer usuario admin (seed o migración)
- Logout funcional

**Tests e2e:**

- `tests/admin-login.spec.ts`:
  - Login con credenciales válidas → redirige a `/admin`
  - Login con credenciales inválidas → muestra error
  - Acceso a `/admin` sin sesión → redirige a login
  - Logout → vuelve al login

---

## Fase 3: Header + Navegación pública

**Objetivo:** Header responsive con navegación.

**Tareas:**

- Crear componente `Header` (desktop + mobile hamburger)
- Crear componente `Footer`
- Configurar rutas públicas: `/`, `/explorar`, `/categorias`, `/nosotros`
- Logo/link funciona como enlace a `/`

**Tests e2e:**

- `tests/navigation.spec.ts`:
  - Header muestra todos los links en desktop
  - Hamburger menu abre/cierra en mobile
  - Click en logo navega a `/`
  - Navegación entre rutas funciona

---

## Fase 4: Homepage

**Objetivo:** Página de inicio con hero, categorías y sección "Somos Yunguyo".

**Tareas:**

- Hero con buscador funcional (lleva a `/explorar?q=...`)
- Sección "Explora por categoría" (datos desde Supabase)
- Sección "Somos Yunguyo"
- Footer

**Tests e2e:**

- `tests/homepage.spec.ts`:
  - Hero se muestra correctamente
  - Buscador redirige a `/explorar` con query
  - Categorías se cargan dinámicamente
  - Footer se muestra

---

## Fase 5: Página Explorar + Búsqueda + Filtros

**Objetivo:** Página principal de descubrimiento con búsqueda y filtros.

**Tareas:**

- Página `/explorar`
- Buscador funcional (nombre, descripción, categoría)
- Filtros por categoría (generados dinámicamente)
- Cuadrícula responsive de tarjetas
- Mensaje cuando no hay resultados
- Botón limpiar filtros

**Tests e2e:**

- `tests/explore.spec.ts`:
  - Página carga con emprendimientos
  - Búsqueda filtra resultados
  - Filtro por categoría funciona
  - "Todas" muestra todo
  - Mensaje de no resultados aparece
  - Limpiar filtros resetea vista

---

## Fase 6: Página de Categoría

**Objetivo:** Detalle de categoría con sus emprendimientos.

**Tareas:**

- Página `/categoria/:id` (o slug)
- Mostrar imagen, nombre, descripción
- Listar emprendimientos de esa categoría
- Mensaje si no hay emprendimientos

**Tests e2e:**

- `tests/category.spec.ts`:
  - Categoría con emprendimientos muestra tarjetas
  - Categoría vacía muestra mensaje adecuado
  - Breadcrumb funciona (Categorías > Gastronomía)

---

## Fase 7: Detalle del Emprendimiento

**Objetivo:** Página de detalle completa.

**Tareas:**

- Página `/emprendimiento/:id` (o slug)
- Imagen principal
- Info: nombre, categoría, descripción
- Galería responsive
- Ubicación: iframe Google Maps + botón "Cómo llegar"
- Horario (si existe)
- Botón "Contactar por WhatsApp"
- Emprendimientos relacionados ("También te puede interesar")

**Tests e2e:**

- `tests/business-detail.spec.ts`:
  - Detalle muestra info correcta
  - Galería funciona
  - Mapa se muestra (iframe)
  - Botón WhatsApp tiene link correcto (`wa.me/...`)
  - Horario se muestra si existe
  - Emprendimientos relacionados aparecen

---

## Fase 8: Panel Admin - Categorías

**Objetivo:** CRUD de categorías en el admin.

**Tareas:**

- Página `/admin/categorias`
- Listado con imagen, nombre, descripción, count de emprendimientos
- Formulario crear/editar categoría
- Subir imagen a Supabase Storage
- Eliminar con confirmación
- Bloquear eliminación si tiene emprendimientos asociados

**Tests e2e:**

- `tests/admin-categories.spec.ts`:
  - Listado carga correctamente
  - Crear categoría nueva
  - Editar categoría existente
  - Eliminar categoría (confirmación)
  - No eliminar categoría con emprendimientos
  - Subir imagen funciona

---

## Fase 9: Panel Admin - Emprendimientos

**Objetivo:** CRUD de emprendimientos en el admin.

**Tareas:**

- Página `/admin/emprendimientos`
- Listado con imagen, nombre, categoría
- Formulario crear/editar
- Selector de categoría dinámico
- Upload imagen principal
- Upload galería múltiple
- Campo WhatsApp
- Campo Google Maps (textarea con validación)
- Gestión de horario (checkbox por día + apertura/cierre)
- Eliminar con confirmación

**Tests e2e:**

- `tests/admin-businesses.spec.ts`:
  - Listado carga correctamente
  - Crear emprendimiento nuevo
  - Editar emprendimiento existente
  - Subir imagen principal
  - Agregar/eliminar imágenes de galería
  - Configurar horario
  - Insertar código Google Maps
  - Eliminar emprendimiento (confirmación)
  - No crear sin categoría

---

## Fase 10: Panel Admin - Usuarios

**Objetivo:** Gestión de administradores.

**Tareas:**

- Página `/admin/usuarios`
- Listado de administradores
- Crear nuevo administrador
- Eliminar administrador
- No permitir eliminar el último admin

**Tests e2e:**

- `tests/admin-users.spec.ts`:
  - Listado muestra usuarios
  - Crear nuevo admin
  - Eliminar admin (confirmación)
  - No eliminar último admin

---

## Fase 11: SEO + Accesibilidad + Estados de carga

**Objetivo:** Pulir la app con SEO, accesibilidad y UX.

**Tareas:**

- Title dinámico por página
- Meta description dinámica
- Open Graph
- Skeletons en carga
- Mensajes de error amigables
- Estados vacíos
- Contraste adecuado
- Labels en formularios
- Focus states
- Alt en imágenes

**Tests e2e:**

- `tests/seo.spec.ts`:
  - Title dinámico en detalle de emprendimiento
  - Title dinámico en categoría
- `tests/accessibility.spec.ts`:
  - Imágenes tienen alt
  - Formularios tienen labels
  - Navegación por teclado funciona

---

## Fase 12: Datos Demo + Deploy

**Objetivo:** Poblar con datos reales de demo y preparar para deploy.

**Tareas:**

- Crear seed con datos demo
- Cargar imágenes representativas
- Verificar que todo funciona end-to-end
- Configurar variables de entorno
- Build de producción

**Tests e2e:**

- `tests/smoke.spec.ts`:
  - Flujo completo: homepage → explorar → categoría → detalle → WhatsApp
  - Login admin → crear categoría → crear emprendimiento → verificar en público

---

## Resumen de fases

| Fase | Feature                 | Tests e2e              |
| ---- | ----------------------- | ---------------------- |
| 0    | Setup Playwright        | smoke, navigation      |
| 1    | Supabase + Modelo datos | supabase-connection    |
| 2    | Auth + Login Admin      | admin-login            |
| 3    | Header + Navegación     | navigation             |
| 4    | Homepage                | homepage               |
| 5    | Explorar + Búsqueda     | explore                |
| 6    | Categoría               | category               |
| 7    | Detalle Emprendimiento  | business-detail        |
| 8    | Admin: Categorías       | admin-categories       |
| 9    | Admin: Emprendimientos  | admin-businesses       |
| 10   | Admin: Usuarios         | admin-users            |
| 11   | SEO + Accesibilidad     | seo, accessibility     |
| 12   | Datos Demo + Deploy     | smoke (flujo completo) |
