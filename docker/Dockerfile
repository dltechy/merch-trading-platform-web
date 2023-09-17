ARG INITIAL_SETUP_IMAGE=initial-setup
ARG BUILD_DEPENDENCIES_IMAGE=build-dependencies
ARG DEPLOY_DEPENDENCIES_IMAGE=deploy-dependencies
ARG BUILDER_IMAGE=builder

FROM node:16.17.0-alpine3.16 AS node

FROM node AS initial-setup
WORKDIR /web
COPY scripts/extract-package-dependencies.js ./scripts/
COPY package.json ./
RUN node scripts/extract-package-dependencies.js

FROM $INITIAL_SETUP_IMAGE AS tagged-initial-setup

FROM node AS build-dependencies
WORKDIR /web
COPY --from=tagged-initial-setup /web/package.min.json ./package.json
COPY pnpm-lock.yaml ./
RUN pnpm install

FROM node AS deploy-dependencies
WORKDIR /web
COPY --from=tagged-initial-setup /web/package.min.json ./package.json
COPY pnpm-lock.yaml ./
RUN pnpm install --prod

FROM $BUILD_DEPENDENCIES_IMAGE AS builder
COPY .env next.config.js postcss.config.js tailwind.config.js tsconfig.json ./
COPY styles ./styles/
COPY public ./public/
COPY src ./src/
RUN pnpm build

FROM $BUILDER_IMAGE AS tagged-builder

FROM $DEPLOY_DEPENDENCIES_IMAGE AS deployer
COPY .env package.json start.js ./
COPY public ./public/
COPY --from=tagged-builder /web/.next ./.next/
CMD pnpm start
