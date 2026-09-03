# Phase 12: Datos Demo + Deploy

**Objetivo:** Poblar con datos reales de demo y preparar para deploy.

## Archivos a crear/modificar

### 1. `docs/seed.sql` (nuevo)

Script SQL para insertar datos demo:

- 5 categorías con imágenes
- 10 emprendimientos de ejemplo
- Imágenes placeholder de Unsplash

### 2. `docs/env.example` (nuevo)

Ejemplo de variables de entorno para deploy.

### 3. `e2e/smoke.spec.ts` (modificar)

Agregar test de flujo completo.

## Datos Demo

### Categorías

1. Gastronomía - Restaurantes, cafeterías, food trucks
2. Artesanías - Productos hechos a mano, textiles, cerámica
3. Servicios - Salones, peluquerías, talleres
4. Turismo - Tours, alojamiento, experiencias
5. Comercio - Tiendas, minimarkets, ferreterías

### Emprendimientos

1. Restaurant Wara Wara - Gastronomía
2. Café Titikaka - Gastronomía
3. Artesanías del Titicaca - Artesanías
4. Textiles Andinos - Artesanías
5. Salón de Belleza Lucía - Servicios
6. Taller Mecánico Carlos - Servicios
7. Tours Titicaca - Turismo
8. Hotel Valle Sagrado - Turismo
9. Minimarket Los Andes - Comercio
10. Ferretería Yunguyo - Comercio

## Commits

1. `docs: add seed data script` — docs/seed.sql
2. `docs: add env example` — docs/env.example
3. `docs: add phase 12 plan` — docs/phases/phase-12-demo-deploy/plan.md

## Lessons to Follow

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming
- `.opencode/skills/learning-book/lessons/pitfalls.md` — No dev/preview servers, check git status
