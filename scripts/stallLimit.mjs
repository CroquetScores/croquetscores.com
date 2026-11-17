// How long a run may go without a scenario finishing before it is called
// stalled, in minutes, as the settings give it: CUCUMBER_STALL_MINUTES or ten.
//
// A limit that is not a finite number above zero would be passed over as one:
// "10m" is NaN and "" is 0, and either makes the first check after the first
// scenario call the run stalled with nothing said about why, and Infinity never
// calls it so. It is refused instead, naming the setting. It is a module of its
// own so that scripts/run-cucumber.mjs can ask before it starts a run, where the
// refusal is the whole of what is printed, and not only when Cucumber loads the
// formatter, where it comes wrapped in the loader's own trace.
export const stallMinutes = () => {
  const written = process.env.CUCUMBER_STALL_MINUTES;
  const minutes = Number(written ?? 10);
  if (!(Number.isFinite(minutes) && minutes > 0)) {
    throw new Error(
      `CUCUMBER_STALL_MINUTES must be a number of minutes above zero, not ${JSON.stringify(written)}.`,
    );
  }
  return minutes;
};
