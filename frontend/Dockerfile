# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS development

ENV PORT=5173

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci
COPY . /code

CMD [ "npm", "run", "dev" ]

FROM development AS builder

RUN npm run build

FROM nginx:1.13-alpine

COPY --from=builder /code/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
COPY OneSignalSDKWorker.js /usr/share/nginx/html/