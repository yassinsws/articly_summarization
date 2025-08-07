# Task Management Backend (Strapi)

A Strapi 5.20.0 CMS backend with SQLite database, providing REST API endpoints for task management with user authentication.

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker from the project root:

```bash
# From project root directory
./start.sh start
```

Then visit:
- **Strapi Admin**: http://localhost:1337/admin  
- **API**: http://localhost:1337/api

## 🏗️ Features

- **Content Management**: Full Strapi CMS with admin panel
- **Task Management**: Custom task content type with approval workflow
- **User Authentication**: Built-in users & permissions system
- **SQLite Database**: Lightweight, zero-config database
- **REST API**: Auto-generated endpoints for all content types
- **Real-time Updates**: WebSocket support for live updates

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Project cloned from repository

### Using Docker Compose
```bash
# Start backend + frontend together
docker-compose up --build

# Start in background
docker-compose up -d

# View logs  
docker-compose logs -f strapi

# Stop services
docker-compose down

# Reset database (⚠️ deletes all data)
docker-compose down -v
```

### Backend-only Docker
```bash
# Build the Strapi image
docker build -t task-backend .

# Run backend container
docker run -p 1337:1337 task-backend
```

## 💻 Local Development (Without Docker)

If you prefer local development:

### Prerequisites
- Node.js 18+
- SQLite (automatically installed)

### Setup
```bash
# Navigate to backend directory
cd my-strapi-project

# Install dependencies
npm install

# Start development server  
npm run develop

# Visit admin at http://localhost:1337/admin
```

### Available Scripts
```bash
npm run develop    # Development with auto-reload
npm run start      # Production mode
npm run build      # Build admin panel
npm run console    # Strapi console
npm run deploy     # Deploy (if configured)
```

## 🗄️ Database Configuration

### SQLite Setup (Default)
```javascript
// config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', '..', '.tmp/data.db'),
    },
    useNullAsDefault: true,
  },
});
```

### Database Location
- **Development**: `.tmp/data.db` 
- **Docker**: Stored in `strapi_database` volume
- **Backup**: Automatically persistent between container restarts

## 📊 Content Types

### Task Content Type
```javascript
{
  "kind": "collectionType",
  "collectionName": "tasks", 
  "info": {
    "singularName": "task",
    "pluralName": "tasks",
    "displayName": "Task"
  },
  "attributes": {
    "long_text": {
      "type": "text",
      "required": true
    },
    "summary": {
      "type": "text"
    },
    "approved": {
      "type": "boolean"
    }
  }
}
```

### Other Content Types
- **User**: Built-in user management
- **Role**: Permission management  
- **About, Article, Author, Category, Global**: Example content types

## 🔗 API Endpoints

### Authentication
```bash
POST /api/auth/local
{
  "identifier": "user@example.com",
  "password": "password"
}
```

### Tasks
```bash
GET    /api/tasks                    # List all tasks
GET    /api/tasks/:id               # Get specific task  
POST   /api/tasks                   # Create new task
PUT    /api/tasks/:id               # Update task
DELETE /api/tasks/:id               # Delete task
```

### Query Parameters
```bash
# Populate relations
GET /api/tasks?populate=*

# Filter by status
GET /api/tasks?filters[approved][$eq]=true

# Pagination
GET /api/tasks?pagination[page]=1&pagination[pageSize]=10
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Security
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# Server
HOST=0.0.0.0
PORT=1337
```

### Admin Panel Setup
1. Start the server: `npm run develop`
2. Visit: http://localhost:1337/admin
3. Create your admin account
4. Configure content types and permissions

## 🛠️ Development Workflow

### 1. Initial Setup
```bash
# Start with Docker
./start.sh start

# Or locally
cd my-strapi-project
npm install
npm run develop
```

### 2. Admin Configuration
- Create admin account at `/admin`
- Set up user roles and permissions
- Configure API access tokens if needed

### 3. Content Management
- Create tasks through admin panel or API
- Manage users and permissions
- Configure content type relationships

### 4. API Development
- Test endpoints using admin API docs
- Set up webhooks if needed
- Configure custom routes in `src/api/`

## 🚨 Troubleshooting

### Common Issues

**Strapi not starting:**
```bash
# Check logs
docker-compose logs strapi

# Check database file
docker-compose exec strapi ls -la .tmp/

# Reset database  
docker-compose down -v
docker-compose up --build
```

**Database corruption:**
```bash
# Backup current database
docker cp container_name:/opt/.tmp/data.db ./backup.db

# Reset and restore
docker-compose down -v
# Restore your backup or start fresh
```

**Permission issues:**
```bash
# Check user roles in admin panel
# Verify API permissions for tasks content type
# Check authentication headers in requests
```

### Health Checks
```bash
# API health
curl http://localhost:1337/api

# Admin health  
curl http://localhost:1337/admin

# Database check
docker-compose exec strapi ls -la .tmp/data.db
```

## 📦 Project Structure

```
my-strapi-project/
├── config/           # Strapi configuration
├── src/
│   ├── api/         # API routes and controllers  
│   │   └── task/    # Task content type
│   ├── components/  # Reusable components
│   └── extensions/  # Plugin extensions
├── data/            # Seed data and uploads
├── database/        # Database files and migrations
└── Dockerfile       # Docker configuration
```

## 💾 Database Backup & Restore

### Backup
```bash
# Create backup
docker-compose exec strapi cp .tmp/data.db .tmp/backup-$(date +%Y%m%d).db

# Copy to host
docker cp container_name:/opt/.tmp/backup-YYYYMMDD.db ./
```

### Restore
```bash
# Copy backup to container
docker cp ./backup.db container_name:/opt/.tmp/data.db

# Restart service
docker-compose restart strapi
```

## 🔒 Security & Production

### Development vs Production
- **Development**: SQLite, detailed logging, admin panel accessible
- **Production**: Consider PostgreSQL/MySQL, restricted admin access, proper secrets

### Security Checklist
- [ ] Change all default secrets
- [ ] Configure CORS properly  
- [ ] Set up SSL certificates
- [ ] Restrict admin panel access
- [ ] Configure rate limiting
- [ ] Set up proper logging

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)  
- [Strapi Docker Guide](https://docs.strapi.io/dev-docs/installation/docker)
- [Content Type Builder](https://docs.strapi.io/user-docs/content-type-builder)

---

**Need help?** Check the main project README or visit the [Strapi Community Forum](https://forum.strapi.io/).