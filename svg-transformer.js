const path = require('path');
const { createTransformer } = require('react-native-svg-transformer');

// react-native-svg-transformer/expo looks for Expo's Babel transformer with a bare require,
// which only works when @expo/metro-config happens to be hoisted. On a clean install
// (e.g. Vercel) it's nested under expo/, so resolve it from there explicitly.
const expoTransformerPath = require.resolve('@expo/metro-config/babel-transformer', {
  paths: [path.dirname(require.resolve('expo/package.json'))],
});

module.exports.transform = createTransformer(require(expoTransformerPath));
