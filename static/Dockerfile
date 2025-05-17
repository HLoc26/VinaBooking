FROM nginx:alpine

# Copy ảnh vào nơi Nginx có thể đọc
COPY uploads /usr/share/nginx/html/uploads

# Copy file cấu hình custom
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
