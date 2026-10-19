// tsx for Cucumber's workers. Run in parallel, each worker is a thread of its
// own, and a thread does not inherit the hooks tsx put on the main one — not
// from running Cucumber through tsx, and not from node --import tsx either —
// so every .steps.ts failed to load. Cucumber registers whatever scripts/cucumber.mjs
// names as a loader in each worker before it imports anything, and this is
// that loader.
//
// It is tsx's own hooks, handed an empty set of options. Registered as Cucumber
// registers a loader, tsx is given none, and it reads that as having been
// started with Node's old --loader flag and refuses to start.
export * from "tsx/esm";
import { initialize as tsxInitialize } from "tsx/esm";

export const initialize = (data) => tsxInitialize(data ?? {});
