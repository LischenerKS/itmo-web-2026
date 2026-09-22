FROM nginx
LABEL authors="kir"


COPY ./* /usr/share/nginx/html
