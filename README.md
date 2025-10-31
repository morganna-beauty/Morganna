# Morganna - Full-Stack Product Management System

A modern, full-stack web application for product management built with **Next.js**, **NestJS**, and **Firebase**. This project demonstrates a complete CRUD system with real-time database capabilities and cloud storage.

## 🚀 Features

- **Frontend**: Next.js 14 with TypeScript, TailwindCSS, and App Router
- **Backend**: NestJS with Firebase Admin SDK and comprehensive validation
- **Database**: Firebase Firestore for real-time NoSQL database
- **Storage**: Firebase Storage for file and image management
- **Modern UI**: Responsive design with TailwindCSS
- **Type Safety**: Full TypeScript implementation
- **API Documentation**: RESTful API with Swagger documentation
- **Error Handling**: Comprehensive error handling and validation
- **Code Quality**: Pre-commit hooks with ESLint auto-fixing

## 🔍 Code Quality & Pre-commit Hooks

This project includes an automated pre-commit system that ensures code quality:

### ✅ What happens on every commit:

1. **Automatic ESLint verification** - Checks code style and quality
2. **Auto-fix formatting issues** - Corrects spacing, quotes, and style automatically  
3. **Frontend & Backend processing** - Processes Next.js and NestJS independently
4. **Commit integration** - Fixed files are automatically included in your commit
5. **Windows compatible** - Fully supports PowerShell and Windows environment

### 🛠️ Pre-commit system includes:

- **Husky** - Git hooks management
- **lint-staged** - Run tasks only on staged files
- **ESLint --fix** - Automatic code corrections

### 📝 Available commands:

```bash
# Test the pre-commit system
npm run test:precommit

# Run linting on entire project  
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Lint specific parts
npm run lint:frontend     # Frontend only
npm run lint:backend      # Backend only
```

### 🎯 How it works:

The system runs automatically on `git commit` and will:
- ✅ Fix formatting, spacing, and style issues
- ✅ Include corrections in your commit automatically
- ❌ Block commits if there are unfixable errors
- ✅ Ensure consistent code quality across the team

**No setup required** - Just commit normally and the system handles the rest!

For detailed configuration see: [PRE-COMMIT-SETUP.md](./PRE-COMMIT-SETUP.md)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js 18+** (for local development)
- **Firebase Project** with Firestore and Storage enabled
- **Git**

### 🔥 Firebase Setup

**Before starting, you need a Firebase project:**

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Firestore Database** and **Storage** in your project
3. Generate a **Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
4. Copy the credentials to your environment configuration

**For detailed Firebase setup:** 

See the complete guide in [DEVELOPMENT.md](./DEVELOPMENT.md)

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
│   └── package.json
├── backend/                  # NestJS backend API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── products/    # Products module (CRUD operations)
│   │   │   ├── users/       # Users module
│   │   │   └── auth/        # Authentication module
│   │   ├── common/
│   │   │   ├── firebase/    # Firebase configuration and services
│   │   │   ├── types/       # TypeScript type definitions
│   │   │   └── controllers/ # Upload and storage controllers
│   │   └── migrate-images.ts # Migration script for existing images
│   └── package.json
├── scripts/                  # Development and build scripts
└── README.md
```

## 🚀 Quick Start

### 1. Clone and Install

```bash
# 1. Clone the repository
git clone <repository-url>
cd morganna

# 2. Install dependencies
npm run install:all
```

### 2. Configure Firebase

Copy the example environment file and add your Firebase credentials:

```bash
# Copy example file
cp backend/.env.example backend/.env
```

**Edit `backend/.env` with your Firebase credentials:**
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
BASE_URL=http://localhost:3001
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```

**Frontend environment (optional):**
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Environment

```bash
# Start both frontend and backend with hot reload
npm run dev:local
```

🎉 **That's it!** Your app will be running at:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)
- API Documentation: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### Manual Start (Alternative)

```bash
# Start backend (in terminal 1)
cd backend
npm run start:dev

# Start frontend (in terminal 2)  
cd frontend
npm run dev
```

## 💻 Development Experience

This project is optimized for **local development** with Firebase as the backend:

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:local` | **Start everything** - Backend + Frontend with live reload |
| `npm run backend:dev` | Start backend with hot reload |
| `npm run frontend:dev` | Start frontend with hot reload |

### Why This Stack?

✅ **Instant Hot Reload** - Changes reflect immediately  
✅ **Cloud Database** - Firebase Firestore with real-time updates  
✅ **File Storage** - Firebase Storage for images and files  
✅ **No Setup Required** - No local database installation needed  
✅ **Scalable** - Firebase scales automatically  
✅ **Real-time** - Live updates across all connected clients  

### Firebase Features Used

- **Firestore Database** - NoSQL document database for products and users
- **Firebase Storage** - Cloud storage for product images
- **Firebase Admin SDK** - Server-side operations and authentication
- **Real-time Updates** - Automatic UI updates when data changes

## 🔌 API Endpoints

The backend provides a complete REST API for product management:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PATCH | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/uploads/image` | Upload product image |
| GET | `/api/storage/diagnostics` | Firebase Storage diagnostics |

### API Examples

#### Create a Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Shampoo Hidratante",
    "description": "Shampoo hidratante para cabello seco",
    "price": 29.99,
    "stock": 100,
    "hairType": "rizado",
    "concern": "cabelloSeco",
    "brand": "Morganna Beauty"
  }'
```

#### Upload Product Image

```bash
curl -X POST http://localhost:3001/api/uploads/image \
  -F "file=@/path/to/image.jpg"
```

## 🔧 Configuration

### Environment Variables

#### Backend Configuration (`.env`)

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Backend server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS
- `FIREBASE_PROJECT_ID` - Firebase project identifier
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key

#### Frontend Configuration (`.env.local`)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001/api)

## 📊 Features Overview

### Frontend Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Product Management** - Create, read, update, delete products
- **Image Upload** - Firebase Storage integration for product images
- **Form Validation** - Client-side validation with error messages
- **Real-time Updates** - Firestore real-time listeners
- **Loading States** - User-friendly loading indicators

### Backend Features
- **RESTful API** - Standard REST endpoints with Swagger documentation
- **Firebase Integration** - Firestore database and Storage
- **File Upload** - Image upload with validation and cloud storage
- **Data Validation** - Server-side validation using class-validator
- **Type Safety** - Complete TypeScript implementation
- **Error Handling** - Comprehensive error handling middleware

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill processes using ports 3000 or 3001
npx kill-port 3000 3001
```

#### Firebase Connection Issues
- Verify Firebase project ID is correct
- Check that Firestore and Storage are enabled in Firebase Console
- Ensure Firebase credentials are properly formatted in `.env`
- Test connection using `/api/storage/diagnostics` endpoint

#### Backend Won't Start
```bash
# Check if backend dependencies are installed
cd backend && npm install

# Verify environment variables are set
cat backend/.env

# Check Firebase credentials format
npm run start:dev
```

#### Frontend Won't Start
```bash
# Check if frontend dependencies are installed
cd frontend && npm install

# Clear Next.js cache
cd frontend && rm -rf .next
```

## 🚀 Next Steps

This project provides a solid foundation for a product management system. Consider adding:

- **Authentication & Authorization** - Firebase Auth integration
- **Advanced Search** - Firestore queries and filtering
- **Categories** - Product categorization system
- **Inventory Tracking** - Stock movement history
- **Image Optimization** - Automatic image resizing and formats
- **Real-time Notifications** - Firebase messaging
- **API Rate Limiting** - Request throttling and security
- **Testing** - Unit and integration tests
- **Performance Monitoring** - Firebase Performance

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using Firebase and modern web technologies** 🎉
