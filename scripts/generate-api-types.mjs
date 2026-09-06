#!/usr/bin/env node
/**
 * API 타입 자동 생성 스크립트
 * 실행: node scripts/generate-api-types.mjs
 * 출력: types/api.generated.ts
 */

import "dotenv/config";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_DOCS_URL = "https://lgenius.site/v3/api-docs";
const OUTPUT_PATH = resolve(__dirname, "../types/api.generated.ts");

// ─── OpenAPI → TypeScript 변환 ────────────────────────────────────────────────

function resolveRef(ref) {
  return ref.replace("#/components/schemas/", "");
}

function schemaToTS(schema, indent = 0) {
  if (!schema) return "unknown";
  if (schema.$ref) return resolveRef(schema.$ref);

  if (schema.enum) {
    return schema.enum
      .map((v) => (typeof v === "string" ? `"${v}"` : String(v)))
      .join(" | ");
  }

  if (schema.oneOf) return schema.oneOf.map((s) => schemaToTS(s, indent)).join(" | ");
  if (schema.allOf) return schema.allOf.map((s) => schemaToTS(s, indent)).join(" & ");

  const pad = "  ".repeat(indent);
  const innerPad = "  ".repeat(indent + 1);

  switch (schema.type) {
    case "string":
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array": {
      const inner = schemaToTS(schema.items, indent);
      return inner.includes("|") ? `(${inner})[]` : `${inner}[]`;
    }
    case "object":
      if (!schema.properties) {
        if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
          return `Record<string, ${schemaToTS(schema.additionalProperties, indent)}>`;
        }
        return "Record<string, unknown>";
      }
      const props = Object.entries(schema.properties)
        .map(([key, val]) => {
          const required = schema.required?.includes(key) ?? false;
          return `${innerPad}${key}${required ? "" : "?"}: ${schemaToTS(val, indent + 1)};`;
        })
        .join("\n");
      return `{\n${props}\n${pad}}`;
    default:
      return "unknown";
  }
}

// ─── 스키마 → 타입 선언 ───────────────────────────────────────────────────────

function generateSchemaDeclaration(name, schema) {
  if (schema.enum) {
    return `export type ${name} = ${schemaToTS(schema)};`;
  }

  if (schema.type === "object" || schema.properties) {
    const props = Object.entries(schema.properties ?? {})
      .map(([key, val]) => {
        const required = schema.required?.includes(key) ?? false;
        return `  ${key}${required ? "" : "?"}: ${schemaToTS(val, 1)};`;
      })
      .join("\n");
    return `export type ${name} = {\n${props}\n};`;
  }

  return `export type ${name} = ${schemaToTS(schema)};`;
}

// ─── 이름 변환 헬퍼 ───────────────────────────────────────────────────────────

function toPascalCase(str) {
  return str
    .replace(/[-_/](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function pathToEndpointKey(path) {
  const key = path
    .replace(/^\/api\//, "")
    .replace(/\{[^}]+\}/g, (m) => "BY_" + m.slice(1, -1).toUpperCase())
    .replace(/\//g, "_")
    .replace(/-/g, "_")
    .toUpperCase();
  return key || "ROOT";
}

function operationToName(path, method, operationId) {
  if (operationId) return toPascalCase(operationId);
  const segments = path
    .replace(/^\/api\//, "")
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      seg.startsWith("{") ? "By" + toPascalCase(seg.slice(1, -1)) : toPascalCase(seg)
    );
  return toPascalCase(method) + segments.join("");
}

// ─── 오퍼레이션 타입 생성 ─────────────────────────────────────────────────────

function generateOperationTypes(path, method, operation, schemaNames) {
  const name = operationToName(path, method, operation.operationId);
  const lines = [];

  // 오퍼레이션 이름 + 접미사가 스키마 이름과 겹치면(`LoginResponse = LoginResponse`)
  // 중복 선언이 되므로 별칭을 만들지 않는다 — 스키마 타입을 직접 쓰면 된다
  const pushAlias = (alias, type) => {
    if (schemaNames.has(alias)) return;
    lines.push(`export type ${alias} = ${type};`);
  };

  // Query / Path 파라미터
  const params = (operation.parameters ?? []).filter(
    (p) => p.in === "query" || p.in === "path"
  );
  if (params.length > 0) {
    lines.push(`export type ${name}Params = {`);
    for (const param of params) {
      const required = param.required ?? false;
      lines.push(`  ${param.name}${required ? "" : "?"}: ${schemaToTS(param.schema)};`);
    }
    lines.push(`};`);
  }

  // content-type이 application/json이 아니라 */* 로 선언된 엔드포인트가 있어
  // json 우선, 없으면 첫 번째 content 항목으로 폴백한다
  const contentSchema = (content) =>
    content?.["application/json"]?.schema ??
    Object.values(content ?? {})[0]?.schema;

  // Request Body
  const bodySchema = contentSchema(operation.requestBody?.content);
  if (bodySchema) {
    pushAlias(`${name}Body`, schemaToTS(bodySchema));
  }

  // Response (200 또는 201)
  const responseSchema =
    contentSchema(operation.responses?.["200"]?.content) ??
    contentSchema(operation.responses?.["201"]?.content);
  if (responseSchema) {
    pushAlias(`${name}Response`, schemaToTS(responseSchema));
  }

  return lines;
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching ${API_DOCS_URL} ...`);
  // api-docs가 Basic 인증으로 보호됨 — 크리덴셜은 .env(커밋 금지)에서 읽는다
  const user = process.env.API_DOCS_USER;
  const password = process.env.API_DOCS_PASSWORD;
  const headers =
    user && password
      ? {
          Authorization: `Basic ${globalThis.Buffer.from(
            `${user}:${password}`,
          ).toString("base64")}`,
        }
      : {};
  const res = await fetch(API_DOCS_URL, { headers });
  if (res.status === 401) {
    throw new Error(
      "HTTP 401 — .env에 API_DOCS_USER / API_DOCS_PASSWORD를 설정하세요",
    );
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const spec = await res.json();

  const sections = [];

  sections.push(
    `// Auto-generated from ${API_DOCS_URL}`,
    `// Run \`node scripts/generate-api-types.mjs\` to regenerate`,
    `// ⚠️ Do not edit manually`,
    ``
  );

  // ── Endpoints ──
  sections.push(`// ${"─".repeat(77)}`);
  sections.push(`// Endpoints`);
  sections.push(`// ${"─".repeat(77)}`);
  sections.push(`export const ENDPOINTS = {`);
  for (const path of Object.keys(spec.paths)) {
    const key = pathToEndpointKey(path);
    const params = [...path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    if (params.length > 0) {
      const args = params.map((p) => `${p}: number | string`).join(", ");
      const template = path.replace(/\{([^}]+)\}/g, (_, p) => `\${${p}}`);
      sections.push(`  ${key}: (${args}) => \`${template}\`,`);
    } else {
      sections.push(`  ${key}: "${path}",`);
    }
  }
  sections.push(`} as const;`);
  sections.push(``);

  // ── Schemas ──
  if (spec.components?.schemas) {
    sections.push(`// ${"─".repeat(77)}`);
    sections.push(`// Schemas`);
    sections.push(`// ${"─".repeat(77)}`);
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      sections.push(generateSchemaDeclaration(name, schema));
    }
    sections.push(``);
  }

  // ── Operations ──
  sections.push(`// ${"─".repeat(77)}`);
  sections.push(`// Operations (Params / Body / Response)`);
  sections.push(`// ${"─".repeat(77)}`);
  const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
  const schemaNames = new Set(Object.keys(spec.components?.schemas ?? {}));
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;
      const opLines = generateOperationTypes(path, method, operation, schemaNames);
      if (opLines.length > 0) {
        sections.push(`// ${method.toUpperCase()} ${path}`);
        sections.push(...opLines);
        sections.push(``);
      }
    }
  }

  mkdirSync(resolve(__dirname, "../types"), { recursive: true });
  writeFileSync(OUTPUT_PATH, sections.join("\n"), "utf-8");
  console.log(`✓ Generated: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
