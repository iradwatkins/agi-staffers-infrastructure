# PWA Complete Source Code Package

A production-ready Progressive Web App (PWA) implementation with push notifications, offline support, and Samsung Fold optimization.

## 🚀 Features

- **Offline Support**: Service worker with intelligent caching strategies
- **Push Notifications**: Web Push API with VAPID authentication
- **App Installation**: Cross-platform PWA installation prompts
- **Samsung Fold Support**: Responsive design for foldable devices
- **Hybrid Storage**: PostgreSQL with in-memory fallback
- **Alert Management**: Configurable notification preferences
- **Background Sync**: Offline-first architecture
- **Docker Ready**: Containerized backend services

## 📁 Project Structure

```
pwa-source-code/
├── frontend/          # Client-side PWA files
├── backend/           # Push notification API server
├── icons/             # PWA icons and assets
├── templates/         # HTML templates
├── docs/              # Documentation
└── tools/             # Utilities and generators
```

## 🏃 Quick Start

### 1. Generate VAPID Keys

```bash
cd tools
node generate-vapid-keys.js
```

### 2. Configure Your App

Update `frontend/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp",
  "start_url": "/",
  "theme_color": "#your-color"
}
```

### 3. Update Configuration

Edit configuration in each file:
- `frontend/push-notifications.js` - Set your VAPID public key
- `backend/push-api/.env` - Set server configuration

### 4. Deploy Frontend

Copy these files to your web root:
- All files from `frontend/`
- All files from `icons/`
- Service worker registration in your HTML

### 5. Deploy Backend

```bash
cd backend/push-api
docker build -t your-push-api .
docker run -d -p 3011:3011 --env-file .env your-push-api
```

## 📱 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited push notification support
- Samsung Internet: Full support with Fold optimization

## 🔧 Customization

See `docs/CUSTOMIZATION.md` for detailed customization instructions.

## 📚 Documentation

- [Setup Guide](docs/SETUP-GUIDE.md) - Detailed setup instructions
- [API Reference](docs/API-REFERENCE.md) - Push notification API documentation
- [Customization](docs/CUSTOMIZATION.md) - How to customize for your project

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Docker (for backend)
- SSL certificate (required for PWA)
- PostgreSQL (optional)

### Local Development

1. Install dependencies:
```bash
cd backend/push-api
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Test push notifications:
```bash
cd tools
./test-push-notifications.sh
```

## 🔒 Security

- HTTPS required for service workers and push notifications
- VAPID keys ensure only your server can send notifications
- Environment variables for sensitive configuration
- Input validation on all API endpoints

## 📈 Performance

- Intelligent caching strategies
- Lazy loading of resources
- Minimal service worker size
- Efficient push payload handling

## 🤝 Contributing

Feel free to customize and extend this PWA template for your needs!

## 📄 License

This PWA template is provided as-is for use in your projects.

---

Created from the AGI Staffers PWA implementation.