const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web") {
    if (
      moduleName === "react-native/Libraries/Utilities/codegenNativeComponent"
    ) {
      return {
        type: "sourceFile",
        filePath: path.resolve(
          __dirname,
          "stubs/codegenNativeComponent.web.js"
        ),
      };
    }
    if (moduleName === "@mj-studio/react-native-naver-map") {
      return {
        type: "sourceFile",
        filePath: path.resolve(__dirname, "stubs/naver-map.web.js"),
      };
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
