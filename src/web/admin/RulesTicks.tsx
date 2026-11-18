import { useState } from "react";

import { Field, type Refusal } from "./Field.js";
import { say } from "./words.js";

interface TickProps {
  readonly name: string;
  readonly label: string;
  readonly ticked: boolean;
  readonly tick: (ticked: boolean) => void;
}

/** A labelled box to tick, as a form offers a yes or no. */
export const Tick = ({
  name,
  label,
  ticked,
  tick,
}: TickProps): React.JSX.Element => (
  <div className="field-tick">
    <label htmlFor={`field-${name}`}>
      <input
        id={`field-${name}`}
        type="checkbox"
        checked={ticked}
        onChange={(event) => {
          tick(event.target.checked);
        }}
      />
      <span>{label}</span>
    </label>
  </div>
);

/** How a competition is played and counted, as it is. */
export interface RulesAsItIs {
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly worldRankings: boolean;
  /** The most hoops a game is played to, or null for no most. */
  readonly maximumHoops: number | null;
  /** Whether it is played as Advantage Golf Croquet. */
  readonly advantage: boolean;
}

/**
 * The three ticks every kind of competition has, which a competition's own
 * dialog and a test's both ask: played with handicaps, allows drawn results,
 * and counts toward world rankings. One being changed begins as it is, and one
 * being added counts unless the reader says it does not.
 *
 * Counting is asked only where the sport has world rankings and the
 * competition is neither played under handicap nor allows drawn results, which
 * cannot count, and left unsaid otherwise for the tournament to decide
 * (create.feature). `said` is what is sent; `ticks` is what is drawn.
 *
 * Above them, where it is offered, is whether it is played as Advantage Golf
 * Croquet (advantage.feature). It is offered where the site offers it and the
 * sport is golf croquet, which the caller says as `advantageOffered`, and for
 * a competition that already is Advantage wherever it is, so that it can be
 * seen and switched off, and so that changing anything else about it says what
 * it is, as the dialog says its other rules: leaving it out would switch it
 * off, and a manager could not so much as rename one on a site that stopped
 * offering it. Where it is neither offered nor already so, it is left unsaid,
 * which is not Advantage. It cannot count towards the world rankings, so a
 * competition ticked as Advantage is not asked about them, as one played under
 * handicap is not. It is not played with handicaps as well, since each
 * player's handicap is what their target is looked up from, so the two are
 * mutually exclusive (advantage.feature): ticked, either takes the other away,
 * as one that cannot count takes away the question of the world rankings.
 *
 * After them is the most hoops a game is played to, which a competition being
 * added begins on the usual for its sport, and one being changed on its own.
 * Emptied it is none, which is sent as none rather than left out, since
 * leaving it out would be taken as the usual (maximumHoops.feature). What is
 * typed is sent as it was typed, and the site reads it as a number, so that
 * there is one reading of it and not two to drift apart.
 */
export const useRules = (
  begins: RulesAsItIs | undefined,
  ranked: boolean,
  usualMaximumHoops: number,
  maximumHoopsRefused: readonly Refusal[],
  advantageOffered: boolean,
): {
  readonly said: {
    readonly handicap: boolean;
    readonly drawsAllowed: boolean;
    readonly advantage?: boolean;
    readonly worldRankings?: boolean;
    readonly maximumHoops: string | null;
  };
  /** What the dialog has of Advantage, which what it asks after may depend on. */
  readonly advantage: boolean;
  /** The boxes to tick. */
  readonly ticks: React.JSX.Element;
  /** The most hoops, which a dialog puts last, after whatever else it asks. */
  readonly hoops: React.JSX.Element;
} => {
  const [handicap, setHandicap] = useState(begins?.handicap ?? false);
  const [drawsAllowed, setDrawsAllowed] = useState(
    begins?.drawsAllowed ?? false,
  );
  const [advantage, setAdvantage] = useState(begins?.advantage ?? false);
  // One that does not count under handicap, with drawn results or as Advantage
  // does not for that reason, and not because anybody chose it, so taking
  // those off should not leave it uncounted without the reader having said so.
  // Only one that is none of them, and does not count, was chosen not to.
  const [worldRankings, setWorldRankings] = useState(
    begins === undefined ||
      begins.worldRankings ||
      begins.handicap ||
      begins.drawsAllowed ||
      begins.advantage,
  );
  const [maximumHoops, setMaximumHoops] = useState(
    begins === undefined
      ? String(usualMaximumHoops)
      : begins.maximumHoops === null
        ? ""
        : String(begins.maximumHoops),
  );
  const typedMaximumHoops = maximumHoops.trim();
  const asksAboutAdvantage =
    (advantageOffered || begins?.advantage === true) && !handicap;
  const asksAboutHandicap = !advantage;
  const asksAboutWorldRankings =
    ranked && !handicap && !drawsAllowed && !advantage;
  return {
    advantage,
    said: {
      handicap: asksAboutHandicap && handicap,
      drawsAllowed,
      ...(asksAboutAdvantage ? { advantage } : {}),
      maximumHoops: typedMaximumHoops === "" ? null : typedMaximumHoops,
      ...(asksAboutWorldRankings ? { worldRankings } : {}),
    },
    ticks: (
      <>
        {asksAboutAdvantage ? (
          <Tick
            name="advantage"
            label={say("admin.rules.advantage")}
            ticked={advantage}
            tick={setAdvantage}
          />
        ) : null}
        {asksAboutHandicap ? (
          <Tick
            name="handicap"
            label={say("admin.rules.handicap")}
            ticked={handicap}
            tick={setHandicap}
          />
        ) : null}
        <Tick
          name="drawsAllowed"
          label={say("admin.rules.drawsAllowed")}
          ticked={drawsAllowed}
          tick={setDrawsAllowed}
        />
        {asksAboutWorldRankings ? (
          <Tick
            name="worldRankings"
            label={say("admin.rules.worldRankings")}
            ticked={worldRankings}
            tick={setWorldRankings}
          />
        ) : null}
      </>
    ),
    hoops: (
      <Field
        name="maximum-hoops"
        label={say("admin.rules.maximumHoops")}
        refused={maximumHoopsRefused}
      >
        {(tied) => (
          <input
            {...tied}
            type="text"
            inputMode="numeric"
            placeholder=" "
            autoComplete="off"
            value={maximumHoops}
            onChange={(event) => {
              setMaximumHoops(event.target.value);
            }}
          />
        )}
      </Field>
    ),
  };
};
