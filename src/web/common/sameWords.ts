// Capital letters and spaces round a name are not worth a refusal in a name
// that is typed. The server that reads an address and the form that is typed
// into say so with this one rule, so that they cannot come to differ on what
// is the same name.
export const sameWords = (one: string, other: string): boolean =>
  one.trim().toLowerCase() === other.trim().toLowerCase();
