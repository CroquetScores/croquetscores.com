// Every word a page shows comes from a catalogue for the reader's language,
// looked up by what the word is for, so that a page can be put into another
// language by adding a catalogue and by nothing else.
//
// Which language is the browser's to say until the reader says otherwise. A
// browser lists the languages its reader reads, best first, and the reader gets
// the first the site has — a regional form such as en-AU counting as the
// language it is a form of — or the site's first language where it has none of
// them. A choice made in the footer is kept in a cookie and outranks the
// browser, as the theme's does.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

/** Words for one language, by what each is for. `{name}` is filled in when said. */
export type Words = Readonly<Record<string, string>>;

export interface Language {
  /** Its tag, as a page's lang attribute and a browser's Accept-Language say it. */
  readonly tag: string;
  /** Its name, written in itself, which is how a reader looks for it. */
  readonly name: string;
  /**
   * Which way it is written. Left out for the languages written left to right,
   * which are nearly all, so that only one that is not has to say so.
   */
  readonly direction?: "rtl";
  readonly words: Words;
}

/** The language a request is being answered in, and what it takes to say things in it. */
export interface Speaking {
  readonly language: Language;
  /** Every language the site offers, the first being the one it falls back to. */
  readonly offered: readonly Language[];
  /**
   * The words for `key`, with each `{name}` in them filled from `fill`. A key
   * with no words in the reader's language is said in the site's first one; a
   * key with none in that either is a mistake in the page asking, and throws.
   */
  readonly say: (
    key: string,
    fill?: Readonly<Record<string, string>>,
  ) => string;
  /** Whether there are words for `key`, for what a page may or may not have. */
  readonly knows: (key: string) => boolean;
}

/** The `dir` attribute for a page in `language`, with its leading space, or nothing. */
export const directionAttribute = (language: Language): string =>
  language.direction === undefined ? "" : ` dir="${language.direction}"`;

/**
 * The `dir` attribute for a language's name in a list, which always says which
 * way, since the page around the list may be read the other way and the name
 * would otherwise take that way from it.
 */
export const nameDirectionAttribute = (language: Language): string =>
  ` dir="${language.direction ?? "ltr"}"`;

export const languageCookie = "language";

const wordsFor = (
  key: string,
  language: Language,
  offered: readonly Language[],
): string | undefined => language.words[key] ?? offered[0]?.words[key];

export const speakingIn = (
  language: Language,
  offered: readonly Language[],
): Speaking => ({
  language,
  offered,
  say: (key, fill = {}) => {
    const words = wordsFor(key, language, offered);
    if (words === undefined) throw new Error(`No words for ${key}.`);
    return words.replace(
      /\{(\w+)\}/g,
      (whole, name: string) => fill[name] ?? whole,
    );
  },
  knows: (key) => wordsFor(key, language, offered) !== undefined,
});

// The languages a browser asks for, best first. A weight of nothing counts as
// the most wanted, and a weight of zero as not wanted at all; among equals, the
// order the browser gave them is kept.
const askedFor = (header: string | undefined): string[] =>
  (header ?? "")
    .split(",")
    .map((part, order) => {
      const [tag = "", ...parameters] = part
        .split(";")
        .map((piece) => piece.trim());
      const q = parameters.find((parameter) => parameter.startsWith("q="));
      const weight = q === undefined ? 1 : Number(q.slice(2));
      return {
        tag: tag.toLowerCase(),
        weight: Number.isNaN(weight) ? 0 : weight,
        order,
      };
    })
    .filter(({ tag, weight }) => tag !== "" && tag !== "*" && weight > 0)
    .sort((a, b) => b.weight - a.weight || a.order - b.order)
    .map(({ tag }) => tag);

const offeredAs = (
  tag: string | undefined,
  offered: readonly Language[],
): Language | undefined =>
  tag === undefined
    ? undefined
    : offered.find(
        (language) => language.tag.toLowerCase() === tag.toLowerCase(),
      );

const baseOf = (tag: string): string => tag.split("-")[0] ?? tag;

// A browser asking for Arabic, or for Arabic as Saudi Arabia writes it, gets
// the Arabic the site has even though that is one country's: the reader asked
// for the language, and a form of it is nearer than English. Tried last, so an
// exact or a base match anywhere in the list wins over it.
const offeredAsAFormOf = (
  base: string,
  offered: readonly Language[],
): Language | undefined =>
  offered.find((language) => baseOf(language.tag).toLowerCase() === base);

/** The language `request` is answered in. */
export const languageFor = (
  request: FastifyRequest,
  offered: readonly Language[],
): Language => {
  const chosen = offeredAs(request.cookies[languageCookie], offered);
  if (chosen !== undefined) return chosen;

  for (const tag of askedFor(request.headers["accept-language"])) {
    const found =
      offeredAs(tag, offered) ??
      offeredAs(baseOf(tag), offered) ??
      offeredAsAFormOf(baseOf(tag), offered);
    if (found !== undefined) return found;
  }

  const first = offered[0];
  if (first === undefined) throw new Error("The site offers no language.");
  return first;
};

declare module "fastify" {
  interface FastifyInstance {
    /** Every language the site offers, the first being the one it falls back to. */
    readonly languages: readonly Language[];
  }
  interface FastifyRequest {
    /** The language this request is answered in. Read it through speakingOf. */
    readonly speaking: Speaking | null;
  }
}

export const speakToRequests = (
  server: FastifyInstance,
  offered: readonly Language[],
): void => {
  server.decorate("languages", offered);
  server.decorateRequest("speaking", null);
  server.addHook("onRequest", (request, _reply, done) => {
    (request as { speaking: Speaking }).speaking = speakingIn(
      languageFor(request, offered),
      offered,
    );
    done();
  });
};

/**
 * What `request` is answered in. Decided as it arrives; a request that failed
 * before then — one Fastify could not read at all — is answered in the site's
 * first language, since it asked for nothing anyone could read.
 */
export const speakingOf = (request: FastifyRequest): Speaking => {
  if (request.speaking !== null) return request.speaking;
  const offered = request.server.languages;
  const first = offered[0];
  if (first === undefined) throw new Error("The site offers no language.");
  return speakingIn(first, offered);
};

const aYear = 60 * 60 * 24 * 365;

// Kept as the theme's is, and for the same reasons: see rememberTheme.
export const rememberLanguage = (
  reply: FastifyReply,
  language: Language,
): void => {
  reply.setCookie(languageCookie, language.tag, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: aYear,
  });
};

export const parseLanguage = (
  value: unknown,
  offered: readonly Language[],
): Language | undefined =>
  typeof value === "string" ? offeredAs(value, offered) : undefined;
