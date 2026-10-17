// A page on another site can make a reader's browser post a form here, and the
// browser sends along everything it holds for this site when it does. So a
// request that would change something is refused when it came from somewhere
// else.
//
// No token is needed to tell. Browsers say where a request came from in
// Sec-Fetch-Site, and one too old to say so there still says so in Origin. A
// request carrying neither is let through: a mobile app, a script or another
// server has no cookies of a reader's to be spent, and that is the whole of
// what this is here to stop.
//
// That last step is a judgement rather than a proof. A browser old enough to
// send neither header exists — Firefox before 70 sent no Origin on a form post,
// and Sec-Fetch-Site only arrived in Firefox 90 — and a proxy or an extension
// can strip Origin from a current one. A forgery from one of those is not
// caught. Held against a token on every form, on a site whose readers are on
// browsers of this decade, that is a risk worth carrying; it is written down
// here so it is carried knowingly.
import { Website } from "../../domain/common/Website.js";
import type { FastifyInstance, FastifyRequest } from "fastify";

export interface Provenance {
  readonly method: string;
  readonly secFetchSite: string | undefined;
  readonly origin: string | undefined;
  // What the request was addressed to: the website it is for, which an origin
  // has to be one of this site's to be let through.
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

    // The site answers for several websites, so there is no one host to judge
    // an origin against but the one this request was addressed to. Nothing to
    // compare against, and an origin saying the request came from somewhere,
    // is refused: the answer that cannot be wrong in the dangerous direction.
    const expected = request.host;
    if (expected === undefined || expected === "") return true;

    try {
      return (
        Website.spelled(new URL(request.origin).host) !==
        Website.spelled(expected)
      );
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

// Fastify's own host reads :authority as well as Host, so an HTTP/2 client that
// sends no Host header is still placed.
const provenanceOf = (request: FastifyRequest): Provenance => ({
  method: request.method,
  secFetchSite: header(request, "sec-fetch-site"),
  origin: header(request, "origin"),
  host: request.host === "" ? header(request, "host") : request.host,
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
