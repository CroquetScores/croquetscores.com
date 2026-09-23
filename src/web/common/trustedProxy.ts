// Where the IP address a request came from is read from, which the site's
// limits count by: how often one address may ask for a way back in, and how
// often signing in may fail from one.
//
// With nothing in front of the site, it is the address the connection came in
// on. Behind a load balancer or a reverse proxy every connection comes in from
// the proxy, and the reader's own address is in a header the proxy wrote — a
// header anything that can reach the site can write for itself. So the site is
// told which proxies forward to it, and a forwarded address is believed from
// those and from nowhere else.
//
// Told nothing, it believes nobody, which is the answer that is merely useless
// rather than dangerous: a deployment that forgets the setting counts every
// reader as its proxy and holds them all to one reader's share of the limits,
// which is noticed. The other way round, every request could name an address
// nobody had asked from before, and there would be no limit at all, which is
// noticed by nobody.
import { isIP } from "node:net";

import type { FastifyRequest } from "fastify";

/**
 * The proxies the site was told forward requests to it, each an address or a
 * range. Empty where it was told none. What may be written here, and what
 * happens to a setting that is neither, is the config loader's.
 */
export type TrustedProxies = readonly string[];

/**
 * What Fastify is told about where a request came from: the proxies to
 * believe, or false where there are none.
 *
 * False rather than an empty list, though the two trust the same nobody: an
 * empty list is still a list, and Fastify reads every request's address
 * through the forwarding headers when it is given one at all.
 */
export const sendersBelieved = (trusted: TrustedProxies): boolean | string[] =>
  trusted.length === 0 ? false : [...trusted];

/**
 * The IP address `request` is counted as coming from. Asked here rather than
 * read off the request wherever a limit needs it, so that what it means — and
 * what it is worth, which is whatever the setting above is right about — is
 * written down once.
 *
 * Not request.ip, which is the end of the same walk and hands back whatever
 * the last hop wrote, address or not. A misconfigured proxy writing a word
 * into its header would have the limits counting by that word: the same one on
 * every request holds every reader to one reader's share.
 */
export const ipAddressOf = (request: FastifyRequest): string => {
  // Only where the site was told to believe somebody. The connection's address
  // first, then each forwarded one in turn, as far back as trust went.
  const chain = request.ips;
  if (chain === undefined) return request.ip;

  // As far back as the chain can be read. Anything that does not parse was
  // never in a range the site trusts, so the walk stopped there and it can only
  // be the last of them; stopping here too leaves the last address before it,
  // which is at worst the connection's own.
  let counted: string | undefined;
  for (const ipAddress of chain) {
    if (isIP(ipAddress) === 0) break;
    counted = ipAddress;
  }
  return counted ?? request.ip;
};
