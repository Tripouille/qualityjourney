# Shell Commands & Environment

## Context

This project runs in a **bash environment** (Git Bash on Windows or native bash on Unix).

**CRITICAL:** NEVER mix Windows CMD commands with bash syntax.

---

## The Golden Rule

**Use Unix/bash commands ONLY. No Windows CMD commands.**

---

## ❌ FORBIDDEN: Windows CMD Commands

These commands do NOT work in bash:

```bash
# ❌ FORBIDDEN
del /F /Q file.txt
taskkill /F /PID 1234
dir /B
copy file1 file2
move file1 file2
```

---

## ✅ CORRECT: Bash/Unix Commands

Use these instead:

```bash
# ✅ CORRECT
rm -f file.txt
kill -9 1234
ls
cp file1 file2
mv file1 file2
```

---

## Critical: Redirection

### ❌ FORBIDDEN: Redirecting to `nul`

**Problem:** `nul` is a Windows CMD device, not recognized in bash.

Using `2>nul` in bash creates an actual **file** named `nul` in the project root, polluting the repository.

```bash
# ❌ FORBIDDEN: Creates a file named 'nul'
command 2>nul
command >nul 2>&1
pnpm install >nul
```

### ✅ CORRECT: Redirect to `/dev/null`

```bash
# ✅ CORRECT
command 2>/dev/null
command >/dev/null 2>&1
pnpm install >/dev/null
```

**Explanation:**
- `/dev/null` is the Unix null device (discards all data)
- Redirecting to `/dev/null` suppresses output without creating files

---

## Common Operations

### File Operations

| Operation | ❌ Windows CMD | ✅ Bash/Unix |
|-----------|---------------|-------------|
| Delete file | `del file.txt` | `rm file.txt` |
| Delete forcefully | `del /F /Q file.txt` | `rm -f file.txt` |
| Delete directory | `rmdir /S /Q dir` | `rm -rf dir` |
| Copy file | `copy src dest` | `cp src dest` |
| Move file | `move src dest` | `mv src dest` |
| Create directory | `mkdir dir` | `mkdir dir` ✅ (same) |
| List files | `dir` | `ls` |
| List files (detailed) | `dir /B` | `ls -la` |
| Touch file | `type nul > file` | `touch file` |
| View file | `type file.txt` | `cat file.txt` |

### Process Management

| Operation | ❌ Windows CMD | ✅ Bash/Unix |
|-----------|---------------|-------------|
| Kill process by PID | `taskkill /PID 1234` | `kill 1234` |
| Kill forcefully | `taskkill /F /PID 1234` | `kill -9 1234` |
| List processes | `tasklist` | `ps aux` |
| Find process | `tasklist \| findstr node` | `ps aux \| grep node` |

### Text Processing

| Operation | ❌ Windows CMD | ✅ Bash/Unix |
|-----------|---------------|-------------|
| Search in files | `findstr "text" file` | `grep "text" file` |
| Count lines | `find /C /V "" file` | `wc -l file` |
| View first lines | (no equivalent) | `head -n 10 file` |
| View last lines | (no equivalent) | `tail -n 10 file` |
| Replace in file | (no built-in) | `sed 's/old/new/g' file` |

---

## Environment Variables

### Setting Environment Variables

```bash
# ✅ CORRECT (bash)
export NODE_ENV=production
export API_URL=https://api.example.com

# ❌ WRONG (Windows CMD)
set NODE_ENV=production
set API_URL=https://api.example.com
```

### Using Environment Variables

```bash
# ✅ CORRECT (bash - same on Windows/Unix)
echo $NODE_ENV
echo $API_URL
```

---

## Approved Commands for This Project

### Package Manager (pnpm)
```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm add package-name
pnpm add -D package-name
```

### Git
```bash
git status
git add .
git commit -m "message"
git push
git pull
git checkout -b branch-name
git log --oneline
git diff
```

### Next.js
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
```

### TypeScript
```bash
pnpm tsc --noEmit    # Type check only
pnpm tsc --watch     # Type check in watch mode
```

### File Operations
```bash
ls                   # List files
ls -la               # List files (detailed)
rm file.txt          # Delete file
rm -f file.txt       # Force delete file
rm -rf dir/          # Delete directory recursively
cp file1 file2       # Copy file
mv file1 file2       # Move/rename file
mkdir dir            # Create directory
mkdir -p dir/sub     # Create nested directories
touch file.txt       # Create empty file
cat file.txt         # View file contents
head -n 10 file.txt  # First 10 lines
tail -n 10 file.txt  # Last 10 lines
```

### Text Search
```bash
grep "text" file.txt                 # Search in file
grep -r "text" src/                  # Recursive search
grep -i "text" file.txt              # Case-insensitive
grep -n "text" file.txt              # Show line numbers
```

### Process Management
```bash
ps aux                               # List all processes
ps aux | grep node                   # Find node processes
kill 1234                            # Kill process by PID
kill -9 1234                         # Force kill process
pkill node                           # Kill all node processes
```

---

## Path Separators

### ✅ CORRECT: Forward slashes (/) work everywhere

```bash
# ✅ CORRECT (works on Windows bash AND Unix)
cd src/domain/entities
cat src/domain/entities/course.ts
ls src/infrastructure/
```

### ❌ WRONG: Backslashes (\) are Windows-specific

```bash
# ❌ WRONG (Windows CMD only)
cd src\domain\entities
cat src\domain\entities\course.ts
```

**Rule:** Always use forward slashes (`/`) for paths in bash.

---

## Scripts in package.json

Use cross-platform commands only:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

**DO NOT use:**
- `&&` for sequential commands (bash only)
- `&` for background commands (bash only)
- Windows-specific commands (`del`, `copy`, etc.)

**DO use:**
- npm packages for cross-platform operations (`rimraf`, `cross-env`, etc.)
- Node.js scripts for complex logic

---

## Common Pitfalls

### Pitfall 1: Creating a `nul` File

```bash
# ❌ WRONG: Creates a file named 'nul'
pnpm install 2>nul

# ✅ CORRECT
pnpm install 2>/dev/null
```

**Symptom:** You see a file named `nul` in your project root.

**Solution:** Delete it and use `/dev/null` instead:
```bash
rm nul
```

### Pitfall 2: Using `del` Instead of `rm`

```bash
# ❌ WRONG
del file.txt

# ✅ CORRECT
rm file.txt
```

**Symptom:** Error: `del: command not found`

### Pitfall 3: Using Backslashes in Paths

```bash
# ❌ WRONG
cd src\domain\entities

# ✅ CORRECT
cd src/domain/entities
```

**Symptom:** Error: `cd: src\domain\entities: No such file or directory`

---

## Gitignore Rules

Ensure `nul` is ignored (in case it's accidentally created):

```gitignore
# .gitignore
nul
```

**Note:** This is already added to the repository.

---

## Summary

1. **NEVER** use Windows CMD commands (del, taskkill, dir, copy, move)
2. **ALWAYS** use bash/Unix commands (rm, kill, ls, cp, mv)
3. **NEVER** redirect to `nul` (use `/dev/null` instead)
4. **ALWAYS** use forward slashes `/` for paths (not backslashes `\`)
5. **ALWAYS** use pnpm for package management (cross-platform)
6. **ALWAYS** use Git commands (cross-platform)

---

## Quick Reference

```bash
# File operations
rm -f file.txt                    # Delete file
rm -rf dir/                       # Delete directory
cp file1 file2                    # Copy file
mv file1 file2                    # Move/rename file
mkdir -p dir/sub                  # Create nested directories
ls -la                            # List files (detailed)

# Process management
kill -9 1234                      # Force kill process
ps aux | grep node                # Find node processes

# Redirection
command >/dev/null 2>&1           # Suppress all output

# Package management
pnpm install                      # Install dependencies
pnpm dev                          # Start dev server
pnpm build                        # Build for production

# Git
git status                        # Check status
git add .                         # Stage all changes
git commit -m "message"           # Commit changes
git push                          # Push to remote
```

---

## Enforcement

**Pre-commit Checklist:**
- [ ] No Windows CMD commands used (del, taskkill, dir, copy, move)
- [ ] No redirects to `nul` (use `/dev/null`)
- [ ] No backslashes in paths (use forward slashes `/`)
- [ ] No `nul` file in project root (delete if exists)
