import { ValidationError } from "./validation/ValidationError.js";
import { Validator } from "./validation/Validator.js";

/** Every rule a website can break. */
export type WebsiteErrorCode = "Website.Missing" | "Website.Unknown";

/**
 * Which of the two sites built from this code a website serves. Not the site's
 * name, which is configured rather than known here, because a site can be
 * served under another name without becoming another site.
 */
export type Site = "croquetScores" | "gateballScores";

const hosts = new Validator<string, WebsiteErrorCode>({
  fields: [
    {
      field: "host",
      code: "Website.Missing",
      isBrokenBy: (given) => given === "",
    },
  ],
});

/**
 * A website the site is served as: one of five, known by its host, serving one
 * of the two sites, and a try website or not.
 *
 * The five are written out rather than worked out from the host, so that
 * "try." in front of a host nobody set up does not make a try website of it.
 */
export class Website {
  readonly #host: string;
  readonly #site: Site;
  readonly #isTry: boolean;

  private constructor(host: string, site: Site, isTry: boolean) {
    this.#host = host;
    this.#site = site;
    this.#isTry = isTry;
  }

  static readonly croquetScores = new Website(
    "croquetscores.com",
    "croquetScores",
    false,
  );
  static readonly tryCroquetScores = new Website(
    "try.croquetscores.com",
    "croquetScores",
    true,
  );
  static readonly gateballScores = new Website(
    "gateballscores.com",
    "gateballScores",
    false,
  );
  static readonly tryGateballScores = new Website(
    "try.gateballscores.com",
    "gateballScores",
    true,
  );
  // Development is where the site is worked on rather than somewhere readers
  // are sent, so it is Croquet Scores as readers have it and not a try website.
  static readonly development = new Website(
    "localhost:3000",
    "croquetScores",
    false,
  );

  /** Every website there is. */
  static readonly all: readonly Website[] = [
    Website.croquetScores,
    Website.tryCroquetScores,
    Website.gateballScores,
    Website.tryGateballScores,
    Website.development,
  ];

  /**
   * The website whose host is `host`, however it is capitalised. Throws
   * {@link ValidationError} when there is no host, or no website with that
   * host.
   */
  static from(host: string): Website {
    // Lowered, because a browser takes a host the same way however it is
    // capitalised. Not trimmed or reduced from an address: a host is set by
    // whoever deploys the site, and one written any other way is a mistake to
    // be told about rather than guessed at.
    const lowered = host.toLowerCase();
    hosts.ensureValid(lowered);
    const website = Website.all.find((known) => known.host === lowered);
    if (website === undefined)
      throw new ValidationError<WebsiteErrorCode>("Website.Unknown");
    return website;
  }

  /** How it is known: its host, as a browser's address bar writes it. */
  get host(): string {
    return this.#host;
  }

  /** Which of the two sites it serves. */
  get site(): Site {
    return this.#site;
  }

  /** Whether it is where a reader learns the system rather than uses it. */
  get isTry(): boolean {
    return this.#isTry;
  }

  /** Two websites are the same when their hosts are. */
  equals(other: Website | undefined): boolean {
    return other instanceof Website && this.host === other.host;
  }

  toString(): string {
    return this.#host;
  }
}
