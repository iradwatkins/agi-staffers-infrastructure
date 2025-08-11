#\!/bin/bash

echo "🚀 Installing VS Code Extensions for PWA Development"
echo "=================================================="

# Check if code command is available
if \! command -v code &> /dev/null; then
    echo "❌ VS Code 'code' command not found in PATH"
    echo "📝 To fix: Open VS Code → Cmd+Shift+P → 'Shell Command: Install 'code' command in PATH'"
    exit 1
fi

echo ""
echo "📦 Installing PWA Development Extensions..."
echo "----------------------------------------"

# PWA Development
echo "1️⃣ Installing PWA Studio..."
code --install-extension jenkey2011.vscode-pwa-studio 2>/dev/null || echo "   Alternative: Try 'PWA Tools' by johnpapa"

# API Testing
echo "2️⃣ Installing Thunder Client..."
code --install-extension rangav.vscode-thunder-client

# Console Logging
echo "3️⃣ Installing Turbo Console Log..."
code --install-extension ChakrounAnas.turbo-console-log

# Additional useful extensions for PWA
echo "4️⃣ Installing Service Worker Debugger..."
code --install-extension johnpapa.vscode-serviceworker 2>/dev/null || echo "   Note: May need manual search in Extensions"

echo ""
echo "✅ Installation complete\!"
echo ""
echo "📝 Next Steps:"
echo "-------------"
echo "1. Restart VS Code to activate extensions"
echo "2. Configure Thunder Client with API endpoints:"
echo "   - Metrics API: https://admin.agistaffers.com/api/metrics"
echo "   - Push API: https://admin.agistaffers.com/api/push"
echo "3. Use Turbo Console Log shortcuts:"
echo "   - Cmd+Option+L: Insert console.log"
echo "   - Cmd+Option+D: Delete all console.logs"
echo ""
echo "🎯 Ready for PWA development\!"
