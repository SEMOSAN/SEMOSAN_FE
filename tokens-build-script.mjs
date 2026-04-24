import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary);

/* =========================================
 * 1) 타이포그래피 클래스 포맷
 * ========================================= */
const TYPO_PROP_MAP = {
  "font-family": "font-family",
  "font-weight": "font-weight",
  "font-size": "font-size",
  "line-height": "line-height",
  "letter-spacing": "letter-spacing",
  "text-decoration": "text-decoration",
  "text-case": "text-transform",
  "paragraph-indent": "text-indent",
  "paragraph-spacing": null,
};
const TYPO_PROPS = Object.keys(TYPO_PROP_MAP);

function extractTypographyPrefix(name) {
  for (const prop of TYPO_PROPS) {
    if (name.endsWith(`-${prop}`)) {
      return { prefix: name.slice(0, -(prop.length + 1)), prop };
    }
  }
  return null;
}

StyleDictionary.registerFormat({
  name: "css/typography-classes",
  format: ({ dictionary }) => {
    const groups = {};
    dictionary.allTokens.forEach((token) => {
      const match = extractTypographyPrefix(token.name);
      if (!match) return;
      const { prefix, prop } = match;
      const cssProp = TYPO_PROP_MAP[prop];
      if (!cssProp) return;
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push({ cssProp, varName: token.name });
    });

    const classes = Object.entries(groups).map(([prefix, rules]) => {
      const body = rules
        .map(({ cssProp, varName }) => `  ${cssProp}: var(--${varName});`)
        .join("\n");
      return `.${prefix} {\n${body}\n}`;
    });

    return `/**
 * Do not edit directly, this file was auto-generated.
 */

${classes.join("\n\n")}
`;
  },
});

/* =========================================
 * 2) Tailwind 토큰 포맷 (colors)
 *    - global.* 하위 토큰을 colors 네임스페이스로
 * ========================================= */
function setDeep(obj, pathArr, value) {
  let current = obj;
  pathArr.forEach((key, i) => {
    if (i === pathArr.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] ?? {};
      current = current[key];
    }
  });
}

StyleDictionary.registerFormat({
  name: "tailwind/tokens",
  format: ({ dictionary }) => {
    console.log(
      "\n=== [tailwind/tokens] 토큰 수:",
      dictionary.allTokens.length,
    );
    if (dictionary.allTokens.length > 0) {
      console.log("샘플 토큰 3개:");
      dictionary.allTokens.slice(0, 3).forEach((t) => {
        console.log({
          name: t.name,
          path: t.path,
          value: t.$value ?? t.value, // 👈 $value 우선
          type: t.$type ?? t.type,
        });
      });
    }

    const colors = {};

    dictionary.allTokens.forEach((token) => {
      if (token.path[0] !== "global") return;

      // 👇 $value 우선, 없으면 value
      const value = token.$value ?? token.value;
      if (typeof value !== "string") return;

      const rest = token.path.slice(1);
      setDeep(colors, rest, value);
    });

    return `// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
module.exports = {
  colors: ${JSON.stringify(colors, null, 2)},
};
`;
  },
});

/* =========================================
 * 3) spacing/radius/font-size에 px 단위 붙이기
 * ========================================= */
StyleDictionary.registerTransform({
  name: "size/append-px",
  type: "value",
  filter: (token) => {
    const numericTypes = [
      "spacing",
      "sizing",
      "borderRadius",
      "fontSizes",
      "dimension",
    ];
    return numericTypes.includes(token.type) && typeof token.value === "number";
  },
  transform: (token) => `${token.value}px`,
});

/* =========================================
 * 4) 빌드 설정
 * ========================================= */
const sd = new StyleDictionary({
  source: ["tokens/global/global.json"],
  preprocessors: ["tokens-studio"],
  log: { verbosity: "verbose" },
  expand: {
    typesMap: { typography: "css" },
  },
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      transforms: ["name/kebab", "size/append-px"],
      buildPath: "css/",
      files: [
        { destination: "variables.css", format: "css/variables" },
        { destination: "typography.css", format: "css/typography-classes" },
      ],
    },
    tailwind: {
      transformGroup: "tokens-studio",
      transforms: ["name/kebab", "size/append-px"],
      buildPath: "./",
      files: [{ destination: "tokens.cjs", format: "tailwind/tokens" }],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
