const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database functions
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3008;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure web-push with VAPID details
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@agistaffers.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Initialize database on startup
db.initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await db.checkDatabaseConnection();
  res.json({ 
    status: 'ok', 
    service: 'AGI Push Notification API',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  const { subscription, userId = 'default' } = req.body;
  
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }
  
  try {
    // Store subscription in database
    await db.saveSubscription(userId, subscription);
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
    const removed = await db.removeSubscription(userId);
    if (removed) {
      console.log(`Subscription removed for user: ${userId}`);
      res.json({ success: true, message: 'Unsubscribed successfully' });
    } else {
      res.status(404).json({ error: 'Subscription not found' });
    }
  } catch (error) {
    console.error('Error removing subscription:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Update preferences endpoint
app.post('/api/preferences', async (req, res) => {
  const { userId = 'default', preferences } = req.body;
  
  try {
    const updated = await db.updatePreferences(userId, preferences);
    res.json({ success: true, preferences: updated });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get preferences endpoint
app.get('/api/preferences/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const preferences = await db.getPreferences(userId);
    res.json({ success: true, preferences });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

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
    const subscription = await db.getSubscription(userId);
    
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
      await db.saveNotificationHistory(userId, { title, body, data }, 'sent');
      console.log(`Notification sent to user: ${userId}`);
      res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
      console.error('Error sending notification:', error);
      await db.saveNotificationHistory(userId, { title, body, data }, 'failed', error.message);
      
      // If error is due to expired subscription, remove it
      if (error.statusCode === 410) {
        await db.removeSubscription(userId);
        res.status(410).json({ error: 'Subscription expired' });
      } else {
        res.status(500).json({ error: 'Failed to send notification' });
      }
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
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
    const allSubscriptions = await db.getAllSubscriptions();
    const results = [];
    
    for (const { userId, subscription } of allSubscriptions) {
      try {
        await webpush.sendNotification(subscription, payload);
        await db.saveNotificationHistory(userId, { title, body, data }, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await db.saveNotificationHistory(userId, { title, body, data }, 'failed', error.message);
        
        if (error.statusCode === 410) {
          await db.removeSubscription(userId);
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
    console.error('Database error during broadcast:', error);
    res.status(500).json({ error: 'Database error' });
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
    const allSubscriptions = await db.getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences } of allSubscriptions) {
      // Check if user wants container down notifications
      if (!preferences.notify_container_down) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await db.saveNotificationHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await db.saveNotificationHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          await db.removeSubscription(userId);
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
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
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
    const allSubscriptions = await db.getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences } of allSubscriptions) {
      // Check if user wants high CPU notifications
      if (!preferences.notify_high_cpu) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await db.saveNotificationHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await db.saveNotificationHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          await db.removeSubscription(userId);
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
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
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
    const allSubscriptions = await db.getAllSubscriptions();
    const results = [];
    const payload = JSON.stringify(notification);
    
    for (const { userId, subscription, preferences } of allSubscriptions) {
      // Check if user wants low disk notifications
      if (!preferences.notify_low_disk) continue;
      
      try {
        await webpush.sendNotification(subscription, payload);
        await db.saveNotificationHistory(userId, notification, 'sent');
        results.push({ userId, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send to ${userId}:`, error.message);
        await db.saveNotificationHistory(userId, notification, 'failed', error.message);
        
        if (error.statusCode === 410) {
          await db.removeSubscription(userId);
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
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// List all subscriptions (for debugging)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const allSubscriptions = await db.getAllSubscriptions();
    const subs = allSubscriptions.map(({ userId, subscription }) => ({
      userId,
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime
    }));
    
    res.json({
      count: subs.length,
      subscriptions: subs
    });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get notification history
app.get('/api/history/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;
  
  try {
    const history = await db.getNotificationHistory(userId, parseInt(limit));
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error getting notification history:', error);
    res.status(500).json({ error: 'Failed to get notification history' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Push Notification API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('Database: PostgreSQL persistence enabled');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await db.pool.end();
  process.exit(0);
});