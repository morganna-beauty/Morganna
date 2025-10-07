# Morganna - Full-Stack Product Management System

A modern, full-stack web application for product management built with **Next.js**, **NestJS**, and **PostgreSQL**. This project demonstrates a complete CRUD system with a clean, professional architecture.

## 🚀 Features

- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, and App Router
- **Backend**: NestJS with TypeORM, PostgreSQL, and comprehensive validation
- **Database**: PostgreSQL with automated migrations
- **Containerization**: Full Docker support with Docker Compose
- **Modern UI**: Responsive design with TailwindCSS
- **Type Safety**: Full TypeScript implementation
- **API Documentation**: RESTful API with proper HTTP status codes
- **Error Handling**: Comprehensive error handling and validation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Docker** (version 20.0 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git**

## 🏗️ Project Structure

```
morganna/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API client
│   │   └── types/           # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
├── backend/                  # NestJS backend API
│   ├── src/
│   │   ├── modules/
│   │   │   └── products/    # Products module (CRUD operations)
│   │   ├── config/          # Configuration files
│   │   └── common/          # Shared utilities
│   ├── Dockerfile
│   └── package.json
├── db-data/                  # PostgreSQL data volume
├── docker-compose.yml        # Docker services configuration
├── init.sql                  # Database initialization script
└── README.md
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd morganna
```

### 2. Environment Configuration

The project includes example environment files. For development with Docker, the default values will work out of the box.

**Backend** (`.env` file will be created automatically):
```env
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=morganna_db
PORT=3001
```

**Frontend** (`.env.local` file will be created automatically):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Launch the Application

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d
```

This command will:
- Build the frontend and backend applications
- Start PostgreSQL database
- Run database migrations automatically
- Launch all services with proper networking

### 4. Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Database**: localhost:5432

## 🔌 API Endpoints

The backend provides a complete REST API for product management:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### API Examples

#### Create a Product
```bash
curl -X POST http://localhost:3001/api/products \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "MacBook Pro",
    "description": "Apple MacBook Pro 16-inch with M2 chip",
    "price": 2499.99,
    "stock": 10
  }'
```

#### Get All Products
```bash
curl http://localhost:3001/api/products
```

#### Update a Product
```bash
curl -X PATCH http://localhost:3001/api/products/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "price": 2299.99,
    "stock": 8
  }'
```

#### Delete a Product
```bash
curl -X DELETE http://localhost:3001/api/products/1
```

## 🛠️ Development

### Running Individual Services

#### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

#### Database Only
```bash
docker-compose up postgres -d
```

### Available Scripts

#### Backend Scripts
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

#### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting

## 🗄️ Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| name | VARCHAR(255) | Product name (required) |
| description | TEXT | Product description (optional) |
| price | DECIMAL(10,2) | Product price (required) |
| stock | INTEGER | Stock quantity (default: 0) |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

## 🐳 Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

### Maintenance
```bash
# Clean up containers and images
docker-compose down --rmi all --volumes --remove-orphans

# Reset database (removes all data)
docker-compose down -v
docker volume rm morganna-db-data

# Enter database shell
docker-compose exec postgres psql -U postgres -d morganna_db
```

## 🔧 Configuration

### Environment Variables

#### Backend Configuration
- `DATABASE_HOST` - PostgreSQL host (default: postgres)
- `DATABASE_PORT` - PostgreSQL port (default: 5432)
- `DATABASE_USER` - PostgreSQL username (default: postgres)
- `DATABASE_PASSWORD` - PostgreSQL password (default: postgres)
- `DATABASE_NAME` - PostgreSQL database name (default: morganna_db)
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

#### Frontend Configuration
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001/api)

## 📊 Features Overview

### Frontend Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Product Management** - Create, read, update, delete products
- **Form Validation** - Client-side validation with error messages
- **Loading States** - User-friendly loading indicators
- **Error Handling** - Graceful error handling and user feedback
- **Modal Forms** - Clean modal interfaces for product forms

### Backend Features
- **RESTful API** - Standard REST endpoints with proper HTTP codes
- **Data Validation** - Server-side validation using class-validator
- **Database Integration** - TypeORM with PostgreSQL
- **Error Handling** - Comprehensive error handling middleware
- **CORS Support** - Configured for frontend communication
- **Health Checks** - Built-in health check endpoints

## 🔒 Production Considerations

For production deployment, consider the following:

1. **Environment Variables** - Use proper environment-specific values
2. **Database Security** - Use strong passwords and proper access controls
3. **HTTPS** - Enable SSL/TLS encryption
4. **Monitoring** - Implement logging and monitoring solutions
5. **Backup Strategy** - Set up regular database backups
6. **Load Balancing** - Consider load balancing for high availability

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes using ports 3000, 3001, or 5432
sudo lsof -t -i:3000 | xargs kill -9
sudo lsof -t -i:3001 | xargs kill -9
sudo lsof -t -i:5432 | xargs kill -9
```

#### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up postgres -d
```

#### Build Issues
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

## 🚀 Next Steps

This project provides a solid foundation for a product management system. Consider adding:

- **Authentication & Authorization** - User login and role-based access
- **Image Upload** - Product image management
- **Categories** - Product categorization system
- **Search & Filtering** - Advanced product search capabilities
- **Inventory Tracking** - Stock movement history
- **Reports & Analytics** - Business intelligence features
- **API Rate Limiting** - Request throttling and security
- **Caching** - Redis for improved performance
- **Testing** - Unit and integration tests

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

**Mete mano psicopata!** 🎉
