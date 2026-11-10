// A description, no longer than a search result shows whole: shortened at a
// word, with an ellipsis, where it would be longer, so that what is shown is
// never a word cut in half (pageDescription.feature).
export const mostCharactersInADescription = 160;

export const shortened = (text: string): string => {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= mostCharactersInADescription) return trimmed;
  // Room is left for the ellipsis, and the cut is at the last space before it.
  const room = trimmed.slice(0, mostCharactersInADescription - 1);
  const at = room.lastIndexOf(" ");
  return `${(at > 0 ? room.slice(0, at) : room).trimEnd()}…`;
};
