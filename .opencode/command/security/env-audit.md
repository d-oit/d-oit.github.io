# Environment Security Audit Command

## Overview
The `env-audit` command performs comprehensive security analysis of environment variables and sensitive data across your project.

## Usage
```bash
# Run complete environment security audit
env-audit

# Run with specific focus
env-audit --focus=secrets    # Focus on hardcoded secrets
env-audit --focus=permissions # Focus on file permissions
env-audit --focus=git        # Focus on git history security
```

## What It Checks

### 1. File Security
- ✅ Sensitive files properly ignored in .gitignore
- ✅ .env files have secure permissions (600)
- ✅ No sensitive files exposed in project root
- ✅ .env.example template exists and is secure

### 2. Content Security
- ✅ No hardcoded secrets in source files
- ✅ No weak passwords in environment variables
- ✅ No default/example values in production
- ✅ No suspicious patterns in environment data

### 3. Git Security
- ✅ No sensitive files in git history
- ✅ No secrets accidentally committed
- ✅ Proper .gitignore configuration

### 4. Best Practices
- ✅ Environment variables properly documented
- ✅ Secure password policies enforced
- ✅ Secret rotation recommendations provided

## Security Levels

### 🔴 Critical (Blocks Commits)
- Hardcoded secrets in source code
- Sensitive files committed to git
- Exposed .env files

### 🟡 Warning (Requires Review)
- Weak passwords detected
- Default values in production
- Insecure file permissions

### 🟢 Good (Secure)
- All security checks passed
- Best practices followed
- Environment properly secured

## Integration

The `env-audit` command integrates with:
- **Pre-commit hooks**: Automatic security checks
- **CI/CD pipelines**: Automated security validation
- **OpenCode framework**: Comprehensive security monitoring

## Recommendations

After running the audit, follow these recommendations:

1. **Fix Critical Issues Immediately**
   - Remove hardcoded secrets
   - Delete sensitive files from git history
   - Secure exposed environment files

2. **Address Warnings**
   - Use strong, unique passwords
   - Replace default values
   - Fix file permissions

3. **Implement Best Practices**
   - Use .env.example for documentation
   - Rotate secrets regularly
   - Monitor for security issues

## Example Output

```
🔐 OpenCode Environment Security Audit
=======================================

🔍 Validating .env...
✅ .env has secure permissions: 600
✅ .env validation passed

🔍 Checking for hardcoded secrets...
✅ Source files security check passed

🔍 Checking git history...
✅ Git history check passed

🎉 All security checks passed!
```

## Automation

The audit runs automatically:
- **Pre-commit**: Blocks commits with security issues
- **CI/CD**: Validates environment security in pipelines
- **Manual**: Run `env-audit` anytime for security check

This ensures your environment variables and sensitive data remain secure throughout the development lifecycle.
