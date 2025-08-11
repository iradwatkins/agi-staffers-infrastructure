const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'stepperslife',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create push_subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        expiration_time BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create push_preferences table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_preferences (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES push_subscriptions(user_id) ON DELETE CASCADE,
        notify_container_down BOOLEAN DEFAULT true,
        notify_high_cpu BOOLEAN DEFAULT true,
        notify_low_memory BOOLEAN DEFAULT true,
        notify_low_disk BOOLEAN DEFAULT true,
        notify_deployments BOOLEAN DEFAULT true,
        notify_security BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notification_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notification_history (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        title VARCHAR(255),
        body TEXT,
        type VARCHAR(100),
        data JSONB,
        status VARCHAR(50),
        error_message TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_push_preferences_user_id ON push_preferences(user_id);
      CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON notification_history(sent_at);
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Subscription management functions
async function saveSubscription(userId, subscription) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert subscription
    const result = await client.query(`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, expiration_time)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        endpoint = EXCLUDED.endpoint,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        expiration_time = EXCLUDED.expiration_time,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [
      userId,
      subscription.endpoint,
      subscription.keys.p256dh,
      subscription.keys.auth,
      subscription.expirationTime
    ]);

    // Create default preferences if not exists
    await client.query(`
      INSERT INTO push_preferences (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `, [userId]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function removeSubscription(userId) {
  try {
    const result = await pool.query(
      'DELETE FROM push_subscriptions WHERE user_id = $1 RETURNING *',
      [userId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error removing subscription:', error);
    throw error;
  }
}

async function getSubscription(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM push_subscriptions WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      endpoint: row.endpoint,
      expirationTime: row.expiration_time,
      keys: {
        p256dh: row.p256dh,
        auth: row.auth
      }
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

async function getAllSubscriptions() {
  try {
    const result = await pool.query(`
      SELECT 
        s.user_id,
        s.endpoint,
        s.p256dh,
        s.auth,
        s.expiration_time,
        p.notify_container_down,
        p.notify_high_cpu,
        p.notify_low_memory,
        p.notify_low_disk,
        p.notify_deployments,
        p.notify_security
      FROM push_subscriptions s
      LEFT JOIN push_preferences p ON s.user_id = p.user_id
    `);
    
    return result.rows.map(row => ({
      userId: row.user_id,
      subscription: {
        endpoint: row.endpoint,
        expirationTime: row.expiration_time,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth
        }
      },
      preferences: {
        notify_container_down: row.notify_container_down ?? true,
        notify_high_cpu: row.notify_high_cpu ?? true,
        notify_low_memory: row.notify_low_memory ?? true,
        notify_low_disk: row.notify_low_disk ?? true,
        notify_deployments: row.notify_deployments ?? true,
        notify_security: row.notify_security ?? true
      }
    }));
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    throw error;
  }
}

// Preference management
async function updatePreferences(userId, preferences) {
  try {
    const result = await pool.query(`
      UPDATE push_preferences 
      SET 
        notify_container_down = COALESCE($2, notify_container_down),
        notify_high_cpu = COALESCE($3, notify_high_cpu),
        notify_low_memory = COALESCE($4, notify_low_memory),
        notify_low_disk = COALESCE($5, notify_low_disk),
        notify_deployments = COALESCE($6, notify_deployments),
        notify_security = COALESCE($7, notify_security),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `, [
      userId,
      preferences.notify_container_down,
      preferences.notify_high_cpu,
      preferences.notify_low_memory,
      preferences.notify_low_disk,
      preferences.notify_deployments,
      preferences.notify_security
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}

async function getPreferences(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM push_preferences WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting preferences:', error);
    throw error;
  }
}

// Notification history
async function saveNotificationHistory(userId, notification, status, errorMessage = null) {
  try {
    await pool.query(`
      INSERT INTO notification_history (user_id, title, body, type, data, status, error_message)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      userId,
      notification.title,
      notification.body,
      notification.data?.type || 'general',
      JSON.stringify(notification.data || {}),
      status,
      errorMessage
    ]);
  } catch (error) {
    console.error('Error saving notification history:', error);
  }
}

async function getNotificationHistory(userId, limit = 50) {
  try {
    const result = await pool.query(`
      SELECT * FROM notification_history 
      WHERE user_id = $1 
      ORDER BY sent_at DESC 
      LIMIT $2
    `, [userId, limit]);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting notification history:', error);
    throw error;
  }
}

// Health check
async function checkDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    return { connected: true, timestamp: result.rows[0].now };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

module.exports = {
  pool,
  initializeDatabase,
  saveSubscription,
  removeSubscription,
  getSubscription,
  getAllSubscriptions,
  updatePreferences,
  getPreferences,
  saveNotificationHistory,
  getNotificationHistory,
  checkDatabaseConnection
};