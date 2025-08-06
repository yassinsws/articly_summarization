# Strapi Development Dockerfile with SQLite
FROM node:18-alpine

# Installing libvips-dev for sharp compatibility and development tools
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git \
    wget \
    python3 \
    make

# Set working directory
WORKDIR /opt/

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p public/uploads .tmp && chmod -R 755 public/uploads .tmp

# Expose port
EXPOSE 1337

# Add health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start development server with auto-reload
CMD ["npm", "run", "develop"]