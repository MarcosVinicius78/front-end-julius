# Use a imagem base do Nginx
FROM nginx:latest

# Copie os arquivos da aplicação Angular para o diretório de trabalho do Nginx
COPY ./dist/julius-da-promo-front-end /usr/share/nginx/html
