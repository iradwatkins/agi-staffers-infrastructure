// Push Notification API Server for AGI Staffers
// This server handles push subscriptions, preferences, and sending notifications

const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3011;

// VAPID keys (from environment or defaults)
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'Wdx6e2SOp6Bd1Y1YIAstxg_l7pcEwJObqXYXqlkIZ5E'
};

// Configure web-push
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@agistaffers.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:hes5SldOvxvh2llrZlwcjQXgj@stepperslife-db:5432/stepperslife'
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://admin.agistaffers.com', 'https://agistaffers.com'],
    credentials: true
}));
app.use(bodyParser.json());

// In-memory storage for subscriptions (should be persisted in production)
const subscriptions = new Map();
const preferences = new Map();

// Initialize database tables
async function initDatabase() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE NOT NULL,
                subscription JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS push_preferences (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) UNIQUE NOT NULL,
                preferences JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS push_notifications_log (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                title VARCHAR(255),
                body TEXT,
                type VARCHAR(50),
                sent_at TIMESTAMP DEFAULT NOW(),
                success BOOLEAN DEFAULT true,
                error TEXT
            )
        `);

        console.log('✅ Database tables initialized');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Routes

// Subscribe to push notifications
app.post('/api/subscribe', async (req, res) => {
    const { subscription, userId } = req.body;
    
    if (!subscription || !userId) {
        return res.status(400).json({ error: 'Missing subscription or userId' });
    }

    try {
        // Save to database
        await pool.query(
            `INSERT INTO push_subscriptions (user_id, subscription) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id) 
             DO UPDATE SET subscription = $2, updated_at = NOW()`,
            [userId, JSON.stringify(subscription)]
        );

        // Save to memory cache
        subscriptions.set(userId, subscription);

        // Send welcome notification
        await sendNotification(subscription, {
            title: '🎉 Notifications Enabled!',
            body: 'You will now receive real-time alerts from AGI Staffers Dashboard',
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
        });

        res.json({ success: true, message: 'Subscription saved' });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
});

// Unsubscribe from push notifications
app.post('/api/unsubscribe', async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        await pool.query('DELETE FROM push_subscriptions WHERE user_id = $1', [userId]);
        subscriptions.delete(userId);
        
        res.json({ success: true, message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
});

// Save notification preferences
app.post('/api/preferences', async (req, res) => {
    const { userId, preferences: userPrefs } = req.body;
    
    if (!userId || !userPrefs) {
        return res.status(400).json({ error: 'Missing userId or preferences' });
    }

    try {
        await pool.query(
            `INSERT INTO push_preferences (user_id, preferences) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id) 
             DO UPDATE SET preferences = $2, updated_at = NOW()`,
            [userId, JSON.stringify(userPrefs)]
        );

        preferences.set(userId, userPrefs);
        
        res.json({ success: true, message: 'Preferences saved' });
    } catch (error) {
        console.error('Preferences error:', error);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

// Send test notification
app.post('/api/test-notification', async (req, res) => {
    const { userId, title, body } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        const result = await pool.query(
            'SELECT subscription FROM push_subscriptions WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const subscription = result.rows[0].subscription;
        await sendNotification(subscription, {
            title: title || '🔔 Test Notification',
            body: body || 'This is a test notification from AGI Staffers',
            icon: '/icon-192x192.png'
        });

        res.json({ success: true, message: 'Test notification sent' });
    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json({ error: 'Failed to send test notification' });
    }
});

// Broadcast notification to all users
app.post('/api/broadcast', async (req, res) => {
    const { title, body, type = 'info', filterPreference } = req.body;
    
    if (!title || !body) {
        return res.status(400).json({ error: 'Missing title or body' });
    }

    try {
        const result = await pool.query('SELECT user_id, subscription FROM push_subscriptions');
        let sent = 0;
        let failed = 0;

        for (const row of result.rows) {
            const userId = row.user_id;
            const subscription = row.subscription;

            // Check user preferences if filter is specified
            if (filterPreference) {
                const prefResult = await pool.query(
                    'SELECT preferences FROM push_preferences WHERE user_id = $1',
                    [userId]
                );
                
                if (prefResult.rows.length > 0) {
                    const prefs = prefResult.rows[0].preferences;
                    if (!prefs[filterPreference]) {
                        continue; // Skip if user hasn't enabled this notification type
                    }
                }
            }

            try {
                await sendNotification(subscription, {
                    title,
                    body,
                    icon: '/icon-192x192.png',
                    data: { type, timestamp: Date.now() }
                });
                sent++;
            } catch (error) {
                console.error(`Failed to send to ${userId}:`, error);
                failed++;
            }
        }

        res.json({ 
            success: true, 
            message: `Broadcast sent to ${sent} users, ${failed} failed` 
        });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({ error: 'Failed to broadcast notification' });
    }
});

// Alert webhook endpoint (called by monitoring system)
app.post('/api/alert', async (req, res) => {
    const { type, severity, message, details } = req.body;
    
    const alertTypes = {
        'container-down': {
            title: '🚨 Container Down',
            preference: 'notify-container-down'
        },
        'high-cpu': {
            title: '⚠️ High CPU Usage',
            preference: 'notify-high-cpu'
        },
        'low-memory': {
            title: '⚠️ Low Memory',
            preference: 'notify-low-memory'
        },
        'low-disk': {
            title: '⚠️ Low Disk Space',
            preference: 'notify-low-disk'
        },
        'deployment': {
            title: '🚀 Deployment Update',
            preference: 'notify-deployments'
        },
        'security': {
            title: '🔒 Security Alert',
            preference: 'notify-security'
        }
    };

    const alertConfig = alertTypes[type] || {
        title: '🔔 System Alert',
        preference: null
    };

    try {
        await broadcastToSubscribers({
            title: alertConfig.title,
            body: message || 'System alert triggered',
            type: type,
            filterPreference: alertConfig.preference
        });

        res.json({ success: true, message: 'Alert sent' });
    } catch (error) {
        console.error('Alert error:', error);
        res.status(500).json({ error: 'Failed to send alert' });
    }
});

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

// Helper function to send notification
async function sendNotification(subscription, payload) {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        
        // Log successful notification
        await pool.query(
            `INSERT INTO push_notifications_log (title, body, type, success) 
             VALUES ($1, $2, $3, $4)`,
            [payload.title, payload.body, payload.type || 'info', true]
        );
    } catch (error) {
        console.error('Notification send error:', error);
        
        // Log failed notification
        await pool.query(
            `INSERT INTO push_notifications_log (title, body, type, success, error) 
             VALUES ($1, $2, $3, $4, $5)`,
            [payload.title, payload.body, payload.type || 'info', false, error.message]
        );
        
        throw error;
    }
}

// Helper function to broadcast to all subscribers with preference filtering
async function broadcastToSubscribers({ title, body, type, filterPreference }) {
    const result = await pool.query(`
        SELECT s.user_id, s.subscription, p.preferences 
        FROM push_subscriptions s
        LEFT JOIN push_preferences p ON s.user_id = p.user_id
    `);

    let sent = 0;
    let skipped = 0;

    for (const row of result.rows) {
        // Check preferences
        if (filterPreference && row.preferences) {
            if (!row.preferences[filterPreference]) {
                skipped++;
                continue;
            }
        }

        try {
            await sendNotification(row.subscription, {
                title,
                body,
                icon: '/icon-192x192.png',
                data: { type, timestamp: Date.now() }
            });
            sent++;
        } catch (error) {
            console.error(`Failed to send to ${row.user_id}:`, error);
        }
    }

    console.log(`Broadcast complete: ${sent} sent, ${skipped} skipped`);
    return { sent, skipped };
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        version: '1.0.0',
        subscriptions: subscriptions.size,
        vapidPublicKey: vapidKeys.publicKey
    });
});

// Start server
app.listen(port, () => {
    console.log(`🔔 Push Notification API running on port ${port}`);
    initDatabase();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server...');
    await pool.end();
    process.exit(0);
});