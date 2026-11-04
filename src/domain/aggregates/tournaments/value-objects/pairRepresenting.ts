// What a doubles pair represents (pairRepresenting.feature).

const said = (written: string | undefined): string | undefined =>
  written?.trim() || undefined;

/**
 * What the pair of two players represents: what the one that represents
 * anything does; once, as the first wrote it, where both represent the same;
 * and where they differ, both, the first then the second, with a slash between,
 * as a reader would write two clubs a pair plays for. Nothing where neither
 * represents anything.
 */
export const pairRepresenting = (
  first: string | undefined,
  second: string | undefined,
): string | undefined => {
  const one = said(first);
  const other = said(second);
  if (one === undefined || other === undefined) return one ?? other;
  return one.toLocaleLowerCase() === other.toLocaleLowerCase()
    ? one
    : `${one} / ${other}`;
};
