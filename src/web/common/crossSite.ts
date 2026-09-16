// A page on another site can make a reader's browser post a form here, and the
// browser sends along everything it holds for this site when it does. So a
// request that would change something is refused when it came from somewhere
// else.
//
// No token is needed to tell. Browsers say where a request came from in
// Sec-Fetch-Site, and one too old to say so there still says so in Origin. A
// request carrying neither did not come from a browser at all — a mobile app, a
// script, another server — and so nobody's browser is being made to act on
// somebody else's behalf, which is the only thing this is here to stop.
import type { FastifyInstance, FastifyRequest } from "fastify";

export interface Provenance {
  readonly method: string;
  readonly secFetchSite: string | undefined;
  readonly origin: string | undefined;
  readonly host: string | undefined;
}

// Methods that change something. Anything else only reads, and reading cannot
// be forged into doing anything.
const changing = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// "same-origin" is this site. "none" is the reader acting directly: the address
// bar, a bookmark. "same-site" is refused along with "cross-site": a subdomain is
// still somebody else's page until something here says otherwise.
const trusted = new Set(["same-origin", "none"]);

export const isRefused = (request: Provenance): boolean => {
  if (!changing.has(request.method.toUpperCase())) return false;

  if (request.secFetchSite !== undefined) {
    return !trusted.has(request.secFetchSite);
  }

  if (request.origin !== undefined) {
    // A browser sends "null" from a sandboxed frame, a data: URL and the like:
    // places that are, by design, not this site.
    if (request.origin === "null") return true;
    try {
      return new URL(request.origin).host !== request.host;
    } catch {
      return true;
    }
  }

  return false;
};

const header = (request: FastifyRequest, name: string): string | undefined => {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
};

const provenanceOf = (request: FastifyRequest): Provenance => ({
  method: request.method,
  secFetchSite: header(request, "sec-fetch-site"),
  origin: header(request, "origin"),
  host: header(request, "host"),
});

export const refuseCrossSite = (server: FastifyInstance): void => {
  server.addHook("onRequest", (request, _reply, done) => {
    if (!isRefused(provenanceOf(request))) {
      done();
      return;
    }
    // Through the error mapping like any other failure with a status, so a page
    // answers with a page and the API answers with JSON.
    done(
      Object.assign(new Error("That can only be done from this site."), {
        statusCode: 403,
        code: "Request.CrossSite",
      }),
    );
  });
};
