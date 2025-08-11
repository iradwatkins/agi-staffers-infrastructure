# Complete MCP Setup & Auto-Usage Rules

## 🎯 MCP Server Installation & Configuration

### 1. **Ref-Tools MCP** - Smart Documentation Search
```json
{
  "ref-tools": {
    "command": "npx",
    "args": ["ref-tools-mcp@latest"],
    "env": {
      "REF_API_KEY": "YOUR_API_KEY_HERE"
    }
  }
}
```
**Auto-triggers**: When searching for API docs, library documentation, or technical references

### 2. **Filesystem MCP** - Secure File Operations
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem", "/Users/irawatkins/Documents/Cursor Setup"],
    "env": {}
  }
}
```
**Auto-triggers**: File operations, batch file processing, complex directory management

### 3. **Git MCP** - Version Control Operations
```json
{
  "git": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-git"],
    "env": {}
  }
}
```
**Auto-triggers**: Complex git operations, branch management, commit history analysis

### 4. **PostgreSQL MCP** - Database Operations
```json
{
  "postgres": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost:5432/stepperslife"],
    "env": {}
  }
}
```
**Auto-triggers**: Database queries, schema management, data analysis

### 5. **Semgrep MCP** - Security Scanning
```json
{
  "semgrep": {
    "command": "npx",
    "args": ["semgrep-mcp-server"],
    "env": {
      "SEMGREP_APP_TOKEN": "YOUR_SEMGREP_TOKEN"
    }
  }
}
```
**Auto-triggers**: Security audits, vulnerability scanning, code review

### 6. **ESLint MCP** - Code Quality
```json
{
  "eslint": {
    "command": "npx",
    "args": ["eslint-mcp-server"],
    "env": {}
  }
}
```
**Auto-triggers**: Code quality checks, linting, style enforcement

### 7. **Prettier MCP** - Code Formatting
```json
{
  "prettier": {
    "command": "npx",
    "args": ["prettier-mcp-server"],
    "env": {}
  }
}
```
**Auto-triggers**: Code formatting, style consistency

### 8. **Docker MCP** - Container Management
```json
{
  "docker": {
    "command": "npx",
    "args": ["docker-mcp-server"],
    "env": {}
  }
}
```
**Auto-triggers**: Container operations, Docker compose management

### 9. **AWS MCP** - Cloud Services
```json
{
  "aws": {
    "command": "npx",
    "args": ["aws-mcp-server"],
    "env": {
      "AWS_ACCESS_KEY_ID": "YOUR_KEY",
      "AWS_SECRET_ACCESS_KEY": "YOUR_SECRET",
      "AWS_REGION": "us-east-1"
    }
  }
}
```
**Auto-triggers**: AWS service operations, cloud deployments

### 10. **Memory MCP** - Knowledge Graph
```json
{
  "memory": {
    "command": "npx",
    "args": ["@modelcontextprotocol/server-memory"],
    "env": {}
  }
}
```
**Auto-triggers**: Long-term project memory, context preservation

## 📋 Claude Rules for Auto-MCP Usage

Add to CLAUDE.md:

```markdown
## MCP AUTO-USAGE RULES

### MANDATORY MCP ACTIVATION TRIGGERS

1. **Documentation Search**: 
   - ALWAYS use `ref-tools` MCP when searching for API docs, library docs, or technical references
   - DO NOT use WebSearch for technical documentation

2. **UI/UX Development**:
   - ALWAYS use `shadcn-ui` MCP when creating or modifying UI components
   - Auto-suggest shadcn components for any UI work

3. **Security Checks**:
   - Run `semgrep` MCP on every code commit
   - Scan for vulnerabilities before deployment
   - Check for OWASP Top 10 issues

4. **Code Quality**:
   - Use `serena` MCP for code analysis on every major function
   - Run `eslint` MCP before marking any task complete
   - Apply `prettier` MCP for consistent formatting

5. **Testing**:
   - Use `playwright` MCP for any browser-based testing
   - Create automated tests for new features

6. **Database Operations**:
   - Use `postgres` MCP for complex queries
   - Never use raw SQL in application code without MCP validation

7. **Git Operations**:
   - Use `git` MCP for complex branch operations
   - Auto-generate commit messages based on changes

8. **File Operations**:
   - Use `filesystem` MCP for batch operations
   - Prefer MCP over individual file commands for 3+ files

9. **Container Management**:
   - Use `docker` MCP for all container operations
   - Auto-check container health before deployments

10. **Memory & Context**:
    - Use `memory` MCP to store important project decisions
    - Save architectural choices and rationale

### MCP PRIORITY ORDER
1. Security (Semgrep) - Run first on any code changes
2. Documentation (Ref-tools) - Check docs before implementation
3. UI Components (shadcn-ui) - Use for all UI work
4. Code Quality (Serena, ESLint) - Run before completion
5. Testing (Playwright) - Validate all changes

### AUTOMATIC TRIGGERS
- File edits > 3 files → Filesystem MCP
- UI component creation → shadcn-ui MCP
- API integration → Ref-tools MCP
- Code completion → ESLint + Prettier MCP
- Deployment prep → Semgrep + Docker MCP
```

## 🚀 Installation Script

```bash
#!/bin/bash
# install-all-mcp.sh

echo "🚀 Installing all MCP servers..."

# Core MCP servers
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-memory

# Additional servers
npm install -g ref-tools-mcp
npm install -g semgrep-mcp-server
npm install -g eslint-mcp-server
npm install -g prettier-mcp-server
npm install -g docker-mcp-server
npm install -g aws-mcp-server

echo "✅ All MCP servers installed!"
```

## 🔧 Cursor/VS Code Settings Update

Add to `.vscode/settings.json`:

```json
{
  "mcp.autoTriggers": {
    "documentation": ["ref-tools"],
    "ui-components": ["shadcn-ui"],
    "security": ["semgrep"],
    "code-quality": ["eslint", "prettier", "serena"],
    "testing": ["playwright"],
    "database": ["postgres"],
    "git": ["git"],
    "files": ["filesystem"],
    "containers": ["docker"]
  },
  "mcp.priorities": {
    "security": 1,
    "documentation": 2,
    "ui-components": 3,
    "code-quality": 4,
    "testing": 5
  }
}
```

## 📊 MCP Usage Dashboard

Track MCP usage with this monitoring setup:

```typescript
// mcp-monitor.ts
interface MCPUsage {
  server: string;
  tool: string;
  timestamp: Date;
  duration: number;
  success: boolean;
  context?: string;
}

class MCPMonitor {
  private usage: MCPUsage[] = [];
  
  logUsage(usage: MCPUsage) {
    this.usage.push(usage);
    this.checkAutoTriggers(usage);
  }
  
  checkAutoTriggers(usage: MCPUsage) {
    // Auto-suggest related MCPs
    if (usage.tool.includes('search') && !usage.server.includes('ref')) {
      console.warn('Consider using ref-tools for documentation search');
    }
    if (usage.context?.includes('UI') && !usage.server.includes('shadcn')) {
      console.warn('Consider using shadcn-ui for UI components');
    }
  }
  
  generateReport() {
    // Weekly usage report
    const report = {
      totalCalls: this.usage.length,
      byServer: this.groupBy(this.usage, 'server'),
      avgDuration: this.average(this.usage.map(u => u.duration)),
      successRate: this.usage.filter(u => u.success).length / this.usage.length
    };
    return report;
  }
}
```

## 🎯 BMAD Integration

### Benchmark Phase
- **Playwright MCP**: Automated testing
- **Semgrep MCP**: Security benchmarks

### Model Phase  
- **shadcn-ui MCP**: Component modeling
- **Ref-tools MCP**: Documentation-driven design

### Analyze Phase
- **Serena MCP**: Code analysis
- **ESLint MCP**: Quality metrics
- **Git MCP**: Change analysis

### Deliver Phase
- **Docker MCP**: Container deployment
- **AWS MCP**: Cloud delivery
- **Filesystem MCP**: Asset management

## 🔑 API Keys Needed

1. **REF_API_KEY**: Sign up at https://ref.tools
2. **SEMGREP_APP_TOKEN**: Get from https://semgrep.dev
3. **GITHUB_PERSONAL_ACCESS_TOKEN**: Already configured
4. **AWS credentials**: For AWS MCP
5. **Database URLs**: For postgres MCP

## ✅ Testing Checklist

- [ ] Ref-tools: Search for "Next.js 14 app router documentation"
- [ ] Shadcn-ui: Generate a new Button component
- [ ] Semgrep: Scan current project for vulnerabilities
- [ ] Playwright: Create a simple test
- [ ] Git: Show recent commits with details
- [ ] Filesystem: List all TypeScript files
- [ ] Docker: List running containers
- [ ] Postgres: Query database schema
- [ ] ESLint: Check code quality
- [ ] Memory: Store project decision

Ready to implement comprehensive MCP automation!