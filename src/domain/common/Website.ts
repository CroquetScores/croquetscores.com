import { ValidationError } from "./validation/ValidationError.js";
import { Validator } from "./validation/Validator.js";

/** Every rule a website can break. */
export type WebsiteErrorCode = "Website.Missing" | "Website.Unknown";

/**
 * Which of the two sites built from this code a website serves. Not the site's
 * name, which is a word of the web layer's and not the domain's.
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

  /**
   * The website a request addressed to `host` is for: the website with that
   * host, or development where `host` is `localhost` or `127.0.0.1` on any
   * port. Throws {@link ValidationError} when there is no host, or it is no
   * website's and no local address.
   *
   * Development is reached on whatever port is free by the development server,
   * the admin's Vite server and the browser scenarios, so it is known by its
   * name and not by its port. Nothing else is taken for it.
   */
  static addressedTo(host: string): Website {
    // The dot that ends a fully qualified name names the same host.
    const lowered = Website.spelled(host);
    hosts.ensureValid(lowered);
    const name = lowered.replace(/:\d+$/, "");
    if (name === "localhost" || name === "127.0.0.1" || name === "[::1]")
      return Website.development;
    // The beta site is croquetscores.com under another name, and the only one.
    if (lowered === "beta.croquetscores.com") return Website.croquetScores;
    return Website.from(lowered);
  }

  /**
   * `host` as one spelling of it: lower case, without the dot that ends a
   * fully qualified name and without the port a browser leaves off, so that
   * every way of writing a host is the one way it is compared.
   */
  static spelled(host: string): string {
    return host
      .toLowerCase()
      .replace(/\.(?=:\d+$|$)/, "")
      .replace(/:443$/, "");
  }

  /** How it is known: its host, as a browser's address bar writes it. */
  get host(): string {
    return this.#host;
  }

  /**
   * Where it answers, as a link to one of its pages begins: `https://` and its
   * host, or `http://` for development, which is never served over TLS.
   * Worked out here and never from a request, whose host is whatever its
   * sender wrote: a link made from one could be pointed at anybody's site.
   */
  get address(): string {
    return `${this.equals(Website.development) ? "http" : "https"}://${this.#host}`;
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
