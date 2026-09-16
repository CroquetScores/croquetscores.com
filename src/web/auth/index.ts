// Sign-in, sign-out, the OAuth redirect and callback, and the mobile token and
// refresh endpoints. The routes arrive with the features that specify them
// (SETUP.md §7.6, §7.7); this is the mount they attach to.
import type { FastifyPluginCallback } from "fastify";

export interface AuthOptions {
  readonly googleConfigured: boolean;
  readonly facebookConfigured: boolean;
}

export const auth =
  (options: AuthOptions): FastifyPluginCallback =>
  (server, _options, done) => {
    // Logged at startup so a misconfigured deployment is visible there rather
    // than in somebody's failed sign-in.
    server.log.info(
      {
        google: options.googleConfigured,
        facebook: options.facebookConfigured,
      },
      "External identity providers",
    );
    done();
  };
