const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

function resolveLocalBin(binName) {
  const fileName = process.platform === 'win32' ? `${binName}.cmd` : binName;
  return path.join(process.cwd(), 'node_modules', '.bin', fileName);
}

function wrapSpawn(fn) {
  return function patchedSpawn(command, args, options) {
    if (command === 'npx' && Array.isArray(args) && args.length > 0) {
      const [binName, ...restArgs] = args;
      const localBinPath = resolveLocalBin(binName);
      if (fs.existsSync(localBinPath)) {
        return fn(localBinPath, restArgs, options);
      }
    }
    return fn(command, args, options);
  };
}

childProcess.spawnSync = wrapSpawn(childProcess.spawnSync);
childProcess.spawn = wrapSpawn(childProcess.spawn);

require('./node_modules/@lark-opdev/block-basekit-cli/dist/index.js');
