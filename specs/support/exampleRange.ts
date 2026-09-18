// The example range and its rules. A range exists only to exercise validation.
// Its rules mean nothing beyond what they show: several rules on one field, a
// field whose rule is optional, and a rule reading two fields.
//
// Here rather than beside the validator's feature because the validation
// behaviour asks the same rules about the example requests, and a second copy
// of them would be a second set of rules to drift from the first.
//
// Loaded by every spec in the repository, so it names nothing from
// infrastructure or the web.
import { Validator } from "../../src/domain/common/validation/Validator.js";

export interface Range {
  readonly start: number | undefined;
  readonly end: number | undefined;
  readonly step: number | undefined;
}

export type RangeErrorCode =
  | "Range.StartMissing"
  | "Range.EndMissing"
  | "Range.StartNegative"
  | "Range.StepNotPositive"
  | "Range.StepNotRound"
  | "Range.EndBeforeStart";

export const ranges = new Validator<Range, RangeErrorCode>({
  fields: [
    {
      field: "start",
      code: "Range.StartMissing",
      isBrokenBy: (range) => range.start === undefined,
    },
    {
      field: "end",
      code: "Range.EndMissing",
      isBrokenBy: (range) => range.end === undefined,
    },
    {
      field: "start",
      code: "Range.StartNegative",
      isBrokenBy: (range) => range.start !== undefined && range.start < 0,
    },
    {
      field: "step",
      code: "Range.StepNotPositive",
      isBrokenBy: (range) => range.step !== undefined && range.step <= 0,
    },
    {
      field: "step",
      code: "Range.StepNotRound",
      isBrokenBy: (range) => range.step !== undefined && range.step % 5 !== 0,
    },
  ],
  spanning: [
    {
      reads: ["start", "end"],
      code: "Range.EndBeforeStart",
      // Anything it cannot compare counts against it, so that when it says
      // nothing about a missing field it is the validator keeping it quiet.
      isBrokenBy: ({ start, end }) =>
        start === undefined || end === undefined || end < start,
    },
  ],
});
