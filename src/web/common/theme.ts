// Which theme a reader has asked for, if they have asked. The public pages have
// no JavaScript, so the choice is made by posting a form and kept in a cookie
// that the server reads on the way back out.
import type { FastifyReply, FastifyRequest } from "fastify";

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

export const themeCookie = "theme";

const isTheme = (value: string | undefined): value is Theme =>
  value !== undefined && (themes as readonly string[]).includes(value);

/** "system" when nothing has been chosen, which is also what an unreadable
    cookie means: a preference nobody can make sense of is not a preference. */
export const themeOf = (request: FastifyRequest): Theme => {
  const value = request.cookies[themeCookie];
  return isTheme(value) ? value : "system";
};

export const parseTheme = (value: unknown): Theme | undefined =>
  typeof value === "string" && isTheme(value) ? value : undefined;

export const aYear = 60 * 60 * 24 * 365;

/**
 * How every cookie this site keeps for a reader is set: out of reach of a
 * script on the page, never sent in the clear, and for this site alone.
 */
export const keptByTheServer = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // Always, rather than worked out from the request. Behind whatever
  // terminates HTTPS in front of the application, the connection that reaches
  // it is plain HTTP, so request.protocol says "http" on every request and a
  // cookie set from it would never be Secure where it most needs to be.
  // Reading X-Forwarded-Proto instead means trusting a header any client can
  // send. Browsers treat localhost and 127.0.0.1 as secure contexts, so
  // development over plain HTTP loses nothing.
  secure: true,
} as const;

export const rememberTheme = (reply: FastifyReply, theme: Theme): void => {
  const options = keptByTheServer;

  // Choosing "system" is choosing not to have chosen, so the cookie goes rather
  // than recording the absence of a preference.
  if (theme === "system") {
    reply.clearCookie(themeCookie, options);
    return;
  }
  reply.setCookie(themeCookie, theme, { ...options, maxAge: aYear });
};

// Where to send the reader back to. Only somewhere on this site: anything else
// is somebody else's idea of where this form should lead.
//
// The value is not inspected for bad spellings. It is resolved the way a
// browser would resolve it, against an origin that belongs to nobody, and kept
// only if that origin survives. A check that recognises "//host" misses
// "/\host", which a browser also reads as another host; resolving catches both,
// and the spellings nobody has thought of yet. It also normalises "/../etc",
// and the URL parser strips the carriage returns and line feeds that would
// otherwise let a value smuggle a second header into the Location.
const nowhere = "http://return.invalid";

export const safeReturnPath = (value: unknown): string => {
  if (typeof value !== "string") return "/";

  let resolved: URL;
  try {
    resolved = new URL(value, nowhere);
  } catch {
    return "/";
  }

  if (resolved.origin !== nowhere) return "/";
  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
};
