# Implementation Checklist

## Pre-Implementation Checklist

**Before writing ANY code, always complete this checklist:**

### Phase 0: Implementation Preview & Clarification (MANDATORY)

- [ ] **Show detailed preview** of what you plan to implement
- [ ] **Ask clarifying questions** if requirements are unclear
- [ ] **Include examples** in clarifying questions for better understanding
- [ ] **Wait for user approval** before proceeding to implementation

### Phase 1: Research

- [ ] **Read relevant lessons** in `lessons/`
- [ ] **Find existing patterns** in the codebase
- [ ] **Check compliance** with project rules
- [ ] **Verify architecture patterns** from lessons

### Phase 2: Pattern Verification

- [ ] **Using object-based constants** (no string literals)
- [ ] **Following feature-based organization** (`features/`)
- [ ] **Applying dependency injection** (no React hooks in utilities)
- [ ] **Using factory patterns** for providers
- [ ] **Following SOLID principles**

### Phase 3: Implementation

- [ ] **Code follows established patterns exactly**
- [ ] **TypeScript strict mode compliance**
- [ ] **Proper error handling implemented**
- [ ] **Prettier formatting ready**

## Implementation Process

1. **PREVIEW** - Show implementation plan and ask clarifying questions
2. **AUDIT** - Verify plan follows all lessons before presenting to user
3. **READ** - lessons/implementation-checklist.md
4. **RESEARCH** - existing codebase patterns
5. **VERIFY** - compliance with all rules
6. **IMPLEMENT** - following established patterns exactly
7. **TEST** - format, type-check, test

## Plan Audit (MANDATORY)

**Before presenting a plan to the user, always audit it against the learning book:**

### Audit Checklist

- [ ] **Read relevant lessons** — Check `lessons/` for applicable rules
- [ ] **Object-based constants** — No string literals for routes, statuses, types
- [ ] **Spanish naming** — Variables, functions, components in Spanish (project-specific)
- [ ] **Architecture compliance** — Follow `src/pages/`, `src/lib/`, `src/components/` structure
- [ ] **Tailwind only** — No custom CSS unless necessary
- [ ] **File naming** — PascalCase for components, camelCase for functions
- [ ] **No secrets** — Never include credentials in plans

### How to Audit

1. List all lessons in `lessons/`
2. For each lesson, check if the plan violates any rule
3. If violation found, fix the plan before presenting
4. Add "Lessons to Follow" section in plan with relevant lesson files

### Example

```markdown
## Lessons to Follow

Before implementing, review these lessons:

- `.opencode/skills/learning-book/lessons/patterns.md` — Object-based constants
- `.opencode/skills/learning-book/lessons/code-quality.md` — Spanish naming
```

## Phase 4 Planning - Critical Lessons Integration

### Architecture Classification - Feature as Feature

**Critical Insight**: Features are NOT shared components — they're complete features

**Correct Structure**:

```
features/dashboard/       # Complete feature
├── core/types/          # Feature-specific types
├── core/hooks/          # Feature-specific hooks
├── components/          # Feature-specific components
└── lib/                 # Feature-specific utilities
```

### File Naming Compliance - Kebab-Case Mandatory

```
❌ WRONG: StatsCard.tsx, UpcomingAppointments.tsx
✅ CORRECT: stats-card.tsx, upcoming-appointments.tsx
```

### String Literal Detection - Object-Based Constants

```typescript
// ❌ WRONG - String literals
switch (status) {
  case 'scheduled':
    return 'default';
}

// ✅ CORRECT - Object-based constants
switch (status) {
  case APPOINTMENT_STATUS.scheduled:
    return 'default';
}
```

### Feature-Based Organization

**Lesson**: Organize by business capability, not technical layers

**Pattern**: `features/dashboard/components/` not `components/dashboard/`

### Systematic Pattern Verification

**Process**: Study existing code to understand established patterns before implementation

**Perfect Example**:

```typescript
import { useRole } from '@/features/auth/core/hooks/use-role';
import { USER_ROLES } from '@/features/auth/core/types/role.types';
if (item.adminOnly && !hasAccess(USER_ROLES.admin)) return null;
```
