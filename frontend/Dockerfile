# Frontend Development Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port for development server
EXPOSE 3000

# Start development server with Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]