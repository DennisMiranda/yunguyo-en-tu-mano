# Supabase Conventions

## Rules

- **Context:** All data comes from Supabase
- **Rule:** Never hardcode categories or businesses. Always fetch from Supabase.
- **Rule:** Use snake_case for database columns
- **Rule:** Store image URLs in Supabase Storage, not binary data in PostgreSQL

## Storage Structure

```
imagenes/
├── categorias/
└── emprendimientos/
```
