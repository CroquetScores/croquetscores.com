// What judges whether whoever is registering is a person, for a site that has the
// test control: never Google, which a spec run has no business asking, but
// whatever the scenario says. Part of the test control (testControl.ts), and
// guarded as it is: mounted only for a site that has the token, answering only
// to it.
import type { FastifyInstance } from "fastify";

import type { Judgement, ReaderCheck } from "./public/register.js";
import { sameToken, testControlHeader } from "./testControl.js";

/** A key of the scenarios' own, so that the page asks for Google's script. */
export const standInSiteKey = "the scenarios' reCAPTCHA site key";

/** How a scenario can have reCAPTCHA judge. */
const judgements = ["a person", "not a person"] as const;
type Said = (typeof judgements)[number];

export class StandInReaderCheck implements ReaderCheck {
  readonly siteKey = standInSiteKey;
  #judgement: Said = "a person";
  #down = false;
  #tokens: string[] = [];

  judge(token: string | undefined): Promise<Judgement> {
    if (token !== undefined) this.#tokens.push(token);
    if (this.#down) {
      return Promise.reject(
        new Error("The scenario has taken reCAPTCHA down."),
      );
    }
    // A form carrying no token is unjudged here exactly as it would be there.
    if (token === undefined || token.trim() === "") {
      return Promise.resolve("no judgement");
    }
    return Promise.resolve(this.#judgement);
  }

  tell(judgement: Said): void {
    this.#judgement = judgement;
  }

  takeDown(down: boolean): void {
    this.#down = down;
  }

  tokens(): readonly string[] {
    return this.#tokens;
  }

  reset(): void {
    this.#judgement = "a person";
    this.#down = false;
    this.#tokens = [];
  }
}

/** Mounts what tells reCAPTCHA how to judge, answering only to `token`. */
export const registerTestControlReaderCheck = (
  server: FastifyInstance,
  token: string,
  standIn: StandInReaderCheck,
): void => {
  void server.register(
    (scope, _options, done) => {
      scope.addHook("onRequest", async (request, reply) => {
        if (!sameToken(request.headers[testControlHeader], token)) {
          return reply.callNotFound();
        }
        return undefined;
      });

      scope.post("/recaptcha", async (request, reply) => {
        const body = (request.body ?? {}) as {
          judgement?: unknown;
          down?: unknown;
        };
        if (body.judgement !== undefined) {
          const said = judgements.find((each) => each === body.judgement);
          if (said === undefined) {
            return reply.code(400).send({ code: "TestControl.NotAJudgement" });
          }
          standIn.tell(said);
        }
        if (typeof body.down === "boolean") standIn.takeDown(body.down);
        return reply.code(200).send();
      });

      scope.get("/recaptcha/tokens", () => ({ tokens: standIn.tokens() }));

      done();
    },
    { prefix: "/__test" },
  );
};
