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
2. **READ** - lessons/implementation-checklist.md
3. **RESEARCH** - existing codebase patterns
4. **VERIFY** - compliance with all rules
5. **IMPLEMENT** - following established patterns exactly
6. **TEST** - format, type-check, test

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
