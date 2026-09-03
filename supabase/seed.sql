-- Categorias
insert into categorias (nombre, descripcion, imagen) values
  ('Turismo', 'Descubre los destinos y experiencias turísticas de Yunguyo', null),
  ('Gastronomía', 'Sabores y restaurantes típicos del altiplano', null),
  ('Artesanía', 'Artesanías locales con tradición andina', null),
  ('Productos', 'Productos locales y del altiplano', null),
  ('Servicios', 'Servicios para residentes y visitantes', null);

-- Emprendimientos
insert into emprendimientos (nombre, categoria_id, descripcion, whatsapp, horario) values
  ('Restaurante El Lago', 1, 'Gastronomía típica con vista al Lago Titicaca', '51999111222', '{"lunes":{"activo":true,"abre":"09:00","cierra":"18:00"},"martes":{"activo":true,"abre":"09:00","cierra":"18:00"},"miercoles":{"activo":false},"jueves":{"activo":true,"abre":"09:00","cierra":"18:00"},"viernes":{"activo":true,"abre":"09:00","cierra":"18:00"},"sabado":{"activo":true,"abre":"10:00","cierra":"16:00"},"domingo":{"activo":false}}'),
  ('Sabores del Altiplano', 2, 'Restaurantes de comida tradicional altoandina', '51999333444', null),
  ('Artesanías Titicaca', 3, 'Artesanías en lana y cerámica', '51999555666', null),
  ('Textiles Yunguyo', 3, 'Tejidos artesanales con patrones ancestrales', '51999777888', null),
  ('Productos del Altiplano', 4, 'Quinua, maca y productos orgánicos', '51999999000', null),
  ('Turismo Andino Yunguyo', 1, 'Tours y experiencias turísticas', '51999112233', null);
