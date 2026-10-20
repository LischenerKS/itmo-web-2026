FROM nginx
LABEL authors="kir"

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html