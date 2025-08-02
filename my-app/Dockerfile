# Use official Node.js image for build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Use official Nginx image for serving static files
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from build stage
COPY --from=build /app/build .

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
