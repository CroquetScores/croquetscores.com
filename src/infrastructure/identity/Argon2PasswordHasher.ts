// The hasher for passwords made on this site: argon2id at today's cost, with a
// password taken as its reader meant it rather than as their keyboard spelled
// it. An accented letter can be typed as one character or as a letter followed
// by an accent, and the two look the same to whoever typed them, so both are
// put into the one form (NFC) before hashing and before checking. Nothing else
// is changed: case, spaces and every other character count.
import type {
  PasswordCheck,
  PasswordHasher,
} from "../../application/services/PasswordHasher.js";
import { Argon2id, belowToday } from "./Argon2id.js";

const asMeant = (password: string): string => password.normalize("NFC");

export class Argon2PasswordHasher implements PasswordHasher {
  constructor(private readonly argon2: Argon2id = new Argon2id()) {}

  hash(password: string): Promise<string> {
    return this.argon2.hash(asMeant(password));
  }

  async check(
    password: string,
    hash: string | undefined,
  ): Promise<PasswordCheck> {
    if (hash === undefined) {
      return {
        matches: await this.argon2.spend(asMeant(password)),
        remake: false,
      };
    }
    const matches = await this.argon2.verify(hash, asMeant(password));
    return { matches, remake: matches && belowToday(hash) };
  }
}
