// Loads a thing that lasts by its id, and saves what happened to it, over the
// event store. One of these serves every kind of thing alike: each kind says
// only how it is rebuilt from its id and its events, and everything else is
// shared, so there is nothing to write per kind but that.
import type { AggregateRoot } from "../../domain/common/AggregateRoot.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { EventStore } from "../services/EventStore.js";

/** How one kind of thing is rebuilt from the stream its id names. */
export type Rebuild<TAggregate extends AggregateRoot, TId extends Id> = (
  id: TId,
  events: readonly DomainEvent[],
) => TAggregate;

export class AggregateRepository<
  TAggregate extends AggregateRoot,
  TId extends Id,
> {
  constructor(
    private readonly store: EventStore,
    private readonly rebuild: Rebuild<TAggregate, TId>,
  ) {}

  /**
   * The thing `id` names, rebuilt from its stream, or nothing when nobody has
   * saved one: a thing with no events never happened. What that means — an
   * account that does not exist, a tournament somebody mistyped — is for the
   * command to say.
   */
  async load(id: TId): Promise<TAggregate | undefined> {
    const events = await this.store.getEvents(id);
    return events.length === 0 ? undefined : this.rebuild(id, events);
  }

  /**
   * Keeps what `thing` recorded since it was loaded, expecting its stream to
   * be where it was then, so that of two commands that decided from the same
   * history only the first is kept: the second is refused with
   * `EventStore.Concurrency`, and it is for that command to load the thing
   * again and decide again. A thing that recorded nothing keeps nothing.
   *
   * The thing hands over what it recorded only once it has been kept. Handed
   * over first, a refused append would leave it holding nothing, and what it
   * recorded would be gone without anyone having seen it refused.
   */
  async save(thing: TAggregate): Promise<void> {
    const recorded = thing.recorded;
    if (recorded.length === 0) return;
    await this.store.appendEvents(thing.id, thing.expectedVersion, recorded);
    thing.handOver();
  }
}
