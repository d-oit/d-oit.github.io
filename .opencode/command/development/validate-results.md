---
description: Validate agent outputs and detect false positives across all OpenCode workflows
agent: general/validation-specialist
---

Validate the results from recent agent activities with $ARGUMENTS focus.

**Recent Agent Activity:**
!`find .opencode -name "*.log" -mtime -1 2>/dev/null | wc -l` recent log files

**Current Validation Rules:**
!`cat .opencode/validation/code-quality-rules.json | jq '.code_quality_validation.false_positive_patterns | length' 2>/dev/null || echo "No validation rules found"`

**Available Validation Files:**
!`find .opencode/validation -name "*.json" | wc -l` validation rule files

**Agent Outputs to Validate:**
!`find reports/ -name "*.json" 2>/dev/null | wc -l` validation report files

**Recent Alerts:**
!`find alerts/ -name "*.json" 2>/dev/null | wc -l` alert files

**Latest Validation Summary:**
!`cat reports/latest-validation-summary.md 2>/dev/null | grep -E "(Overall Score|Success Rate)" | head -5 || echo "No recent validation summary"`

Please analyze the recent validation reports and agent outputs by:

1. **False Positive Detection**: Identify and filter out false positives using pattern matching from validation rules
2. **Confidence Scoring**: Assess confidence levels for each finding (0.0-1.0 scale)
3. **Cross-Validation**: Cross-reference findings across multiple validation reports
4. **Context Analysis**: Validate findings against project-specific context and false positive patterns

**Validation Criteria:**

- **High Confidence (≥0.9)**: Multiple validations agree, clear evidence
- **Medium Confidence (0.7-0.9)**: Single validation, reasonable evidence  
- **Low Confidence (0.5-0.7)**: Weak evidence, needs human review
- **Very Low Confidence (<0.5)**: Likely false positive, filter out

**Focus Areas:**

- Security vulnerabilities and their exploitability
- Performance issues and real-world impact
- Code quality findings and maintainability impact
- False positive patterns and filtering

**Analysis Tasks:**

1. Review the latest validation reports in the `reports/` directory
2. Check for security vulnerabilities that may be false positives
3. Analyze code quality findings against the false positive patterns
4. Assess performance metrics for real impact
5. Cross-reference findings across different validation runs

Provide a comprehensive validation report with confidence scores and actionable recommendations.
