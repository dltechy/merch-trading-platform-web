const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');

const getFilesToLint = async (files) => {
  const eslintCli = new ESLint();

  const isFileIgnored = await Promise.all(
    files.map((file) => {
      return eslintCli.isPathIgnored(file);
    }),
  );

  const filteredFiles = files.filter((_, index) => !isFileIgnored[index]);
  return filteredFiles.join(' ');
};

const createTsConfig = (files) => {
  const srcPath = `${path.resolve(__dirname, 'src')}/`;

  const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json'));
  tsconfig.include = files.filter(
    (file) =>
      file.startsWith(srcPath) &&
      (file.endsWith('.ts') || file.endsWith('.tsx')),
  );

  if (tsconfig.include.length > 0) {
    tsconfig.include.push('**/*.d.ts');
  }

  fs.writeFileSync('tsconfig.lintstaged.json', JSON.stringify(tsconfig));

  return tsconfig;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': async (files) => {
    const filesToLint = await getFilesToLint(files);
    if (filesToLint.length > 0) {
      const output = [];

      output.push(`eslint --max-warnings=0 --fix ${filesToLint}`);

      const tsconfig = createTsConfig(files);
      if (tsconfig.include.length > 0) {
        output.push(`tsc --project tsconfig.lintstaged.json --noEmit`);
      }

      output.push(`jest --clearCache`);
      output.push(`jest --passWithNoTests --findRelatedTests ${filesToLint}`);

      output.push('rimraf tsconfig.lintstaged.*');

      return output;
    }
    return [];
  },
};
