# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: Development environment
FROM node:18-alpine AS development
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . ./
EXPOSE 3000
CMD ["npm", "start"]

# Stage 3: Production environment
FROM nginx:alpine AS production

# Copy the production build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
