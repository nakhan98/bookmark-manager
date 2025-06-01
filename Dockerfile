# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Only copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/lib ./lib

# Set environment variables
ENV NODE_ENV=production

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
