# Build stage
FROM node:22.12.0-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app/frontend

# Copy package files
COPY package.json .

# Clean install dependencies
RUN yarn install

# Install serve globally
RUN yarn global add serve

# Copy all files
COPY . .
COPY .env ./

# Build the app
RUN yarn build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]