#!/bin/bash

# Migration script to PostgreSQL-backed push notification API
echo "🔄 Migrating Push Notification API to PostgreSQL..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Backup current server.js
echo -e "\n${YELLOW}Step 1: Backing up current server.js${NC}"
cp server.js server-inmemory.js
check_status "Backup created: server-inmemory.js"

# Step 2: Replace server.js with PostgreSQL version
echo -e "\n${YELLOW}Step 2: Switching to PostgreSQL version${NC}"
cp server-pg.js server.js
check_status "PostgreSQL server.js activated"

# Step 3: Update .env file with database credentials
echo -e "\n${YELLOW}Step 3: Adding database configuration to .env${NC}"
cat >> .env << EOF

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stepperslife
DB_USER=postgres
DB_PASSWORD=postgres
EOF
check_status "Database configuration added"

# Step 4: Install PostgreSQL dependency
echo -e "\n${YELLOW}Step 4: Installing PostgreSQL package${NC}"
npm install
check_status "Dependencies installed"

# Step 5: Test database connection locally
echo -e "\n${YELLOW}Step 5: Testing database connection${NC}"
node -e "
const db = require('./database');
db.checkDatabaseConnection().then(result => {
  if (result.connected) {
    console.log('✓ Database connection successful');
    process.exit(0);
  } else {
    console.error('✗ Database connection failed:', result.error);
    process.exit(1);
  }
}).catch(err => {
  console.error('✗ Error:', err);
  process.exit(1);
});
" || {
    echo -e "${RED}Database connection test failed. Please check your PostgreSQL credentials.${NC}"
    echo "Reverting to in-memory version..."
    cp server-inmemory.js server.js
    exit 1
}

echo -e "\n${GREEN}✅ Migration completed successfully!${NC}"
echo "================================================"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Deploy to VPS: ./deploy-push-api.sh"
echo "2. Test the API: ./test-push-notifications.sh"
echo "3. Monitor logs: ssh agi-vps 'docker logs -f push-notification-api'"
echo -e "\n${YELLOW}Rollback instructions:${NC}"
echo "If needed, revert to in-memory version:"
echo "  cp server-inmemory.js server.js"
echo "  ./deploy-push-api.sh"