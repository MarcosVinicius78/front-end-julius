# Use a imagem base do Nginx
FROM nginx:latest

# Copie os arquivos da aplicação Angular para o diretório de trabalho do Nginx
COPY ./dist/my-angular-app /usr/share/nginx/html
