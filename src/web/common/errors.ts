// Errors map in one place, so no route decides for itself what a failure looks
// like to a caller.
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

export const registerErrorMapping = (server: FastifyInstance): void => {
  server.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api/")) {
      return reply.code(404).send({ error: "NotFound" });
    }
    return reply
      .code(404)
      .type("text/html; charset=utf-8")
      .send("<!doctype html><title>Not found</title><h1>Not found</h1>");
  });

  server.setErrorHandler((error, request, reply) => {
    // The correlation id goes to the log with the cause, and to the caller
    // without it. What went wrong is ours to know and not theirs to read.
    const correlationId = randomUUID();
    request.log.error({ err: error, correlationId }, "Unhandled error");
    return reply.code(500).send({ error: "Internal", correlationId });
  });
};
