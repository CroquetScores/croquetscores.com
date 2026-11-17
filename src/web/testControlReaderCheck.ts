// What judges whether whoever is registering is a person, for a site that has the
// test control: never Google, which a spec run has no business asking, but
// whatever the scenario says. Part of the test control (testControl.ts), and
// guarded as it is: mounted only for a site that has the token, answering only
// to it.
import type { FastifyInstance } from "fastify";

import type { BreachedPasswords } from "../application/services/BreachedPasswords.js";
import { CheckRefused } from "../application/services/BreachedPasswords.js";
import type { Judgement, ReaderCheck } from "./public/register.js";
import { sameToken, testControlHeader } from "./testControl.js";

/** A key of the scenarios' own, so that the page asks for Google's script. */
export const standInSiteKey = "the scenarios' reCAPTCHA site key";

/** How a scenario can have reCAPTCHA judge. */
const judgements = ["a person", "not a person"] as const;
type Said = (typeof judgements)[number];

/** The services a scenario can take down, which a site under test would otherwise ask. */
export const services = ["reCAPTCHA", "Have I Been Pwned"] as const;
type Service = (typeof services)[number];

export class StandInReaderCheck implements ReaderCheck, BreachedPasswords {
  readonly siteKey = standInSiteKey;
  #judgement: Said = "a person";
  #down = false;
  #breachedDown = false;
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

  takeDown(service: Service, down: boolean): void {
    if (service === "reCAPTCHA") this.#down = down;
    else this.#breachedDown = down;
  }

  /** Never Have I Been Pwned, which a spec run has no business asking. */
  isBreached(): Promise<boolean> {
    return this.#breachedDown
      ? Promise.reject(
          new CheckRefused(
            "BreachedPasswords.Unreachable",
            "The scenario has taken Have I Been Pwned down.",
          ),
        )
      : Promise.resolve(false);
  }

  tokens(): readonly string[] {
    return this.#tokens;
  }

  reset(): void {
    this.#judgement = "a person";
    this.#down = false;
    this.#breachedDown = false;
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
        const body = (request.body ?? {}) as { judgement?: unknown };
        if (body.judgement !== undefined) {
          const said = judgements.find((each) => each === body.judgement);
          if (said === undefined) {
            return reply.code(400).send({ code: "TestControl.NotAJudgement" });
          }
          standIn.tell(said);
        }
        return reply.code(200).send();
      });

      // A service taken down, or brought back, as a scenario about the site
      // being unable to reach it says.
      scope.post("/services", async (request, reply) => {
        const body = (request.body ?? {}) as {
          service?: unknown;
          down?: unknown;
        };
        const service = services.find((each) => each === body.service);
        if (service === undefined || typeof body.down !== "boolean") {
          return reply.code(400).send({ code: "TestControl.NotAService" });
        }
        standIn.takeDown(service, body.down);
        return reply.code(200).send();
      });

      scope.get("/recaptcha/tokens", () => ({ tokens: standIn.tokens() }));

      done();
    },
    { prefix: "/__test" },
  );
};
