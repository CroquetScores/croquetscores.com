import { useState } from "react";

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
 */
export const useRules = (
  begins: RulesAsItIs | undefined,
  ranked: boolean,
): {
  readonly said: {
    readonly handicap: boolean;
    readonly drawsAllowed: boolean;
    readonly worldRankings?: boolean;
  };
  readonly ticks: React.JSX.Element;
} => {
  const [handicap, setHandicap] = useState(begins?.handicap ?? false);
  const [drawsAllowed, setDrawsAllowed] = useState(
    begins?.drawsAllowed ?? false,
  );
  // One that does not count under handicap or with drawn results does not for
  // that reason, and not because anybody chose it, so taking those off should
  // not leave it uncounted without the reader having said so. Only one that
  // is neither, and does not count, was chosen not to.
  const [worldRankings, setWorldRankings] = useState(
    begins === undefined ||
      begins.worldRankings ||
      begins.handicap ||
      begins.drawsAllowed,
  );
  const asksAboutWorldRankings = ranked && !handicap && !drawsAllowed;
  return {
    said: {
      handicap,
      drawsAllowed,
      ...(asksAboutWorldRankings ? { worldRankings } : {}),
    },
    ticks: (
      <>
        <Tick
          name="handicap"
          label={say("admin.rules.handicap")}
          ticked={handicap}
          tick={setHandicap}
        />
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
  };
};
