// The rankings file a scenario asked for, kept for the steps that read it. A
// module rather than a steps file, so that the steps of the file's two kinds
// can share what they read without defining a step twice.
//
// Asked for with a plain request rather than the browser, since a file is
// saved rather than shown, and a browser that is sent one as an attachment
// has no page to read it from.
import { strict as assert } from "node:assert";
import { inflateRawSync } from "node:zlib";

import type { SpecWorld } from "../../../support/world.js";

/** What the site answered a request for the file with. */
export interface Given {
  readonly status: number;
  readonly headers: Headers;
  readonly bytes: Buffer;
  /** Where it was found after any redirect, as a path. */
  readonly path: string;
}

/** One line of the file: a spreadsheet's first cell of the row, or a text file's line. */
export interface Line {
  readonly text: string;
  readonly bold: boolean;
}

/** A cell of a spreadsheet's row, by its column's letter. */
export interface Cell {
  readonly text: string;
  readonly bold: boolean;
}

interface Kept {
  given: Given | undefined;
  lines: readonly Line[];
  /** For a spreadsheet: each row's cells by column letter. */
  rows: readonly ReadonlyMap<string, Cell>[];
  sheetName: string | undefined;
}

const kept = new WeakMap<SpecWorld, Kept>();

const keptOf = (world: SpecWorld): Kept => {
  let found = kept.get(world);
  if (found === undefined) {
    found = { given: undefined, lines: [], rows: [], sheetName: undefined };
    kept.set(world, found);
  }
  return found;
};

/** Asks for `path` on the scenario's site, following any redirect. */
export const request = async (
  world: SpecWorld,
  path: string,
): Promise<Given> => {
  const response = await fetch(`${world.baseUrl!}${path}`, {
    redirect: "follow",
  });
  const given: Given = {
    status: response.status,
    headers: response.headers,
    bytes: Buffer.from(await response.arrayBuffer()),
    path: new URL(response.url).pathname,
  };
  keptOf(world).given = given;
  return given;
};

/** What was last asked for. */
export const givenTo = (world: SpecWorld): Given => {
  const { given } = keptOf(world);
  assert.ok(given !== undefined, "No file was asked for.");
  return given;
};

/** Whether what was given is a file to save. */
export const isAFile = (given: Given): boolean =>
  given.status === 200 &&
  (given.headers.get("content-disposition") ?? "").startsWith("attachment");

/** The name the file was given to be saved as. */
export const fileNameOf = (given: Given): string => {
  const disposition = given.headers.get("content-disposition") ?? "";
  const encoded = /filename\*=UTF-8''([^;]+)/.exec(disposition)?.[1];
  if (encoded !== undefined) return decodeURIComponent(encoded);
  return /filename="([^"]*)"/.exec(disposition)?.[1] ?? "";
};

// Text file -------------------------------------------------------------------------

/** Keeps the lines of the text file given, which is `text` as it was written. */
export const keepTextFile = (world: SpecWorld, text: string): void => {
  const lines = text === "" ? [] : text.replace(/\r?\n$/, "").split(/\r?\n/);
  keptOf(world).lines = lines.map((line) => ({ text: line, bold: false }));
};

/** The text of the file given, which is what was asked for last. */
export const textGiven = (world: SpecWorld): string =>
  givenTo(world).bytes.toString("latin1");

// Spreadsheet -----------------------------------------------------------------------

// The entries of a zip, read from its central directory, each inflated where
// it was deflated: what a reader of the file does, and the only way to read a
// file written to be opened by somebody else's software.
const zipEntries = (zip: Buffer): Map<string, string> => {
  const entries = new Map<string, string>();
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end -= 1;
  assert.ok(end >= 0, "The file is not a zip.");
  const count = zip.readUInt16LE(end + 10);
  let at = zip.readUInt32LE(end + 16);
  for (let each = 0; each < count; each += 1) {
    assert.equal(zip.readUInt32LE(at), 0x02014b50, "A bad central entry.");
    const method = zip.readUInt16LE(at + 10);
    const size = zip.readUInt32LE(at + 20);
    const nameLength = zip.readUInt16LE(at + 28);
    const extraLength = zip.readUInt16LE(at + 30);
    const commentLength = zip.readUInt16LE(at + 32);
    const local = zip.readUInt32LE(at + 42);
    const name = zip.toString("utf8", at + 46, at + 46 + nameLength);
    const dataAt =
      local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const stored = zip.subarray(dataAt, dataAt + size);
    entries.set(
      name,
      (method === 8 ? inflateRawSync(stored) : stored).toString("utf8"),
    );
    at += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
};

const unescaped = (text: string): string =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/**
 * Keeps the spreadsheet given: each row's cells, and each row's first cell as
 * a line, so that the steps for a line read a spreadsheet as they read a text
 * file. Rows and cells are as written, so a row left empty is a line of
 * nothing.
 */
export const keepSpreadsheet = (world: SpecWorld): void => {
  const entries = zipEntries(givenTo(world).bytes);
  const sheet = entries.get("xl/worksheets/sheet1.xml");
  assert.ok(sheet !== undefined, "The file has no worksheet.");
  const rows: Map<string, Cell>[] = [];
  for (const row of sheet.matchAll(/<row r="(\d+)">(.*?)<\/row>/gs)) {
    const cells = new Map<string, Cell>();
    for (const cell of row[2]!.matchAll(
      /<c r="([A-Z]+)\d+"((?: [a-z]+="[^"]*")*)>(.*?)<\/c>/gs,
    )) {
      const bold = / s="1"/.test(cell[2]!);
      const inline = /<t[^>]*>(.*?)<\/t>/s.exec(cell[3]!)?.[1];
      const number = /<v>(.*?)<\/v>/s.exec(cell[3]!)?.[1];
      cells.set(cell[1]!, {
        text: unescaped(inline ?? number ?? ""),
        bold,
      });
    }
    rows[Number(row[1]) - 1] = cells;
  }
  const empty = new Map<string, Cell>();
  const filled = Array.from(
    { length: rows.length },
    (_, at) => rows[at] ?? empty,
  );
  const keptHere = keptOf(world);
  keptHere.rows = filled;
  keptHere.lines = filled.map((cells) => ({
    text: cells.get("A")?.text ?? "",
    bold: cells.get("A")?.bold ?? false,
  }));
  keptHere.sheetName = /<sheet name="([^"]*)"/.exec(
    entries.get("xl/workbook.xml") ?? "",
  )?.[1];
};

/** The lines of the file read last. */
export const linesRead = (world: SpecWorld): readonly Line[] =>
  keptOf(world).lines;

/** The spreadsheet's rows read last, each its cells by column letter. */
export const rowsRead = (
  world: SpecWorld,
): readonly ReadonlyMap<string, Cell>[] => keptOf(world).rows;

/** The name of the spreadsheet's worksheet read last. */
export const sheetNameRead = (world: SpecWorld): string | undefined =>
  keptOf(world).sheetName;
