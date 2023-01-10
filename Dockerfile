### STAGE 1: Build ###
#FROM node:10.19.0-alpine AS build
#WORKDIR /app
#COPY package.json /app
#RUN npm install
#COPY . /app
#RUN npm run build --prod

### STAGE 2: Run ###
FROM nginx:1.20.0-alpine
COPY package.json package-lock.json ./
RUN  npm install
COPY . .
RUN  npm run build -- --c dev
CMD ["/bin/bash","-i","/bin/run.sh"]
COPY dist/epsoft /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
