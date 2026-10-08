// What the admin's pages share in asking the API: how a thing is named in an
// address, and what a refusal was answered with. Here rather than written out
// beside each page, so that the pages cannot come to differ.

/**
 * The part of an id after its kind, which is how the API names a thing, so
 * that each is one segment of an address: "tournament/abc" is "abc".
 */
export const idInAddress = (id: string): string =>
  id.slice(id.indexOf("/") + 1);

/**
 * The code a refusal was answered with, or "Unknown" where it was answered
 * with none, as a failure of the site's is, so that something is always said.
 */
export const refusalOf = async (response: Response): Promise<string> => {
  try {
    return ((await response.json()) as { error?: string }).error ?? "Unknown";
  } catch {
    return "Unknown";
  }
};
