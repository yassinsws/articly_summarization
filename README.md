# Strapi + SQLite + React Application

A full-stack application with Strapi CMS backend, SQLite database, and React frontend, all containerized with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning)

### 1. Setup and Run
```bash
# Make the setup script executable
chmod +x start.sh

# Start all services
./start.sh start
```

### 2. Access Your Application
- **Frontend**: http://localhost:3000
- **Strapi Admin**: http://localhost:1337/admin
- **Strapi API**: http://localhost:1337/api

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────────────────┐
│   React App     │────│   Strapi CMS + SQLite      │
│   Port: 3000    │    │   Port: 1337               │
└─────────────────┘    └─────────────────────────────┘
```

## 🛠️ Development

### Quick Commands
```bash
# Start services
./start.sh start

# Stop services
./start.sh stop

# View logs
./start.sh logs

# Reset everything (⚠️ deletes data)
./start.sh reset
```

### Manual Docker Commands
```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset with volume cleanup (deletes SQLite database)
docker-compose down -v
```

## 📦 Services

### Strapi Backend with SQLite
- **Framework**: Strapi 5.20.0
- **Database**: SQLite (better-sqlite3)
- **Development Mode**: Auto-reload enabled
- **Admin**: Create admin user on first run
- **Database File**: Stored in Docker volume for persistence

### React Frontend
- **Framework**: React 18
- **Hot Reload**: Enabled
- **API Connection**: Connects to Strapi backend

## 🔧 Configuration

### Database Configuration
The database is configured in `my-strapi-project/config/database.ts` with SQLite as the default:
- **File Location**: `.tmp/data.db` (inside container)
- **Volume**: `strapi_database` for persistence
- **Driver**: better-sqlite3

### Environment Variables
Key environment variables for development:
- `DATABASE_CLIENT=sqlite`
- `DATABASE_FILENAME=.tmp/data.db`
- `NODE_ENV=development`

## 📝 Development Workflow

1. **First Time Setup**:
   ```bash
   ./start.sh start
   ```

2. **Create Strapi Admin User**:
   - Visit http://localhost:1337/admin
   - Create your admin account

3. **Develop**:
   - Frontend code: `./frontend/src/`
   - Backend code: `./my-strapi-project/src/`
   - Both support hot reload

4. **Database Access**:
   SQLite database is stored in a Docker volume. To access:
   ```bash
   # Enter the Strapi container
   docker-compose exec strapi sh
   
   # Navigate to database location
   cd .tmp
   ls -la  # You'll see data.db
   ```

## 🚨 Troubleshooting

### Common Issues

**Services not starting:**
```bash
# Check Docker is running
docker info

# Check logs
./start.sh logs
```

**Database issues:**
```bash
# Check if SQLite file exists
docker-compose exec strapi ls -la .tmp/

# Reset database (⚠️ deletes all data)
./start.sh reset
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :3000
lsof -i :1337
```

### Health Checks
The setup includes health checks for:
- Strapi: HTTP health endpoint
- Automatic service dependencies

## 📊 Monitoring

View real-time logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f strapi
docker-compose logs -f frontend
```

## 💾 Database Backup

Since you're using SQLite, backing up is simple:

```bash
# Create backup
docker-compose exec strapi cp .tmp/data.db .tmp/data.db.backup

# Copy backup to host
docker cp dev_strapi:/opt/.tmp/data.db.backup ./backup-$(date +%Y%m%d).db
```

## 🔒 Security Notes

**Development Environment**: Current configuration is for development only.

**Production Considerations**:
- Consider PostgreSQL or MySQL for production
- Change all default secrets
- Use proper SSL certificates
- Configure proper CORS settings
- Use environment-specific secrets

## ✅ Benefits of SQLite Setup

- **Simplicity**: No separate database container needed
- **Zero Configuration**: Works out of the box
- **Lightweight**: Perfect for development and small applications
- **Fast**: Excellent performance for single-user scenarios
- **Portable**: Database file can be easily copied/moved

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [React Documentation](https://react.dev/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)