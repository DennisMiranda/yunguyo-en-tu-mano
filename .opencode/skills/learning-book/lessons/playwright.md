# Playwright Testing

## Rules

- **Context:** Writing e2e tests
- **Rule:** Only use chromium project for e2e tests (faster, sufficient for this project)
- **Rule:** Use case-insensitive title matching: `toHaveTitle(/yunguyo/i)`
- **Rule:** Use `page.on('pageerror')` to catch JS errors

## Mistakes to Avoid

### Title Matching in Playwright

- **Mistake:** Using `toHaveTitle(/Yunguyo/)` with capital Y
- **Cause:** Vite serves `index.html` title as-is (lowercase "yunguyo")
- **Fix:** Use case-insensitive regex: `/yunguyo/i`
- **Date:** 2026-09-02
