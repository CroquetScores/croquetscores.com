// How long each step definition and hook took over a run, the most time first.
//
// Cucumber's own usage formatter reports the same thing, but works it out once
// the run is over by matching every step definition against every step of
// every scenario, and over the whole suite that took more than two minutes on
// top of the run itself. This adds each step's time up as the step finishes,
// so there is nothing left to work out at the end.
//
// Sorted by total rather than by mean, because the question it is there to
// answer is where the suite's time goes: a step that takes a second and runs
// once matters less than one that takes a tenth of a second and runs in every
// scenario.
import { Formatter } from "@cucumber/cucumber";

// A step that never ran has no time worth counting, and one that matched no
// definition, or more than one, has no definition to count it against.
const unexecuted = new Set(["SKIPPED", "UNDEFINED", "AMBIGUOUS", "UNKNOWN"]);

const milliseconds = ({ seconds, nanos }) => seconds * 1000 + nanos / 1e6;

const hookKind = {
  BEFORE_TEST_CASE: "Before",
  AFTER_TEST_CASE: "After",
  BEFORE_TEST_STEP: "BeforeStep",
  AFTER_TEST_STEP: "AfterStep",
};

export default class TimingFormatter extends Formatter {
  static documentation =
    "How long each step definition and hook took, the most time first.";

  constructor(options) {
    super(options);
    const definitions = new Map();
    const steps = new Map();

    options.eventBroadcaster.on("envelope", (envelope) => {
      if (envelope.stepDefinition) {
        const { id, pattern, sourceReference } = envelope.stepDefinition;
        definitions.set(id, {
          name: pattern.source,
          where: `${sourceReference.uri}:${sourceReference.location?.line ?? "?"}`,
          count: 0,
          total: 0,
          longest: 0,
        });
      } else if (envelope.hook) {
        const { id, name, type, tagExpression, sourceReference } =
          envelope.hook;
        const label = [
          `${hookKind[type] ?? "Hook"} hook`,
          name,
          tagExpression && `(${tagExpression})`,
        ]
          .filter(Boolean)
          .join(" ");
        definitions.set(id, {
          name: label,
          where: `${sourceReference.uri}:${sourceReference.location?.line ?? "?"}`,
          count: 0,
          total: 0,
          longest: 0,
        });
      } else if (envelope.testCase) {
        for (const step of envelope.testCase.testSteps) {
          const definitionId =
            step.hookId ??
            (step.stepDefinitionIds?.length === 1
              ? step.stepDefinitionIds[0]
              : undefined);
          if (definitionId !== undefined) steps.set(step.id, definitionId);
        }
      } else if (envelope.testStepFinished) {
        const { testStepId, testStepResult } = envelope.testStepFinished;
        if (unexecuted.has(testStepResult.status)) return;
        const definition = definitions.get(steps.get(testStepId));
        if (definition === undefined) return;
        const taken = milliseconds(testStepResult.duration);
        definition.count += 1;
        definition.total += taken;
        definition.longest = Math.max(definition.longest, taken);
      } else if (envelope.testRunFinished) {
        this.report([...definitions.values()]);
      }
    });
  }

  report(definitions) {
    const ran = definitions
      .filter((definition) => definition.count > 0)
      .sort((a, b) => b.total - a.total);
    if (ran.length === 0) {
      this.log("No step ran.\n");
      return;
    }

    const time = (value) => `${value.toFixed(1)}ms`;
    const rows = ran.map((definition) => [
      time(definition.total),
      String(definition.count),
      time(definition.total / definition.count),
      time(definition.longest),
      definition.name,
      definition.where,
    ]);
    const heading = ["Total", "Runs", "Mean", "Longest", "Step", "Where"];
    // The numbers are right-aligned so they can be compared down a column, and
    // the step is padded so that where it is lines up after it.
    const widths = heading.map((title, column) =>
      Math.max(title.length, ...rows.map((row) => row[column].length)),
    );
    const line = (row) =>
      row
        .map((cell, column) =>
          column < 4
            ? cell.padStart(widths[column])
            : column === 4
              ? cell.padEnd(widths[column])
              : cell,
        )
        .join("  ");

    this.log(`${[heading, ...rows].map(line).join("\n")}\n`);
  }
}
