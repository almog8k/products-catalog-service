# Use Node.js LTS (Long Term Support) as the base image
FROM node:slim

# Set working directory
WORKDIR /app

# Install dependencies first (leveraging Docker cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the port that the app will run on
EXPOSE 8080

# Command to run the application
CMD ["node", "src/index.js"]