#!/bin/bash

echo "🧹 SteppersLife - Complete Supabase Removal Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backup directory
BACKUP_DIR="/root/stepperslife-backup-$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}Step 1: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r /root/stepperslife/src "$BACKUP_DIR/"
cp /root/stepperslife/.env* "$BACKUP_DIR/" 2>/dev/null || true

echo -e "${YELLOW}Step 2: Removing Supabase environment variables...${NC}"

# Clean .env files
sed -i '/SUPABASE/d' /root/stepperslife/.env 2>/dev/null || true
sed -i '/supabase/d' /root/stepperslife/.env 2>/dev/null || true
sed -i '/SUPABASE/d' /root/stepperslife/.env.production 2>/dev/null || true
sed -i '/supabase/d' /root/stepperslife/.env.production 2>/dev/null || true
sed -i '/SUPABASE/d' /root/stepperslife/.env.local 2>/dev/null || true
sed -i '/supabase/d' /root/stepperslife/.env.local 2>/dev/null || true

echo -e "${YELLOW}Step 3: Removing Supabase client files...${NC}"

# Remove Supabase integration files
rm -rf /root/stepperslife/src/integrations/supabase/ 2>/dev/null || true
rm -f /root/stepperslife/src/services/supabaseClassService.ts 2>/dev/null || true

echo -e "${YELLOW}Step 4: Creating stub files for removed Supabase functionality...${NC}"

# Create stub auth context (removes Supabase auth)
cat > /root/stepperslife/src/contexts/AuthContext.tsx << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // TODO: Implement your new auth system here
    console.log('Sign in requested for:', email);
    setUser({ id: '1', email, name: email });
  };

  const signOut = async () => {
    setUser(null);
  };

  const signUp = async (email: string, password: string) => {
    // TODO: Implement your new auth system here
    console.log('Sign up requested for:', email);
    setUser({ id: '1', email, name: email });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
EOF

# Create stub client (removes Supabase client)
mkdir -p /root/stepperslife/src/lib
cat > /root/stepperslife/src/lib/database.ts << 'EOF'
// Database client (no longer using Supabase)
// TODO: Replace with your new database connection

export const db = {
  from: (table: string) => ({
    select: (fields?: string) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
};

export default db;
EOF

echo -e "${YELLOW}Step 5: Updating service files to remove Supabase calls...${NC}"

# Update files that import Supabase
find /root/stepperslife/src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | while read file; do
  if grep -q "supabase\|@supabase" "$file"; then
    echo "Updating: $file"
    
    # Replace Supabase imports with stub
    sed -i "s|import.*supabase.*from.*|import { db } from '../lib/database';|g" "$file"
    sed -i "s|import.*@supabase.*||g" "$file"
    
    # Replace common Supabase patterns
    sed -i "s|supabase\.from|db.from|g" "$file"
    sed -i "s|supabase\.auth|// TODO: Replace auth calls|g" "$file"
    sed -i "s|supabase\.storage|// TODO: Replace storage calls|g" "$file"
  fi
done

echo -e "${YELLOW}Step 6: Fixing MIME type configuration...${NC}"

# Check if nginx config exists and fix MIME types
if [ -f /etc/nginx/sites-available/default ]; then
  # Add proper MIME types for JavaScript modules
  if ! grep -q "application/javascript" /etc/nginx/sites-available/default; then
    sed -i '/location \/ {/a\        location ~* \\.js$ {\n            add_header Content-Type application/javascript;\n        }' /etc/nginx/sites-available/default
    nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true
  fi
fi

echo -e "${YELLOW}Step 7: Clean rebuild without Supabase...${NC}"
cd /root/stepperslife
rm -rf node_modules/.vite dist
npm run build

echo -e "${GREEN}✅ Supabase removal completed!${NC}"
echo -e "${YELLOW}Backup created at: $BACKUP_DIR${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your database calls to use your new database"
echo "2. Implement proper authentication system"
echo "3. Test all functionality"

echo -e "${GREEN}🚀 Ready to restart services!${NC}"