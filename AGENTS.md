# Yunguyo en tu mano

Directorio digital de emprendimientos de Yunguyo, Puno, Perú.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Playwright (e2e tests, chromium only)

## Commands

```bash
bun run dev          # Start dev server (port 5173)
bun run build        # TypeScript + Vite build
bun run lint         # Run oxlint
bun run test         # Run Playwright e2e tests
bun run test:ui      # Playwright UI mode
bun run test:headed  # Playwright headed mode
```

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Page components (public + admin)
  lib/            # Utilities, Supabase client
  assets/         # Static assets
e2e/              # Playwright e2e tests (*.spec.ts)
docs/             # Plan and phases documentation
```

## Conventions

- **Language**: All code, variable names, properties, and database columns in Spanish
- **Styling**: Tailwind CSS only, no custom CSS unless necessary
- **Components**: Reusable, PascalCase names in Spanish
- **Database**: snake_case columns, never hardcode categories/businesses
- **Testing**: E2E tests only with chromium project

## Architecture

- Two separate sections: public site (`/`) and admin panel (`/admin`)
- All data from Supabase — no static data as primary source
- Images stored in Supabase Storage (`imagenes/categorias/`, `imagenes/emprendimientos/`)
- WhatsApp is the only contact method
- Google Maps via embed code (no API)

## Key Rules

- Never hardcode categories or businesses
- Admin routes must be protected (auth required)
- Spanish naming for all domain properties
- Mobile-first responsive design
- Lazy loading for images
- Sanitize Google Maps embed code (no arbitrary HTML)

## Files to Reference

- `docs/plan.md` — Full project specification
- `docs/phases.md` — Development phases and progress tracking
- `.opencode/skills/learning-book/LEARNINGS.md` — Project-specific best practices and lessons learned
