const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");

// 탭 경로를 router.push하면 탭 네비게이터가 루트 스택에 중복으로 쌓인다.
// 그러면 안드로이드 뒤로가기를 눌렀을 때 아래 화면으로 돌아가지 않고
// 탭 네비게이터의 첫 탭(홈)으로 빠진다 (backBehavior 기본값이 firstRoute).
// 이미 떠 있는 탭으로 보내는 navigate/replace를 쓸 것.
const TAB_PATH_PREFIX = "/(tabs)";

const SOURCE_DIRS = ["app", "components", "features", "hooks", "lib"];
const SOURCE_EXTENSIONS = [".ts", ".tsx"];

function collectSourceFiles(dir, found = []) {
  if (!fs.existsSync(dir)) return found;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "node_modules") continue;
      collectSourceFiles(full, found);
    } else if (SOURCE_EXTENSIONS.includes(path.extname(entry.name))) {
      found.push(full);
    }
  }

  return found;
}

function walk(node, visit) {
  if (!node || typeof node.type !== "string") return;

  visit(node);

  for (const key of Object.keys(node)) {
    if (key === "loc") continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) walk(child, visit);
    } else if (value && typeof value.type === "string") {
      walk(value, visit);
    }
  }
}

// `foo as any` / `<any>foo` / `(foo)`를 벗겨 실제 값 노드를 꺼낸다.
// 이 저장소에는 router.push(path as any) 패턴이 실제로 있어서 반드시 필요하다.
function unwrap(node) {
  let current = node;
  while (
    current &&
    (current.type === "TSAsExpression" ||
      current.type === "TSSatisfiesExpression" ||
      current.type === "TSNonNullExpression" ||
      current.type === "TSTypeAssertion" ||
      current.type === "ParenthesizedExpression")
  ) {
    current = current.expression;
  }
  return current;
}

function isRouterPushCall(node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "router" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "push"
  );
}

function isTabPath(node) {
  return (
    node &&
    node.type === "StringLiteral" &&
    node.value.startsWith(TAB_PATH_PREFIX)
  );
}

function findViolations(file) {
  const ast = parser.parse(fs.readFileSync(file, "utf8"), {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const violations = [];

  walk(ast.program, (node) => {
    if (!isRouterPushCall(node)) return;

    const target = unwrap(node.arguments[0]);
    if (!target) return;

    const line = node.loc.start.line;

    if (isTabPath(target)) {
      violations.push(`${file}:${line} — router.push("${target.value}")`);
      return;
    }

    if (target.type !== "ObjectExpression") return;

    const pathname = target.properties.find(
      (prop) =>
        prop.type === "ObjectProperty" &&
        prop.key.type === "Identifier" &&
        prop.key.name === "pathname",
    );

    if (!pathname) return;

    const pathnameValue = unwrap(pathname.value);
    if (isTabPath(pathnameValue)) {
      violations.push(
        `${file}:${line} — router.push({ pathname: "${pathnameValue.value}" })`,
      );
    }
  });

  return violations;
}

describe("탭 경로 내비게이션", () => {
  const files = SOURCE_DIRS.flatMap((dir) => collectSourceFiles(dir));

  it("스캔할 소스 파일을 찾는다", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("탭 경로를 router.push로 쌓지 않는다", () => {
    const violations = files.flatMap((file) => findViolations(file));

    expect(violations).toEqual([]);
  });
});
