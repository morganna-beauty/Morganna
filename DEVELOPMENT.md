# Morganna Local Development Setup

This guide shows how to develop the Morganna application locally using Firebase as the backend database.

## Prerequisites

- Node.js 18+ 
- Firebase project with Firestore and Storage enabled
- Git

## Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd morganna
npm run install:all
```

2. **Configure Firebase:**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your Firebase configuration:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL` 
     - `FIREBASE_PRIVATE_KEY`

3. **Start development environment:**
```bash
npm run dev:local
```

This will:
- Start NestJS backend with hot reload 
- Start Next.js frontend with hot reload

## Manual Setup

If you prefer to start services individually:

### 1. Start Backend
```bash
cd backend
npm run start:dev
```

### 2. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

## Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3001
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development Benefits

✅ **Hot Reload** - Changes are reflected instantly
✅ **Fast Builds** - No Docker needed
✅ **Better Debugging** - Direct access to logs and debugging tools
✅ **IDE Integration** - Full IntelliSense and error highlighting
✅ **Cloud Database** - Firebase Firestore provides real-time updates

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:local` | Start all services locally |
| `npm run backend:dev` | Start backend with hot reload |
| `npm run frontend:dev` | Start frontend with hot reload |

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Documentation:** http://localhost:3001/api-docs

## Troubleshooting

**Port conflicts:**
```bash
# Kill processes on ports
npx kill-port 3000 3001
```

**Firebase connection issues:**
- Check that Firebase project ID is correct
- Verify that Firestore and Storage are enabled in Firebase Console
- Ensure Firebase credentials are properly formatted in .env

**Dependencies issues:**
```bash
# Reinstall all dependencies
rm -rf backend/node_modules frontend/node_modules
npm run install:all
```