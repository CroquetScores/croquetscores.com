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

const parse = (text) => {
  const values = new Map();
  for (const line of text.split("\n")) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match) values.set(match[1], match[2]);
  }
  return values;
};

const example = parse(readFileSync(examplePath, "utf8"));
const existing = existsSync(envPath)
  ? parse(readFileSync(envPath, "utf8"))
  : new Map();

const added = [];
const blank = [];
const lines = [];
for (const [key, fallback] of example) {
  const held = existing.get(key);
  if (held !== undefined && held !== "") {
    lines.push(`${key}=${held}`);
    continue;
  }
  const value = generated.has(key)
    ? randomBytes(32).toString("base64")
    : fallback;
  if (value === "") blank.push(key);
  else added.push(key);
  lines.push(`${key}=${value}`);
}

// Anything the developer added themselves stays, even though .env.example has
// never heard of it.
for (const [key, value] of existing) {
  if (!example.has(key)) lines.push(`${key}=${value}`);
}

writeFileSync(envPath, lines.join("\n") + "\n");

// Names only. A value in here is a secret even when it is only a local one.
console.log(
  added.length === 0
    ? ".env is already complete."
    : `.env filled in: ${added.join(", ")}`,
);
if (blank.length > 0) {
  console.log(`.env still needs, when they are wanted: ${blank.join(", ")}`);
}
