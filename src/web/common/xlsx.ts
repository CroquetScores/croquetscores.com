// A spreadsheet written as the smallest .xlsx that Excel, LibreOffice and
// Google Sheets all open: one worksheet of text and whole numbers, with cells
// that can be bold. It is written by hand rather than with a library because
// that is all the rankings file needs, and a library to write it would be a
// dependency for one file.
//
// An .xlsx is a zip of XML parts. The zip is written with nothing compressed,
// since the file is a few kilobytes and a reader opens a stored entry as it
// does a deflated one.
import { crc32 } from "node:zlib";

/** What a cell holds: text, or a whole number. */
export type Cell = string | number | undefined;

/** One cell, and whether it is drawn in bold. */
export interface Styled {
  readonly value: Cell;
  readonly bold?: boolean | undefined;
}

/** A row of cells, each text, a number, or a cell with a style. */
export type Row = readonly (Cell | Styled)[];

const xml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// A column's letter: A, B, ... Z, AA. A rankings file has eight at most.
const letterOf = (column: number): string => {
  let letters = "";
  for (let at = column + 1; at > 0; at = Math.floor((at - 1) / 26)) {
    letters = String.fromCharCode(65 + ((at - 1) % 26)) + letters;
  }
  return letters;
};

// A worksheet name may not have : \ / ? * [ ] and is at most 31 characters.
const sheetNameOf = (name: string): string =>
  name.replace(/[:\\/?*[\]]/g, "-").slice(0, 31) || "Sheet1";

const cellXml = (cell: Cell | Styled, at: string): string => {
  const styled =
    typeof cell === "object" && cell !== undefined ? cell : { value: cell };
  const style = styled.bold === true ? ' s="1"' : "";
  if (styled.value === undefined || styled.value === "") return "";
  if (typeof styled.value === "number") {
    return `<c r="${at}"${style}><v>${String(styled.value)}</v></c>`;
  }
  return `<c r="${at}"${style} t="inlineStr"><is><t xml:space="preserve">${xml(styled.value)}</t></is></c>`;
};

const worksheetXml = (rows: readonly Row[]): string =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows
    .map((row, at) => {
      const number = at + 1;
      const cells = row
        .map((cell, column) =>
          cellXml(cell, `${letterOf(column)}${String(number)}`),
        )
        .join("");
      return `<row r="${String(number)}">${cells}</row>`;
    })
    .join("")}</sheetData></worksheet>`;

const parts = (sheetName: string, rows: readonly Row[]): [string, string][] => [
  [
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
  ],
  [
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  ],
  [
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xml(sheetNameOf(sheetName))}" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  ],
  [
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  ],
  [
    // Two cell formats: the default, and bold, which a cell asks for as s="1".
    "xl/styles.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`,
  ],
  ["xl/worksheets/sheet1.xml", worksheetXml(rows)],
];

// A zip of stored entries: each a local header and its data, then the central
// directory that lists them, then the record that says where that starts.
const zipOf = (entries: readonly [string, string][]): Buffer => {
  const chunks: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  for (const [name, text] of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const data = Buffer.from(text, "utf8");
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // names are UTF-8
    local.writeUInt16LE(0, 8); // stored
    local.writeUInt16LE(0, 10); // time
    local.writeUInt16LE(0x21, 12); // date: 1 January 1980
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBytes, data);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4); // version made by
    entry.writeUInt16LE(20, 6); // version needed
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(0, 10);
    entry.writeUInt16LE(0, 12);
    entry.writeUInt16LE(0x21, 14);
    entry.writeUInt32LE(checksum, 16);
    entry.writeUInt32LE(data.length, 20);
    entry.writeUInt32LE(data.length, 24);
    entry.writeUInt16LE(nameBytes.length, 28);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, nameBytes);
    offset += local.length + nameBytes.length + data.length;
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, directory, end]);
};

/** The .xlsx of a single worksheet called `sheetName`, made of `rows`. */
export const xlsxOf = (sheetName: string, rows: readonly Row[]): Buffer =>
  zipOf(parts(sheetName, rows));
