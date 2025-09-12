# OpenCode Template Troubleshooting Guide

This guide provides solutions to common issues encountered when using the OpenCode template repository.

## Table of Contents
1. [Quick Diagnosis](#quick-diagnosis)
2. [Agent Issues](#agent-issues)
3. [Plugin Problems](#plugin-problems)
4. [Validation Errors](#validation-errors)
5. [Repository Link Issues](#repository-link-issues)
6. [Orchestration Failures](#orchestration-failures)
7. [Build and Deployment Issues](#build-and-deployment-issues)
8. [Performance Problems](#performance-problems)
9. [Getting Help](#getting-help)

## Quick Diagnosis

### System Health Check
```bash
# Check OpenCode installation
opencode --version

# Verify template structure
ls -la .opencode/

# Test basic functionality
opencode run "echo 'Template test'"
```

### Common Symptoms and Solutions

| Symptom | Likely Cause | Quick Fix |
|---------|-------------|-----------|
| Agents not responding | Configuration issue | Check `opencode.json` permissions |
| Plugins not loading | File permission issue | Verify plugin file permissions |
| Validation failures | Rule configuration error | Review validation JSON files |
| Orchestration timeouts | Resource constraints | Reduce parallel agents or increase timeout |
| Build failures | Missing dependencies | Run `npm install` |

## Agent Issues

### Agent Not Found
**Problem**: `@agent-name` commands return "agent not found"

**Solutions**:
1. **Check agent file exists**:
   ```bash
   opencode @agent-name --help
   ```

2. **Verify agent configuration**:
   ```bash
   opencode @agent-name --info | head -20
   ```

3. **Check file permissions**:
   ```bash
   ls -la .opencode/agent/agent-name.md
   ```

4. **Restart OpenCode session**:
   ```bash
   # Close and restart your OpenCode session
   # Or check if OpenCode process is running
   ps aux | grep opencode
   ```

### Agent Execution Errors
**Problem**: Agent starts but fails during execution

**Solutions**:
1. **Check tool permissions** in `opencode.json`:
   ```json
   {
     "permission": {
       "read": true,
       "write": true,
       "bash": true
     }
   }
   ```

2. **Review agent logs**:
   ```bash
   # Check OpenCode logs if available
   cat .opencode/logs/*.log 2>/dev/null || echo "No logs found"
   ```

3. **Test individual tools**:
   ```bash
   # Test read tool
   cat .opencode/agent/agent-name.md

   # Test bash tool
   pwd
   ```

### Agent Communication Issues
**Problem**: Agents can't share context or results

**Solutions**:
1. **Check AGENTS.md context**:
   ```bash
   cat AGENTS.md | grep -A 5 -B 5 "Context"
   ```

2. **Update project context**:
   ```bash
   # Edit AGENTS.md to update project context
   nano AGENTS.md
   ```

3. **Verify agent mode settings**:
   ```bash
   opencode @agent-name --info | grep "mode:"
   ```

## Plugin Problems

### Plugin Not Loading
**Problem**: Plugin functionality not working

**Solutions**:
1. **Check plugin file syntax**:
   ```bash
   node -c .opencode/plugin/plugin-name.js
   ```

2. **Verify plugin exports**:
   ```javascript
   // Plugin should export a function
   export const PluginName = async ({ client, $ }) => {
     // plugin code
   };
   ```

3. **Test plugin in isolation**:
   ```bash
   node .opencode/plugin/plugin-name.js
   ```

### Plugin Execution Errors
**Problem**: Plugin throws errors during execution

**Solutions**:
1. **Check error logs**:
   ```bash
   # Check for any error logs
   find .opencode -name "*.log" -exec cat {} \;
   ```

2. **Validate plugin dependencies**:
   ```bash
   # Check if plugin uses undefined variables
   grep -n "undefined" .opencode/plugin/plugin-name.js
   ```

3. **Test plugin hooks**:
   ```javascript
   // Test before/after hooks
   return {
     tool: {
      execute: {
        before: async (input, output) => {
          console.log('Plugin executing before:', input);
        },
        after: async (input, output) => {
          console.log('Plugin executing after:', output);
        }
      }
    }
   };
   ```

### Plugin Conflicts
**Problem**: Multiple plugins interfering with each other

**Solutions**:
1. **Disable plugins temporarily**:
   ```bash
   # Rename plugin file
   mv .opencode/plugin/plugin-name.js .opencode/plugin/plugin-name.js.disabled
   ```

2. **Check plugin execution order**:
   ```bash
   # Plugins execute in alphabetical order
   ls .opencode/plugin/*.js | sort
   ```

3. **Review plugin interactions**:
   ```bash
   # Check for conflicting tool overrides
   grep -r "tool:" .opencode/plugin/
   ```

## Validation Errors

### Invalid JSON Configuration
**Problem**: Validation rules files have syntax errors

**Solutions**:
1. **Validate JSON syntax**:
   ```bash
   cat .opencode/validation/rules.json | jq .
   ```

2. **Check for common JSON errors**:
   ```bash
   # Missing commas
   cat .opencode/validation/rules.json | grep -n ","
   ```

3. **Use JSON validator**:
   ```bash
   npm install -g jsonlint
   jsonlint .opencode/validation/rules.json
   ```

### Validation Rule Conflicts
**Problem**: Multiple validation rules contradict each other

**Solutions**:
1. **Review rule priorities**:
   ```json
   {
     "rules": {
       "rule1": { "priority": 1 },
       "rule2": { "priority": 2 }
     }
   }
   ```

2. **Check for overlapping patterns**:
   ```bash
   grep -r "pattern" .opencode/validation/
   ```

3. **Test rules individually**:
   ```bash
   # Create test file
   echo "test code" > test-validation.js

   # Check validation rules manually
   cat .opencode/validation/code-quality-rules.json
   ```

### False Positive Issues
**Problem**: Validation incorrectly flags valid code

**Solutions**:
1. **Add false positive patterns**:
   ```json
   {
     "false_positive_patterns": [
       {
         "pattern": "custom_pattern",
         "description": "Custom valid pattern",
         "auto_dismiss": true
       }
     ]
   }
   ```

2. **Adjust confidence thresholds**:
   ```json
   {
     "confidence_threshold": 0.8
   }
   ```

3. **Review validation context**:
   ```bash
   # Check what context validation has
   cat AGENTS.md | grep -A 10 -B 10 "Technology Stack"
   ```

## Repository Link Issues

### Incorrect Repository Links
**Problem**: Documentation contains placeholder or incorrect repository links

**Solutions**:
1. **Run automatic link update**:
   ```bash
   # Automatic detection and update
   ./.opencode/tests/test-runner --update-links

   # Or run the updater directly
   node .opencode/tests/enhanced-link-updater.js
   ```

2. **Manual link verification**:
   ```bash
   # Check current git remote
   git remote -v

   # Verify repository links in documentation
   grep -r "github.com\|codeberg.org\|gitlab.com" docs/
   ```

3. **Update git remote if needed**:
   ```bash
   # Set correct remote repository
   git remote set-url origin https://your-platform.com/your-org/your-repo.git

   # Then update links
   ./.opencode/tests/test-runner --update-links
   ```

### Repository Platform Not Supported
**Problem**: Git hosting platform not recognized by the link updater

**Solutions**:
1. **Check supported platforms**:
   ```bash
   # The system supports:
   # - GitHub (github.com)
   # - Codeberg (codeberg.org)
   # - GitLab (gitlab.com)
   # - Bitbucket (bitbucket.org)
   ```

2. **Manual link updates**:
   ```bash
   # Edit files manually if platform not supported
   nano README.md
   nano docs/*.md
   ```

3. **Request platform support**:
   ```bash
   # File an issue for new platform support
   # (Link will be automatically updated to correct repository)
   ```

### Link Update Fails
**Problem**: Automatic link update process fails

**Solutions**:
1. **Check git repository**:
   ```bash
   # Ensure you are in a git repository
   git status

   # Verify remote is set
   git remote -v
   ```

2. **Check file permissions**:
   ```bash
   # Ensure write permissions on documentation files
   ls -la README.md docs/
   ```

3. **Run with verbose output**:
   ```bash
   # Get detailed output
   node .opencode/tests/enhanced-link-updater.js
   ```

## Orchestration Failures

### Parallel Execution Issues
**Problem**: Agents fail when running in parallel

**Solutions**:
1. **Reduce parallel agents**:
   ```bash
   # Use sequential execution instead
   echo "Use sequential agent execution"
   ```

2. **Check resource usage**:
   ```bash
   # Monitor system resources
   free -h
   df -h
   ```

3. **Implement agent dependencies**:
   ```bash
   # Run agents one by one
   echo "Execute agents sequentially"
   ```

### Swarm Mode Problems
**Problem**: Swarm iterations don't converge or loop infinitely

**Solutions**:
1. **Set iteration limits**:
   ```bash
   # Configure swarm limits in agent settings
   echo "Configure iteration limits in agent configuration"
   ```

2. **Define convergence criteria**:
   ```bash
   # Set convergence criteria in agent config
   echo "Define convergence criteria"
   ```

3. **Monitor swarm progress**:
   ```bash
   # Check agent logs for progress
   find .opencode -name "*.log" -exec cat {} \;
   ```

### Result Aggregation Errors
**Problem**: Orchestrator can't combine agent outputs

**Solutions**:
1. **Check output formats**:
   ```bash
   # Ensure agents use consistent output format
   echo "Verify agent output formats"
   ```

2. **Review aggregation logic**:
   ```bash
   cat .opencode/agent/agent-orchestrator.md | grep -A 10 "Result Aggregation"
   ```

3. **Test individual agent outputs**:
   ```bash
   # Test agents individually
   opencode @agent1 --help
   opencode @agent2 --help
   ```

## Build and Deployment Issues

### Dependency Problems
**Problem**: Build fails due to missing or conflicting dependencies

**Solutions**:
1. **Check package.json**:
   ```bash
   cat package.json | jq .dependencies
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for version conflicts**:
   ```bash
   npm ls --depth=0
   ```

### Build Tool Configuration
**Problem**: Build tools not configured correctly

**Solutions**:
1. **Verify build scripts**:
   ```json
   {
     "scripts": {
       "build": "vite build",
       "test": "vitest",
       "lint": "eslint src"
     }
   }
   ```

2. **Check configuration files**:
   ```bash
   ls -la vite.config.* tsconfig.json
   ```

3. **Test build tools individually**:
   ```bash
   npm run build
   npm run test
   ```

### Deployment Failures
**Problem**: Deployment commands fail

**Solutions**:
1. **Check deployment configuration**:
   ```bash
   cat .opencode/command/deployment/deploy-staging.md
   ```

2. **Verify environment variables**:
   ```bash
   # Check for required env vars
   grep -r "process.env" src/
   ```

3. **Test deployment steps manually**:
   ```bash
   # Test each deployment step
   npm run build
   npm run test
   # Then test deployment command
   ```

## Performance Problems

### Slow Agent Execution
**Problem**: Agents take too long to complete tasks

**Solutions**:
1. **Profile agent performance**:
   ```bash
   # Time agent execution
   time opencode @agent-name --help
   ```

2. **Optimize agent configuration**:
   ```bash
   # Reduce analysis scope
   echo "Configure agent scope in settings"
   ```

3. **Check system resources**:
   ```bash
   free -h
   df -h
   ```

### Memory Issues
**Problem**: Agents run out of memory

**Solutions**:
1. **Increase Node.js memory limit**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. **Process large files in chunks**:
   ```bash
   # Configure chunk size in agent settings
   echo "Configure chunk processing"
   ```

3. **Monitor memory usage**:
   ```bash
   ps aux | grep node
   ```

### High CPU Usage
**Problem**: Agent processes consume too much CPU

**Solutions**:
1. **Limit concurrent operations**:
   ```bash
   # Configure sequential execution
   echo "Use sequential processing"
   ```

2. **Add processing delays**:
   ```bash
   # Configure delays in agent settings
   echo "Add processing delays"
   ```

3. **Profile CPU usage**:
   ```bash
   ps aux | grep node
   ```

## Getting Help

### Documentation Resources
1. **Template Usage Guide**: `.opencode/docs/TEMPLATE-USAGE.md`
2. **Agent Documentation**: `.opencode/agent/[agent-name].md`
3. **OpenCode Documentation**: https://opencode.ai/docs/

### Community Support
1. **Issues**: Report bugs and request features
2. **Community Forum**: Join discussions with other users
3. **Discord Channel**: Real-time help and discussions

### Professional Services
1. **OpenCode Consulting**: Expert setup and customization
2. **Template Training**: Learn to use the template effectively
3. **Custom Development**: Specialized agent and plugin development

### Diagnostic Commands
```bash
# Generate system report
uname -a
node --version
npm --version

# Check OpenCode configuration
cat opencode.json
cat AGENTS.md | head -20

# List all available resources
ls -la .opencode/
```

### Emergency Procedures
1. **Stop all agents**: `Ctrl+C`
2. **Reset session**: Close and restart OpenCode session
3. **Clear cache**: `rm -rf .opencode/cache/`
4. **Restore from backup**: `git checkout -- .`

---

*This troubleshooting guide should be updated as new issues are discovered and resolved.*
