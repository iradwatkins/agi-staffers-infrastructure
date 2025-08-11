# Fix Test Notifications Button Error

## Current Error
```
(index):463 Uncaught SyntaxError: Invalid or unexpected token
(index):244 Uncaught ReferenceError: testPushNotification is not defined
```

## Manual Fix Instructions

### Option 1: Direct on Server (If you have SSH access)

1. **SSH into the server**:
   ```bash
   ssh root@148.230.93.174
   ```

2. **Check what's at line 463**:
   ```bash
   docker exec -it admin-dashboard sed -n '460,465p' /usr/share/nginx/html/index.html
   ```

3. **Look for the JavaScript function around line 410-440**:
   ```bash
   docker exec -it admin-dashboard sed -n '410,450p' /usr/share/nginx/html/index.html
   ```

4. **Fix the syntax error** (likely missing closing braces):
   ```bash
   # Backup first
   docker exec -it admin-dashboard cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.before-fix

   # Check if the function is missing closing braces
   docker exec -it admin-dashboard grep -A 30 "function testPushNotification" /usr/share/nginx/html/index.html
   ```

### Option 2: Using the Pull/Push Workflow (Recommended)

1. **Set up SSH key first**:
   ```bash
   # Generate SSH key
   ssh-keygen -t ed25519 -f ~/.ssh/agi-vps -C "agi-vps-access" -N ""
   
   # Add to server (you'll need to enter the password: Bobby321&Gloria321Watkins?)
   ssh-copy-id -i ~/.ssh/agi-vps.pub root@148.230.93.174
   ```

2. **Pull the current code**:
   ```bash
   ./pull-admin-dashboard.sh
   ```

3. **Fix the error in `admin-dashboard-local/index.html`**:
   - Open the file in your editor
   - Go to line 463
   - Look for the `testPushNotification` function (around line 410-440)
   - Ensure it's properly formatted:

   ```javascript
   function testPushNotification() {
       if ("Notification" in window) {
           if (Notification.permission === "granted") {
               new Notification("AGI Staffers", {
                   body: "Test notification! Your PWA is working!",
                   icon: "/favicon.ico"
               });
           } else if (Notification.permission !== "denied") {
               Notification.requestPermission().then(permission => {
                   if (permission === "granted") {
                       new Notification("AGI Staffers", {
                           body: "Notifications enabled!",
                           icon: "/favicon.ico"
                       });
                   }
               });
           } else {
               alert("Notifications are blocked. Enable them in browser settings.");
           }
       } else {
           alert("This browser does not support notifications.");
       }
   }

   // Service Worker Registration
   if ("serviceWorker" in navigator) {
       navigator.serviceWorker.register("/sw.js");
   }
   ```

4. **Push the fixed code**:
   ```bash
   ./push-admin-dashboard.sh
   ```

## Common Issues to Check

1. **Missing closing brace** for the function
2. **Extra closing braces** after the function
3. **Syntax errors** in the notification code
4. **Service worker registration** placement

## Testing

After fixing:
1. Go to https://admin.agistaffers.com
2. Open browser console (F12)
3. Check for errors
4. Click the yellow "Test Notifications" button
5. Allow notifications when prompted

## Expected Result
- No JavaScript errors in console
- Clicking button shows notification permission prompt
- After allowing, shows test notification