ARG NODE_VERSION
ARG NGINX_VERSION

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

COPY ./src/package.json .
COPY ./src/package-lock.json .

RUN npm install

COPY ./src/ .

ARG API_HOST
ARG DEVELOPMENT

RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}"
RUN echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}"
RUN echo "VITE_SUPABASE_SERVICE_ROLE_KEY=${VITE_SUPABASE_SERVICE_ROLE_KEY}"

RUN rm -rf dist

RUN npm run build

FROM nginx:${NGINX_VERSION}-alpine AS server

COPY --from=build /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
