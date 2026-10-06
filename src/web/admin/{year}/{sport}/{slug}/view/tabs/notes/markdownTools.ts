// What each of the note dialog's tools writes (note.feature), as GitHub's do:
// a tool for words writes its Markdown around what is selected, or with
// nothing selected writes it and puts the reader where the words go; a tool
// for lines writes its Markdown at the start of each line selected, or on a
// line of its own where the reader is part way along one. Kept apart from the
// dialog, which only says where the box's selection is and puts back what
// comes of it.

/** The tools, in GitHub's order. */
export const tools = [
  "heading",
  "bold",
  "italic",
  "quote",
  "code",
  "link",
  "numberedList",
  "bulletedList",
  "taskList",
] as const;

export type Tool = (typeof tools)[number];

/** A box's words and what is selected in them, as a box says them. */
export interface Typed {
  readonly value: string;
  readonly start: number;
  readonly end: number;
}

// What goes either side of the words selected.
const around: Partial<Record<Tool, string>> = {
  bold: "**",
  italic: "_",
  code: "`",
};

// What begins each line selected; a numbered list counts its lines.
const linePrefix: Partial<Record<Tool, (line: number) => string>> = {
  heading: () => "### ",
  quote: () => "> ",
  numberedList: (line) => `${String(line + 1)}. `,
  bulletedList: () => "- ",
  taskList: () => "- [ ] ",
};

const wrapped = (typed: Typed, before: string, after: string): Typed => {
  const { value, start, end } = typed;
  const selected = value.slice(start, end);
  return {
    value: value.slice(0, start) + before + selected + after + value.slice(end),
    start: start + before.length,
    end: start + before.length + selected.length,
  };
};

const forLines = (typed: Typed, prefix: (line: number) => string): Typed => {
  const { value, start, end } = typed;
  // Nothing selected part way along a line: what the tool begins goes on a
  // line of its own, rather than in the middle of what is there.
  if (start === end) {
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const begun = value.slice(lineStart, start).trim() === "" ? "" : "\n";
    const written = begun + prefix(0);
    return {
      value: value.slice(0, start) + written + value.slice(end),
      start: start + written.length,
      end: start + written.length,
    };
  }
  // Every line the selection touches, whole. A selection ending just after a
  // line break, as a triple-click selects a line in some browsers, ends with
  // the line before it: the line after is not one the reader chose.
  const from = value.lastIndexOf("\n", start - 1) + 1;
  const last = value[end - 1] === "\n" ? end - 1 : end;
  const lineEnd = value.indexOf("\n", last);
  const to = lineEnd === -1 ? value.length : lineEnd;
  const lines = value
    .slice(from, to)
    .split("\n")
    .map((line, at) => prefix(at) + line)
    .join("\n");
  return {
    value: value.slice(0, from) + lines + value.slice(to),
    start: from,
    end: from + lines.length,
  };
};

/** What `tool` makes of `typed`, and what is selected after it. */
export const written = (tool: Tool, typed: Typed): Typed => {
  const selected = typed.value.slice(typed.start, typed.end);
  // Code around more than one line is a block of code, fenced on lines of
  // its own, since backticks around a line break are not one.
  if (tool === "code" && selected.includes("\n")) {
    return wrapped(typed, "```\n", "\n```");
  }
  if (tool === "link") {
    // The words are the link's, and the address is left selected, to be
    // typed over.
    const { value, start, end } = typed;
    const link = `[${selected}](url)`;
    const at = start + selected.length + 3;
    return {
      value: value.slice(0, start) + link + value.slice(end),
      start: selected === "" ? start + 1 : at,
      end: selected === "" ? start + 1 : at + 3,
    };
  }
  const either = around[tool];
  if (either !== undefined) return wrapped(typed, either, either);
  const prefix = linePrefix[tool];
  return prefix === undefined ? typed : forLines(typed, prefix);
};
