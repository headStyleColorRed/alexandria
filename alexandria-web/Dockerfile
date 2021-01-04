FROM nginx

# Copy nginx configuration to container
COPY nginx.conf /etc/nginx/

# Copy website to container
COPY dist /usr/share/nginx/html

# U P D A T E
RUN		apt-get update
RUN		apt-get upgrade -y

# I N S T A L L S 
RUN		apt-get install -y vim


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]