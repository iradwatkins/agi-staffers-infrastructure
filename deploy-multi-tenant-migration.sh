#!/bin/bash

echo "🗄️ Deploying Multi-Tenant Database Migration..."

# Copy migration files to VPS
echo "📦 Copying migration files..."
scp -r agistaffers/prisma/migrations/20250110_multi_tenant_schema root@72.60.28.175:/root/agistaffers/prisma/migrations/

# Copy updated schema
echo "📄 Copying updated schema..."
scp agistaffers/prisma/schema.prisma root@72.60.28.175:/root/agistaffers/prisma/

# SSH to VPS and run migration
echo "🚀 Running migration on VPS..."
ssh root@72.60.28.175 << 'EOF'
cd /root/agistaffers

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

# Run migration
echo "🗄️ Applying database migration..."
npx prisma migrate deploy

# Check migration status
echo "✅ Checking migration status..."
npx prisma migrate status

echo "✅ Migration complete!"
EOF

echo "✅ Multi-tenant database schema deployed!"