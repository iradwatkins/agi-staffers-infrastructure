// Debug script for testing push notifications on admin.agistaffers.com
// Run these commands in the browser console to diagnose issues

console.log('=== Push Notification Debug Script ===');

// 1. Check if notifications are supported
console.log('1. Notification Support:', 'Notification' in window);

// 2. Check current permission
console.log('2. Current Permission:', Notification.permission);

// 3. Check if service worker is supported
console.log('3. Service Worker Support:', 'serviceWorker' in navigator);

// 4. Check if function exists
console.log('4. testPushNotification exists:', typeof testPushNotification);
console.log('5. window.testPushNotification exists:', typeof window.testPushNotification);

// 6. Check service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('6. Service Worker Registrations:', registrations.length);
        registrations.forEach((reg, index) => {
            console.log(`   Registration ${index + 1}:`, {
                scope: reg.scope,
                active: reg.active ? reg.active.state : 'none',
                waiting: reg.waiting ? reg.waiting.state : 'none',
                installing: reg.installing ? reg.installing.state : 'none'
            });
        });
    });
}

// 7. Check if the button exists
const buttons = document.querySelectorAll('button');
let notificationButton = null;
buttons.forEach(button => {
    if (button.textContent.includes('Test Notifications')) {
        notificationButton = button;
        console.log('7. Notification button found:', button);
        console.log('   onclick attribute:', button.getAttribute('onclick'));
    }
});

// 8. Test the function directly
console.log('8. Testing function directly...');
try {
    if (typeof testPushNotification === 'function') {
        console.log('   Function is available, you can call: testPushNotification()');
    } else if (typeof window.testPushNotification === 'function') {
        console.log('   Function is available on window, you can call: window.testPushNotification()');
    } else {
        console.log('   ERROR: Function not found in global scope');
    }
} catch (e) {
    console.error('   Error testing function:', e);
}

// 9. Check HTTPS
console.log('9. Protocol:', location.protocol);
console.log('   HTTPS required:', location.protocol === 'https:');

// 10. Manifest check
fetch('/manifest.json')
    .then(response => response.json())
    .then(manifest => {
        console.log('10. Manifest loaded:', manifest.name);
        console.log('    Icons:', manifest.icons.length);
    })
    .catch(error => {
        console.error('10. Manifest error:', error);
    });

// Manual test function
window.debugTestNotification = function() {
    console.log('Manual test notification triggered');
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            try {
                const notification = new Notification('Debug Test', {
                    body: 'If you see this, notifications are working!',
                    icon: '/icon-192x192.png'
                });
                console.log('Notification created:', notification);
            } catch (e) {
                console.error('Notification error:', e);
            }
        } else {
            console.log('Requesting permission...');
            Notification.requestPermission().then(permission => {
                console.log('Permission result:', permission);
                if (permission === 'granted') {
                    window.debugTestNotification();
                }
            });
        }
    }
};

console.log('\n=== Debug Complete ===');
console.log('To test manually, run: debugTestNotification()');
console.log('To test the button function, run: testPushNotification()');