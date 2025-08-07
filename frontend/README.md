# Task Management Frontend

A React TypeScript frontend for managing Strapi tasks with authentication, approval/disapproval functionality, and summary editing.

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker from the project root:

```bash
# From project root directory
./start.sh start
```

Then visit **http://localhost:3000**

## 🏗️ Features

- **Authentication**: Login with email/username and password
- **Task Management**: View all user tasks with filtering and statistics
- **Task Actions**: 
  - Approve/Disapprove tasks with visual feedback
  - Edit task summaries inline
  - View full task text and metadata
- **Real-time Updates**: Tasks update immediately after actions
- **Responsive Design**: Clean Material-UI interface with dark/light theme

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Project cloned from repository

### Using Docker Compose
```bash
# Start frontend + backend together
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

### Frontend-only Docker
```bash
# Build the frontend image
docker build -t task-frontend .

# Run frontend container
docker run -p 3000:3000 task-frontend
```

## 💻 Local Development (Without Docker)

If you prefer local development:

### Prerequisites
- Node.js 18+ 
- Strapi backend running on `http://localhost:1337`

### Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies  
npm install

# Start development server
npm start

# View at http://localhost:3000
```

### Available Scripts
```bash
npm start          # Development server with hot reload
npm test           # Run tests
npm run build      # Production build
npm run type-check # TypeScript validation
npm run lint       # ESLint checking
npm run format     # Code formatting
```

## 🔧 Configuration

### Environment Variables
The app uses these environment variables (optional):

```bash
REACT_APP_API_URL=http://localhost:1337  # Backend URL (default)
```

### Backend Connection
The frontend automatically connects to:
- **Strapi API**: `http://localhost:1337/api`
- **Authentication**: `http://localhost:1337/api/auth/local`

## 📱 Usage

1. **First Time Setup**:
   - Start the services with `./start.sh start`
   - Create Strapi admin account at http://localhost:1337/admin
   - Create a user account through Strapi admin

2. **Daily Usage**:
   - Login with your credentials
   - View and filter tasks by approval status
   - Approve/disapprove tasks with one click
   - Edit task summaries inline
   - Logout when done

## 🏛️ Architecture

```
┌─────────────────┐    HTTP    ┌─────────────────────┐
│   React App     │───────────▶│   Strapi Backend    │
│   Port: 3000    │            │   Port: 1337        │
│                 │◀───────────│                     │
│ • Authentication│    JSON    │ • REST API          │
│ • Task UI       │            │ • SQLite DB         │
│ • Real-time     │            │ • User Management   │
└─────────────────┘            └─────────────────────┘
```

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Material-UI v5** for components and theming  
- **Axios** for HTTP requests
- **React Router** for navigation
- **Custom hooks** for state management
- **Vite** for fast development builds

## 🚨 Troubleshooting

### Common Issues

**Frontend not loading:**
```bash
# Check if container is running
docker-compose ps

# Check logs for errors  
docker-compose logs frontend

# Rebuild if needed
docker-compose up --build frontend
```

**API connection issues:**
```bash
# Verify backend is running
curl http://localhost:1337/api

# Check network connectivity
docker-compose exec frontend ping strapi
```

**Build errors:**
```bash
# Clear node modules and reinstall
docker-compose down
docker-compose up --build --no-cache
```

## 📚 API Integration

### Endpoints Used
- `POST /api/auth/local` - User authentication
- `GET /api/tasks?populate=*&status=draft,published` - Fetch user tasks  
- `PUT /api/tasks/:id` - Update task (approve/disapprove/edit summary)

### Task Data Structure
```typescript
interface Task {
  id: number;
  documentId: string;
  summary?: string;
  long_text: string;
  approved?: boolean | null;
  createdAt: string;
  updatedAt: string;
}
```

## 🔒 Security

- Authentication required for all actions
- JWT tokens for session management
- CORS configured for localhost development
- Input validation on all forms

---

**Need help?** Check the main project README or the troubleshooting section above.