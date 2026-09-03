---
name: git-commit
description: 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mentions "/commit". Supports: (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping, (5) Commit plan generation with SHA validation'
license: MIT
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Generate Commit Plan (MANDATORY)

Before committing, create a `commit-plan.md` file in the project root with the following structure:

```markdown
# Commit Plan

Generated: [DATE]

## Summary

- Total commits: [N]
- Files to commit: [N]

## Commits

### Commit 1: [TYPE] [SCOPE]: [DESCRIPTION]

**Files:**

- path/to/file1.ts
- path/to/file2.ts

**Command:**
\`\`\`bash
git add path/to/file1.ts path/to/file2.ts
git commit -m "[TYPE] [SCOPE]: [DESCRIPTION]"
\`\`\`

**SHA:** _pending_

---

### Commit 2: [TYPE] [SCOPE]: [DESCRIPTION]

**Files:**

- path/to/file3.ts

**Command:**
\`\`\`bash
git add path/to/file3.ts
git commit -m "[TYPE] [SCOPE]: [DESCRIPTION]"
\`\`\`

**SHA:** _pending_

---

## Validation

- [ ] All commits executed successfully
- [ ] All SHA IDs recorded
- [ ] No secrets committed
- [ ] All tests pass (if applicable)

## Execution Log

| #   | Type | Scope | Description          | SHA       | Status    |
| --- | ---- | ----- | -------------------- | --------- | --------- |
| 1   | feat | auth  | add login page       | _pending_ | _pending_ |
| 2   | fix  | api   | fix validation error | _pending_ | _pending_ |
```

**Rules for commit plan:**

- Group related files into logical commits
- Each commit should be atomic (one logical change)
- Order commits from least to most dependent
- Never include secrets, .env files, or credentials
- Show the plan to the user for approval before executing

### 3. Stage Files (if needed)

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (.env, credentials.json, private keys).

### 4. Execute Commits

After user approves the plan, execute each commit sequentially:

```bash
# Execute each commit from the plan
git add path/to/file1.ts path/to/file2.ts
git commit -m "[TYPE] [SCOPE]: [DESCRIPTION]"
```

After each commit, capture the SHA:

```bash
# Get the SHA of the last commit
git rev-parse HEAD
```

### 5. Update Commit Plan with SHA IDs

After ALL commits are executed, update the `commit-plan.md` file:

1. Replace `_pending_` with actual SHA IDs in the Validation section
2. Update the Execution Log table with SHA and status
3. Mark all checkboxes as complete

**Example of updated plan:**

```markdown
## Validation

- [x] All commits executed successfully
- [x] All SHA IDs recorded
- [x] No secrets committed
- [x] All tests pass (if applicable)

## Execution Log

| #   | Type | Scope | Description          | SHA     | Status |
| --- | ---- | ----- | -------------------- | ------- | ------ |
| 1   | feat | auth  | add login page       | a1b2c3d | ✅     |
| 2   | fix  | api   | fix validation error | e4f5g6h | ✅     |
```

### 6. Final Verification

```bash
# Verify all commits exist
git log --oneline -[N]

# Show the updated plan to user
cat commit-plan.md
```

## Best Practices

- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters
- Always generate commit plan before committing
- Always update plan with SHA IDs after committing

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
- NEVER commit without first generating and showing the commit plan
