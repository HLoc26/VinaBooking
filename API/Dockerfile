# Stage 1: Build dependencies
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies required for bcrypt compilation
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Stage 2: Create production image
FROM node:22-slim

WORKDIR /app

# Copy built node modules and source code from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Set environment to production
ENV NODE_ENV=develop

EXPOSE 3000

# Install nodemon for development
RUN npm install -g nodemon

# Set user to non-root for better security
USER node

CMD ["nodemon", "--legacy-watch", "./src/server.js"]