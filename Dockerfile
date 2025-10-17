# ===== Build Stage =====
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy application source
COPY . .

# Install deps
RUN npm install

# Build
RUN npm run build

FROM node:22-alpine

# Set working directory
WORKDIR /app

# Set environment variable
ENV PORT=3000

# Copy only needed files from build stage
COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "dist/app.js"]
