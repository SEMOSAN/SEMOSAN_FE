module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // 릴리스 빌드에서 console 호출을 제거한다.
    // 개발용 로그에 인증 토큰이 섞여 들어가는 것을 구조적으로 막는다.
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
  };
};
