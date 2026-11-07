import type { FastifyRequest } from "fastify";

/**
 * The signed link a request carries in its address, as it was written there,
 * or nothing. Read in one place so that the pages a link opens cannot come to
 * disagree about which part of an address is the link.
 */
export const carriedIn = (request: FastifyRequest): string | undefined =>
  /[?&]link=([^&]*)/.exec(request.url)?.[1];
