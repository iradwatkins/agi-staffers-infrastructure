#!/usr/bin/env node

/**
 * VAPID Key Generator for Web Push Notifications
 * 
 * This script generates a new pair of VAPID keys for your PWA.
 * Run: node generate-vapid-keys.js
 */

const crypto = require('crypto');

// Check if web-push is available
let webpush;
try {
    webpush = require('web-push');
} catch (error) {
    console.log('\n⚠️  web-push module not found!');
    console.log('Installing web-push temporarily...\n');
    
    const { execSync } = require('child_process');
    execSync('npm install web-push', { stdio: 'inherit' });
    webpush = require('web-push');
}

console.log('=================================');
console.log('🔐 VAPID Key Generator for PWA');
console.log('=================================\n');

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID Keys Generated Successfully!\n');

console.log('📋 Copy these values to your configuration:\n');

console.log('PUBLIC KEY (for frontend - push-notifications.js):');
console.log('----------------------------------------');
console.log(vapidKeys.publicKey);
console.log('');

console.log('PRIVATE KEY (for backend - .env file):');
console.log('----------------------------------------');
console.log(vapidKeys.privateKey);
console.log('');

console.log('📝 Complete .env configuration:');
console.log('----------------------------------------');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_EMAIL=mailto:admin@yourdomain.com`);
console.log('');

console.log('🔧 Update these files:');
console.log('----------------------------------------');
console.log('1. frontend/push-notifications.js - Line 5:');
console.log(`   this.vapidPublicKey = '${vapidKeys.publicKey}';`);
console.log('');
console.log('2. backend/push-api/.env:');
console.log('   Copy the complete .env configuration above');
console.log('');

console.log('⚠️  Security Notes:');
console.log('----------------------------------------');
console.log('• Keep your PRIVATE key secret!');
console.log('• Never commit private keys to version control');
console.log('• Use environment variables in production');
console.log('• Generate new keys for each deployment');
console.log('');

// Save to file option
const fs = require('fs');
const path = require('path');

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('💾 Save keys to file? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `vapid-keys-${timestamp}.json`;
        
        const keysData = {
            generated: new Date().toISOString(),
            publicKey: vapidKeys.publicKey,
            privateKey: vapidKeys.privateKey,
            note: 'Keep the private key secret! Do not commit to version control.'
        };
        
        fs.writeFileSync(filename, JSON.stringify(keysData, null, 2));
        console.log(`\n✅ Keys saved to: ${filename}`);
        console.log('🔒 Remember to add this file to .gitignore!\n');
    }
    
    rl.close();
    process.exit(0);
});