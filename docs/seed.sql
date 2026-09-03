-- Seed data para Yunguyo en tu mano
-- Ejecutar en Supabase SQL Editor

-- Categorías
INSERT INTO categorias (nombre, slug, descripcion, imagen) VALUES
(
  'Gastronomía',
  'gastronomia',
  'Restaurantes, cafeterías, food trucks y todo lo relacionado con comida y bebida en Yunguyo.',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
),
(
  'Artesanías',
  'artesanias',
  'Productos hechos a mano, textiles, cerámicas y artesanías típicas de la región.',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'
),
(
  'Servicios',
  'servicios',
  'Salones de belleza, peluquerías, talleres y todo tipo de servicios para la comunidad.',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800'
),
(
  'Turismo',
  'turismo',
  'Tours, alojamiento, experiencias turísticas y todo para disfrutar Yunguyo.',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
),
(
  'Comercio',
  'comercio',
  'Tiendas, minimarkets, ferreterías y establecimientos comerciales varios.',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
);

-- Emprendimientos
INSERT INTO emprendimientos (nombre, slug, descripcion, categoria_id, imagen_principal, whatsapp, google_maps_url, galeria) VALUES
(
  'Restaurant Wara Wara',
  'restaurant-wara-wara',
  'Restaurante de comida típica y regional con vista al lago Titicaca. Especialidades: trucha, chuño, queso con papas.',
  (SELECT id FROM categorias WHERE slug = 'gastronomia'),
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  '591701234567',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1234567890!2d-69.8833!3d-16.2167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEzJzAwLjAiUyA2OcKwNTMnMDAuMCJX!5e0!3m2!1ses-419!2spe!4v1234567890',
  ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800']
),
(
  'Café Titikaka',
  'cafe-titikaka',
  'Cafetería artesanal con granos de la región. Desayunos, almuerzos ligeros y el mejor café de Yunguyo.',
  (SELECT id FROM categorias WHERE slug = 'gastronomia'),
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
  '591709876543',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800']
),
(
  'Artesanías del Titicaca',
  'artesanias-del-titicaca',
  'Artesanías tejidas a mano con técnicas tradicionales. Mantas, chompas, alfombras y souvenirs.',
  (SELECT id FROM categorias WHERE slug = 'artesanias'),
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
  '591705678901',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800']
),
(
  'Textiles Andinos',
  'textiles-andinos',
  'Tejidos y textiles con estampados típicos del altiplano. Prendas de vestir y decoración.',
  (SELECT id FROM categorias WHERE slug = 'artesanias'),
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
  '591703456789',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800']
),
(
  'Salón de Belleza Lucía',
  'salon-de-belleza-lucia',
  'Servicios de belleza y cuidado personal. Cortes, tintes, manicure, pedicure y más.',
  (SELECT id FROM categorias WHERE slug = 'servicios'),
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
  '591702345678',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800']
),
(
  'Taller Mecánico Carlos',
  'taller-mecanico-carlos',
  'Reparación y mantenimiento de vehículos. Mecánica general, frenos, suspensiones y electromecánica.',
  (SELECT id FROM categorias WHERE slug = 'servicios'),
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
  '591706789012',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800']
),
(
  'Tours Titicaca',
  'tours-titicaca',
  'Tours y experiencias turísticas por el lago Titicaca, Isla del Sol, Isla de la Luna y más.',
  (SELECT id FROM categorias WHERE slug = 'turismo'),
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
  '591704567890',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1234567890!2d-69.8833!3d-16.2167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEzJzAwLjAiUyA2OcKwNTMnMDAuMCJX!5e0!3m2!1ses-419!2spe!4v1234567890',
  ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800']
),
(
  'Hotel Valle Sagrado',
  'hotel-valle-sagrado',
  'Hotel boutique con habitaciones cómodas y vistas panorámicas. Desayuno incluido y WiFi gratis.',
  (SELECT id FROM categorias WHERE slug = 'turismo'),
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  '591707890123',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800']
),
(
  'Minimarket Los Andes',
  'minimarket-los-andes',
  'Minimarket con productos básicos, snacks, bebidas y artículos de limpieza. Abierto todos los días.',
  (SELECT id FROM categorias WHERE slug = 'comercio'),
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  '591708901234',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800']
),
(
  'Ferretería Yunguyo',
  'ferreteria-yunguyo',
  'Ferretería completa con herramientas, materiales de construcción, plomería y electricidad.',
  (SELECT id FROM categorias WHERE slug = 'comercio'),
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
  '591709012345',
  NULL,
  ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800']
);
