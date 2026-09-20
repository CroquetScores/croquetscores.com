// A stand-in for Google's reCAPTCHA siteverify, listening on a port of its
// own, which answers as a scenario says and remembers what it was asked. It is
// a real HTTP server rather than a stubbed fetch so that what the check puts on
// the wire — the method, the body, the secret key in it — is what the scenarios
// look at.
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

/** What one request asked, read out of the form it was sent as. */
export interface Asked {
  readonly secret: string;
  readonly token: string;
}

type Answer =
  | { kind: "judgement" }
  | { kind: "failure" }
  | { kind: "page" }
  | { kind: "not an answer" }
  | { kind: "late"; byMilliseconds: number };

export class FakeRecaptcha {
  // What each request asked, in order.
  readonly asked: Asked[] = [];

  private readonly scored = new Map<string, number>();
  private readonly disowned = new Set<string>();
  // What its answers say they were for. Registering, until a scenario says the
  // answer came back for something else.
  private for_ = "register";
  private answer: Answer = { kind: "judgement" };
  private readonly timers = new Set<NodeJS.Timeout>();
  private stopped = false;

  private constructor(private readonly server: Server) {}

  static async start(): Promise<FakeRecaptcha> {
    const server = createServer();
    const fake = new FakeRecaptcha(server);
    server.on("request", (request, response) => {
      void fake.serve(request, response);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    return fake;
  }

  /** Where the check is told to send a token. */
  get verifyUrl(): string {
    const { port } = this.server.address() as AddressInfo;
    return `http://127.0.0.1:${port}/recaptcha/api/siteverify`;
  }

  /** Answers for `token` with `score`, as a token Google minted. */
  scores(token: string, score: number): void {
    this.scored.set(token, score);
  }

  /** Answers that `token` is one it will not stand behind. */
  willNotAccept(token: string): void {
    this.disowned.add(token);
  }

  /** Answers that what it judged was `action` rather than registering. */
  saysTheAnswerWasFor(action: string): void {
    this.for_ = action;
  }

  answersWithAFailure(): void {
    this.answer = { kind: "failure" };
  }

  answersWithAPage(): void {
    this.answer = { kind: "page" };
  }

  /** Answers with JSON that is not one of Google's answers, as a proxy does. */
  answersWithSomethingElse(): void {
    this.answer = { kind: "not an answer" };
  }

  answersLateBy(milliseconds: number): void {
    this.answer = { kind: "late", byMilliseconds: milliseconds };
  }

  /** Stops answering, and drops every connection, so nothing reaches it. */
  async stop(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    for (const timer of this.timers) clearTimeout(timer);
    this.server.closeAllConnections();
    await new Promise<void>((resolve) => {
      this.server.close(() => resolve());
    });
  }

  private async serve(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    let body = "";
    for await (const chunk of request) body += String(chunk);

    // Sent as a form, which is how Google is asked.
    const form = new URLSearchParams(body);
    const token = form.get("response") ?? "";
    this.asked.push({ secret: form.get("secret") ?? "", token });

    if (this.answer.kind === "late") {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        this.judgement(token, response);
      }, this.answer.byMilliseconds);
      // A timer left running would hold the process open after the scenario
      // has finished with it.
      timer.unref();
      this.timers.add(timer);
      return;
    }
    if (this.answer.kind === "failure") {
      // With a body that would read as a judgement if anything read it, which
      // Google does not send: it is how the scenario says the status is what
      // the check goes by, rather than the check being right because a failure
      // happened to carry nothing to misread.
      response.writeHead(502, { "content-type": "application/json" });
      response.end(
        JSON.stringify({ success: true, score: 1, action: this.for_ }),
      );
      return;
    }
    if (this.answer.kind === "page") {
      response.writeHead(200, { "content-type": "text/html" });
      response.end("<!doctype html><html><body>Rate limited</body></html>");
      return;
    }
    // JSON, and nothing of Google's in it: what something in the way answers
    // with, and the one kind of bad answer that reads as an answer far enough
    // to be believed.
    if (this.answer.kind === "not an answer") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "rate limited" }));
      return;
    }
    this.judgement(token, response);
  }

  // Google's own shape. A token nobody scored is one it never minted, which is
  // what an answer with success false says; error-codes is sent with it
  // because Google sends it, and is not something the check reads.
  //
  // A token a scenario has both scored and disowned gets the score back beside
  // the refusal, which Google never does. That is the point of it: it is how a
  // scenario says the refusal is what the check reads, rather than the check
  // being right for want of a score to read.
  private judgement(token: string, response: ServerResponse): void {
    const score = this.scored.get(token);
    const refused = this.disowned.has(token) || score === undefined;
    const scored = score === undefined ? {} : { score, action: this.for_ };
    const answer = refused
      ? { success: false, ...scored, "error-codes": ["timeout-or-duplicate"] }
      : {
          ...scored,
          success: true,
          challenge_ts: new Date().toISOString(),
          hostname: "croquetscores.com",
        };
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(answer));
  }
}
