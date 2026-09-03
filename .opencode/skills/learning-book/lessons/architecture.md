# Architecture

## Project Structure

- Two separate sections: public site (`/`) and admin panel (`/admin`)
- Admin routes must be protected (auth required)
- WhatsApp is the only contact method
- Google Maps via embed code (no API)

## File Organization

- `src/components/` — Reusable UI components
- `src/pages/` — Page components (public + admin)
- `src/lib/` — Utilities, Supabase client
- `src/assets/` — Static assets
