const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3011;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure web-push with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@agistaffers.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Try to load database module
let db = null;
let useDatabase = false;
let dbStatus = { connected: false, error: 'Not initialized' };

// In-memory fallback storage
const subscriptions = new Map();
const preferences = new Map();
const notificationHistory = [];

// Initialize database if available
async function initializeStorage() {
  try {
    db = require('./database');
    await db.initializeDatabase();
    dbStatus = await db.checkDatabaseConnection();
    useDatabase = dbStatus.connected;
    
    if (useDatabase) {
      console.log('✅ PostgreSQL database connected successfully');
    } else {
      console.log('⚠️  PostgreSQL not available, using in-memory storage');
    }
  } catch (error) {
    console.log('⚠️  Database module not available or connection failed:', error.message);
    console.log('⚠️  Using in-memory storage (subscriptions will be lost on restart)');
    useDatabase = false;
    dbStatus = { connected: false, error: error.message };
  }
}

// Initialize storage on startup
initializeStorage().catch(console.error);

// Health check endpoint
app.get('/health', async (req, res) => {
  const currentDbStatus = useDatabase && db 
    ? await db.checkDatabaseConnection() 
    : dbStatus;
    
  res.json({ 
    status: 'ok', 
    service: 'AGI Push Notification API',
    timestamp: new Date().toISOString(),
    database: currentDbStatus,
    storage: useDatabase ? 'PostgreSQL' : 'In-Memory',
    subscriptions: useDatabase ? 'Check /api/subscriptions' : subscriptions.size
  });
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  const { subscription, userId = 'default' } = req.body;
  
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }
  
  try {
    if (useDatabase && db) {
      await db.saveSubscription(userId, subscription);
    } else {
      subscriptions.set(userId, subscription);
      // Create default preferences
      if (!preferences.has(userId)) {
        preferences.set(userId, {
          notify_container_down: true,
          notify_high_cpu: true,
          notify_low_memory: true,
          notify_low_disk: true,
          notify_deployments: true,
          notify_security: true
        });
      }
    }
    
    console.log(`Subscription stored for user: ${userId}`);
    res.json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe endpoint
app.post('/api/unsubscribe', async (req, res) => {
  const { userId = 'default' } = req.body;
  
  try {
    if (useDatabase && db) {
      const removed = await db.removeSubscription(userId);
      if (removed) {
        console.log(`Subscription removed for user: ${userId}`);
        res.json({ success: true, message: 'Unsubscribed successfully' });
      } else {
        res.status(404).json({ error: 'Subscription not found' });
      }
    } else {
      if (subscriptions.has(userId)) {
        subscriptions.delete(userId);
        preferences.delete(userId);
        console.log(`Subscription removed for user: ${userId}`);
        res.json({ success: true, message: 'Unsubscribed successfully' });
      } else {
        res.status(404).json({ error: 'Subscription not found' });
      }
    }
  } catch (error) {
    console.error('Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Update preferences endpoint
app.post('/api/preferences', async (req, res) => {
  const { userId = 'default', preferences: prefs } = req.body;
  
  try {
    if (useDatabase && db) {
      const updated = await db.updatePreferences(userId, prefs);
      res.json({ success: true, preferences: updated });
    } else {
      const currentPrefs = preferences.get(userId) || {};
      const updatedPrefs = { ...currentPrefs, ...prefs };
      preferences.set(userId, updatedPrefs);
      res.json({ success: true, preferences: updatedPrefs });
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get preferences endpoint
app.get('/api/preferences/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    if (useDatabase && db) {
      const prefs = await db.getPreferences(userId);
      res.json({ success: true, preferences: prefs });
    } else {
      const prefs = preferences.get(userId);
      res.json({ success: true, preferences: prefs || null });
    }
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

// Helper function to save notification history
async function saveHistory(userId, notification, status, errorMessage = null) {
  if (useDatabase && db) {
    await db.saveNotificationHistory(userId, notification, status, errorMessage);
  } else {
    notificationHistory.push({
      userId,
      title: notification.title,
      body: notification.body,
      type: notification.data?.type || 'general',
      data: notification.data || {},
      status,
      error_message: errorMessage,
      sent_at: new Date()
    });
    // Keep only last 1000 entries
    if (notificationHistory.length > 1000) {
      notificationHistory.shift();
    }
  }
}

// Helper function to get subscription
async function getSubscription(userId) {
  if (useDatabase && db) {
    return await db.getSubscription(userId);
  } else {
    return subscriptions.get(userId);
  }
}

// Helper function to get all subscriptions
async function getAllSubscriptions() {
  if (useDatabase && db) {
    return await db.getAllSubscriptions();
  } else {
    const result = [];
    for (const [userId, subscription] of subscriptions) {
      result.push({
        userId,
        subscription,
        preferences: preferences.get(userId) || {
          notify_container_down: true,
          notify_high_cpu: true,
          notify_low_memory: true,
          notify_low_disk: true,
          notify_deployments: true,
          notify_security: true
        }
      });
    }
    return result;
  }
}

// Send notification endpoint
app.post('/api/send-notification', async (req, res) => {
  const { 
    userId = 'default', 
    title = 'AGI Staffers Alert',
    body = 'You have a new notification',
    icon = '/icon-192x192.png',
    badge = '/icon-192x192.png',
    data = {},
    actions = []
  } = req.body;
  
  try {
    const subscription = await getSubscription(userId);
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found for user' });
    }
    
    const payload = JSON.stringify({
      title,
      body,
      icon,
      badge,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      actions
    });
    
    try {
      await webpush.sendNotification(subscription, payload);
      await saveHistory(userId, { title, body, data }, 'sent');
      console.log(`Notification sent to user: ${userId}`);
      res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
      console.error('Error sending notification:', error);
      await saveHistory(userId, { title, body, data }, 'failed', error.message);
      
      // If error is due to expired subscription, remove it
      if (error.statusCode === 410) {
        if (useDatabase && db) {
          await db.removeSubscription(userId);
        } else {
          subscriptions.delete(userId);
          preferences.delete(userId);
        }
        res.status(410).json({ error: 'Subscription expired' });
      } else {
        res.status(500).json({ error: 'Failed to send notification' });
      }
    }
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

// Broadcast notification to all subscribers
app.post('/api/broadcast', async (req, res) => {
  const { 
    title = 'AGI Staffers Broadcast',
    body = 'System-wide notification',
    icon = '/icon-192x192.png',
    badge = '/icon-192x192.png',
    data = {}
  } = req.body;
  
  const payload = JSON.stringify({
    title,
    body,
    icon,
    badge,
    data: {
      ...data,
      timestamp: new Date().toISOString()
    }
  });
  
  try {
    const allSubscriptions = await getAllSubscriptions();
    const results = [];
    
    for (const { userId, subscription } of allSubscriptions) {
      try {
        await webpush.sendNotification(subscription, payload);
        await saveHistory(userId, { title, body, data }, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await saveHistory(userId, { title, body, data }, 'failed', error.message);
        
        if (error.statusCode === 410) {
          if (useDatabase && db) {
            await db.removeSubscription(userId);
          } else {
            subscriptions.delete(userId);
            preferences.delete(userId);
          }
          results.push({ userId, status: 'expired' });
        } else {
          results.push({ userId, status: 'failed' });
        }
      }
    }
    
    const successCount = results.filter(r => r.status === 'sent').length;
    console.log(`Broadcast sent: ${successCount}/${results.length} successful`);
    
    res.json({ 
      success: true, 
      results,
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount
      }
    });
  } catch (error) {
    console.error('Storage error during broadcast:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

// Docker monitoring integration endpoints
app.post('/api/notify/container-down', async (req, res) => {
  const { containerName, containerId } = req.body;
  
  const notification = {
    title: '🚨 Container Down',
    body: `Container ${containerName} has stopped`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      type: 'container-alert',
      containerName,
      containerId,
      severity: 'high'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'restart',
        title: 'Restart Container'
      }
    ]
  };
  
  // Broadcast to all subscribers with appropriate preferences
  try {
    const allSubscriptions = await getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences: prefs } of allSubscriptions) {
      // Check if user wants container down notifications
      if (!prefs || !prefs.notify_container_down) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await saveHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await saveHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          if (useDatabase && db) {
            await db.removeSubscription(userId);
          } else {
            subscriptions.delete(userId);
            preferences.delete(userId);
          }
          results.push({ userId, status: 'expired' });
        } else {
          results.push({ userId, status: 'failed' });
        }
      }
    }
    
    const successCount = results.filter(r => r.status === 'sent').length;
    console.log(`Container down alert sent: ${successCount}/${results.length} successful`);
    
    res.json({ 
      success: true, 
      alert: 'container-down',
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount
      }
    });
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

app.post('/api/notify/high-cpu', async (req, res) => {
  const { usage, threshold = 80 } = req.body;
  
  const notification = {
    title: '⚠️ High CPU Usage',
    body: `CPU usage is at ${usage}% (threshold: ${threshold}%)`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      type: 'performance-alert',
      metric: 'cpu',
      value: usage,
      threshold
    }
  };
  
  // Broadcast to all subscribers with appropriate preferences
  try {
    const allSubscriptions = await getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences: prefs } of allSubscriptions) {
      // Check if user wants high CPU notifications
      if (!prefs || !prefs.notify_high_cpu) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await saveHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await saveHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          if (useDatabase && db) {
            await db.removeSubscription(userId);
          } else {
            subscriptions.delete(userId);
            preferences.delete(userId);
          }
          results.push({ userId, status: 'expired' });
        } else {
          results.push({ userId, status: 'failed' });
        }
      }
    }
    
    const successCount = results.filter(r => r.status === 'sent').length;
    console.log(`High CPU alert sent: ${successCount}/${results.length} successful`);
    
    res.json({ 
      success: true, 
      alert: 'high-cpu',
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount
      }
    });
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

app.post('/api/notify/low-disk', async (req, res) => {
  const { available, threshold = 10 } = req.body;
  
  const notification = {
    title: '💾 Low Disk Space',
    body: `Only ${available}GB of disk space remaining`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      type: 'storage-alert',
      available,
      threshold
    }
  };
  
  // Broadcast to all subscribers with appropriate preferences
  try {
    const allSubscriptions = await getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences: prefs } of allSubscriptions) {
      // Check if user wants low disk notifications
      if (!prefs || !prefs.notify_low_disk) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await saveHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await saveHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          if (useDatabase && db) {
            await db.removeSubscription(userId);
          } else {
            subscriptions.delete(userId);
            preferences.delete(userId);
          }
          results.push({ userId, status: 'expired' });
        } else {
          results.push({ userId, status: 'failed' });
        }
      }
    }
    
    const successCount = results.filter(r => r.status === 'sent').length;
    console.log(`Low disk alert sent: ${successCount}/${results.length} successful`);
    
    res.json({ 
      success: true, 
      alert: 'low-disk',
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount
      }
    });
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

// List all subscriptions (for debugging)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const allSubscriptions = await getAllSubscriptions();
    const subs = allSubscriptions.map(({ userId, subscription }) => ({
      userId,
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime
    }));
    
    res.json({
      count: subs.length,
      subscriptions: subs,
      storage: useDatabase ? 'PostgreSQL' : 'In-Memory'
    });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    res.status(500).json({ error: 'Storage error' });
  }
});

// Get notification history
app.get('/api/history/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;
  
  try {
    if (useDatabase && db) {
      const history = await db.getNotificationHistory(userId, parseInt(limit));
      res.json({ success: true, history });
    } else {
      const userHistory = notificationHistory
        .filter(h => h.userId === userId)
        .slice(-parseInt(limit))
        .reverse();
      res.json({ success: true, history: userHistory });
    }
  } catch (error) {
    console.error('Error getting notification history:', error);
    res.status(500).json({ error: 'Failed to get notification history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Push Notification API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('Storage: Checking database availability...');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (useDatabase && db && db.pool) {
    await db.pool.end();
  }
  process.exit(0);
});