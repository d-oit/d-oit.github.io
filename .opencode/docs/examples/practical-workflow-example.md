# Practical Workflow: Building a User Authentication System

This example demonstrates how to use the new @foldername/agentname format in a complete development workflow.

## 🎯 Project Overview

**Goal**: Implement a secure user authentication system with the following features:
- User registration and login
- Password reset functionality
- JWT token-based authentication
- Role-based access control
- Security best practices

## 📋 Development Workflow with @foldername/agentname Format

### Phase 1: Planning & Architecture

```bash
# Step 1: System Architecture Design
@common/agent-orchestrator "Design authentication system architecture:
- @general/code-architect: Create system design and component diagram
- @domains/api/api-designer: Design REST API endpoints
- @domains/api/database-specialist: Design user database schema
- @common/security-auditor: Define security requirements"

# Step 2: API Specification
@domains/api/api-designer "Create detailed API specification for:
- POST /api/auth/register - User registration
- POST /api/auth/login - User authentication
- POST /api/auth/refresh - Token refresh
- POST /api/auth/logout - User logout
- POST /api/auth/forgot-password - Password reset request"

# Step 3: Database Design
@domains/api/database-specialist "Design optimized database schema:
- Users table with proper indexing
- Sessions/tokens management
- Password security (hashing, salting)
- Audit logging for security events"
```

### Phase 2: Implementation

```bash
# Step 4: Backend Implementation
@common/agent-orchestrator "Implement authentication backend:
- @domains/api/api-designer: Implement API endpoints
- @domains/api/database-specialist: Optimize database queries
- @common/security-auditor: Implement security measures
- @common/test-engineer: Create unit and integration tests"

# Step 5: Security Implementation
@common/security-auditor "Implement security features:
- Password hashing with bcrypt
- JWT token generation and validation
- Rate limiting for auth endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers"

# Step 6: Testing Strategy
@common/test-engineer "Create comprehensive test suite:
- Unit tests for auth functions
- Integration tests for API endpoints
- Security tests for common vulnerabilities
- Load testing for auth endpoints"
```

### Phase 3: Frontend Integration

```bash
# Step 7: UI Components
@common/agent-orchestrator "Create authentication UI:
- @domains/ui/ui-ux-designer: Design login/register forms
- @general/code-architect: Plan component structure
- @common/test-engineer: Create component tests"

# Step 8: User Experience Design
@domains/ui/ui-ux-designer "Design user-friendly auth interface:
- Responsive login/register forms
- Password strength indicator
- Loading states and error handling
- Accessibility compliance (WCAG 2.1)
- Mobile-first responsive design"
```

### Phase 4: Quality Assurance

```bash
# Step 9: Code Review
@common/code-reviewer "Review authentication implementation:
- Security best practices compliance
- Code quality and maintainability
- Performance optimization opportunities
- Error handling completeness
- Documentation accuracy"

# Step 10: Performance Optimization
@common/performance-optimizer "Optimize authentication system:
- Database query performance
- JWT token caching strategy
- Rate limiting efficiency
- Memory usage optimization
- Response time improvements"

# Step 11: Documentation
@common/documentation-maintainer "Create comprehensive documentation:
- API documentation with examples
- User guide for authentication features
- Developer integration guide
- Security considerations document"
```

### Phase 5: Deployment & Monitoring

```bash
# Step 12: Deployment Setup
@common/agent-orchestrator "Prepare for deployment:
- @general/deployment-specialist: Configure deployment pipeline
- @platforms/codeberg/codeberg-workflow-manager: Set up CI/CD
- @general/ci-cd-manager: Create deployment scripts"

# Step 13: Platform Configuration
@platforms/codeberg/codeberg-specialist "Configure Codeberg repository:
- Set up branch protection rules
- Configure repository secrets
- Set up deployment environments
- Configure webhook integrations"
```

## 🔄 Agent Coordination Examples

### Complex Multi-Agent Workflow

```bash
@common/agent-orchestrator "Full authentication system implementation:
1. @general/code-architect: System architecture and design patterns
2. @domains/api/api-designer: API design and implementation
3. @domains/api/database-specialist: Database design and optimization
4. @common/security-auditor: Security implementation and audit
5. @domains/ui/ui-ux-designer: Frontend design and implementation
6. @common/test-engineer: Comprehensive testing strategy
7. @common/code-reviewer: Code quality and security review
8. @common/performance-optimizer: Performance analysis and optimization
9. @common/documentation-maintainer: Complete documentation
10. @general/deployment-specialist: Deployment configuration
11. @platforms/codeberg/codeberg-specialist: Platform-specific setup"
```

### Specialized Agent Calls

```bash
# Security-focused review
@common/security-auditor "Audit authentication system for:
- OWASP Top 10 vulnerabilities
- Password security best practices
- Session management security
- API security (authentication, authorization)
- Data protection measures"

# Database performance analysis
@domains/api/database-specialist "Optimize authentication database:
- Analyze query performance
- Design proper indexes
- Implement connection pooling
- Set up database monitoring
- Plan backup and recovery strategy"

# UI/UX design review
@domains/ui/ui-ux-designer "Design authentication user experience:
- Create wireframes and mockups
- Implement responsive design
- Ensure accessibility compliance
- Design error states and feedback
- Create consistent design system"
```

## 📊 Benefits of @foldername/agentname Format

### 1. Clear Agent Organization
- **@common/**: Core functionality (always available)
- **@domains/**: Business domain specialists
- **@general/**: General-purpose tools
- **@platforms/**: Platform-specific tools

### 2. Easy Agent Discovery
```bash
# Find all API-related agents
@domains/api/*

# Find all security tools
@common/security-auditor

# Find platform-specific tools
@platforms/codeberg/*
```

### 3. Consistent Workflow Patterns
```bash
# Standard development workflow
@common/agent-orchestrator "Coordinate:
- @general/code-architect: Design
- @domains/api/api-designer: Implementation
- @common/test-engineer: Testing
- @common/code-reviewer: Review"
```

### 4. Platform Awareness
```bash
# Platform-specific setup
@platforms/codeberg/codeberg-specialist "Configure repository"
@platforms/github/github-specialist "Configure repository"  # When available
```

## 🎉 Success Metrics

After implementing this workflow:

- ✅ Secure authentication system
- ✅ Comprehensive test coverage
- ✅ Performance optimized
- ✅ Fully documented
- ✅ Platform configured
- ✅ Team collaboration enhanced

The new @foldername/agentname format makes complex multi-agent coordination clear, organized, and maintainable!
