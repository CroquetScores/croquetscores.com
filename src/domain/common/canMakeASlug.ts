import { Slug } from "./Slug.js";

/**
 * Whether a slug can be made of `name`, as {@link Slug.fromName} would make
 * it. Asked of the slug itself rather than of the name, since a slug takes
 * accents off, and a name of nothing but one has a letter in it as typed and
 * none once the slug is made.
 */
export const canMakeASlug = (name: string): boolean => {
  try {
    Slug.fromName(name);
    return true;
  } catch {
    return false;
  }
};
