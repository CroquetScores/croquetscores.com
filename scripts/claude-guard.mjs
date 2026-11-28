// Run by Claude Code before it edits or writes a file (.claude/settings.json),
// and given what it is about to do on standard input. It refuses by ending
// with status 2 and saying why on standard error, which Claude Code is shown;
// ending with any other status lets the edit go on.
//
// It holds the two rules of AI.md §9 that are about files, since a line in a
// document can be set aside by whoever reads it and this cannot. What it does
// not hold is the rest of §9, such as an event being rewritten, which no edit
// to a file says. Nor does it see a file changed through the shell (`sed -i`,
// a redirect, a script): it is asked before the editing tools and nothing else.
//
// A request it cannot read, or a tool it knows nothing of, is let through: it
// is asked before every edit, and a guard that stopped work over what it could
// not make sense of would be worse than the advice it replaces.
import { readFileSync } from "node:fs";

const refuse = (reason) => {
  console.error(reason);
  process.exit(2);
};

let request;
try {
  request = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const { tool_name: tool, tool_input: input } = request ?? {};
if (
  (tool !== "Edit" && tool !== "Write" && tool !== "MultiEdit") ||
  typeof input !== "object" ||
  input === null
) {
  process.exit(0);
}

// Said with forward slashes and in lower case whatever way it was given, since
// Windows gives a path with backslashes and does not tell one case from
// another, and the rules below are written with neither.
const path = String(input.file_path ?? "")
  .replaceAll("\\", "/")
  .toLowerCase();

// What the tool is about to put in the file: the new text of an edit, of each
// of several, or the whole of a file written.
const text = [
  input.new_string,
  input.content,
  ...(Array.isArray(input.edits) ? input.edits.map((e) => e?.new_string) : []),
]
  .filter((part) => typeof part === "string")
  .join("\n");

if (/(?:^|\/)migrations\/0001-initial\.sql$/.test(path)) {
  refuse(
    "0001-initial.sql is never edited: it is the schema as it was when the site first went live, and a database that has applied it is told so by its name. A change is a migration numbered after it (SETUP.md §6.2, AI.md §9).",
  );
}

// A table whose name begins with import, or imported, is what the import from
// the old sites keeps. The underscore is what tells it from a word that only
// begins the same way, such as important_note.
//
// A statement that changes one is refused, and a mention of one is not: a
// comment, or a query that only reads one, changes nothing, and refusing them
// would stop a migration being explained or a view being made over the
// import's tables, which AI.md §9 does not forbid. The comments are taken out
// first, so that a statement written inside one is not read as a statement.
const importTable = String.raw`(?:only\s+)?(?:if\s+exists\s+)?(?:"?\w+"?\.)?"?import(?:ed)?_`;
const changesAnImportTable = [
  String.raw`\balter\s+table\s+${importTable}`,
  String.raw`\bdrop\s+table\s+${importTable}`,
  String.raw`\btruncate\s+(?:table\s+)?${importTable}`,
  String.raw`\bdelete\s+from\s+${importTable}`,
  String.raw`\bupdate\s+${importTable}`,
  String.raw`\binsert\s+into\s+${importTable}`,
  String.raw`\bcreate\s+(?:unique\s+)?index\b[^;]*?\bon\s+${importTable}`,
  String.raw`\bcreate\s+(?:or\s+replace\s+)?trigger\b[^;]*?\bon\s+${importTable}`,
].map((pattern) => new RegExp(pattern, "i"));

if (/(?:^|\/)migrations\/[^/]+\.sql$/.test(path)) {
  const statements = text
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ");
  if (changesAnImportTable.some((pattern) => pattern.test(statements))) {
    refuse(
      "A migration does not alter, rename, empty or drop a table whose name begins with import, nor write to one: those are what the import from the old sites keeps, and nothing but the import writes to one (AI.md §9). Where one looks wrong, say so and leave it.",
    );
  }
}
