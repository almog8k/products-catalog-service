# Use Node.js LTS as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies including TypeScript compiler
RUN npm ci

# Copy all source files
COPY . .

# Build TypeScript code with additional verbosity for debugging
RUN echo "Building TypeScript project..." && \
    npx tsc --listFiles && \
    npm run build

# Remove development dependencies to reduce image size
RUN npm ci --omit=dev

# Set environment variables
ENV NODE_ENV=production

# Expose the port that the app will run on
EXPOSE 8080

# Command to run the compiled JavaScript code
CMD ["node", "dist/index.js"]