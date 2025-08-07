#!/bin/bash
# Production Deployment Script
# Follows senior engineering best practices

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}🚀 Starting Production Deployment${NC}"
echo -e "${BLUE}=================================${NC}"

# Step 1: Pre-deployment checks
echo -e "${YELLOW}Step 1: Pre-deployment validation${NC}"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Production environment file not found: $ENV_FILE${NC}"
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Production docker-compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo -e "${RED}❌ Required environment variable not set: $var${NC}"
        echo "Please set: export $var=your_value"
        exit 1
    fi
done

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"

# Step 2: Create backup
echo -e "${YELLOW}Step 2: Creating backup${NC}"
mkdir -p "$BACKUP_DIR"

# Backup database if running
if docker-compose -f "$COMPOSE_FILE" ps postgres | grep -q "Up"; then
    echo "Creating database backup..."
    docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U formbuilder formbuilder > "$BACKUP_DIR/database.sql"
    echo -e "${GREEN}✅ Database backup created${NC}"
fi

# Step 3: Build images
echo -e "${YELLOW}Step 3: Building Docker images${NC}"
docker-compose -f "$COMPOSE_FILE" build --no-cache

echo -e "${GREEN}✅ Images built successfully${NC}"

# Step 4: Run tests (if available)
echo -e "${YELLOW}Step 4: Running tests${NC}"
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    npm test || {
        echo -e "${RED}❌ Tests failed. Deployment aborted.${NC}"
        exit 1
    }
else
    echo "No tests found, skipping..."
fi

# Step 5: Deploy with rolling update strategy
echo -e "${YELLOW}Step 5: Deploying application${NC}"

# Stop services gracefully
echo "Stopping current services..."
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Start database and dependencies first
echo "Starting dependencies..."
docker-compose -f "$COMPOSE_FILE" up -d postgres redis

# Wait for database to be ready
echo "Waiting for database..."
timeout=60
counter=0
while ! docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U formbuilder -d formbuilder > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo -e "${RED}❌ Database failed to start within $timeout seconds${NC}"
        exit 1
    fi
    echo "Waiting for database... ($counter/$timeout)"
    sleep 1
done

echo -e "${GREEN}✅ Database is ready${NC}"

# Start main application
echo "Starting main application..."
docker-compose -f "$COMPOSE_FILE" up -d app

# Wait for application health check
echo "Waiting for application health check..."
timeout=120
counter=0
while ! curl -f http://localhost:5001/health > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo -e "${RED}❌ Application failed health check within $timeout seconds${NC}"
        echo "Rolling back..."
        docker-compose -f "$COMPOSE_FILE" down
        exit 1
    fi
    echo "Health check... ($counter/$timeout)"
    sleep 2
done

echo -e "${GREEN}✅ Application is healthy${NC}"

# Step 6: Post-deployment verification
echo -e "${YELLOW}Step 6: Post-deployment verification${NC}"

# Test critical endpoints
endpoints=("http://localhost:5001/health" "http://localhost:3000")
for endpoint in "${endpoints[@]}"; do
    if curl -f "$endpoint" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $endpoint is responding${NC}"
    else
        echo -e "${RED}❌ $endpoint is not responding${NC}"
        exit 1
    fi
done

# Step 7: Cleanup
echo -e "${YELLOW}Step 7: Cleanup${NC}"
docker system prune -f --volumes=false
docker image prune -f

echo -e "${GREEN}✅ Cleanup completed${NC}"

# Success message
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "🌐 Frontend: http://localhost:3000"
echo -e "⚙️  Backend API: http://localhost:5001"
echo -e "📊 Health Check: http://localhost:5001/health"
echo -e "💾 Backup Location: $BACKUP_DIR"
echo -e "${GREEN}================================${NC}"

# Show running containers
echo -e "${BLUE}Running containers:${NC}"
docker-compose -f "$COMPOSE_FILE" ps