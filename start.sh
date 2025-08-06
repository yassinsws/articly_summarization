#!/bin/bash

# Simple Docker Setup Script for Strapi with SQLite + React Frontend (Vite)

set -e  # Exit on any error

echo "🚀 Starting Strapi with SQLite + React Frontend (Vite)..."

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and start services
start_services() {
    echo "📦 Building and starting services..."
    
    # Build images and start services
    docker-compose up --build -d
    
    echo "⏳ Waiting for services to start..."
    
    # Wait for Strapi to be ready
    echo "Waiting for Strapi..."
    
    # macOS-compatible timeout loop
    local count=0
    local max_attempts=24  # 24 * 5 seconds = 120 seconds total
    
    while [ $count -lt $max_attempts ]; do
        if curl -f http://localhost:1337/_health > /dev/null 2>&1; then
            echo "✅ Strapi is ready!"
            break
        fi
        echo "Still waiting for Strapi... (attempt $((count + 1))/$max_attempts)"
        sleep 5
        count=$((count + 1))
    done
    
    if [ $count -eq $max_attempts ]; then
        echo "⚠️  Strapi health check timed out after 120 seconds"
        echo "   You can still try accessing it manually at http://localhost:1337"
    fi
    
    # Wait for Frontend (Vite) to be ready
    echo "Waiting for Frontend (Vite)..."
    
    count=0
    max_attempts=12  # 12 * 5 seconds = 60 seconds total
    
    while [ $count -lt $max_attempts ]; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ Frontend (Vite) is ready!"
            break
        fi
        echo "Still waiting for Frontend... (attempt $((count + 1))/$max_attempts)"
        sleep 5
        count=$((count + 1))
    done
    
    if [ $count -eq $max_attempts ]; then
        echo "⚠️  Frontend health check timed out after 60 seconds"
        echo "   You can still try accessing it manually at http://localhost:3000"
    fi
    
    echo "✅ All services are up and running!"
    echo ""
    echo "🎉 Your application is ready:"
    echo "   📊 Frontend (Vite): http://localhost:3000"
    echo "   🔧 Strapi Admin: http://localhost:1337/admin"
    echo "   📁 Database: SQLite (stored in container volume)"
    echo ""
    echo "🔧 Development Features:"
    echo "   ⚡ Vite HMR (Hot Module Replacement)"
    echo "   🔄 Live reload for both frontend and backend"
    echo "   🚀 Fast TypeScript compilation"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Rebuild: docker-compose up --build"
    echo "   Frontend only: docker-compose up frontend --build"
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to show logs
show_logs() {
    docker-compose logs -f
}

# Function to reset everything (including data)
reset_all() {
    echo "⚠️  This will delete all data including your SQLite database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "🗑️  Stopping and removing all containers and volumes..."
        docker-compose down -v
        echo "✅ Everything reset"
    else
        echo "❌ Reset cancelled"
    fi
}

# Main script logic
case "${1:-start}" in
    start)
        check_docker
        start_services
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    reset)
        reset_all
        ;;
    *)
        echo "Usage: $0 {start|stop|logs|reset}"
        echo ""
        echo "Commands:"
        echo "  start  - Build and start all services (default)"
        echo "  stop   - Stop all services"
        echo "  logs   - Show live logs from all services"
        echo "  reset  - Reset everything (WARNING: deletes all data)"
        exit 1
        ;;
esac