FROM node:alpine as builder

WORKDIR /app
COPY ./package.json ./
COPY yarn.lock ./

RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine

EXPOSE 8080
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
