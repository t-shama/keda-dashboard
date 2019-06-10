FROM node:lts-alpine as build-env

COPY . /src
WORKDIR /src
RUN yarn install && yarn build && \
    mv server/dist dist && \
    mv server/node_modules dist && \
    mv client/build dist/public && \
    mv dist /app

FROM node:lts-alpine as final
COPY --from=build-env [ "/app", "/app" ]
ENV PORT=80

CMD [ "node", "/app/server.js" ]