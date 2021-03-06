const path = require('path');
const opencvBuild = require('opencv-build');

// ensure binaries are added to path on windows
if (!opencvBuild.isAutoBuildDisabled() && process.platform === 'win32') {
  // append opencv binary path to node process
  if (!process.env.path.includes(opencvBuild.opencvBinDir)) {
    process.env.path = `${process.env.path};${opencvBuild.opencvBinDir};`
  }
}

let cv;
if (process.env.BINDINGS_DEBUG) {
  cv = require(path.join(__dirname, '../build/Debug/opencv4nodejs'));
} else {
  cv = require(path.join(__dirname, '../build/Release/opencv4nodejs'));
}

const { resolvePath } = require('./commons');
const promisify = require('./promisify');
const extendWithJsSources = require('./src');

// resolve haarcascade files
const { haarCascades, lbpCascades } = cv;
Object.keys(haarCascades).forEach(
  key => cv[key] = resolvePath(path.join(__dirname, './haarcascades'), haarCascades[key]));
Object.keys(lbpCascades).forEach(
  key => cv[key] = resolvePath(path.join(__dirname, './lbpcascades'), lbpCascades[key]));

// promisify async methods
cv = promisify(cv);
cv = extendWithJsSources(cv);

module.exports = cv;