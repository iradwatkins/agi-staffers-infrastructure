// Additional notification endpoints for specific alert types
// To be added to the main server.js file

// Container down notification
app.post('/api/notify/container-down', async (req, res) => {
    const { containerName, timestamp } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '🚨 Container Down',
            body: `Container ${containerName} is not running`,
            type: 'container-down',
            filterPreference: 'container_down'
        });
        
        res.json({ success: true, message: 'Container down notification sent' });
    } catch (error) {
        console.error('Container down notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// High CPU notification
app.post('/api/notify/high-cpu', async (req, res) => {
    const { usage, threshold, containerName } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '⚠️ High CPU Usage',
            body: `CPU usage at ${usage}% (threshold: ${threshold}%)${containerName ? ` on ${containerName}` : ''}`,
            type: 'high-cpu',
            filterPreference: 'performance'
        });
        
        res.json({ success: true, message: 'High CPU notification sent' });
    } catch (error) {
        console.error('High CPU notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Low memory notification
app.post('/api/notify/low-memory', async (req, res) => {
    const { available, threshold, containerName } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '⚠️ Low Memory',
            body: `Memory available: ${available}% (threshold: ${threshold}%)${containerName ? ` on ${containerName}` : ''}`,
            type: 'low-memory',
            filterPreference: 'performance'
        });
        
        res.json({ success: true, message: 'Low memory notification sent' });
    } catch (error) {
        console.error('Low memory notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Low disk space notification
app.post('/api/notify/low-disk', async (req, res) => {
    const { available, threshold, path = '/' } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '⚠️ Low Disk Space',
            body: `Disk space at ${path}: ${available}% free (threshold: ${threshold}%)`,
            type: 'low-disk',
            filterPreference: 'performance'
        });
        
        res.json({ success: true, message: 'Low disk notification sent' });
    } catch (error) {
        console.error('Low disk notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Backup completion notification
app.post('/api/notify/backup-complete', async (req, res) => {
    const { success, backupName, error } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: success ? '✅ Backup Complete' : '❌ Backup Failed',
            body: success 
                ? `Backup "${backupName}" completed successfully`
                : `Backup "${backupName}" failed: ${error}`,
            type: 'backup',
            filterPreference: 'backups'
        });
        
        res.json({ success: true, message: 'Backup notification sent' });
    } catch (error) {
        console.error('Backup notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Deployment notification
app.post('/api/notify/deployment', async (req, res) => {
    const { serviceName, version, status } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '🚀 Deployment Update',
            body: `${serviceName} ${version} deployment ${status}`,
            type: 'deployment',
            filterPreference: 'deployments'
        });
        
        res.json({ success: true, message: 'Deployment notification sent' });
    } catch (error) {
        console.error('Deployment notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Security alert notification
app.post('/api/notify/security-alert', async (req, res) => {
    const { severity, message, source } = req.body;
    
    try {
        await broadcastToSubscribers({
            title: '🔒 Security Alert',
            body: `[${severity.toUpperCase()}] ${message}${source ? ` (from ${source})` : ''}`,
            type: 'security',
            filterPreference: 'security'
        });
        
        res.json({ success: true, message: 'Security notification sent' });
    } catch (error) {
        console.error('Security notification error:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

module.exports = { /* export if needed */ };