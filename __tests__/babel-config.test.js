const babel = require("@babel/core");

const SOURCE = `
  console.log("debug");
  console.warn("warn");
  console.error("error");
`;

function transform(envName) {
  // 파일명은 babel.config.js를 찾기 위한 기준일 뿐이라 실재하지 않아도 된다
  return babel.transformSync(SOURCE, {
    filename: "sample.js",
    envName,
    caller: { name: "metro", supportsStaticESM: true },
  }).code;
}

describe("babel.config.js", () => {
  it("프로덕션 빌드에서 console.log를 제거한다", () => {
    const code = transform("production");
    expect(code).not.toContain("console.log");
  });

  it("프로덕션에서도 console.warn과 console.error는 남긴다", () => {
    const code = transform("production");
    expect(code).toContain("console.warn");
    expect(code).toContain("console.error");
  });

  it("개발 빌드에서는 console.log를 남긴다", () => {
    const code = transform("development");
    expect(code).toContain("console.log");
  });
});
