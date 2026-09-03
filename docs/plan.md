# Proyecto: Yunguyo en tu mano

Construye una aplicación web moderna, responsive y funcional llamada **“Yunguyo en tu mano”**.

El objetivo del sitio es crear un directorio digital de emprendimientos de **Yunguyo, Puno, Perú**, donde las personas puedan descubrir negocios y emprendimientos locales por categoría, buscar información y acceder fácilmente a su ubicación y WhatsApp.

La aplicación debe tener dos partes claramente separadas:

1. **Sitio público**, destinado a visitantes.
2. **Panel administrativo**, destinado exclusivamente a administradores.

Utiliza **Supabase** como backend principal:

- PostgreSQL para los datos.
- Supabase Storage para las imágenes.
- Supabase Auth para autenticación de administradores.

No utilices datos estáticos como fuente principal de información. Las categorías y emprendimientos deben cargarse desde Supabase.

---

# 1. Objetivo y filosofía del producto

La experiencia principal debe ser:

**Buscar → Filtrar → Explorar → Ver detalle → Contactar**

El sitio debe sentirse como un directorio local moderno y amigable, no como una página gubernamental ni como un portal corporativo.

Prioriza:

- simplicidad;
- rapidez;
- legibilidad;
- fotografías;
- navegación intuitiva;
- diseño mobile-first;
- facilidad de administración.

Evita funcionalidades innecesarias.

No implementar:

- sistema de registro público para emprendimientos;
- perfiles públicos de usuarios;
- sistema de reseñas;
- ratings;
- favoritos;
- carrito;
- pagos;
- noticias;
- eventos;
- dashboard con estadísticas;
- sistema de solicitudes;
- workflow de aprobación;
- formularios de contacto;
- redes sociales de cada emprendimiento.

---

# 2. Stack

Utiliza:

- React + TypeScript.
- Tailwind CSS.
- Componentes reutilizables.
- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Storage.

Mantén una arquitectura limpia y sencilla.

Las propiedades utilizadas en el código y modelo de datos deben estar en español.

---

# 3. Modelo de datos

Crear las siguientes tablas principales.

## Tabla: categorias

Campos:

```text
id
nombre
descripcion
imagen
```

Tipos recomendados:

```text
id          bigint / uuid
nombre      text
descripcion text
imagen      text
```

`nombre` es obligatorio.

`descripcion` puede ser opcional.

`imagen` contiene la referencia o URL de la imagen almacenada en Supabase Storage.

---

## Tabla: emprendimientos

Campos:

```text
id
nombre
categoria_id
descripcion
imagen_principal
galeria
whatsapp
google_maps
horario
```

Tipos recomendados:

```text
id                  bigint / uuid
nombre              text
categoria_id        foreign key
descripcion         text
imagen_principal    text
galeria             text[]
whatsapp             text
google_maps          text
horario             jsonb
```

Crear una relación:

```text
categorias.id
      │
      │ 1:N
      ▼
emprendimientos.categoria_id
```

No duplicar el nombre de la categoría dentro del emprendimiento.

El emprendimiento debe referenciar la categoría mediante `categoria_id`.

---

# 4. Horario

El horario es opcional.

Debe almacenarse como JSON estructurado.

Utilizar una estructura sencilla por día:

```json
{
  "lunes": {
    "activo": true,
    "abre": "09:00",
    "cierra": "18:00"
  },
  "martes": {
    "activo": true,
    "abre": "09:00",
    "cierra": "18:00"
  },
  "miercoles": {
    "activo": false
  },
  "jueves": {
    "activo": true,
    "abre": "09:00",
    "cierra": "18:00"
  },
  "viernes": {
    "activo": true,
    "abre": "09:00",
    "cierra": "18:00"
  },
  "sabado": {
    "activo": true,
    "abre": "10:00",
    "cierra": "16:00"
  },
  "domingo": {
    "activo": false
  }
}
```

El administrador debe poder marcar cada día como:

- Abierto.
- Cerrado.

Si el horario no existe o está vacío, no mostrar la sección de horario públicamente.

---

# 5. Google Maps

Cada emprendimiento debe poder mostrar un mapa directamente dentro de su página de detalle.

No utilizar Google Maps API.

El administrador podrá introducir el código de inserción de Google Maps generado mediante la opción **“Compartir → Insertar un mapa”** de Google Maps.

Guardar el código de inserción en:

```text
google_maps
```

En el frontend:

- validar/sanitizar el contenido;
- permitir únicamente contenido seguro de tipo iframe de Google Maps;
- no ejecutar HTML arbitrario;
- mostrar el mapa de forma responsive.

El mapa debe aparecer en la sección:

**Ubicación**

Debajo del mapa mostrar un botón:

**Cómo llegar en Google Maps**

Si es posible obtener una URL navegable a partir de la información proporcionada, utilizarla para el botón. Si no es posible, permitir almacenar también la URL de navegación si resulta necesario.

El mapa debe tener una proporción adecuada en desktop y móvil.

Utilizar `loading="lazy"`.

---

# 6. WhatsApp

Cada emprendimiento tendrá solamente un contacto de WhatsApp.

Campo:

```text
whatsapp
```

No crear campos separados para:

- teléfono;
- correo;
- Instagram;
- Facebook;
- página web.

En la página de detalle mostrar un botón destacado:

**Contactar por WhatsApp**

El enlace debe utilizar el formato adecuado de WhatsApp, por ejemplo:

```text
https://wa.me/NUMERO
```

El número almacenado debe poder limpiarse/formatearse correctamente para generar el enlace.

---

# 7. Supabase Storage

Utilizar Supabase Storage para todas las imágenes.

Crear una estructura lógica como:

```text
imagenes/
├── categorias/
└── emprendimientos/
```

Las categorías tendrán:

- una imagen.

Los emprendimientos tendrán:

- una imagen principal;
- varias imágenes para la galería.

El administrador debe poder:

- subir imágenes;
- reemplazar imágenes;
- eliminar imágenes;
- seleccionar una imagen principal;
- subir múltiples imágenes para la galería.

No guardar archivos binarios dentro de PostgreSQL.

Guardar únicamente las URLs o referencias necesarias.

Utilizar carga diferida (`lazy loading`) para imágenes que no estén inmediatamente visibles.

Las imágenes deben tener `alt` descriptivo.

---

# 8. Autenticación

Utilizar **Supabase Auth**.

No permitir registro público.

Los visitantes no necesitan una cuenta.

Solamente los administradores tendrán acceso al panel `/admin`.

El acceso debe ser mediante:

- correo electrónico;
- contraseña.

Proteger todas las rutas administrativas.

Si un usuario no autenticado intenta acceder a `/admin`, redirigirlo al login.

---

# 9. Usuarios administradores

El sistema debe permitir que los administradores gestionen cuentas administrativas.

No necesitamos roles complejos.

Inicialmente basta con un concepto simple de usuario administrador.

En el panel administrativo debe existir una sección:

**Usuarios**

Permitir:

- visualizar administradores;
- crear nuevos administradores;
- eliminar/desactivar administradores.

No permitir que usuarios públicos creen cuentas.

No crear perfiles públicos.

---

# 10. Sitio público

Crear las siguientes rutas:

```text
/
 /explorar
 /categorias
 /categoria/:id
 /emprendimiento/:id
 /nosotros
```

Las URLs deben ser amigables.

Si es posible, utilizar slugs para categorías y emprendimientos.

Ejemplo:

```text
/categoria/gastronomia
/emprendimiento/restaurante-el-lago
```

En lugar de depender únicamente de IDs visibles en las URLs.

---

# 11. Header

Crear un header responsive.

Desktop:

```text
Yunguyo en tu mano

Inicio
Explorar
Categorías
Nosotros
```

En móvil utilizar navegación compacta/hamburger menu.

El nombre/logo debe funcionar como enlace hacia `/`.

El header debe permanecer limpio y no ocupar demasiado espacio.

---

# 12. Página de inicio

La homepage debe ser visual, sencilla y orientada a descubrir emprendimientos.

Estructura:

## Header

Navegación principal.

## Hero

Utilizar una fotografía atractiva y representativa de Yunguyo/Puno/Lago Titicaca.

Mostrar:

### Descubre Yunguyo

Texto:

“Encuentra emprendimientos, sabores, productos y experiencias locales.”

Incluir un buscador grande y visible:

```text
¿Qué estás buscando?
```

El buscador debe ser funcional y llevar a `/explorar` con el término buscado.

No utilizar demasiado texto sobre la fotografía.

---

# 13. Categorías en homepage

Mostrar una sección:

### Explora por categoría

Las categorías deben venir dinámicamente desde Supabase.

No hardcodear las categorías.

Las categorías iniciales de demostración son:

- Turismo
- Gastronomía
- Artesanía
- Productos
- Servicios

Pero deben ser completamente dinámicas.

Si el administrador crea una nueva categoría, esta debe aparecer automáticamente en el sitio público.

Cada tarjeta de categoría debe incluir:

- imagen;
- nombre;
- descripción corta;
- icono sutil;
- botón/enlace “Explorar”.

Las tarjetas deben ser grandes, visuales y fáciles de tocar en móvil.

No mostrar una lista de emprendimientos individuales en esta sección.

---

# 14. Sección “Somos Yunguyo”

Agregar una sección breve de identidad/comunidad.

Título:

**Somos Yunguyo**

Transmitir la idea de:

- comunidad;
- talento local;
- emprendimientos;
- cultura;
- productos;
- gastronomía;
- turismo.

Mantenerla breve y visual.

No convertirla en una página institucional extensa.

---

# 15. Footer

Footer sencillo.

Incluir:

- nombre “Yunguyo en tu mano”;
- breve descripción;
- navegación principal;
- copyright.

No agregar enlaces sociales si no son necesarios.

---

# 16. Página Explorar

Ruta:

```text
/explorar
```

Esta será la principal página de descubrimiento.

Mostrar:

### Explorar emprendimientos

Buscador:

```text
Buscar emprendimiento...
```

Filtros por categoría.

Inicialmente:

```text
Todas
Turismo
Gastronomía
Artesanía
Productos
Servicios
```

Pero los filtros deben generarse dinámicamente desde la tabla `categorias`.

Mostrar los emprendimientos en una cuadrícula responsive.

Desktop:

```text
3 o 4 columnas
```

Tablet:

```text
2 columnas
```

Móvil:

```text
1 columna
```

Cada tarjeta debe mostrar:

- imagen principal;
- categoría;
- nombre;
- descripción corta;
- enlace “Ver emprendimiento”.

---

# 17. Búsqueda

La búsqueda debe ser funcional.

Buscar al menos por:

- nombre del emprendimiento;
- descripción;
- categoría.

La búsqueda debe actualizar los resultados sin necesidad de recargar toda la página.

Mostrar un mensaje cuando no existan resultados:

**No encontramos emprendimientos que coincidan con tu búsqueda.**

Ofrecer la posibilidad de limpiar los filtros.

---

# 18. Página de categoría

Ruta:

```text
/categoria/:id
```

Mostrar:

- imagen de la categoría;
- nombre;
- descripción;
- emprendimientos pertenecientes a ella.

Ejemplo:

```text
Gastronomía

Descubre los sabores y restaurantes de Yunguyo.

[ tarjetas de emprendimientos ]
```

Si una categoría no tiene emprendimientos:

**Aún no hay emprendimientos en esta categoría.**

No ocultar la categoría.

---

# 19. Detalle del emprendimiento

Ruta:

```text
/emprendimiento/:id
```

Esta página debe ser visual pero sencilla.

Orden recomendado:

## Imagen principal

Imagen grande y atractiva.

## Información

Mostrar:

- nombre;
- categoría;
- descripción.

## Galería

Mostrar todas las imágenes adicionales.

Utilizar una galería responsive.

En móvil debe ser fácil deslizar o abrir imágenes.

## Ubicación

Título:

**Ubicación**

Mostrar el mapa de Google Maps mediante el iframe configurado por el administrador.

El mapa debe ocupar un ancho adecuado y ser responsive.

Debajo:

**Cómo llegar en Google Maps**

## Horario

Mostrar solamente si existe información.

Ejemplo:

```text
Lunes       09:00 – 18:00
Martes      09:00 – 18:00
Miércoles   Cerrado
...
```

## WhatsApp

Mostrar un botón destacado:

**Contactar por WhatsApp**

El objetivo es que el usuario pueda contactar rápidamente al emprendimiento.

---

# 20. Emprendimientos relacionados

Opcionalmente, al final del detalle mostrar:

### También te puede interesar

Mostrar algunos emprendimientos de la misma categoría.

No mostrar el propio emprendimiento.

Mantener esta sección sencilla.

---

# 21. Panel administrativo

Ruta:

```text
/admin
```

Debe estar completamente separada visualmente del sitio público.

El administrador debe poder gestionar únicamente:

```text
Categorías
Emprendimientos
Usuarios
```

No crear dashboard complejo.

---

# 22. Login administrativo

Ruta:

```text
/admin/login
```

Diseño limpio:

```text
Yunguyo en tu mano

Acceso administrativo

Correo
[________________]

Contraseña
[________________]

[ Iniciar sesión ]
```

Mostrar errores de autenticación de manera clara.

Una vez autenticado:

```text
/admin
```

---

# 23. Gestión de categorías

Ruta:

```text
/admin/categorias
```

Mostrar listado.

Cada categoría debe mostrar:

- imagen;
- nombre;
- descripción;
- cantidad de emprendimientos;
- editar;
- eliminar.

Botón:

**+ Nueva categoría**

Formulario:

```text
Nombre
Descripción
Imagen
```

Permitir:

- crear;
- editar;
- eliminar.

Antes de eliminar una categoría, comprobar si existen emprendimientos relacionados.

Si tiene emprendimientos asociados, impedir la eliminación y mostrar un mensaje claro:

“Esta categoría tiene emprendimientos asociados. Reasigna los emprendimientos antes de eliminarla.”

---

# 24. Gestión de emprendimientos

Ruta:

```text
/admin/emprendimientos
```

Mostrar listado con:

- imagen;
- nombre;
- categoría;
- editar;
- eliminar.

Agregar:

**+ Nuevo emprendimiento**

Formulario:

```text
Nombre

Categoría

Descripción

Imagen principal

Galería

WhatsApp

Código de inserción de Google Maps

Horario
```

La categoría debe ser un selector cargado dinámicamente desde Supabase.

No permitir crear un emprendimiento sin categoría.

---

# 25. Subida de imágenes

En el formulario de emprendimiento:

### Imagen principal

Permitir seleccionar y subir una imagen.

### Galería

Permitir seleccionar múltiples imágenes.

Mostrar previews antes de guardar.

Permitir eliminar imágenes individualmente.

Al editar un emprendimiento:

- mostrar imágenes existentes;
- permitir eliminar;
- permitir agregar nuevas.

Las imágenes deben almacenarse en Supabase Storage.

---

# 26. Código de Google Maps

En el formulario administrativo mostrar:

### Código de inserción de Google Maps

Campo tipo textarea.

Añadir una pequeña ayuda:

“En Google Maps selecciona Compartir → Insertar un mapa → copia el código y pégalo aquí.”

Validar que el contenido corresponda a un iframe permitido de Google Maps.

Nunca renderizar HTML arbitrario sin sanitización.

---

# 27. Gestión de horario

En el formulario:

```text
Horario

☐ Lunes
    Apertura [09:00]
    Cierre   [18:00]

☐ Martes
    Apertura [09:00]
    Cierre   [18:00]

...
```

Si el día está desactivado, mostrar:

**Cerrado**

El horario debe ser opcional.

---

# 28. Gestión de usuarios

Ruta:

```text
/admin/usuarios
```

Mostrar usuarios administradores.

Permitir crear y eliminar usuarios.

No crear roles innecesarios.

El panel debe permanecer simple.

---

# 29. Seguridad Supabase

Implementar correctamente Row Level Security.

Reglas generales:

### Público

Puede:

- leer categorías;
- leer emprendimientos.

No puede:

- insertar;
- modificar;
- eliminar.

### Administradores autenticados

Pueden:

- crear categorías;
- modificar categorías;
- eliminar categorías;
- crear emprendimientos;
- modificar emprendimientos;
- eliminar emprendimientos;
- gestionar contenido administrativo.

Proteger también Storage mediante políticas adecuadas.

No exponer claves privadas de Supabase en el frontend.

Utilizar únicamente las variables públicas necesarias para Supabase.

---

# 30. Datos demo

No existen todavía datos reales.

Crear datos ficticios de demostración para poder visualizar el sitio.

Los datos deben dejar claro que son ejemplos/demostración y no información real.

Crear varios emprendimientos distribuidos entre las categorías iniciales.

Ejemplos de nombres ficticios:

- Restaurante El Lago
- Sabores del Altiplano
- Artesanías Titicaca
- Textiles Yunguyo
- Productos del Altiplano
- Turismo Andino Yunguyo

Utilizar imágenes representativas de:

- Lago Titicaca;
- gastronomía local;
- trucha;
- textiles andinos;
- artesanía;
- productos locales;
- paisajes de Yunguyo/Puno.

No presentar información ficticia como negocios reales.

---

# 31. Identidad visual

La estética debe ser:

**moderna + local + amigable + cultural**

No debe parecer:

- portal gubernamental;
- página corporativa;
- agencia turística genérica.

## Colores

Usar principalmente:

- azul profundo;
- azul claro;
- turquesa;
- naranja cálido;
- blanco;
- gris claro.

Utilizar magenta/fucsia solamente como acento muy puntual.

No utilizar todos los colores simultáneamente de forma intensa.

El azul y blanco deben dominar la interfaz.

---

# 32. Tipografía

Utilizar una tipografía sans-serif moderna y altamente legible.

Preferencia:

- Inter;
- Manrope.

Utilizar una jerarquía tipográfica clara.

Los títulos deben ser grandes y fáciles de leer.

No utilizar tipografías decorativas difíciles de leer.

---

# 33. Diseño

Características:

- bordes redondeados;
- tarjetas grandes;
- fotografías protagonistas;
- sombras suaves;
- mucho espacio en blanco;
- jerarquía visual clara;
- botones fácilmente identificables;
- iconografía sencilla.

Evitar:

- exceso de gradientes;
- glassmorphism;
- animaciones excesivas;
- sombras exageradas;
- patrones culturales en todas las secciones;
- demasiados elementos decorativos.

La identidad cultural debe transmitirse principalmente mediante fotografías, colores y detalles visuales sutiles.

---

# 34. Responsive

Diseñar primero pensando en móvil.

Breakpoints:

```text
Mobile
Tablet
Desktop
```

Todo debe funcionar correctamente en:

- teléfonos;
- tablets;
- laptops;
- monitores grandes.

Especial atención a:

- buscador;
- tarjetas;
- galería;
- mapa;
- formularios administrativos;
- navegación móvil.

---

# 35. Accesibilidad

Implementar buenas prácticas básicas:

- contraste adecuado;
- labels en formularios;
- estados de focus;
- navegación mediante teclado;
- `alt` en imágenes;
- botones con nombres claros;
- tamaños táctiles adecuados;
- mensajes de error comprensibles.

---

# 36. SEO

Implementar SEO básico.

Cada página debe tener:

- title dinámico;
- meta description;
- URL amigable;
- Open Graph cuando corresponda.

Las páginas de categorías y emprendimientos deben tener metadata dinámica.

Ejemplo:

```text
Título:
Restaurante El Lago | Yunguyo en tu mano

Descripción:
Conoce Restaurante El Lago, un emprendimiento gastronómico de Yunguyo.
```

Utilizar URLs amigables.

---

# 37. Estados de carga y errores

No mostrar páginas vacías mientras se cargan los datos.

Implementar:

- skeletons;
- estados de loading;
- mensajes de error;
- estados vacíos.

Ejemplos:

**Cargando emprendimientos...**

**No hay emprendimientos disponibles.**

**No encontramos resultados para tu búsqueda.**

Los errores de Supabase no deben mostrarse directamente al usuario. Mostrar mensajes amigables.

---

# 38. Confirmaciones

Antes de eliminar:

- categoría;
- emprendimiento;
- usuario;
- imagen;

mostrar confirmación.

Ejemplo:

“¿Estás seguro de que deseas eliminar este emprendimiento? Esta acción no se puede deshacer.”

---

# 39. Navegación

La navegación debe ser intuitiva.

Desde cualquier emprendimiento:

- volver a categoría;
- volver a explorar;
- acceder a inicio.

No utilizar navegación excesivamente profunda.

Agregar breadcrumbs cuando aporten valor, especialmente en:

```text
Categorías > Gastronomía > Restaurante El Lago
```

---

# 40. Principios importantes para la implementación

1. **No hardcodear categorías.**
2. **No hardcodear emprendimientos como fuente principal.**
3. Todo el contenido debe provenir de Supabase.
4. El administrador controla todo el contenido.
5. Los visitantes solamente consultan información.
6. Las imágenes deben estar en Supabase Storage.
7. El mapa debe mostrarse dentro del detalle del emprendimiento.
8. WhatsApp debe ser el principal canal de contacto.
9. El horario es opcional.
10. La interfaz debe ser sencilla y rápida.
11. No agregar funcionalidades que no estén especificadas.
12. Mantener todos los nombres de propiedades y variables de dominio en español.
13. Utilizar componentes reutilizables.
14. Evitar duplicación de código.
15. Mantener separación clara entre frontend público y administración.
16. Implementar correctamente las políticas de seguridad de Supabase.
17. El resultado debe ser funcional, no solamente visual.

---

# 41. Resultado esperado

Generar una aplicación completa y funcional donde:

### Un visitante pueda:

- entrar al sitio;
- buscar un emprendimiento;
- explorar categorías;
- filtrar emprendimientos;
- abrir una categoría;
- abrir el detalle de un emprendimiento;
- ver fotografías;
- ver su ubicación en Google Maps;
- abrir cómo llegar;
- consultar el horario;
- contactar mediante WhatsApp.

### Un administrador pueda:

- iniciar sesión;
- crear categorías;
- editar categorías;
- eliminar categorías;
- subir imágenes de categorías;
- crear emprendimientos;
- editar emprendimientos;
- eliminar emprendimientos;
- subir imagen principal;
- gestionar galerías;
- agregar WhatsApp;
- agregar el mapa de Google Maps;
- configurar horarios;
- crear/eliminar otros administradores.

Todo debe quedar conectado a Supabase y funcionar realmente mediante PostgreSQL, Supabase Storage y Supabase Auth.

No generar únicamente mockups o datos locales. Construir la aplicación funcional con la integración real de Supabase.
