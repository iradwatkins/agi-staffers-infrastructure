-- Create metrics history table
CREATE TABLE IF NOT EXISTS metrics_history (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cpu_usage DECIMAL(5,2),
    memory_used BIGINT,
    memory_total BIGINT,
    memory_percentage DECIMAL(5,2),
    disk_used BIGINT,
    disk_total BIGINT,
    disk_available BIGINT,
    disk_percentage DECIMAL(5,2),
    network_rx BIGINT,
    network_tx BIGINT,
    containers_running INTEGER,
    containers_total INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_metrics_history_timestamp ON metrics_history(timestamp DESC);

-- Create container metrics table
CREATE TABLE IF NOT EXISTS container_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    container_id VARCHAR(64),
    container_name VARCHAR(255),
    status VARCHAR(50),
    cpu_percentage DECIMAL(5,2),
    memory_used BIGINT,
    memory_limit BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on container metrics
CREATE INDEX IF NOT EXISTS idx_container_metrics_timestamp ON container_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_container_metrics_name ON container_metrics(container_name, timestamp DESC);

-- Create alerts history table
CREATE TABLE IF NOT EXISTS alerts_history (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(255),
    threshold_id VARCHAR(255),
    alert_name VARCHAR(255),
    metric_name VARCHAR(50),
    metric_value DECIMAL(10,2),
    threshold_value DECIMAL(10,2),
    operator VARCHAR(10),
    severity VARCHAR(20),
    message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by VARCHAR(255)
);

-- Create index on alerts
CREATE INDEX IF NOT EXISTS idx_alerts_history_timestamp ON alerts_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_history_threshold ON alerts_history(threshold_id, timestamp DESC);

-- Create a function to clean old metrics (keep last 30 days)
CREATE OR REPLACE FUNCTION clean_old_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM metrics_history WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
    DELETE FROM container_metrics WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
    DELETE FROM alerts_history WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a view for hourly metrics averages
CREATE OR REPLACE VIEW metrics_hourly AS
SELECT
    date_trunc('hour', timestamp) AS hour,
    AVG(cpu_usage) AS avg_cpu,
    AVG(memory_percentage) AS avg_memory,
    AVG(disk_percentage) AS avg_disk,
    AVG(network_rx) AS avg_network_rx,
    AVG(network_tx) AS avg_network_tx,
    AVG(containers_running) AS avg_containers_running,
    COUNT(*) AS sample_count
FROM metrics_history
GROUP BY date_trunc('hour', timestamp)
ORDER BY hour DESC;

-- Create a view for daily metrics averages
CREATE OR REPLACE VIEW metrics_daily AS
SELECT
    date_trunc('day', timestamp) AS day,
    AVG(cpu_usage) AS avg_cpu,
    MAX(cpu_usage) AS max_cpu,
    AVG(memory_percentage) AS avg_memory,
    MAX(memory_percentage) AS max_memory,
    AVG(disk_percentage) AS avg_disk,
    MIN(disk_available) AS min_disk_available,
    SUM(network_rx) AS total_network_rx,
    SUM(network_tx) AS total_network_tx,
    AVG(containers_running) AS avg_containers_running,
    COUNT(*) AS sample_count
FROM metrics_history
GROUP BY date_trunc('day', timestamp)
ORDER BY day DESC;