#!/bin/bash
# Script to store MCP API keys in Vault on VPS

echo "🔐 Storing MCP API Keys in Vault"
echo "================================"

# API Keys to store
GITHUB_TOKEN="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"
EXA_API_KEY="b85913a0-1aeb-4dcd-b21a-a83b9ec61ffd"
FIRECRAWL_API_KEY="fc-b8dceff8862b4da482614bcf0ff001d6"
PIECES_API_KEY="${PIECES_API_KEY:-your-pieces-api-key-here}"
CONTEXT7_API_KEY="${CONTEXT7_API_KEY:-your-context7-api-key-if-required}"
SEMGREP_TOKEN="${SEMGREP_APP_TOKEN:-optional-for-cloud-features}"

# Connect to VPS and store in Vault
ssh agi-vps << EOF
# Check if Vault is running
if ! docker ps | grep -q vault; then
    echo "Starting Vault container..."
    docker start vault || echo "Vault container not found"
fi

# Wait for Vault to be ready
sleep 2

# Use the dev token for Vault access
export VAULT_TOKEN="agistaffers-vault-token"
export VAULT_ADDR="http://localhost:8200"

# Enable KV secrets engine if not already enabled
docker exec vault vault secrets enable -path=mcp kv 2>/dev/null || echo "KV already enabled"

# Store API keys
echo "Storing API keys in Vault..."

docker exec vault vault kv put mcp/github \
    token="$GITHUB_TOKEN" \
    description="GitHub Personal Access Token for shadcn-ui MCP"

docker exec vault vault kv put mcp/exa \
    api_key="$EXA_API_KEY" \
    description="Exa API Key for intelligent web search"

docker exec vault vault kv put mcp/firecrawl \
    api_key="$FIRECRAWL_API_KEY" \
    description="Firecrawl API Key for web scraping"

docker exec vault vault kv put mcp/pieces \
    api_key="$PIECES_API_KEY" \
    description="Pieces API Key for code snippets"

docker exec vault vault kv put mcp/context7 \
    api_key="$CONTEXT7_API_KEY" \
    description="Context7 API Key (optional)"

docker exec vault vault kv put mcp/semgrep \
    token="$SEMGREP_TOKEN" \
    description="Semgrep Token (optional for cloud features)"

echo ""
echo "✅ API keys stored in Vault"
echo ""
echo "To retrieve keys from Vault:"
echo "docker exec vault vault kv get mcp/github"
echo "docker exec vault vault kv get mcp/exa"
echo "docker exec vault vault kv get mcp/firecrawl"
echo "docker exec vault vault kv get mcp/pieces"
echo ""
EOF

echo ""
echo "================================"
echo "Local MCP configuration update needed!"
echo ""
echo "Please update ~/.cursor/mcp.json with the API keys"
echo "or set them as environment variables before use."