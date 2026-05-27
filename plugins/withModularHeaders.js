const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// use_modular_headers! 전체 적용 시 RNFBApp 빌드 에러 발생
// GoogleUtilities 에만 modular_headers 적용
module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const patch = "  pod 'GoogleUtilities', :modular_headers => true";
      if (!podfile.includes(patch)) {
        podfile = podfile.replace(
          /^(platform :ios,.+)$/m,
          `$1\n\n${patch}`
        );
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
};
