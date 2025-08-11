# MCP and Cursor Tools Setup Guide

## 🎯 Current Status

### ✅ MCP Servers Configured (4/4)

1. **agistaffers** ✅
   - Location: `/Users/irawatkins/agistaffers-mcp/server.js`
   - Tools: check_website, check_server_status, restart_server, backup_server, deploy_website, chat_with_ollama
   - Integration: N8N webhooks for automation

2. **playwright** ✅
   - Command: `npx @playwright/mcp@latest`
   - Purpose: Testing and benchmarking (BMAD Method - Benchmark phase)

3. **serena** ✅
   - Command: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server`
   - Purpose: Code analysis and quality (BMAD Method - Analyze phase)

4. **shadcn-ui** ✅
   - Command: `npx @jpisnice/shadcn-ui-mcp-server`
   - Purpose: UI component management (BMAD Method - Model phase)
   - Note: Has GitHub PAT configured

### 📱 Cursor IDE Settings

Located at: `~/Library/Application Support/Cursor/User/settings.json`

Current configurations:
- ✅ Auto-save enabled
- ✅ Format on save
- ✅ Git integration (auto-fetch, smart commit)
- ✅ SSH remote platform configured for agi-vps
- ✅ Material icon theme
- ✅ Word wrap enabled

## 🔧 MCP Server Testing

### Test AGI Staffers MCP Tools:

1. **Check Website Status**
   ```
   Tool: check_website
   Input: {"domain": "agistaffers.com"}
   Expected: Online status
   ```

2. **Check Server Status**
   ```
   Tool: check_server_status
   Expected: List of running containers
   ```

3. **Chat with Ollama**
   ```
   Tool: chat_with_ollama
   Input: {"message": "Hello, how are you?"}
   Expected: AI response
   ```

## 🚀 Recommended Cursor Extensions

### Essential Extensions for AGI Staffers Project:

1. **Error Lens** - Inline error highlighting
2. **Docker** - Container management
3. **Prisma** - Database schema support
4. **ESLint** - Code quality
5. **Prettier** - Code formatting
6. **GitLens** - Enhanced Git integration
7. **Thunder Client** - API testing
8. **Remote - SSH** - VPS connection

### BMAD Method Support Extensions:

1. **Todo Tree** - Task tracking
2. **Project Manager** - Workspace organization
3. **Better Comments** - Enhanced comment highlighting
4. **Markdown All in One** - Documentation support

## 📋 Setup Checklist

### MCP Servers:
- [x] agistaffers server installed and configured
- [x] playwright MCP configured
- [x] serena MCP configured
- [x] shadcn-ui MCP configured
- [ ] Test all MCP tools are responding
- [ ] Verify N8N webhook integration

### Cursor IDE:
- [x] Basic settings configured
- [x] SSH remote access to VPS
- [ ] Install recommended extensions
- [ ] Configure workspace-specific settings
- [ ] Set up debugging configurations

### Integration Points:
- [ ] MCP tools accessible from Claude
- [ ] Cursor can connect to VPS via SSH
- [ ] Git integration working
- [ ] Database tools configured

## 🔄 Next Steps

1. **Test MCP Tools**
   - Run each tool to verify functionality
   - Check N8N webhook connections
   - Ensure Ollama integration works

2. **Install Cursor Extensions**
   - Use Command Palette: "Extensions: Install Extensions"
   - Search and install recommended extensions
   - Configure extension settings

3. **Create Workspace Settings**
   - Add `.vscode/settings.json` to project
   - Configure TypeScript strict mode
   - Set up linting rules
   - Configure formatters

4. **Set Up Debugging**
   - Create `.vscode/launch.json`
   - Configure Node.js debugging
   - Set up Chrome debugging for Next.js

## 📝 Workspace Settings Template

Create `/Users/irawatkins/Documents/Cursor Setup/.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.exclude": {
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true,
    "**/node_modules": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/*.code-search": true,
    "**/dist": true,
    "**/build": true
  }
}
```

## 🎯 BMAD Method Integration

### How MCP Servers Support BMAD:

1. **BENCHMARK** (Playwright MCP)
   - Performance testing
   - User flow validation
   - Cross-browser testing

2. **MODEL** (shadcn-ui MCP)
   - Component generation
   - UI consistency
   - Design system management

3. **ANALYZE** (Serena MCP)
   - Code quality analysis
   - Security scanning
   - Best practices enforcement

4. **DELIVER** (AGI Staffers MCP)
   - Deployment automation
   - Server management
   - Backup operations

## 🔗 Quick References

- MCP Config: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Cursor Settings: `~/Library/Application Support/Cursor/User/settings.json`
- AGI Staffers MCP: `/Users/irawatkins/agistaffers-mcp/`
- Project Root: `/Users/irawatkins/Documents/Cursor Setup/`

---

Ready to proceed with MCP testing and Cursor extension setup!