FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
FROM node:10-alpine

RUN apk add --no-cache gettext librsvg ghostscript imagemagick graphicsmagick ffmpeg

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# USER node

RUN npm install --only=prod

COPY --chown=node:node . .

EXPOSE 4001

CMD [ "node", "./dist/index.js" ]
# USER node

RUN npm install --only=prod

COPY --chown=node:node . .

EXPOSE 4001 4011

CMD [ "node", "./dist/index.js" ]