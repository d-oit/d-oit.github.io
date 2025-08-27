---
description: Perform comprehensive security vulnerability assessment with false positive detection
agent: common/security-auditor

---

Perform comprehensive security scan with $ARGUMENTS focus.

**Project Dependencies:**
!`cat package.json | jq '.dependencies | keys | length' 2>/dev/null || echo "No dependencies found"`

**Security Tools Available:**
!`which npm-audit || which yarn-audit || which trivy || echo "No security tools found"`

**Current Security Status:**
!`npm audit --audit-level=moderate --json 2>/dev/null | jq '.metadata.vulnerabilities' || echo "No audit data available"`

Please perform comprehensive security assessment covering:

1. **Static Application Security Testing (SAST)**: Code vulnerability detection and pattern analysis
2. **Software Composition Analysis (SCA)**: Dependency vulnerability scanning and license compliance
3. **Infrastructure Security**: Configuration and container security review

**Security Scan Types:**

- **Code Analysis**: Automated vulnerability detection in source code
- **Dependency Scanning**: Third-party library vulnerability assessment
- **Configuration Review**: Security misconfigurations and best practices
- **License Compliance**: Open source license validation

**Validation Framework:**

- **False Positive Detection**: Context-aware filtering of irrelevant findings
- **Confidence Scoring**: High/Medium/Low confidence based on exploitability
- **Impact Assessment**: Evaluate real-world security impact
- **Remediation Priority**: Critical, High, Medium, Low risk categorization

**Risk Assessment Criteria:**

- **Critical**: Remote code execution, SQL injection, authentication bypass
- **High**: XSS, CSRF, sensitive data exposure
- **Medium**: Information disclosure, weak cryptography
- **Low**: Best practice violations, outdated dependencies

Provide comprehensive security report with validated findings, risk assessment, and remediation recommendations.
