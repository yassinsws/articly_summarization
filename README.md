# Task Management System

A full-stack task management application with Strapi CMS backend, SQLite database, and React frontend - all containerized with Docker for easy setup.

## 🚀 Quick Start (1 minute setup)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (for cloning)

### One-Command Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd <project-name>

# Make setup script executable and start everything
chmod +x start.sh && ./start.sh start
```

### Access Your Application
- **📱 Frontend (React App)**: http://localhost:3000
- **⚙️ Strapi Admin Panel**: http://localhost:1337/admin  
- **🔗 API Endpoints**: http://localhost:1337/api

## 🎯 What You Get

### ✨ Features
- **Task Management**: Create, view, and manage tasks with approval workflow
- **User Authentication**: Secure login/logout with JWT tokens
- **Real-time Updates**: Instant task status changes
- **Clean UI**: Modern Material-UI React interface
- **Admin Panel**: Full Strapi CMS for content management
- **Zero Config Database**: SQLite that just works

### 🏗️ Architecture
```
┌─────────────────┐    REST API    ┌─────────────────────────────┐
│   React App     │◀──────────────▶│   Strapi CMS + SQLite      │
│   Port: 3000    │    JSON/JWT    │   Port: 1337               │
│                 │                │                             │
│ • Task UI       │                │ • REST API                  │
│ • Authentication│                │ • Admin Panel               │
│ • Real-time     │                │ • User Management           │
└─────────────────┘                └─────────────────────────────┘
```

## 📋 Quick Commands

```bash
# Start all services
./start.sh start

# Stop all services  
./start.sh stop

# View real-time logs
./start.sh logs

# Reset everything (⚠️ deletes all data)
./start.sh reset

# Check service status
./start.sh status
```

## 🛠️ First Time Setup

### 1. Start the Services
```bash
./start.sh start
```
*This builds and starts both frontend and backend containers*

### 2. Create Strapi Admin Account  
1. Visit http://localhost:1337/admin
2. Create your admin account (first user becomes admin)
3. Login to the admin panel

### 3. Create App User Account
1. In Strapi admin, go to **Content Manager > User**
2. Click **Create new entry**
3. Fill in email, username, password
4. Set **Confirmed** to `true`
5. Save the user

### 4. Start Using the App
1. Visit http://localhost:3000  
2. Login with the user account you created
3. Start managing tasks!

## 💻 Development

### Project Structure
```
├── frontend/              # React TypeScript app
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── my-strapi-project/     # Strapi CMS backend  
│   ├── src/
│   ├── config/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Container orchestration
├── start.sh              # Setup script
└── README.md             # This file
```

### Manual Docker Commands
```bash
# Build and start with logs
docker-compose up --build

# Start in background
docker-compose up -d

# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f strapi

# Stop services
docker-compose down

# Complete reset (removes database)
docker-compose down -v
```

### Local Development (Alternative)
If you prefer running without Docker:

```bash
# Backend (Terminal 1)
cd my-strapi-project
npm install  
npm run develop

# Frontend (Terminal 2)  
cd frontend
npm install
npm start
```

## 🗄️ Database

### SQLite Database
- **Location**: Docker volume `strapi_database`
- **File**: `.tmp/data.db` inside Strapi container
- **Persistence**: Data survives container restarts
- **Backup**: Use `./start.sh backup` (if implemented)

### Database Access
```bash
# Enter Strapi container
docker-compose exec strapi sh

# Navigate to database
cd .tmp && ls -la
# You'll see data.db file
```

## 🚨 Troubleshooting

### Services Won't Start
```bash
# Check Docker is running
docker info

# Check port conflicts
lsof -i :3000  # Frontend port
lsof -i :1337  # Backend port

# View detailed logs
./start.sh logs
```

### Reset Everything
```bash
# Nuclear option - deletes all data
./start.sh reset

# Or manually
docker-compose down -v
docker system prune -f
./start.sh start
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000 busy | `lsof -i :3000` then kill process |
| Port 1337 busy | `lsof -i :1337` then kill process |
| Database corrupt | `./start.sh reset` |
| Build fails | `docker system prune -f` then rebuild |
| Can't login | Check user exists in Strapi admin |

## 🔧 Configuration

### Environment Variables
The system works out-of-the-box, but you can customize:

```bash
# Create .env file (optional)
REACT_APP_API_URL=http://localhost:1337
DATABASE_CLIENT=sqlite
NODE_ENV=development
```

### Production Deployment
For production, consider:
- Use PostgreSQL/MySQL instead of SQLite
- Set up proper SSL certificates  
- Configure environment variables
- Use production Docker images
- Set up reverse proxy (nginx)

## 🔒 Security Notes

⚠️ **Development Setup**: Current configuration is for development only.

**For Production**:
- Change all default secrets
- Use environment-specific configurations
- Set up proper CORS policies
- Use production database (PostgreSQL/MySQL)
- Configure SSL/HTTPS
- Restrict admin panel access

## 📊 Monitoring & Logs

### Real-time Monitoring
```bash
# Watch all logs
docker-compose logs -f

# Individual service logs
docker-compose logs -f frontend
docker-compose logs -f strapi

# Container status
docker-compose ps
```

### Health Checks
```bash
# Test API connectivity
curl http://localhost:1337/api

# Test frontend
curl http://localhost:3000

# Check database
docker-compose exec strapi ls -la .tmp/
```

## 📚 Documentation

- **Frontend**: See `frontend/README.md` for React app details
- **Backend**: See `my-strapi-project/README.md` for Strapi details
- **API Docs**: Available at http://localhost:1337/admin (when running)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test with Docker
4. Submit pull request

## 📄 License

[Add your license here]

---

🎉 **You're all set!** Visit http://localhost:3000 to start using your task management system.