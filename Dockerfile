FROM node:6.4.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -q
COPY . /usr/src/app

CMD [ "npm", "start" ]
EXPOSE 8090
