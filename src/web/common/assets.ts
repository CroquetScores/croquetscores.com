// Static assets are served under a name carrying a hash of their contents, so
// that "cache this for a year and never ask again" is true rather than a hope.
// The hashes are taken once, at startup: a file that changes changes its name,
// and a name that has not changed cannot have changed its file.
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";
import { createHash } from "node:crypto";
import { createReadStream, readdirSync, readFileSync } from "node:fs";
import { extname, join, posix } from "node:path";

import { ipAddressOf } from "./trustedProxy.js";

/**
 * Where the site's own files are served from. Named here, where the addresses
 * are made, rather than spelled again wherever something has to know whether a
 * request is for one: what is served from under it is served to everybody
 * alike and kept for a year, and that is a thing more than the route cares
 * about.
 */
export const assetsPath = "/assets/";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff2", "font/woff2"],
  [".txt", "text/plain; charset=utf-8"],
]);

export interface Asset {
  /** Where the file is on disk. */
  readonly path: string;
  readonly contentType: string;
  /** The name it is published under, carrying the hash. */
  readonly publicName: string;
}

export interface ResolvedAsset extends Asset {
  /** False when the caller asked by a name whose hash is not the current one. */
  readonly current: boolean;
}

export interface Assets {
  /**
   * Which version of the website the build these files came from is, or
   * nothing where it is not known (buildVersion.feature). Carried here because
   * the files are the build's and every page is already given them to draw
   * itself with; a version of its own, handed to each page, would be one more
   * thing for each of dozens of pages to remember to pass on.
   */
  readonly version: number | undefined;
  /**
   * The email address of whoever administers the site, which the footer of
   * every page offers a bug to be reported to. Carried here for the reason the
   * version is: every page is already given the assets to draw itself with.
   */
  readonly administratorEmailAddress: string;
  /** "site.css" becomes "/assets/site.1a2b3c4d.css". */
  url(name: string): string;
  resolve(requestedName: string): ResolvedAsset | undefined;
}

const hashed = (name: string, hash: string): string => {
  const extension = extname(name);
  return `${name.slice(0, name.length - extension.length)}.${hash}${extension}`;
};

// A name may arrive carrying any hash, including one from a deploy ago. The
// file it means is the same either way.
const withoutHash = (name: string): string => {
  const extension = extname(name);
  const stem = name.slice(0, name.length - extension.length);
  const match = /^(.*)\.[0-9a-f]{8}$/.exec(stem);
  return match === null ? name : `${match[1]}${extension}`;
};

const filesUnder = (root: string, prefix = ""): string[] =>
  readdirSync(join(root, prefix), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesUnder(root, posix.join(prefix, entry.name))
      : [posix.join(prefix, entry.name)],
  );

export const readAssets = (
  root: string,
  administratorEmailAddress: string,
  version?: number,
): Assets => {
  const byName = new Map<string, Asset>();

  for (const name of filesUnder(root)) {
    const path = join(root, name);
    const hash = createHash("sha256")
      .update(readFileSync(path))
      .digest("hex")
      .slice(0, 8);
    byName.set(name, {
      path,
      contentType:
        contentTypes.get(extname(name)) ?? "application/octet-stream",
      publicName: hashed(name, hash),
    });
  }

  return {
    version,
    administratorEmailAddress,
    url(name) {
      const asset = byName.get(name);
      if (asset === undefined)
        throw new Error(`There is no asset named ${name}.`);
      return `${assetsPath}${asset.publicName}`;
    },
    resolve(requestedName) {
      const asset = byName.get(withoutHash(requestedName));
      if (asset === undefined) return undefined;
      return { ...asset, current: requestedName === asset.publicName };
    },
  };
};

const year = 60 * 60 * 24 * 365;

/**
 * How many files one address may ask for in a minute. A cold page is drawn
 * with a dozen at most, and a browser keeps them for a year, so this is
 * several hundred pages' worth: a club's members share one address and a
 * meeting's worth of them open the site together. It is there to stop a
 * program asking for files in thousands, and is meant to be out of sight of
 * everyone else; one that is reached by readers is too low.
 */
export const assetRequestsAMinute = 3000;

/**
 * How many addresses are counted at once. The plugin's own number, five
 * thousand, is few enough that a run of requests from many addresses, which a
 * range of IPv6 addresses makes cheap, pushes an address out and so resets its
 * count. An address costs a few dozen bytes.
 */
const addressesCounted = 100_000;

/**
 * Serves the files under `assetsPath`, and counts each address's requests for
 * them. The count is on these routes alone, in a scope of their own, so that
 * a page is never turned away because of the files a reader has been asking
 * for, and one asked for too often is told to wait rather than read from disk
 * again.
 *
 * A name with no file is counted as a file is, since asking for names at random
 * is how a program would find which there are. The count is by the address the
 * site is told to read a request's from, so that behind a load balancer it is
 * the reader's and not the balancer's.
 *
 * The count is kept in this process. A second one would count for itself, and
 * a reader could have as many as there are, which is the cost of not keeping it
 * in the database, where every file read would be a write.
 */
export const registerAssets = async (
  server: FastifyInstance,
  assets: Assets,
  requestsAMinute = assetRequestsAMinute,
): Promise<void> => {
  await server.register(async (scope) => {
    await scope.register(rateLimit, {
      max: requestsAMinute,
      timeWindow: "1 minute",
      keyGenerator: ipAddressOf,
      cache: addressesCounted,
    });

    // The answer that says to wait is for the one who asked, now. The files
    // are served to be kept for a year, so a cache that took this for the
    // answer at that address would hand it to everyone after.
    scope.addHook("onSend", (_request, reply, payload, done) => {
      if (reply.statusCode === 429) reply.header("cache-control", "no-store");
      done(null, payload);
    });

    scope.get<{ Params: { "*": string } }>(
      `${assetsPath}*`,
      (request, reply) => {
        const asset = assets.resolve(request.params["*"]);
        if (asset === undefined) return reply.callNotFound();

        // A name carrying the current hash cannot come to mean a different file,
        // so it may be kept for as long as anyone likes. A name without one — an
        // old hash from a deploy ago, or none at all — still serves the file, so
        // a page held in a browser's cache is not left unstyled, but it is not
        // promised to stay put.
        return reply
          .header(
            "cache-control",
            asset.current
              ? `public, max-age=${year}, immutable`
              : "public, max-age=60",
          )
          .type(asset.contentType)
          .send(createReadStream(asset.path));
      },
    );
  });
};
