FROM node:22.12.0-slim

# Install build dependencies and yarn
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci --include=dev

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD npm run start
