FROM node:20

ARG DEBIAN_FRONTEND=noninteractive
WORKDIR /app
RUN apt-get update --allow-insecure-repositories && apt-get install -y apt-utils iputils-ping net-tools traceroute telnet nano dnsutils curl
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3200
EXPOSE 3643
CMD [ "npm", "start" ]