const { loadEnvConfig } = require('@next/env');
const cli = require('next/dist/cli/next-start');

loadEnvConfig('./');

cli.nextStart(['-p', process.env.PORT || 3000]);
