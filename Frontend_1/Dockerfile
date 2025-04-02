# Frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first for caching
COPY package.json .
COPY package-lock.json* ./
COPY postcss.config.cjs ./
COPY tailwind.config.cjs ./
COPY tsconfig*.json ./
COPY vite.config.js .

# Install dependencies
RUN npm ci

# Copy source files
COPY index.html .
COPY public ./public
COPY src ./src

# Build the app
RUN npm run build

# Production stage
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]