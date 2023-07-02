ARG BUILDER_CONTAINER=builder

FROM node:16.17.0-alpine3.16 AS node

FROM node AS deploy-dependencies-installer
WORKDIR /web
COPY package.json yarn.lock .env ./
RUN yarn install --prod

FROM deploy-dependencies-installer AS build-dependencies-installer
RUN yarn install

FROM build-dependencies-installer AS builder
COPY . .
RUN yarn build

FROM $BUILDER_CONTAINER AS tagged-builder

FROM deploy-dependencies-installer
COPY --from=tagged-builder /web/.next/ ./.next/
COPY --from=tagged-builder /web/public/ ./public/
CMD yarn start
