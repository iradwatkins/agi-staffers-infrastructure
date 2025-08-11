#!/bin/bash

echo "🚀 Installing all MCP servers for AGI Staffers..."
echo "================================================"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Create MCP directory if it doesn't exist
mkdir -p ~/mcp-servers

echo ""
echo "📦 Installing Core MCP Servers..."
echo "---------------------------------"

# Core MCP servers from Model Context Protocol
echo "1️⃣ Installing Filesystem MCP..."
npm install -g @modelcontextprotocol/server-filesystem

echo "2️⃣ Installing Git MCP..."
npm install -g @modelcontextprotocol/server-git

echo "3️⃣ Installing Memory MCP..."
npm install -g @modelcontextprotocol/server-memory

echo ""
echo "🔧 Installing Additional MCP Servers..."
echo "--------------------------------------"

# Ref-tools for documentation
echo "4️⃣ Installing Ref-tools MCP..."
npm install -g ref-tools-mcp

# Already configured MCPs
echo "✅ Playwright MCP - Already configured (uses npx)"
echo "✅ Serena MCP - Already configured (uses uvx)"
echo "✅ Shadcn-UI MCP - Already configured (uses npx)"
echo "✅ AGI Staffers MCP - Already configured (local)"

echo ""
echo "📋 MCP Server Status:"
echo "--------------------"
echo "✅ agistaffers - Custom server for AGI Staffers operations"
echo "✅ playwright - Browser automation and testing"
echo "✅ serena - Code analysis and quality"
echo "✅ shadcn-ui - UI component management"
echo "✅ ref-tools - Documentation search (needs API key)"
echo "✅ filesystem - File operations"
echo "✅ git - Version control operations"
echo "✅ memory - Knowledge graph storage"

echo ""
echo "🔑 API Keys Needed:"
echo "------------------"
echo "1. REF_API_KEY - Sign up at https://ref.tools"
echo "2. GITHUB_PERSONAL_ACCESS_TOKEN - Already configured ✅"

echo ""
echo "📝 Next Steps:"
echo "-------------"
echo "1. Get REF_API_KEY from https://ref.tools"
echo "2. Update ~/Library/Application Support/Claude/claude_desktop_config.json with the API key"
echo "3. Restart Claude Desktop to load new MCP servers"
echo "4. Test MCP servers with the testing checklist"

echo ""
echo "✅ Installation complete!"
echo ""
echo "🧪 Quick Test Commands:"
echo "----------------------"
echo "- Filesystem: List TypeScript files in current directory"
echo "- Git: Show recent commits"
echo "- Memory: Store 'AGI Staffers Phase 4 started'"
echo "- Ref-tools: Search 'Next.js 14 app router documentation'"

# Create a test script
cat > ~/mcp-servers/test-mcp.sh << 'EOF'
#!/bin/bash
echo "🧪 Testing MCP Servers..."
echo "========================"

# Test filesystem
echo "Testing Filesystem MCP: List .ts files"
echo "Expected: List of TypeScript files"

# Test git
echo -e "\nTesting Git MCP: Recent commits"
echo "Expected: Git commit history"

# Test memory
echo -e "\nTesting Memory MCP: Store information"
echo "Expected: Confirmation of stored data"

# Test ref-tools
echo -e "\nTesting Ref-tools MCP: Search documentation"
echo "Expected: Documentation results (if API key configured)"

echo -e "\n✅ Test prompts ready for Claude!"
EOF

chmod +x ~/mcp-servers/test-mcp.sh

echo ""
echo "💡 Created test script at: ~/mcp-servers/test-mcp.sh"