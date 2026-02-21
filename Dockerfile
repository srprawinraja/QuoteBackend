# Use official Node.js runtime
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of application code
COPY . .

# Expose port
ENV PORT=4000
EXPOSE $PORT

# Run the app
CMD ["node", "functions/index.js"]