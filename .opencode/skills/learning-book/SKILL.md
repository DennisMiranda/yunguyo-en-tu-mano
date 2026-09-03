---
name: learning-book
description: Record Yunguyo-specific best practices, mistakes, and lessons learned. Consult before making decisions to avoid repeating past mistakes.
---

# Learning Book (Yunguyo)

Project-specific best practices and lessons learned for Yunguyo en tu mano.

## When to Consult

- Before writing new code — check for existing patterns
- Before making architectural decisions — check for established conventions
- After encountering an error — record the mistake to avoid repeating it
- When the user says "record this" or "remember this"

## When to Record

- A bug was found and fixed → record the cause and solution
- A pattern was established → record it as a convention
- A mistake was made → record what went wrong and how to prevent it
- A best practice was discovered → record it

## Format

Each entry should be concise and actionable:

```
### [Title]
- **Context:** when/where this applies
- **Rule:** what to do (or not do)
- **Example:** code snippet if applicable
```

## How to Update

When recording a new lesson, append to the appropriate section in `LEARNINGS.md`.

Always confirm with the user before recording a new entry.
