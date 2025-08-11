#!/bin/bash

echo "🗄️  Setting up metrics tables in PostgreSQL..."

# Database connection details
DB_HOST="148.230.93.174"
DB_PORT="5432"
DB_NAME="stepperslife"
DB_USER="postgres"
DB_PASS="password"

# Connection string
export PGPASSWORD="$DB_PASS"

# Run the SQL script
echo "📊 Creating metrics tables..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "/Users/irawatkins/Documents/Cursor Setup/agistaffers/scripts/create-metrics-tables.sql"

if [ $? -eq 0 ]; then
    echo "✅ Metrics tables created successfully!"
    
    # Verify tables were created
    echo ""
    echo "📋 Verifying tables..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt metrics_* container_* alerts_*"
    
    echo ""
    echo "📋 Verifying views..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dv metrics_*"
else
    echo "❌ Failed to create metrics tables"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Tables created:"
echo "  - metrics_history: Stores system metrics every 5 seconds"
echo "  - container_metrics: Stores individual container metrics"
echo "  - alerts_history: Stores all triggered alerts"
echo ""
echo "Views created:"
echo "  - metrics_hourly: Hourly averages of metrics"
echo "  - metrics_daily: Daily aggregates of metrics"