ARG BUILD_DEPENDENCIES_IMAGE=build-dependencies
ARG DEPLOY_DEPENDENCIES_IMAGE=deploy-dependencies
ARG BUILDER_IMAGE=builder

FROM node:16.17.0-alpine3.16 AS node

FROM node AS build-dependencies
WORKDIR /web
COPY package.json yarn.lock ./
RUN yarn install

FROM node AS deploy-dependencies
WORKDIR /web
COPY package.json yarn.lock ./
RUN yarn install --prod

FROM $BUILD_DEPENDENCIES_IMAGE AS builder
COPY . .
RUN yarn build

FROM $BUILDER_IMAGE AS tagged-builder

FROM $DEPLOY_DEPENDENCIES_IMAGE AS deployer
COPY public ./public/
COPY .env ./
COPY --from=tagged-builder /web/.next ./.next/
CMD yarn start
