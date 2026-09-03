# Common Pitfalls

## Mistakes to Avoid

### Config Files with Secrets

- **Mistake:** Committing opencode.json with tokens
- **Cause:** Contains Supabase access tokens
- **Fix:** Add opencode.json to .gitignore, use opencode.example.json as template
- **Date:** 2026-09-02

### PowerShell vs Bash Syntax

- **Mistake:** Using bash syntax in PowerShell environment
- **Cause:** Different shell environments have different syntax
- **Fix:** Use PowerShell-specific commands (`Set-Content` instead of `echo`)
- **Date:** 2026-09-02

### File Encoding Issues

- **Mistake:** Corrupted configuration files due to encoding
- **Cause:** Improper file creation methods
- **Prevention:** Use IDE file creation instead of command-line when possible
- **Date:** 2026-09-02

### JSON Configuration Errors

- **Mistake:** Invalid JSON in configuration files
- **Cause:** Syntax errors, improper escaping
- **Prevention:** Use IDE JSON validation, copy-paste verified JSON
- **Date:** 2026-09-02
