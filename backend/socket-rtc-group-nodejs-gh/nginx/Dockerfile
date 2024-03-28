
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
# COPY nginx.conf /etc/nginx/nginx-local.conf

COPY cert.crt /etc/nginx/cert.crt
COPY cert.key /etc/nginx/cert.key

EXPOSE 443
# EXPOSE 5000