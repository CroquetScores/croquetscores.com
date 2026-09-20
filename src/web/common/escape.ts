// Escaping text for HTML, in a module of its own rather than in layout.ts.
// Everything that writes HTML needs it — the layout, a dialog, an email, the
// account menu — and the account menu is written into the layout, so with it in
// layout.ts the menu had to import the file that imports it. A cycle between
// two modules is only safe while neither uses the other while it is still being
// loaded, which nothing here does and nothing here promises to keep doing: one
// constant worked out at the top of a module would turn it into a failure on
// startup. This has nothing to import, so it can be imported by anything.
export const escape = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
