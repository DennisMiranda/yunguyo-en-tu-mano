# Quick Reference

## Commands

### Before Implementation

```bash
grep -r "pattern" .opencode/skills/learning-book/lessons/
grep -r "similar-pattern" src/
bun run type-check
```

### After Implementation

```bash
bun run format
bun run test
bun run build
```

## Red Flags

```
❌ String literals in switch cases
❌ React hooks in utility functions
❌ Technical layer organization
❌ Hardcoded route strings
❌ Direct provider instantiation
❌ Missing dependency injection
❌ Skipping implementation preview and clarification
```

## Green Flags

```
✅ Object-based constants (USER_ROLES.admin)
✅ Feature-based folders (features/auth/core)
✅ Factory pattern usage
✅ Dependency injection
✅ Interface abstractions
✅ SOLID principles
✅ Component reusability principles
✅ Plugin-Based Architecture
✅ Implementation preview with clarifying questions
```
