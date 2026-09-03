# Critical Pattern References

## Object-Based Constants (NEVER use string literals)

### Wrong

```typescript
switch (type) {
  case 'admin':
    return true;
  case 'clinical':
    return false;
}
```

### Correct

```typescript
switch (type) {
  case USER_ROLES.admin:
    return true;
  case ROUTE_TYPES.CLINICAL:
    return false;
}
```

## Feature-Based Organization

```
features/
├── auth/
│   ├── core/
│   │   ├── types/
│   │   ├── interfaces/
│   │   └── factories/
│   ├── providers/
│   ├── components/
│   └── middleware/
```

## Dependency Injection Pattern

### Wrong

```typescript
export const getRoleName = (role: string) => {
  const t = useTranslations(); // Hook violation!
  return t(role);
};
```

### Correct

```typescript
export const getRoleName = (role: string, t: (key: string) => string) => {
  return t(role);
};
```

## Factory Pattern for Providers

```typescript
export class AuthProviderFactory {
  static createAuthProvider(): IAuthProvider {
    switch (authConfig.provider) {
      case AUTH_PROVIDERS.SUPABASE:
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported provider: ${authConfig.provider}`);
    }
  }
}
```

## Quick Pattern Templates

### Route Types

```typescript
export const ROUTE_TYPES = {
  PUBLIC: 'public',
  ADMIN: 'admin',
  CLINICAL: 'clinical',
} as const;

export type RouteType = (typeof ROUTE_TYPES)[keyof typeof ROUTE_TYPES];
```

### Role Checking

```typescript
export class AccessControl {
  static canAccess(userRole: string, routeType: RouteType): boolean {
    switch (routeType) {
      case ROUTE_TYPES.ADMIN:
        return userRole === USER_ROLES.admin;
      case ROUTE_TYPES.CLINICAL:
        return ROLE_GROUPS[ROLE_GROUP_KEYS.CLINICAL].includes(userRole as any);
      default:
        return true;
    }
  }
}
```

## Memory Triggers

- **Switch statements** → Must use object-based constants
- **New types** → Must use const objects with keyof typeof
- **File organization** → Must follow feature-based structure
- **Utility functions** → Must use dependency injection
- **Provider creation** → Must use factory pattern
