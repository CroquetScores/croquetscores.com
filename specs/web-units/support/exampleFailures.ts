// Two example pages that fail, for the scenarios about what a page saying
// something went wrong shows the reader (language.feature).
//
// Neither is reachable any other way. A form never comes here: what a form
// sends that breaks a rule is answered with the form shown again (form.ts), so
// the page for a broken rule only appears where something that is not a form
// sends one. And nothing in the site is written to fail on purpose, which is
// the point of the page that says it did.
//
// Added to the application the @browser scenarios share, before it listens. A
// request that breaks a rule is refused in front of the transaction
// (ValidationBehaviour.feature), and a request that throws never reaches one,
// so neither needs a database.
import type { Application } from "../../../src/web/server.js";
import { ExampleFormCommand } from "./exampleForm.js";

export const exampleRefusedPath = "/example-refused";
export const exampleFailedPath = "/example-failed";

export const addExampleFailures = (application: Application): void => {
  const { server } = application;

  // Nothing filled in, so the example form's rules refuse it: a page whose
  // request breaks its rules, arriving at the error mapping because there is
  // no form here to show again.
  server.get(exampleRefusedPath, (request) =>
    request.server.mediator.send(
      new ExampleFormCommand(
        request.requestedAt,
        { start: undefined, end: undefined, step: undefined },
        undefined,
      ),
    ),
  );

  // Ours, and nothing the reader did: the failure the site has no answer for
  // but a reference to find it in the log by.
  server.get(exampleFailedPath, () => {
    throw new Error("The example page failed on purpose.");
  });
};
