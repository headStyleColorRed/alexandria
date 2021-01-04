
# Generate web
cd alexandria-web/
npm run build

# Launch web + server
cd ../
docker-compose up --build -d