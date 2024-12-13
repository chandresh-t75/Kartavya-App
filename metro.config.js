const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

// Get the default Expo config
const config = getDefaultConfig(__dirname);

// Modify the transformer for SVG files
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer")
};

// Update the resolver for asset and source extensions
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// Apply NativeWind configuration
module.exports = withNativeWind(config, { input: './global.css' });
