// A stand-in for Have I Been Pwned's range search, listening on a port of its
// own, which answers as a scenario says and remembers everything it was sent.
// It is a real HTTP server rather than a stubbed fetch so that what the check
// puts on the wire — the path, the headers — is what the scenarios look at.
import { createHash } from "node:crypto";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

/** The SHA-1 of `text`, spelled as the service spells its hashes. */
export const sha1Of = (text: string): string =>
  createHash("sha1").update(text).digest("hex").toUpperCase();

// How much of a hash the service is asked for, which is the rest of the path.
const SENT = 5;

type Answer =
  | { kind: "list" }
  | { kind: "failure" }
  | { kind: "page" }
  | { kind: "nothing" }
  | { kind: "late"; byMilliseconds: number };

export class FakeHaveIBeenPwned {
  // Everything each request said, so that a scenario can look for a password
  // or a hash anywhere in it.
  readonly sent: string[] = [];
  // The five characters each request asked about, in order.
  readonly askedAbout: string[] = [];

  private readonly breached = new Set<string>();
  private answer: Answer = { kind: "list" };
  private readonly timers = new Set<NodeJS.Timeout>();
  private stopped = false;

  private constructor(private readonly server: Server) {}

  static async start(): Promise<FakeHaveIBeenPwned> {
    const server = createServer();
    const fake = new FakeHaveIBeenPwned(server);
    server.on("request", (request, response) => {
      void fake.serve(request, response);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    return fake;
  }

  /** Where the check is told to ask, with the five characters after it. */
  get rangeUrl(): string {
    const { port } = this.server.address() as AddressInfo;
    return `http://127.0.0.1:${port}/range/`;
  }

  /** Adds a whole SHA-1 to the breached hashes it answers with. */
  knows(hash: string): void {
    this.breached.add(hash.toUpperCase());
  }

  answersWithAFailure(): void {
    this.answer = { kind: "failure" };
  }

  answersWithAPage(): void {
    this.answer = { kind: "page" };
  }

  answersWithNothing(): void {
    this.answer = { kind: "nothing" };
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
    this.sent.push(
      [`${request.method} ${request.url}`, ...request.rawHeaders, body].join(
        "\n",
      ),
    );
    const prefix = (request.url ?? "").split("/").at(-1) ?? "";
    this.askedAbout.push(prefix);

    if (this.answer.kind === "late") {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        this.list(prefix, response);
      }, this.answer.byMilliseconds);
      // A timer left running would hold the process open after the scenario
      // has finished with it.
      timer.unref();
      this.timers.add(timer);
      return;
    }
    // With nothing in the body, as a service falling over often answers: a
    // check that read the body as an empty list would call the password clean.
    if (this.answer.kind === "failure") {
      response.writeHead(500);
      response.end();
      return;
    }
    if (this.answer.kind === "page") {
      response.writeHead(200, { "content-type": "text/html" });
      response.end("<!doctype html><html><body>Rate limited</body></html>");
      return;
    }
    if (this.answer.kind === "nothing") {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end();
      return;
    }
    this.list(prefix, response);
  }

  // The service's own shape: the rest of each hash, a colon, how often it was
  // seen, on lines ended the Windows way. The real service has several hundred
  // hashes for any five characters, so a prefix the scenario has said nothing
  // about still gets one, made up from the prefix so that it is not the hash
  // of anything a scenario checks.
  private list(prefix: string, response: ServerResponse): void {
    const known = [...this.breached].filter((hash) => hash.startsWith(prefix));
    const answered =
      known.length > 0
        ? known
        : [prefix + sha1Of(`nobody's ${prefix}`).slice(SENT)];
    const lines = answered.map((hash) => `${hash.slice(SENT)}:3`);
    response.writeHead(200, { "content-type": "text/plain" });
    response.end(lines.map((line) => `${line}\r\n`).join(""));
  }
}
