// Argon2id, at no less than the cost currently recommended for passwords: 19
// MiB of memory, 2 passes and 1 lane. Each guess costs an attacker that much,
// and a reader signing in waits a moment rather than a while.
//
// This hashes and checks whatever it is given, exactly as given. What a
// password is before it gets here — its accents taken one way, or put through
// the old site's hasher first — is for whoever calls it.
import { hash, verify, type Algorithm } from "@node-rs/argon2";
import { randomBytes } from "node:crypto";

// The library's own name for it is a const enum, which cannot be read across
// modules compiled one at a time, as these are. 2 is Argon2id.
const argon2id = 2 as Algorithm;

/** Today's cost. A hash made at less than this should be made again. */
export const todaysCost = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

/** What a hash says it was made with, read from the hash itself. */
export interface Cost {
  readonly algorithm: string;
  readonly memoryCost: number;
  readonly timeCost: number;
  readonly parallelism: number;
}

/** The cost `hashed` says it was made at, or undefined if it cannot be read. */
export const costOf = (hashed: string): Cost | undefined => {
  const found = /^\$(argon2(?:id|i|d))\$v=\d+\$m=(\d+),t=(\d+),p=(\d+)\$/.exec(
    hashed,
  );
  if (found === null) return undefined;
  const [, algorithm = "", memory = "", time = "", lanes = ""] = found;
  return {
    algorithm,
    memoryCost: Number(memory),
    timeCost: Number(time),
    parallelism: Number(lanes),
  };
};

/**
 * Whether `hashed` was made some way short of today's. Lanes are compared for
 * difference rather than for less: more of them are not more cost and fewer are
 * not less, so a hash not made with today's is made again with them.
 */
export const belowToday = (hashed: string): boolean => {
  const cost = costOf(hashed);
  return (
    cost === undefined ||
    cost.algorithm !== "argon2id" ||
    cost.memoryCost < todaysCost.memoryCost ||
    cost.timeCost < todaysCost.timeCost ||
    cost.parallelism !== todaysCost.parallelism
  );
};

export class Argon2id {
  // Made once, the first time it is wanted, and checked against whenever there
  // is no real hash to check, so that answering "no" to an address nobody
  // registered takes as long as answering "no" to a wrong password.
  #decoy: Promise<string> | undefined;

  hash(input: string): Promise<string> {
    return hash(input, { ...todaysCost, algorithm: argon2id });
  }

  /**
   * Whether `input` is what `hashed` was made from. A hash that cannot be read
   * matches nothing, and the time a real check would have taken is spent all
   * the same.
   */
  async verify(hashed: string, input: string): Promise<boolean> {
    try {
      return await verify(hashed, input);
    } catch {
      await this.spend(input);
      return false;
    }
  }

  /** Takes as long as checking `input` against a real hash, and matches nothing. */
  async spend(input: string): Promise<false> {
    if (this.#decoy === undefined) {
      const making = this.hash(randomBytes(32).toString("base64"));
      this.#decoy = making;
      // Kept only once made. A making that failed — the library refusing under
      // memory pressure, say — is let go of, so that the next check makes it
      // again rather than every check until the process restarts failing on
      // the one that did. Whoever awaited it is told of the failure by the
      // await below; this only forgets it.
      void making.catch(() => {
        if (this.#decoy === making) this.#decoy = undefined;
      });
    }
    await verify(await this.#decoy, input);
    return false;
  }
}
