# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS development

ARG VITE_REACT_APP_AUTH0_DOMAIN 
ARG VITE_REACT_APP_AUTH0_CLIENT_ID
ARG VITE_REACT_APP_AUTH0_CALLBACK_URL
ARG VITE_REACT_APP_AUTH0_AUDIENCE
ARG VITE_REACT_APP_API_SERVER_URL 
ARG VITE_REACT_APP_ONESIGNAL_APP_ID 

ENV VITE_REACT_APP_AUTH0_DOMAIN=$VITE_REACT_APP_AUTH0_DOMAIN
ENV VITE_REACT_APP_AUTH0_CLIENT_ID=$VITE_REACT_APP_AUTH0_CLIENT_ID
ENV VITE_REACT_APP_AUTH0_CALLBACK_URL=$VITE_REACT_APP_AUTH0_CALLBACK_URL
ENV VITE_REACT_APP_AUTH0_AUDIENCE=$VITE_REACT_APP_AUTH0_AUDIENCE
ENV VITE_REACT_APP_API_SERVER_URL=$VITE_REACT_APP_API_SERVER_URL
ENV VITE_REACT_APP_ONESIGNAL_APP_ID=$VITE_REACT_APP_ONESIGNAL_APP_ID
ENV PORT=5173

WORKDIR /code
COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm ci 
COPY . /code

CMD [ "npm", "run", "dev" ]

FROM development AS builder

RUN npm run build

FROM nginx:1.13-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
COPY OneSignalSDKWorker.js /usr/share/nginx/html/
COPY server.crt /etc/nginx/ssl/
COPY server.key /etc/nginx/ssl/
# COPY localhost.pem /etc/nginx/ssl/
# COPY localhost-key.pem /etc/nginx/ssl/

CMD ["nginx", "-g", "daemon off;"]
