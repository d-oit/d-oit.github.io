---
description: Create new OpenCode agents with proper validation, integration, and best practices
agent: general/agent-creator

---

Create a new OpenCode agent for: $ARGUMENTS

**Existing Agents:**
!`find .opencode/agent -name "*.md" | wc -l` agents currently available

**Agent Template Structure:**
!`find .opencode/agent/ -name "*.md" | head -5`

**Project Context:**
!`cat opencode.json | jq '.agents' 2>/dev/null || echo "No agent configuration found"`

Please create a new OpenCode agent with the following specifications:

1. **Requirements Analysis**: Analyze the domain requirements and integration needs
2. **Agent Design**: Design agent capabilities, tool permissions, and collaboration patterns
3. **Implementation**: Generate the agent configuration file with proper markdown formatting
4. **Validation**: Ensure the agent follows OpenCode standards and best practices

**Agent Requirements:**

- **Single Responsibility**: Clear, focused area of expertise
- **Minimal Permissions**: Only necessary tool access (read, write, edit, bash, etc.)
- **Clear Integration**: Well-defined collaboration patterns with existing agents
- **Comprehensive Documentation**: Complete usage documentation and examples

**Quality Standards:**

- Markdown compliance with proper frontmatter
- Valid tool permissions and settings
- Robust error handling and recovery patterns
- Performance optimized execution

Provide the complete agent configuration file and integration instructions.
