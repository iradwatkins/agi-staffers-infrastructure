const axios = require('axios');

const API_URL = 'http://localhost:3008';

// Test subscription object (normally comes from the browser)
const testSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
  expirationTime: null,
  keys: {
    p256dh: 'test-p256dh-key',
    auth: 'test-auth-key'
  }
};

async function testAPI() {
  try {
    console.log('🧪 Testing Push Notification API...\n');
    
    // 1. Health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', health.data);
    console.log('');
    
    // 2. Subscribe
    console.log('2. Testing subscription...');
    const subResponse = await axios.post(`${API_URL}/api/subscribe`, {
      subscription: testSubscription,
      userId: 'test-user'
    });
    console.log('✅ Subscribe:', subResponse.data);
    console.log('');
    
    // 3. List subscriptions
    console.log('3. Listing subscriptions...');
    const listResponse = await axios.get(`${API_URL}/api/subscriptions`);
    console.log('✅ Subscriptions:', listResponse.data);
    console.log('');
    
    // 4. Send notification (will fail with test subscription)
    console.log('4. Testing send notification...');
    try {
      await axios.post(`${API_URL}/api/send-notification`, {
        userId: 'test-user',
        title: '🎉 Test Notification',
        body: 'This is a test notification from the API',
        data: {
          customData: 'test'
        }
      });
    } catch (error) {
      console.log('⚠️  Send notification failed (expected with test subscription)');
      console.log('   Error:', error.response?.data || error.message);
    }
    console.log('');
    
    // 5. Test monitoring alerts
    console.log('5. Testing monitoring alert endpoints...');
    
    // Container down alert
    try {
      const containerAlert = await axios.post(`${API_URL}/api/notify/container-down`, {
        containerName: 'test-container',
        containerId: 'abc123'
      });
      console.log('✅ Container alert endpoint working');
    } catch (error) {
      console.log('⚠️  Container alert failed');
    }
    
    // High CPU alert
    try {
      const cpuAlert = await axios.post(`${API_URL}/api/notify/high-cpu`, {
        usage: 85,
        threshold: 80
      });
      console.log('✅ CPU alert endpoint working');
    } catch (error) {
      console.log('⚠️  CPU alert failed');
    }
    
    // Low disk alert
    try {
      const diskAlert = await axios.post(`${API_URL}/api/notify/low-disk`, {
        available: 5,
        threshold: 10
      });
      console.log('✅ Disk alert endpoint working');
    } catch (error) {
      console.log('⚠️  Disk alert failed');
    }
    console.log('');
    
    // 6. Unsubscribe
    console.log('6. Testing unsubscribe...');
    const unsubResponse = await axios.post(`${API_URL}/api/unsubscribe`, {
      userId: 'test-user'
    });
    console.log('✅ Unsubscribe:', unsubResponse.data);
    
    console.log('\n✅ All API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  testAPI();
} catch (e) {
  console.log('⚠️  Please install axios first: npm install axios');
  console.log('Or run: cd push-notification-api && npm install && cd .. && node push-notification-api/test-notification.js');
}