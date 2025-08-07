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
    
    echo "🚀 Services started!"
    echo ""
    echo "🎉 Your application is ready:"
    echo "   📊 Frontend (Vite): http://localhost:3000"
    echo "   🔧 Strapi Admin: http://localhost:1337/admin"
    echo "   📁 Database: SQLite (stored in container volume)"
    echo ""
    echo "ℹ️  Note: Services may take a few moments to fully initialize."
    echo "   If you get connection errors, wait 30-60 seconds and try again."
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