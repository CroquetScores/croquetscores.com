import type { DomainEvent } from "./DomainEvent.js";

/**
 * What every thing that lasts shares: it is kept as everything that happened
 * to it, rebuilt by applying each event in turn, and it records what happens
 * next as events that change it as they are recorded.
 *
 * A subclass says how each event changes it, in {@link apply}, and offers its
 * own ways of being made new and of being rebuilt, since what it takes to begin
 * one is its own business. Both come down to {@link record} and
 * {@link replay}.
 */
export abstract class AggregateRoot {
  // How many events of its stream this has taken account of: those it was
  // rebuilt from, and those it has handed over to be kept since.
  #version = 0;
  #recorded: DomainEvent[] = [];

  /**
   * Where this expects its stream to be when what it recorded is appended.
   *
   * Recording does not move it. An append has to expect the stream as it was
   * when this was rebuilt, so that the store can refuse it if somebody else has
   * added to the stream since — which is the whole of what stops two commands
   * that each decided from the same history both being recorded. Handing over
   * what was recorded moves it, because by then those events are on their way
   * to being kept.
   */
  get expectedVersion(): number {
    return this.#version;
  }

  /** What has happened to it since it was rebuilt, or last handed over. */
  get recorded(): readonly DomainEvent[] {
    return [...this.#recorded];
  }

  /**
   * What it recorded, to be appended to its stream. It holds none of it
   * afterwards: anything still held would be handed over again the next time
   * it was asked, and kept twice.
   */
  handOver(): readonly DomainEvent[] {
    const handed = this.#recorded;
    this.#recorded = [];
    this.#version += handed.length;
    return handed;
  }

  /** How `event` changes this. Every kind of event it records needs a case. */
  protected abstract apply(event: DomainEvent): void;

  /** That `event` has happened to this: it changes it, and is held to be kept. */
  protected record(event: DomainEvent): void {
    this.apply(event);
    this.#recorded.push(event);
  }

  /**
   * Makes this what `events` leave it as. They are applied and not recorded:
   * they are already kept, and recording them again would hand them over to be
   * kept a second time.
   */
  protected replay(events: readonly DomainEvent[]): void {
    for (const event of events) this.apply(event);
    this.#version += events.length;
  }
}
