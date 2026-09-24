// A password nobody chose, made from the operating system's random numbers.
import { randomInt } from "node:crypto";

import type { RandomPasswords } from "../../application/services/RandomPasswords.js";

// Letters, digits and a few marks that mean nothing to anything a password is
// passed through. Nobody types it, so how easily it is typed does not matter;
// each character drawn is about six bits, and fifty of them is more than any
// guessing will reach.
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";

export class CryptoRandomPasswords implements RandomPasswords {
  make(length: number): string {
    let made = "";
    // randomInt rather than a byte taken modulo the alphabet, which would make
    // the first few characters likelier than the rest.
    for (let each = 0; each < length; each++) {
      made += characters[randomInt(characters.length)];
    }
    return made;
  }
}
