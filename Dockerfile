# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# در پروژه‌های Vite، خروجی در پوشه dist قرار می‌گیرد
COPY --from=builder /app/dist /usr/share/nginx/html
# فایل تنظیمات پیش‌فرض انجین‌اکس برای هندل کردن SPA (اختیاری اما توصیه شده)
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]