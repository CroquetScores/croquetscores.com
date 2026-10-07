// Two requests a scenario asks for at once, held together just after each has
// read what it decides by, until the other has read it too: the moment where
// two requests read the same thing before either has written what it decided,
// which a scenario cannot otherwise count on, since one can be done before the
// other begins. A request that cannot read until the other is done is not held
// for long: after a moment it goes on alone, as it would have had nothing held
// it.
//
// Here, beside the world, since the steps that ask at once and the support that
// stands up what is read are in different parts of the specs, and this names
// nothing of either.
import type { SpecWorld } from "./world.js";

// How long one waits for the other before going on alone: long enough for the
// other to read, where nothing stops it, and short enough not to slow a
// scenario where something does.
const WAIT_MS = 250;

interface Holding {
  readonly expected: number;
  arrived: number;
  readonly allArrived: Promise<void>;
  readonly release: () => void;
}

const holdings = new WeakMap<SpecWorld, Holding>();

/** That the next `expected` readings are held together, until `stopHolding`. */
export const startHolding = (world: SpecWorld, expected: number): void => {
  let release = (): void => undefined;
  const allArrived = new Promise<void>((resolve) => {
    release = resolve;
  });
  holdings.set(world, { expected, arrived: 0, allArrived, release });
};

export const stopHolding = (world: SpecWorld): void => {
  holdings.get(world)?.release();
  holdings.delete(world);
};

/**
 * Called just after a request reads what it decides by: held until every
 * request asked at once has read it too, or a moment has passed. Nothing is
 * held where nothing is being asked at once.
 */
export const heldUntilTheOthersHaveRead = async (
  world: SpecWorld,
): Promise<void> => {
  const holding = holdings.get(world);
  if (holding === undefined) return;
  holding.arrived += 1;
  if (holding.arrived >= holding.expected) holding.release();
  await Promise.race([
    holding.allArrived,
    new Promise<void>((resolve) => setTimeout(resolve, WAIT_MS)),
  ]);
};

// `readModel`, but held just after it is asked `method`, until whatever else
// is asked at once has asked it too (heldAtOnce.ts): so that two commands asked
// for at once read what is taken before either writes, where nothing makes the
// second wait. Every other method is the read model's own.
export const heldAfter = <TReadModel extends object>(
  world: SpecWorld,
  readModel: TReadModel,
  method: keyof TReadModel,
): TReadModel =>
  new Proxy(readModel, {
    get(target, property) {
      const value: unknown = Reflect.get(target, property, target);
      if (typeof value !== "function") return value;
      const bound = (value as (...args: unknown[]) => unknown).bind(target);
      if (property !== method) return bound;
      return async (...args: unknown[]) => {
        const answer = await bound(...args);
        await heldUntilTheOthersHaveRead(world);
        return answer;
      };
    },
  });
