FROM node:lts-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY public public
COPY .eslintrc.json .eslintrc.json
COPY tsconfig.json tsconfig.json
COPY package.json package.json

COPY src src

CMD npm run dev