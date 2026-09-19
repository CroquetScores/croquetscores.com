// The composition root. This is the only file outside src/infrastructure/ that
// names a concrete implementation: everything chosen here is chosen once.
import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import formbody from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import { createReadStream, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { Pool } from "pg";

import { Mediator } from "../application/common/Mediator.js";
import { ProjectingEventStore } from "../application/common/ProjectingEventStore.js";
import type { Projection } from "../application/common/Projection.js";
import { ValidationBehaviour } from "../application/common/ValidationBehaviour.js";
import type { EventStore } from "../application/services/EventStore.js";
import { EventRegistry } from "../domain/common/EventRegistry.js";
import {
  loadConfig,
  loadEnvFile,
  type Config,
} from "../infrastructure/config/Config.js";
import { createPool } from "../infrastructure/database/pool.js";
import { ReadOnlyTransactionBehaviour } from "../infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../infrastructure/database/TransactionBehaviour.js";
import { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { PostgresEventStore } from "../infrastructure/event-store/PostgresEventStore.js";
import { apiV1 } from "./api/v1/index.js";
import { readAssets, type Assets } from "./common/assets.js";
import { refuseCrossSite } from "./common/crossSite.js";
import { speakToRequests, type Language } from "./common/language.js";
import {
  machineClock,
  stampRequests,
  type Clock,
} from "./common/requestedAt.js";
import { english } from "./languages/english.js";
import { auth } from "./auth/index.js";
import { registerErrorMapping } from "./common/errors.js";
import { registerPublicPages } from "./public/pages.js";
import { registerRegisterPage } from "./public/register.js";
import { registerJavaScriptRequiredPage } from "./public/javaScriptRequired.js";
import { registerLanguageRoute } from "./public/language.js";
import { registerThemeRoute } from "./public/theme.js";
import { registerWelcomePage } from "./public/welcome.js";

const repositoryRoot = join(import.meta.dirname, "..", "..");

// A route reaches the mediator as request.server.mediator, and nothing else of
// the application. Declared here, beside the one place that puts it there.
declare module "fastify" {
  interface FastifyInstance {
    readonly mediator: Mediator;
  }
}

export interface Application {
  readonly server: FastifyInstance;
  readonly pool: Pool;
  readonly config: Config;
  readonly mediator: Mediator;
  /** Where a request's validator is registered, alongside its handler. */
  readonly validation: ValidationBehaviour;
  /** What a repository, the event store or a projection asks for its connection. */
  readonly unitOfWork: UnitOfWork;
  /** Where every event is kept, with every read model kept in step as it is. */
  readonly eventStore: EventStore;
}

// The one mediator, and the order its behaviours run in. Validation stands
// first in both lines and is the same behaviour in each, so that a request that
// was never going to be carried out is refused before it costs a connection, and
// a validator is registered once whichever side its request comes in on. Behind
// it a command gets a transaction it can write in, and a query one it cannot.
const putTogether = (
  unitOfWork: UnitOfWork,
): { mediator: Mediator; validation: ValidationBehaviour } => {
  const mediator = new Mediator();
  const validation = new ValidationBehaviour();

  mediator.addCommandBehaviour(validation);
  mediator.addCommandBehaviour(new TransactionBehaviour(unitOfWork));

  mediator.addQueryBehaviour(validation);
  mediator.addQueryBehaviour(new ReadOnlyTransactionBehaviour(unitOfWork));

  return { mediator, validation };
};

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
  /** Where the time comes from. The machine's clock, unless a scenario sets one. */
  readonly clock?: Clock;
  /**
   * The languages the site offers, the first being the one it falls back to.
   * English alone, unless a scenario offers more.
   */
  readonly languages?: readonly Language[];
  /**
   * The kinds of event the store knows how to read back, and the projections
   * that keep the read models. The application's own, unless a scenario gives
   * its examples instead.
   */
  readonly events?: EventRegistry;
  readonly projections?: readonly Projection[];
}

// Every kind of event the application records, each named once by the name it
// is kept under, and how it is read back. None yet: the first arrive with the
// account.
const events = (): EventRegistry => new EventRegistry();

// Every read model's projection, each given every event as it is appended. None
// yet: the first, accounts by email address, arrives with the account.
const projections: readonly Projection[] = [];

export const buildApplication = async (
  config: Config,
  options: ApplicationOptions = {},
): Promise<Application> => {
  const server = Fastify({ logger: options.logger ?? true });
  const pool = createPool(config.databaseUrl);
  const assets = readAssets(join(repositoryRoot, "assets"));
  const unitOfWork = new UnitOfWork(pool);
  const { mediator, validation } = putTogether(unitOfWork);

  // On the unit of work the mediator's transactions use, so that what a
  // command's handler appends, and what every projection writes of it, is kept
  // in the command's transaction or not at all.
  const eventStore = new ProjectingEventStore(
    new PostgresEventStore(unitOfWork, options.events ?? events()),
    options.projections ?? projections,
  );

  // Before any route is added, so that every one of them finds it there.
  server.decorate("mediator", mediator);

  await server.register(cookie, { secret: config.sessionCookieSecret });
  await server.register(formbody);

  registerErrorMapping(server, assets);

  stampRequests(server, options.clock ?? machineClock);
  speakToRequests(server, options.languages ?? [english]);

  // Before any route, so nothing that changes something can be reached from
  // another site by forgetting to ask.
  refuseCrossSite(server, config.canonicalHost);

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
  registerLanguageRoute(server);
  registerRegisterPage(server, assets);
  registerWelcomePage(server, assets);
  registerJavaScriptRequiredPage(server, assets);
  registerPublicPages(server, assets);

  return { server, pool, config, mediator, validation, unitOfWork, eventStore };
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
