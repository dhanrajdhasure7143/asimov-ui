### STAGE 1: Build ###
FROM node:10.19.0-alpine AS build
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

### STAGE 2: Run ###
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist/asimov /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
