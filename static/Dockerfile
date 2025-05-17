FROM nginx:alpine

# Copy thư mục chứa tệp static (ví dụ: uploads) vào thư mục Nginx
COPY uploads /usr/share/nginx/html/uploads

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Đảm bảo quyền đọc cho thư mục uploads
RUN chown -R nginx:nginx /usr/share/nginx/html/uploads \
    && chmod -R 755 /usr/share/nginx/html/uploads

# Mở port 80
EXPOSE 80