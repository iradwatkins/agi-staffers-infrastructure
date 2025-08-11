#!/usr/bin/env node

// Script to generate VAPID keys for web push notifications
// VAPID (Voluntary Application Server Identification) keys are used to identify your server

const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

// Create the output
const output = {
  publicKey: vapidKeys.publicKey,
  privateKey: vapidKeys.privateKey,
  subject: 'mailto:admin@agistaffers.com' // Change this to your email
};

// Create a .env template
const envTemplate = `# Web Push VAPID Keys - Generated ${new Date().toISOString()}
# Keep these keys secure! The private key should never be exposed publicly.

VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_SUBJECT=mailto:admin@agistaffers.com
`;

// Create JavaScript config file for client
const clientConfig = `// VAPID Public Key for Push Notifications
// Generated: ${new Date().toISOString()}
// This key is safe to use in client-side code

export const VAPID_PUBLIC_KEY = '${vapidKeys.publicKey}';
`;

// Create server config template
const serverConfig = `// Web Push Server Configuration
// Generated: ${new Date().toISOString()}

const webpush = require('web-push');

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@agistaffers.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = webpush;
`;

// Write files
try {
  // Create keys directory if it doesn't exist
  const keysDir = path.join(__dirname, 'vapid-keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir);
  }

  // Write .env template
  fs.writeFileSync(path.join(keysDir, '.env.vapid'), envTemplate);
  console.log('✅ Created .env.vapid template');

  // Write client config
  fs.writeFileSync(path.join(keysDir, 'vapid-public-key.js'), clientConfig);
  console.log('✅ Created vapid-public-key.js for client');

  // Write server config
  fs.writeFileSync(path.join(keysDir, 'webpush-config.js'), serverConfig);
  console.log('✅ Created webpush-config.js for server');

  // Write JSON output
  fs.writeFileSync(path.join(keysDir, 'vapid-keys.json'), JSON.stringify(output, null, 2));
  console.log('✅ Created vapid-keys.json');

  console.log('\n📋 VAPID Keys Generated Successfully!\n');
  console.log('Public Key (safe to share):');
  console.log(vapidKeys.publicKey);
  console.log('\nPrivate Key (keep secret!):');
  console.log(vapidKeys.privateKey);
  console.log('\n⚠️  IMPORTANT: Keep your private key secure!');
  console.log('Never commit the private key to version control.');
  console.log('\n📁 Files created in ./vapid-keys/');
  console.log('- .env.vapid: Environment variables template');
  console.log('- vapid-public-key.js: Client-side configuration');
  console.log('- webpush-config.js: Server-side configuration');
  console.log('- vapid-keys.json: Complete key set (keep secure)');

  console.log('\n🚀 Next Steps:');
  console.log('1. Copy .env.vapid contents to your server environment');
  console.log('2. Update push-notifications.js with the new public key');
  console.log('3. Set up the push notification API endpoint on your server');

} catch (error) {
  console.error('❌ Error generating VAPID keys:', error);
  process.exit(1);
}

// Simple web-push installation check
try {
  require.resolve('web-push');
} catch (e) {
  console.log('\n⚠️  Note: web-push module not found.');
  console.log('To use this script, run: npm install web-push');
  process.exit(1);
}