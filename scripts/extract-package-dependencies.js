const fs = require('fs');
const path = require('path');

const { version, scripts, ...packageJson } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json')),
);

fs.writeFileSync(
  path.join(__dirname, '..', 'package.min.json'),
  JSON.stringify({
    ...packageJson,
    scripts: {
      prebuild: scripts.prebuild,
      build: scripts.build,
    },
  }),
);
