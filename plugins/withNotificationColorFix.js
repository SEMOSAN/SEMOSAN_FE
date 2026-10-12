const { withAndroidManifest } = require("expo/config-plugins");

const META_NAME = "com.google.firebase.messaging.default_notification_color";

/**
 * expo-notifications는 알림 색 meta-data를 @color/notification_icon_color로,
 * @react-native-firebase/messaging은 같은 키를 @color/white로 선언해
 * 매니페스트 병합이 실패한다. 앱 설정값이 이기도록 tools:replace를 붙인다.
 * android/는 prebuild로 재생성되므로 플러그인으로 처리한다.
 */
module.exports = function withNotificationColorFix(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

    const application = manifest.application?.[0];
    const meta = application?.["meta-data"]?.find(
      (m) => m.$?.["android:name"] === META_NAME,
    );
    if (!meta) {
      throw new Error(
        `withNotificationColorFix: ${META_NAME} meta-data를 찾지 못했습니다.`,
      );
    }
    meta.$["tools:replace"] = "android:resource";
    return cfg;
  });
};
