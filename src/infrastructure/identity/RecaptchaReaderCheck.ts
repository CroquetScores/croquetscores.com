// Judging whether whoever is registering is a person, with reCAPTCHA v3.
// Google's script runs in the reader's browser and hands the form a token;
// this sends that token to Google with the site's secret key, and Google
// answers with a score between 0 and 1 — how likely it thinks it is that a
// person rather than a program filled the form in.
//
// Nothing stands between the application and this, and nothing is meant to:
// reCAPTCHA is the only way a reader is judged here, so the failure a caller
// handles is named for reCAPTCHA rather than for an interface that would have
// only ever had one thing behind it (RecaptchaReaderCheck.feature says why).

/** Where Google answers a token. */
export const recaptchaSiteVerify =
  "https://www.google.com/recaptcha/api/siteverify";

// A few seconds: long enough for Google on a slow day, and short enough that a
// reader registering is not left waiting on it rather than told to try again.
export const defaultWaitMilliseconds = 3000;

/** The score at and above which a reader is taken to be a person. */
export const personScore = 0.5;

/**
 * What the token is minted for, and what Google's answer has to say it was
 * for. An answer for something else is an answer about another form, replayed
 * here.
 */
export const registering = "register";

/**
 * What the check makes of a reader. The words are the feature's own, so that a
 * scenario asserts what the check answers rather than a translation of it.
 *
 * "No judgement" is not "not a person": it is a form that carried no token at
 * all, from a browser that did not run the script. What to do about that is
 * the caller's to say.
 */
export type Judgement = "a person" | "not a person" | "no judgement";

/** Every way judging a reader can be refused. */
export type RecaptchaReaderCheckErrorCode = "RecaptchaReaderCheck.Unreachable";

/**
 * A judgement that could not be made. Named by a code, because the code is the
 * contract: what an unjudged reader means — letting them through, or
 * suspending registering until Google is back — is the caller's to say, and
 * the caller tells this apart from a judgement by the code, not by the words.
 */
export class JudgingRefused extends Error {
  readonly code: RecaptchaReaderCheckErrorCode;

  constructor(
    code: RecaptchaReaderCheckErrorCode,
    message: string,
    cause?: unknown,
  ) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "JudgingRefused";
    this.code = code;
  }
}

// The parts of Google's answer this reads, each still unknown: it is JSON from
// outside, so nothing about it is known until it has been looked at.
interface Answer {
  readonly success?: unknown;
  readonly score?: unknown;
  readonly action?: unknown;
}

const unreachable = (what: string, cause?: unknown): JudgingRefused =>
  new JudgingRefused(
    "RecaptchaReaderCheck.Unreachable",
    `Google ${what}, so the reader could not be judged.`,
    cause,
  );

// An answer of Google's says whether it succeeded. Anything without that is
// not one — a page from a proxy, or something that is not JSON at all.
const isAnAnswer = (read: unknown): read is Answer =>
  typeof read === "object" && read !== null && "success" in read;

export class RecaptchaReaderCheck {
  constructor(
    private readonly secretKey: string,
    private readonly verifyUrl: string = recaptchaSiteVerify,
    private readonly waitMilliseconds: number = defaultWaitMilliseconds,
  ) {}

  /**
   * What to make of whoever sent a form carrying `token`. Throws
   * {@link JudgingRefused} when Google could not be reached, so that a reader
   * nobody judged is neither let through nor turned away here.
   */
  async judge(token: string | undefined): Promise<Judgement> {
    if (token === undefined || token.trim() === "") return "no judgement";

    const answer = await this.ask(token);

    // A token Google disowns — one it never minted, one gone stale, one it has
    // already been shown — is not a person rather than no judgement: the
    // script did run, and produced something Google will not stand behind.
    if (answer.success !== true) return "not a person";
    // An answer for another form says nothing about this one, however good its
    // score, so it is worth no more than no answer at all.
    if (answer.action !== registering) return "not a person";

    return typeof answer.score === "number" && answer.score >= personScore
      ? "a person"
      : "not a person";
  }

  private async ask(token: string): Promise<Answer> {
    let body: string;
    try {
      const response = await fetch(this.verifyUrl, {
        method: "POST",
        body: new URLSearchParams({
          secret: this.secretKey,
          response: token,
        }),
        signal: AbortSignal.timeout(this.waitMilliseconds),
      });
      if (!response.ok) throw unreachable(`answered ${response.status}`);
      body = await response.text();
    } catch (cause) {
      if (cause instanceof JudgingRefused) throw cause;
      throw unreachable(
        "could not be reached, or did not answer in time",
        cause,
      );
    }

    let read: unknown;
    try {
      read = JSON.parse(body) as unknown;
    } catch (cause) {
      throw unreachable("answered with something other than an answer", cause);
    }
    if (!isAnAnswer(read)) {
      throw unreachable("answered with something other than an answer");
    }
    return read;
  }
}
