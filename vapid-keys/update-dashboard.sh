#!/bin/bash
# Script to update the push-notifications.js file with new VAPID key

echo "Updating push-notifications.js with new VAPID public key..."

# Update the VAPID key in push-notifications.js
sed -i.bak "s/this\.vapidPublicKey = '[^']*'/this.vapidPublicKey = 'BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8'/" admin-dashboard-local/push-notifications.js

echo "✅ Updated push-notifications.js"
echo "Original file backed up as push-notifications.js.bak"
