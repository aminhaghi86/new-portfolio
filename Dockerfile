# Stage 1: Build
FROM node:22-alpine AS builder

# تعریف آرگومان برای دریافت از سیستم بیلد
ARG VITE_N8N_WEBHOOK_URL
ARG VITE_TURNSTILE_SITE_KEY
# قرار دادن آرگومان در محیط سیستم برای استفاده Vite
ENV VITE_N8N_WEBHOOK_URL=$VITE_N8N_WEBHOOK_URL
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# در پروژه‌های Vite، خروجی در پوشه dist قرار می‌گیرد
COPY --from=builder /app/dist /usr/share/nginx/html
# فایل تنظیمات پیش‌فرض انجین‌اکس برای هندل کردن SPA (اختیاری اما توصیه شده)
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]