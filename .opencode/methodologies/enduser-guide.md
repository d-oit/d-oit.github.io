# Creating Custom Agents, Commands, and Plugins

This comprehensive guide provides step-by-step instructions for creating custom agents, commands, and plugins within the OpenCode framework. Learn how to extend the framework's capabilities for your specific project needs.

## Agent Creation Guide

### Step 1: Assess the Need
Before creating a new agent, evaluate:
- Does an existing agent already handle this functionality?
- Is this a specialized domain or task that requires custom logic?
- Will this agent be reusable across multiple projects?
- What are the specific inputs, outputs, and success criteria?

### Step 2: Define Agent Structure
Create a new agent file following this template:

```markdown
# [Agent Name] Development Agent System

You are a specialized agent for [specific domain/task] that integrates seamlessly with the OpenCode.ai CLI interface.

## Core Identity & Approach

You are a [specialization] agent that:
- [Key capability 1]
- [Key capability 2]
- [Key capability 3]
- Validates every action with success/failure verification
- Maintains comprehensive documentation

## Implementation Strategy

### 1. [Phase 1 Name]
- [Detailed implementation steps]
- [Specific techniques and patterns]
- [Validation and testing approaches]

### 2. [Phase 2 Name]
- [Next phase implementation]
- [Integration requirements]
- [Quality assurance measures]

## Pre-Implementation Analysis Protocol

### Mandatory Analysis Before Any Actions
**CRITICAL**: Never proceed without completing this analysis first

#### 1. [Analysis Area 1]
- [Specific analysis criteria]
- [Risk assessment factors]
- [Validation requirements]

#### 2. [Analysis Area 2]
- [Additional analysis areas]
- [Dependency mapping]
- [Impact assessment]

## OpenCode.ai CLI Integration

### Available Commands
Based on OpenCode.ai documentation, use only these verified commands:
- `opencode` - Start interactive mode
- `opencode /path/to/project` - Start in specific directory
- `opencode run [message..]` - Non-interactive mode
- [Other relevant commands]

## Success Verification Protocol

For every implementation, validate:
1. [Success criteria 1]
2. [Success criteria 2]
3. [Success criteria 3]

## Creating New Components

### When to Create New Agents
Create new agents when you need specialized functionality:

```bash
@general/agent-creator "Create [type] agent for [specific purpose]"
```

### When to Create New Commands
Create custom commands for reusable workflows:

```bash
@general/command-creator "Create command for [specific workflow]"
```

### When to Create New Plugins
Create plugins for specialized validation and integration:

```bash
@general/agent-creator "Create plugin for [specific functionality]"
```

## Unified Component Inclusion

To use all available OpenCode components:

```bash
@common/agent-orchestrator "Execute [task] using all available components:

**Core Agents:**
- @common/agent-orchestrator (coordination)
- @common/code-reviewer (quality assurance)
- [Other relevant agents]

**All Commands, Plugins, and Validation Rules:**
- Include all custom commands from .opencode/command/
- Activate all plugins from .opencode/plugin/
- Apply all validation rules from .opencode/validation/

**Workflow:** [Specific workflow description]"
```

Remember: **ASSESS FIRST, DESIGN SECOND, IMPLEMENT THIRD** - Every component must be preceded by thorough analysis, every implementation must be validated, and every component must integrate seamlessly with the framework.
```

### Step 3: Implement Agent Logic
- Define the agent's specific capabilities and limitations
- Implement the core functionality and decision-making logic
- Add comprehensive error handling and validation
- Include success/failure verification protocols

### Step 4: Test and Validate
- Test the agent with various scenarios
- Validate integration with existing OpenCode components
- Ensure proper error handling and recovery
- Document usage examples and edge cases

## Command Creation Guide

### Step 1: Identify the Workflow
Determine what specific workflow or process the command will automate:
- Is this a repetitive task that can be standardized?
- What are the inputs, outputs, and dependencies?
- Will this command be used across multiple projects?

### Step 2: Design Command Structure
Create a command file with this structure:

```markdown
---
description: Brief description of what the command does and when to use it
agent: [appropriate-agent-name]
---

Execute [command purpose] with $ARGUMENTS configuration.

**Current Status:**
!`[shell command to check current status]`

**Configuration Check:**
!`[shell command to validate configuration]`

**Readiness Validation:**
!`[shell command to check readiness]`

Please execute [command purpose] with the following approach:

1. **Preparation**: Set up environment and validate prerequisites
2. **Execution**: Perform the main command operations
3. **Validation**: Verify results and check for issues
4. **Reporting**: Provide comprehensive results and recommendations

**[Specific sections based on command type]**

Provide comprehensive [command purpose] report with validation results and actionable insights.
```

### Step 3: Implement Command Logic
- Define the specific steps and actions the command will perform
- Include parameter validation and error handling
- Add integration points with other OpenCode components
- Implement logging and progress tracking

### Step 4: Test Command Execution
- Test the command with various parameter combinations
- Validate error handling and edge cases
- Ensure proper integration with the OpenCode framework
- Document any limitations or prerequisites

## Plugin Creation Guide

### Step 1: Identify Plugin Purpose
Determine what specific functionality the plugin will provide:
- Is this for validation, integration, or automation?
- What existing functionality will it extend or enhance?
- How will it integrate with the OpenCode ecosystem?

### Step 2: Design Plugin Architecture
Create a plugin file with this structure:

```javascript
// [Plugin Name] Plugin

module.exports = {
  name: '[plugin-name]',
  version: '1.0.0',
  description: 'Plugin description and purpose',
  
  // Plugin metadata
  author: 'Your Name',
  repository: 'repository-url',
  license: 'MIT',
  
  // Configuration schema
  config: {
    enabled: {
      type: 'boolean',
      default: true,
      description: 'Enable/disable the plugin'
    },
    // Additional configuration options
    option1: {
      type: 'string',
      default: 'default-value',
      description: 'Description of option1'
    }
  },
  
  // Plugin hooks
  hooks: {
    // Pre-hook: Runs before a specific action
    'pre:[action]': async function(context) {
      // Pre-action logic
      return context;
    },
    
    // Post-hook: Runs after a specific action
    'post:[action]': async function(context, result) {
      // Post-action logic
      return result;
    },
    
    // Validation hook
    'validate:[component]': async function(component) {
      // Validation logic
      return {
        valid: true/false,
        errors: [],
        warnings: []
      };
    }
  },
  
  // Plugin methods
  methods: {
    // Custom methods
    customMethod: async function(params) {
      // Method implementation
      return result;
    }
  },
  
  // Initialization
  init: async function(config) {
    // Plugin initialization logic
    console.log('Plugin initialized:', this.name);
  },
  
  // Cleanup
  destroy: async function() {
    // Plugin cleanup logic
    console.log('Plugin destroyed:', this.name);
  }
};
```

### Step 3: Implement Plugin Logic
- Define the plugin's core functionality and hooks
- Implement proper error handling and validation
- Add configuration management and initialization logic
- Include cleanup and resource management

### Step 4: Test Plugin Integration
- Test the plugin with various OpenCode components
- Validate hook execution and error handling
- Ensure proper configuration management
- Test plugin loading and unloading

## Best Practices for Component Creation

### General Guidelines
- **Single Responsibility**: Each component should have one clear purpose
- **Documentation**: Include comprehensive documentation and examples
- **Testing**: Implement thorough testing for all functionality
- **Error Handling**: Provide robust error handling and recovery
- **Integration**: Ensure seamless integration with existing components

### Agent-Specific Best Practices
- **Clear Scope**: Define the agent's specific domain and limitations
- **Validation Protocols**: Implement comprehensive success/failure verification
- **Resource Management**: Properly manage memory and external resources
- **Performance Monitoring**: Include performance tracking and optimization

### Command-Specific Best Practices
- **Parameter Validation**: Implement thorough input validation
- **Progress Tracking**: Provide clear progress indicators for long-running commands
- **Error Recovery**: Include retry logic and graceful error handling
- **Documentation**: Provide clear usage examples and parameter descriptions

### Plugin-Specific Best Practices
- **Hook Design**: Design hooks that don't interfere with core functionality
- **Configuration**: Provide flexible configuration options
- **Performance**: Ensure plugins don't negatively impact system performance
- **Compatibility**: Test across different environments and configurations

## Integration Patterns

### Using Multiple Components Together
```bash
# Example: Create a comprehensive development workflow
@common/agent-orchestrator "Execute development workflow using custom components:

**Custom Agents:**
- @[custom-agent-1] (specific functionality)
- @[custom-agent-2] (additional functionality)

**Custom Commands:**
- opencode run '.opencode/command/[custom-command-1].md'
- opencode run '.opencode/command/[custom-command-2].md'

**Custom Plugins:**
- [custom-plugin-1] for validation
- [custom-plugin-2] for integration

**Workflow:** [Describe the complete workflow]"
```

### Component Communication
- Use standardized interfaces for component interaction
- Implement proper event handling and messaging
- Provide clear APIs and documentation for integration
- Test component interactions thoroughly

## Testing and Validation

### Component Testing Strategy
- **Unit Tests**: Test individual component functionality
- **Integration Tests**: Test component interaction with OpenCode framework
- **End-to-End Tests**: Test complete workflows using custom components
- **Performance Tests**: Validate performance impact of custom components

### Validation Checklist
- [ ] Component follows established naming conventions
- [ ] Comprehensive documentation is provided
- [ ] All functionality is thoroughly tested
- [ ] Error handling is robust and user-friendly
- [ ] Integration with existing components is seamless
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed

## Deployment and Maintenance

### Deployment Process
1. Test the component in a development environment
2. Validate integration with existing OpenCode components
3. Update documentation and usage examples
4. Deploy to staging environment for further testing
5. Deploy to production with monitoring in place

### Maintenance Guidelines
- Monitor component performance and usage
- Keep documentation current and accurate
- Plan for updates and version management
- Provide user support and feedback collection
- Regularly review and improve component functionality

## Troubleshooting Component Creation

### Common Issues and Solutions

#### Agent Not Responding
```bash
# Check agent configuration
opencode run "Validate agent configuration"

# Test agent connectivity
@general/opencode-help "Test agent connectivity"
```

#### Command Execution Errors
```bash
# Validate command syntax
opencode run ".opencode/command/validate-results.md"

# Check command dependencies
ls .opencode/command/
```

#### Plugin Loading Issues
```bash
# Test plugin loading
./.opencode/tests/test-runner --plugins

# Check plugin configuration
cat .opencode/plugin/[plugin-name].js
```

### Getting Help
```bash
# Get framework-specific help
@general/opencode-help "Guide me through component creation"

# Access creation examples
cat .opencode/docs/examples/agent-format-cheat-sheet.md

# Check troubleshooting documentation
cat .opencode/docs/TROUBLESHOOTING.md
```

## Advanced Component Patterns

### Composite Components
Create components that combine multiple agents, commands, and plugins:

```bash
@common/agent-orchestrator "Create composite component for [complex task]:
- Use @[custom-agent-1] for analysis
- Execute [custom-command-1] for implementation
- Apply [custom-plugin-1] for validation
- Integrate with all existing OpenCode components"
```

### Domain-Specific Frameworks
Build specialized frameworks for specific domains:

```bash
# Healthcare domain framework
@general/agent-creator "Create healthcare-framework with specialized agents, commands, and plugins for medical software development"

# Financial domain framework
@general/agent-creator "Create financial-framework with compliance agents, audit commands, and security plugins"
```

## Resources and Support

### Documentation Resources
- **OpenCode Framework Docs**: https://opencode.ai/docs/
- **Component Examples**: `.opencode/docs/examples/`
- **Best Practices**: Framework documentation and guidelines
- **Community Resources**: OpenCode community forums and examples

### Professional Support
```bash
# Get professional guidance
@general/opencode-help "Get expert guidance for [specific component creation]"

# Request advanced assistance
@common/agent-orchestrator "Provide advanced component creation support"
```

Remember: **DESIGN WITH INTEGRATION IN MIND** - Every custom component must integrate seamlessly with the OpenCode framework, follow established patterns, and provide comprehensive documentation for successful adoption and maintenance.
