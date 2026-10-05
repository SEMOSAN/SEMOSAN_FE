const { withProjectBuildGradle } = require("expo/config-plugins");

/**
 * 네이버 지도·카카오 SDK는 각사 Maven 저장소에만 올라와 있어
 * google()/mavenCentral()/jitpack만으로는 받을 수 없다.
 * android/는 prebuild로 매번 재생성되므로 플러그인으로 주입한다.
 */
const REPOS = [
  "https://repository.map.naver.com/archive/maven", // com.naver.maps:map-sdk
  "https://devrepo.kakao.com/nexus/content/groups/public/", // com.kakao.sdk:*
];

module.exports = function withAndroidMavenRepos(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== "groovy") {
      throw new Error(
        "withAndroidMavenRepos: groovy build.gradle이 아니라 저장소를 추가하지 못했습니다.",
      );
    }
    let contents = cfg.modResults.contents;
    for (const url of REPOS) {
      if (contents.includes(url)) continue;
      const anchor = "maven { url 'https://www.jitpack.io' }";
      if (!contents.includes(anchor)) {
        throw new Error(
          "withAndroidMavenRepos: allprojects의 jitpack 저장소를 찾지 못했습니다.",
        );
      }
      contents = contents.replace(
        anchor,
        `${anchor}\n    maven { url '${url}' }`,
      );
    }
    cfg.modResults.contents = contents;
    return cfg;
  });
};
