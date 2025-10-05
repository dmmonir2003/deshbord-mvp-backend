# Build Stage
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire app source code and build the app
COPY . .
RUN npm run build

# Production Stage
FROM node:22

WORKDIR /app

# Copy necessary files from the builder stage to the final image
COPY --from=builder /app/package.json /app/package-lock.json /app/dist /app/node_modules /app/

# Expose the port
EXPOSE 5001

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
