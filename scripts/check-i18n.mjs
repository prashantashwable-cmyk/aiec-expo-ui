import { readFileSync } from "node:fs";

const LANGS = ["en", "mr", "hi"];
const FILE = (lang) => `src/i18n/catalogues/${lang}.ts`;

const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

/**
 * Walks the catalogue object literal and returns a map of dotted key ->
 * placeholder names. Relies on the one-entry-per-line formatting these files
 * are written and prettier-formatted in.
 */
function parse(lang) {
  const src = stripComments(readFileSync(FILE(lang), "utf8"));
  const body = src.slice(src.indexOf("{"));
  const keys = new Map();
  const stack = [];

  for (const raw of body.split("\n")) {
    const line = raw.trim();

    const open = line.match(/^([A-Za-z0-9_]+):\s*\{$/);
    if (open) {
      stack.push(open[1]);
      continue;
    }
    if (line.startsWith("}")) {
      stack.pop();
      continue;
    }

    const leaf = line.match(/^([A-Za-z0-9_]+):\s*"(.*)",?$/);
    if (leaf) {
      const path = [...stack, leaf[1]].join(".");
      const placeholders = [...leaf[2].matchAll(/\{\{(\w+)\}\}/g)]
        .map((m) => m[1])
        .sort();
      keys.set(path, placeholders);
    }
  }
  return keys;
}

const parsed = Object.fromEntries(LANGS.map((l) => [l, parse(l)]));
const reference = parsed.en;
const problems = [];

if (reference.size === 0) {
  problems.push("en catalogue parsed to zero keys — the parser or the file shape changed");
}

for (const lang of LANGS.filter((l) => l !== "en")) {
  const catalogue = parsed[lang];

  for (const [key, placeholders] of reference) {
    if (!catalogue.has(key)) {
      problems.push(`${lang}: missing key "${key}"`);
      continue;
    }
    const theirs = catalogue.get(key);
    if (theirs.join(",") !== placeholders.join(",")) {
      problems.push(
        `${lang}: "${key}" placeholders {{${theirs.join("}} {{")}}} do not match en {{${placeholders.join("}} {{")}}}`,
      );
    }
  }
  for (const key of catalogue.keys()) {
    if (!reference.has(key)) {
      problems.push(`${lang}: key "${key}" does not exist in en`);
    }
  }
}

if (problems.length > 0) {
  console.error("i18n check FAILED\n");
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${problems.length} problem(s). A missing translation is a build break.`);
  process.exit(1);
}

console.log(`i18n check passed — ${reference.size} keys x ${LANGS.length} languages, placeholders aligned.`);
