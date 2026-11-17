// A Cucumber formatter that prints nothing and watches for a run that has
// stopped. Once, with a worker gone from under it, a run sat for twenty minutes
// at its last scenario, idle, and said nothing: Cucumber waits for a worker that
// will never answer, and a person watching a progress bar that is not moving
// cannot tell that from a slow one.
//
// When no scenario has finished for the limit, it says which scenarios were
// still running and fails the run, so that the stall is a failure with a name
// on it. The limit is ten minutes, which no scenario here comes near (a step
// is given three minutes at the most), or CUCUMBER_STALL_MINUTES.
import { Formatter } from "@cucumber/cucumber";
import { clearInterval, setInterval } from "node:timers";

const limit = Number(process.env.CUCUMBER_STALL_MINUTES ?? 10) * 60_000;

export default class StallWatch extends Formatter {
  constructor(options) {
    super(options);
    const pickles = new Map();
    const testCases = new Map();
    const running = new Map();
    let lastProgress = Date.now();
    let timer;

    const check = () => {
      if (Date.now() - lastProgress < limit) return;
      const names = [...running.values()].map(
        ({ uri, name }) => `  ${name} # ${uri}`,
      );
      console.error(
        `\nNo scenario has finished for ${limit / 60_000} minutes, so the run is stopped as stalled.\n` +
          `Still running:\n${names.join("\n") || "  (none started)"}`,
      );
      process.exit(1);
    };

    options.eventBroadcaster.on("envelope", (envelope) => {
      if (envelope.pickle !== undefined) {
        pickles.set(envelope.pickle.id, envelope.pickle);
      } else if (envelope.testCase !== undefined) {
        testCases.set(envelope.testCase.id, envelope.testCase.pickleId);
      } else if (envelope.testCaseStarted !== undefined) {
        const { id, testCaseId } = envelope.testCaseStarted;
        const pickle = pickles.get(testCases.get(testCaseId));
        running.set(id, { name: pickle?.name, uri: pickle?.uri });
        // The clock starts with the first scenario, not the run, so that the
        // minutes the run spends loading are not counted against it.
        if (timer === undefined) {
          lastProgress = Date.now();
          timer = setInterval(check, Math.min(15_000, limit / 2));
          // Not a reason for the process to stay alive once the run is done.
          timer.unref();
        }
      } else if (envelope.testCaseFinished !== undefined) {
        running.delete(envelope.testCaseFinished.testCaseStartedId);
        lastProgress = Date.now();
      } else if (envelope.testRunFinished !== undefined) {
        clearInterval(timer);
      }
    });
  }
}
