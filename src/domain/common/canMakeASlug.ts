import { Slug } from "./Slug.js";
import { ValidationError } from "./validation/ValidationError.js";

/**
 * Whether a slug can be made of `name`, as {@link Slug.fromName} would make
 * it. Asked of the slug itself rather than of the name, since a slug takes
 * accents off, and a name of nothing but one has a letter in it as typed and
 * none once the slug is made. Only `Slug.Empty` says no slug can be made;
 * anything else thrown is a fault, and is left to be seen as one rather than
 * said to the reader as a name with no letter or digit.
 */
export const canMakeASlug = (name: string): boolean => {
  try {
    Slug.fromName(name);
    return true;
  } catch (failure) {
    if (failure instanceof ValidationError && failure.code === "Slug.Empty") {
      return false;
    }
    throw failure;
  }
};
