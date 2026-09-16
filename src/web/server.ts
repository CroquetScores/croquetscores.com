// The composition root. This is the only file outside src/infrastructure/ that
// names a concrete implementation: everything chosen here is chosen once.
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Pool } from "pg";

import {
  loadConfig,
  loadEnvFile,
  type Config,
} from "../infrastructure/config/Config.js";
import { createPool } from "../infrastructure/database/pool.js";
import { apiV1 } from "./api/v1/index.js";
import { auth } from "./auth/index.js";
import { registerErrorMapping } from "./common/errors.js";
import { registerPublicPages } from "./public/pages.js";

const repositoryRoot = join(import.meta.dirname, "..", "..");

export interface Application {
  readonly server: FastifyInstance;
  readonly pool: Pool;
  readonly config: Config;
}

const registerAdmin = async (
  server: FastifyInstance,
  adminRoot: string,
): Promise<void> => {
  if (!existsSync(adminRoot)) {
    // A fresh clone has not built the SPA yet. Say so, rather than 404ing as
    // though /admin were not a thing this application has.
    const notBuilt = (): never => {
      throw Object.assign(new Error("The admin SPA has not been built."), {
        statusCode: 503,
      });
    };
    server.get("/admin", notBuilt);
    server.get("/admin/*", notBuilt);
    return;
  }

  // wildcard: false leaves the star route below free to claim every path that
  // is not a file, which is what makes a deep link reload rather than 404.
  await server.register(fastifyStatic, {
    root: adminRoot,
    prefix: "/admin/",
    wildcard: false,
  });
  server.get("/admin", (_request, reply) => reply.redirect("/admin/", 308));
  server.get("/admin/*", (_request, reply) =>
    reply.type("text/html; charset=utf-8").sendFile("index.html"),
  );
};

export const buildApplication = async (
  config: Config,
): Promise<Application> => {
  const server = Fastify({ logger: true });
  const pool = createPool(config.databaseUrl);

  await server.register(cookie, { secret: config.sessionCookieSecret });
  await server.register(formbody);

  registerErrorMapping(server);

  await server.register(apiV1, { prefix: "/api/v1" });
  await server.register(
    auth({
      googleConfigured: config.google !== undefined,
      facebookConfigured: config.facebook !== undefined,
    }),
    { prefix: "/auth" },
  );

  // Hashed filenames, so these may be cached for as long as anyone likes.
  // decorateReply: false because only one static mount may decorate, and the
  // admin one needs sendFile.
  await server.register(fastifyStatic, {
    root: join(repositoryRoot, "assets"),
    prefix: "/assets/",
    maxAge: "365d",
    immutable: true,
    decorateReply: false,
  });

  await registerAdmin(server, join(repositoryRoot, "dist", "admin"));

  registerPublicPages(server);

  return { server, pool, config };
};

const startedDirectly =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === import.meta.filename;

if (startedDirectly) {
  loadEnvFile();
  const config = loadConfig();
  const application = await buildApplication(config);
  await application.server.listen({ port: config.port, host: "0.0.0.0" });
}
