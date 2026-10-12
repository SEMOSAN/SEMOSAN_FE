const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * app.config.js의 locales는 iOS용 키(CFBundleDisplayName, NSLocation*)를 담고 있는데
 * Expo가 이를 Android 문자열 리소스(res/values-b+ko 등)로도 생성한다. 기본 로케일에
 * 대응 항목이 없어 lintVitalRelease가 ExtraTranslation을 치명적 오류로 올리고
 * 릴리스 빌드(AAB)가 실패한다. iOS/Android 로케일을 따로 지정할 방법이 없어
 * 해당 검사만 끈다. android/는 prebuild로 재생성되므로 플러그인으로 처리한다.
 */
const SNIPPET = `
// iOS 전용 locale 키가 Android 리소스로도 생성돼 ExtraTranslation이 뜬다 (withAndroidLintFix)
android {
    lint {
        disable += "ExtraTranslation"
    }
}
`;

module.exports = function withAndroidLintFix(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== "groovy") {
      throw new Error(
        "withAndroidLintFix: groovy build.gradle이 아니라 lint 설정을 추가하지 못했습니다.",
      );
    }
    if (!cfg.modResults.contents.includes("withAndroidLintFix")) {
      cfg.modResults.contents += SNIPPET;
    }
    return cfg;
  });
};
