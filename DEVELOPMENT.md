# Morganna Local Development Setup

This guide shows how to run the database in Docker while developing the frontend and backend locally for the best development experience.

## Prerequisites

- Node.js 18+ 
- Docker Desktop (for database only)
- Git

## Quick Start

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd morganna
npm run install:all
```

2. **Start development environment:**
```bash
npm run dev:local
```

This will:
- Start PostgreSQL database in Docker
- Start NestJS backend with hot reload 
- Start Next.js frontend with hot reload

## Manual Setup

If you prefer to start services individually:

### 1. Start Database
```bash
npm run db:start
```

### 2. Start Backend (new terminal)
```bash
cd backend
npm run start:dev
```

### 3. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

## Environment Variables

The project automatically uses these configurations for local development:

**Backend (.env.local):**
```env
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=morganna_db
PORT=3001
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development Benefits

✅ **Hot Reload** - Changes are reflected instantly
✅ **Fast Builds** - No Docker rebuild needed
✅ **Better Debugging** - Direct access to logs and debugging tools
✅ **IDE Integration** - Full IntelliSense and error highlighting

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:local` | Start all services locally |
| `npm run db:start` | Start database only |
| `npm run db:stop` | Stop database |
| `npm run db:reset` | Reset database |
| `npm run backend:dev` | Start backend with hot reload |
| `npm run frontend:dev` | Start frontend with hot reload |

## URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Database:** postgresql://postgres:postgres@localhost:5432/morganna_db

## Troubleshooting

**Port conflicts:**
```bash
# Kill processes on ports
npx kill-port 3000 3001 5432
```

**Database connection issues:**
```bash
# Check if database container is running
docker ps | grep morganna-postgres-local

# View database logs
docker logs morganna-postgres-local
```

**Dependencies issues:**
```bash
# Reinstall all dependencies
rm -rf backend/node_modules frontend/node_modules
npm run install:all
```