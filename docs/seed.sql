-- Seed data para Yunguyo en tu mano
-- Ejecutar en Supabase SQL Editor
-- Nota: Las imágenes deben subirse a Supabase Storage (bucket: imagenes)
-- y usar las URLs públicas resultantes.

-- Categorías
INSERT INTO categorias (nombre, slug, descripcion, imagen) VALUES
(
  'Gastronomía',
  'gastronomia',
  'Restaurantes, cafeterías, food trucks y todo lo relacionado con comida y bebida en Yunguyo.',
  '/imagenes/yunguyo.jpg'
),
(
  'Artesanías',
  'artesanias',
  'Productos hechos a mano, textiles, cerámicas y artesanías típicas de la región.',
  '/imagenes/yunguyo.jpg'
),
(
  'Servicios',
  'servicios',
  'Salones de belleza, peluquerías, talleres y todo tipo de servicios para la comunidad.',
  '/imagenes/yunguyo.jpg'
),
(
  'Turismo',
  'turismo',
  'Tours, alojamiento, experiencias turísticas y todo para disfrutar Yunguyo.',
  '/imagenes/yunguyo.jpg'
),
(
  'Comercio',
  'comercio',
  'Tiendas, minimarkets, ferreterías y establecimientos comerciales varios.',
  '/imagenes/yunguyo.jpg'
);

-- Emprendimientos
INSERT INTO emprendimientos (nombre, slug, descripcion, categoria_id, imagen_principal, whatsapp, google_maps_url, galeria) VALUES
(
  'Restaurant Wara Wara',
  'restaurant-wara-wara',
  'Restaurante de comida típica y regional con vista al lago Titicaca. Especialidades: trucha, chuño, queso con papas.',
  (SELECT id FROM categorias WHERE slug = 'gastronomia'),
  '/imagenes/yunguyo.jpg',
  '591701234567',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1234567890!2d-69.8833!3d-16.2167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEzJzAwLjAiUyA2OcKwNTMnMDAuMCJX!5e0!3m2!1ses-419!2spe!4v1234567890',
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Café Titikaka',
  'cafe-titikaka',
  'Cafetería artesanal con granos de la región. Desayunos, almuerzos ligeros y el mejor café de Yunguyo.',
  (SELECT id FROM categorias WHERE slug = 'gastronomia'),
  '/imagenes/yunguyo.jpg',
  '591709876543',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Artesanías del Titicaca',
  'artesanias-del-titicaca',
  'Artesanías tejidas a mano con técnicas tradicionales. Mantas, chompas, alfombras y souvenirs.',
  (SELECT id FROM categorias WHERE slug = 'artesanias'),
  '/imagenes/yunguyo.jpg',
  '591705678901',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Textiles Andinos',
  'textiles-andinos',
  'Tejidos y textiles con estampados típicos del altiplano. Prendas de vestir y decoración.',
  (SELECT id FROM categorias WHERE slug = 'artesanias'),
  '/imagenes/yunguyo.jpg',
  '591703456789',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Salón de Belleza Lucía',
  'salon-de-belleza-lucia',
  'Servicios de belleza y cuidado personal. Cortes, tintes, manicure, pedicure y más.',
  (SELECT id FROM categorias WHERE slug = 'servicios'),
  '/imagenes/yunguyo.jpg',
  '591702345678',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Taller Mecánico Carlos',
  'taller-mecanico-carlos',
  'Reparación y mantenimiento de vehículos. Mecánica general, frenos, suspensiones y electromecánica.',
  (SELECT id FROM categorias WHERE slug = 'servicios'),
  '/imagenes/yunguyo.jpg',
  '591706789012',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Tours Titicaca',
  'tours-titicaca',
  'Tours y experiencias turísticas por el lago Titicaca, Isla del Sol, Isla de la Luna y más.',
  (SELECT id FROM categorias WHERE slug = 'turismo'),
  '/imagenes/yunguyo.jpg',
  '591704567890',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1234567890!2d-69.8833!3d-16.2167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEzJzAwLjAiUyA2OcKwNTMnMDAuMCJX!5e0!3m2!1ses-419!2spe!4v1234567890',
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Hotel Valle Sagrado',
  'hotel-valle-sagrado',
  'Hotel boutique con habitaciones cómodas y vistas panorámicas. Desayuno incluido y WiFi gratis.',
  (SELECT id FROM categorias WHERE slug = 'turismo'),
  '/imagenes/yunguyo.jpg',
  '591707890123',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Minimarket Los Andes',
  'minimarket-los-andes',
  'Minimarket con productos básicos, snacks, bebidas y artículos de limpieza. Abierto todos los días.',
  (SELECT id FROM categorias WHERE slug = 'comercio'),
  '/imagenes/yunguyo.jpg',
  '591708901234',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
),
(
  'Ferretería Yunguyo',
  'ferreteria-yunguyo',
  'Ferretería completa con herramientas, materiales de construcción, plomería y electricidad.',
  (SELECT id FROM categorias WHERE slug = 'comercio'),
  '/imagenes/yunguyo.jpg',
  '591709012345',
  NULL,
  ARRAY['/imagenes/yunguyo.jpg']
);
