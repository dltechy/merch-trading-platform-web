ARG INITIAL_SETUP_IMAGE=initial-setup
ARG BUILD_DEPENDENCIES_IMAGE=build-dependencies
ARG DEPLOY_DEPENDENCIES_IMAGE=deploy-dependencies
ARG BUILDER_IMAGE=builder

FROM node:20.12.2-alpine3.19 AS node

FROM node AS initial-setup
WORKDIR /web
COPY scripts/extract-package-dependencies.js ./scripts/
COPY package.json ./
RUN node scripts/extract-package-dependencies.js

FROM $INITIAL_SETUP_IMAGE AS tagged-initial-setup

FROM node AS deploy-dependencies
WORKDIR /web
COPY --from=tagged-initial-setup /web/package.min.json ./package.json
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm@9.0.6 && pnpm install --prod

FROM $DEPLOY_DEPENDENCIES_IMAGE AS build-dependencies
RUN pnpm install

FROM $BUILD_DEPENDENCIES_IMAGE AS builder
COPY .env next.config.js postcss.config.js tailwind.config.js tsconfig.json ./
COPY styles ./styles/
COPY public ./public/
COPY src ./src/
RUN pnpm run build

FROM $BUILDER_IMAGE AS tagged-builder

FROM $DEPLOY_DEPENDENCIES_IMAGE AS deployer
COPY .env package.json start.js ./
COPY public ./public/
COPY --from=tagged-builder /web/.next ./.next/
CMD pnpm run start
