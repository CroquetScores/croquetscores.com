import type { SpecWorld } from "../../../../support/world.js";

/**
 * What moving a player is to one aggregate's steps: a tournament's players
 * and a competition's are moved in the same words, so a scenario's steps are
 * one set, and each does it to whichever the scenario is about.
 */
export interface PlayerMoves {
  moved(world: SpecWorld, name: string, direction: "up" | "down"): void;
  movedById(world: SpecWorld, id: string): void;
  /** An order no move would give just so, to bring two orders together. */
  movedTo(world: SpecWorld, name: string, order: number): void;
  spacedOut(world: SpecWorld): void;
  assertMovedAt(world: SpecWorld, index: number): void;
  assertSpacedOutAt(world: SpecWorld, index: number): void;
}
