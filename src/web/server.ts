// The composition root. This is the only file outside src/infrastructure/ that
// names a concrete implementation: everything chosen here is chosen once.
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import { createReadStream, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Pool } from "pg";

import {
  loadConfig,
  loadEnvFile,
  type Config,
} from "../infrastructure/config/Config.js";
import { createPool } from "../infrastructure/database/pool.js";
import { apiV1 } from "./api/v1/index.js";
import { readAssets, type Assets } from "./common/assets.js";
import { auth } from "./auth/index.js";
import { registerErrorMapping } from "./common/errors.js";
import { registerPublicPages } from "./public/pages.js";
import { registerThemeRoute } from "./public/theme.js";

const repositoryRoot = join(import.meta.dirname, "..", "..");

export interface Application {
  readonly server: FastifyInstance;
  readonly pool: Pool;
  readonly config: Config;
}

const year = 60 * 60 * 24 * 365;

const registerAssets = (server: FastifyInstance, assets: Assets): void => {
  server.get<{ Params: { "*": string } }>("/assets/*", (request, reply) => {
    const asset = assets.resolve(request.params["*"]);
    if (asset === undefined) return reply.callNotFound();

    // A name carrying the current hash cannot come to mean a different file, so
    // it may be kept for as long as anyone likes. A name without one — an old
    // hash from a deploy ago, or none at all — still serves the file, so a page
    // held in a browser's cache is not left unstyled, but it is not promised to
    // stay put.
    return reply
      .header(
        "cache-control",
        asset.current
          ? `public, max-age=${year}, immutable`
          : "public, max-age=60",
      )
      .type(asset.contentType)
      .send(createReadStream(asset.path));
  });
};

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

export interface ApplicationOptions {
  /** Off for the specs, whose output is the scenario list and not a request log. */
  readonly logger?: boolean;
}

export const buildApplication = async (
  config: Config,
  options: ApplicationOptions = {},
): Promise<Application> => {
  const server = Fastify({ logger: options.logger ?? true });
  const pool = createPool(config.databaseUrl);
  const assets = readAssets(join(repositoryRoot, "assets"));

  await server.register(cookie, { secret: config.sessionCookieSecret });
  await server.register(formbody);

  registerErrorMapping(server, assets);

  await server.register(apiV1, { prefix: "/api/v1" });
  await server.register(
    auth({
      googleConfigured: config.google !== undefined,
      facebookConfigured: config.facebook !== undefined,
    }),
    { prefix: "/auth" },
  );

  registerAssets(server, assets);

  await registerAdmin(server, join(repositoryRoot, "dist", "admin"));

  registerThemeRoute(server);
  registerPublicPages(server, assets);

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
