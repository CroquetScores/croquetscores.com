import { ValidationError } from "../../../common/validation/ValidationError.js";
import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a tie break can break. */
export type TieBreakErrorCode = "TieBreak.Missing" | "TieBreak.Unknown";

const codes = new Validator<string, TieBreakErrorCode>({
  fields: [
    {
      field: "code",
      code: "TieBreak.Missing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * How the players of a block who are level on the matches they have won are
 * told apart: one of three, known by its code.
 *
 * It is the block's to say rather than the tournament's, since one tournament
 * can hold blocks run under different regulations. What each way does to the
 * order of the players is the placing of a block's players, and is not said
 * here; this is only which way a block has been told to go by.
 *
 * There is no making a tie break of any other code, so a code that is none of
 * the three is refused rather than taken as the nearest.
 */
export class TieBreak {
  readonly #code: string;

  private constructor(code: string) {
    this.#code = code;
  }

  /** Net games, then net hoops, then who beat who among those still level. */
  static readonly netGamesNetHoopsWhoBeatWho = new TieBreak(
    "net-games-net-hoops-who-beat-who",
  );

  /** Who beat who among those level, and nothing else. */
  static readonly whoBeatWho = new TieBreak("who-beat-who");

  /** No known way: those level share a placing. */
  static readonly other = new TieBreak("other");

  /** Every tie break there is. */
  static readonly all: readonly TieBreak[] = [
    TieBreak.netGamesNetHoopsWhoBeatWho,
    TieBreak.whoBeatWho,
    TieBreak.other,
  ];

  /**
   * What a block goes by until it is told otherwise. It is how blocks were
   * ordered on the old sites, which an imported block goes by too. It is not
   * how this site ordered them before a block could be told, which stopped at
   * net hoops, and there are no blocks kept from before it could be told.
   */
  static readonly unlessTold: TieBreak = TieBreak.netGamesNetHoopsWhoBeatWho;

  /**
   * The tie break known by `code`, exactly as it is written. Throws
   * {@link ValidationError} when there is no code, or no tie break by that
   * code.
   */
  static from(code: string): TieBreak {
    // Not trimmed or lowered: a tie break is picked from a list rather than
    // typed, so a code written any other way is a mistake in whatever gave it.
    codes.ensureValid(code);
    const found = TieBreak.all.find((known) => known.code === code);
    if (found === undefined)
      throw new ValidationError<TieBreakErrorCode>("TieBreak.Unknown");
    return found;
  }

  /** What anything that is not a reader goes by. */
  get code(): string {
    return this.#code;
  }

  /** Two tie breaks are the same when their codes are. */
  equals(other: TieBreak | undefined): boolean {
    return other instanceof TieBreak && this.#code === other.#code;
  }

  toString(): string {
    return this.#code;
  }
}
