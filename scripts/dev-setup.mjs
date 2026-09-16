// Fills in .env for development. It tops up rather than overwrites: a value
// already present is left exactly as it is, which matters most for the signing
// key, because everything already signed with it would otherwise stop verifying.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(root, ".env");
const examplePath = join(root, ".env.example");

// Generated here rather than pasted in: these two reach nothing but a
// developer's own machine, so there is nobody to ask for them.
const generated = new Set(["SESSION_COOKIE_SECRET", "TOKEN_SIGNING_KEY"]);

const assignment = /^(\s*)([A-Za-z_][A-Za-z0-9_.]*)(\s*=\s*)(.*)$/;

const parse = (text) => {
  const values = new Map();
  for (const line of text.split("\n")) {
    const match = assignment.exec(line);
    if (match) values.set(match[2], match[4]);
  }
  return values;
};

const valueFor = (key, fallback) =>
  generated.has(key) ? randomBytes(32).toString("base64") : fallback;

const example = parse(readFileSync(examplePath, "utf8"));

// A .env that does not exist yet starts life as a copy of the example, comments
// and grouping included, and is filled in from there.
const source = existsSync(envPath) ? envPath : examplePath;
const lines = readFileSync(source, "utf8").split("\n");

const added = [];
const blank = [];
const seen = new Set();

// Every line is written back. Only the ones this understands are edited, so a
// comment, a blank line or a key it has never heard of survives the round trip.
const rewritten = lines.map((line) => {
  const match = assignment.exec(line);
  if (match === null) return line;

  const [, indent, key, separator, held] = match;
  seen.add(key);
  if (held.trim() !== "") return line;

  const value = valueFor(key, example.get(key) ?? "");
  if (value === "") {
    blank.push(key);
    return line;
  }
  added.push(key);
  return `${indent}${key}${separator}${value}`;
});

// A trailing newline leaves an empty last element, and appending after it would
// open a gap. Anything appended below puts it back.
if (rewritten.at(-1) === "") rewritten.pop();

// Keys the example has gained since this .env was written.
for (const [key, fallback] of example) {
  if (seen.has(key)) continue;
  const value = valueFor(key, fallback);
  if (value === "") blank.push(key);
  else added.push(key);
  rewritten.push(`${key}=${value}`);
}

const text = rewritten.join("\n");
writeFileSync(envPath, text.endsWith("\n") ? text : `${text}\n`);

// Names only. A value in here is a secret even when it is only a local one.
console.log(
  added.length === 0
    ? ".env is already complete."
    : `.env filled in: ${added.join(", ")}`,
);
if (blank.length > 0) {
  console.log(`.env still needs, when they are wanted: ${blank.join(", ")}`);
}
