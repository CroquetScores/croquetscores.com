// /api/v1 — JSON, and the same endpoints whether a mobile app or the admin SPA
// is asking. Operations arrive here as features are accepted; what is here now
// is the mount itself and the one endpoint that needs no domain behind it.
import type { FastifyPluginCallback } from "fastify";

export const apiV1: FastifyPluginCallback = (server, _options, done) => {
  server.get("/health", () => ({ status: "ok" }));
  done();
};
