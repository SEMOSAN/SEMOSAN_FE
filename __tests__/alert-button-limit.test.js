const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");

// 안드로이드 네이티브 AlertDialog는 positive/negative/neutral 3개만 지원한다.
// Alert.alert에 버튼을 4개 이상 넘기면 RN이 앞 3개만 매핑하고 나머지를 버려,
// 취소 버튼이 사라져 사용자가 다이얼로그를 빠져나갈 수 없게 된다.
const MAX_ANDROID_ALERT_BUTTONS = 3;

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
// 이걸 빼먹으면 단언이 붙은 인자를 그냥 통과시킨다.
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

function isAlertAlertCall(node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "Alert" &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "alert"
  );
}

function findViolations(file) {
  const ast = parser.parse(fs.readFileSync(file, "utf8"), {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const violations = [];

  walk(ast.program, (node) => {
    if (!isAlertAlertCall(node)) return;

    const buttons = unwrap(node.arguments[2]);
    if (!buttons || buttons.type !== "ArrayExpression") return;

    const line = node.loc.start.line;

    if (buttons.elements.some((el) => el && el.type === "SpreadElement")) {
      violations.push(
        `${file}:${line} — 버튼 배열에 spread를 사용해 개수를 보장할 수 없음`,
      );
      return;
    }

    if (buttons.elements.length > MAX_ANDROID_ALERT_BUTTONS) {
      violations.push(
        `${file}:${line} — 버튼 ${buttons.elements.length}개 (최대 ${MAX_ANDROID_ALERT_BUTTONS}개)`,
      );
    }
  });

  return violations;
}

describe("Alert.alert 버튼 개수", () => {
  const files = SOURCE_DIRS.flatMap((dir) => collectSourceFiles(dir));

  it("스캔할 소스 파일을 찾는다", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it(`안드로이드 제약인 ${MAX_ANDROID_ALERT_BUTTONS}개를 넘기지 않는다`, () => {
    const violations = files.flatMap((file) => findViolations(file));

    expect(violations).toEqual([]);
  });
});
