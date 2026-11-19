// How an app says which key it is: the key sent with each request, as a bearer
// token in the Authorization header, which is where a program is expected to
// put one and where nothing logs it as it logs an address. Never in the
// address, which proxies, browsers and logs all keep.
//
// What is answered to a key that is missing and to one that does not work
// differs, since an app can mend the first by sending one and can only be told
// of the second; and it says no more of why a key does not work, since which
// of the reasons it was is what must not be told (IdentifyApiKey.feature).
import type { FastifyReply, FastifyRequest } from "fastify";

/** The key a request carries, or nothing where it carries none. */
export const keyOf = (request: FastifyRequest): string | undefined => {
  const header = request.headers.authorization;
  if (typeof header !== "string") return undefined;
  const match = /^Bearer +(\S+)\s*$/i.exec(header);
  return match?.[1];
};

/**
 * Answers a request that carries no key that works, as the API's errors are
 * shaped: a stable code apps rely on, and a sentence for whoever reads a log.
 */
export const refuseKey = (
  reply: FastifyReply,
  carried: boolean,
): FastifyReply =>
  reply
    .code(401)
    .header("cache-control", "no-store")
    .header("www-authenticate", 'Bearer realm="Croquet Scores API"')
    .send(
      carried
        ? { code: "ApiKey.Invalid", message: "The API key does not work." }
        : {
            code: "ApiKey.Missing",
            message:
              "Send an API key as Authorization: Bearer followed by the key.",
          },
    );
