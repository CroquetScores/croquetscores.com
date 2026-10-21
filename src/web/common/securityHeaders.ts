// A browser does what it is allowed to do with a page unless the page says
// otherwise, so the site says otherwise, in one place and to every answer: an
// error and a file as much as a page, so that a route added later cannot be the
// one that forgot.
//
// The policy for what a page may load is as narrow as the pages allow. It keeps
// 'unsafe-inline' for scripts and styles because the pages are written with
// their own inline ones (the search box, the registration form, style
// attributes); refusing those means moving them out or giving each a nonce, and
// that is a change to every page rather than to this. What it does refuse is
// loading anything from anywhere but the few places the site uses: Google's
// reCAPTCHA, to tell people from programs, and PayPal and Google's sign-in,
// which a form is sent on to. Chrome holds a redirect after a form to
// form-action too, which is why the sign-in is named there.
//
// Strict-Transport-Security does not name the sites beneath this one. They are
// not all this site's to commit to a year of secure connections, and a browser
// holds the promise for the whole year.
import type { FastifyInstance } from "fastify";

const oneYear = 31_536_000;

const policy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self' https://www.google.com",
  "frame-src https://www.google.com",
  "form-action 'self' https://www.paypal.com https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export const registerSecurityHeaders = (server: FastifyInstance): void => {
  server.addHook("onSend", (_request, reply, payload, done) => {
    reply.header("strict-transport-security", `max-age=${oneYear}`);
    reply.header("x-content-type-options", "nosniff");
    // For browsers that read this and not frame-ancestors; both say the same.
    reply.header("x-frame-options", "DENY");
    reply.header("content-security-policy", policy);
    done(null, payload);
  });
};
