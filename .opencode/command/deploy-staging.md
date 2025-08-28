---
description: Deploy application to staging environment with comprehensive validation and safety checks
agent: general/deployment-specialist

---

Deploy application to staging environment with $ARGUMENTS configuration.

**Build Status:**
!`npm run build --silent 2>&1 | tail -5 || echo "Build not configured"`

**Current Branch:**
!`git branch --show-current`

**Environment Configuration:**
!`ls -la .env* 2>/dev/null || echo "No environment files found"`

**Deployment Readiness:**
!`git status --porcelain | wc -l` uncommitted changes

Please execute comprehensive staging deployment with the following phases:

1. **Pre-Deployment Validation**: Build verification, security scans, and configuration checks
2. **Deployment Execution**: Safe deployment with rollback capability
3. **Post-Deployment Validation**: Health checks, smoke tests, and performance validation
4. **Monitoring Setup**: Configure monitoring, alerting, and dashboards

**Pre-Deployment Checks:**

- **Build Verification**: Validate build artifacts and integrity
- **Security Scan**: Perform vulnerability assessment
- **Configuration Validation**: Verify environment-specific settings
- **Dependency Check**: Ensure all dependencies are available

**Deployment Strategy:**

- **Blue-Green Deployment**: Zero-downtime with instant rollback
- **Health Checks**: Application readiness and liveness probes
- **Gradual Traffic Shift**: Controlled rollout with monitoring
- **Automatic Rollback**: Triggered by health/performance failures

**Post-Deployment Validation:**

- **Smoke Tests**: Basic functionality verification
- **Integration Tests**: End-to-end workflow validation
- **Performance Tests**: Load and response time validation
- **Security Verification**: Post-deployment security checks

**Monitoring Setup:**

- **Application Metrics**: Response times, error rates, throughput
- **Infrastructure Monitoring**: CPU, memory, disk, network usage
- **Health Endpoints**: Service availability and readiness checks
- **Alert Configuration**: Automated alerts for issues

Provide comprehensive deployment report with validation results, performance metrics, and rollback readiness.
