# Use a imagem base do Nginx
# FROM nginx:latest
FROM node:latest

WORKDIR /tmp/angular

COPY . .

# RUN rm -rf node_modules

# RUN npm install

# RUN npm run build

RUN mkdir -p /var/www/html

RUN mv dist/* /var/www/html

VOLUME /var/www/html

WORKDIR /

RUN rm -rf /tmp/angular

# Copie os arquivos da aplicação Angular para o diretório de trabalho do Nginx
# COPY ./dist/julius-da-promo-front-end /usr/share/nginx/html
