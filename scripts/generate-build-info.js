const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const buildInfo = {
  version: packageJson.version,
  buildTime: new Date().toISOString(),
  buildTimestamp: Date.now(),
};

const outputPath = path.join(__dirname, '..', 'lib', 'build-info.json');

fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));

console.log(`Build info generated: v${buildInfo.version} at ${buildInfo.buildTime}`);
