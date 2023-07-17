const { loadEnvConfig } = require('@next/env');
const cli = require('next/dist/cli/next-dev');

loadEnvConfig('./');

cli.nextDev(['-p', process.env.PORT || 3000]);
