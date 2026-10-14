import type { StoredEvent } from "../../../src/infrastructure/event-store/PostgresEventStore.js";

/** What a read model is asked to do to be made again. */
export interface Rebuildable {
  clear(): Promise<void>;
  rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void>;
}

/**
 * Makes `readModel` again from `events` as the site's rebuild does: emptied
 * once, and then handed each stream, whole, one at a time. The streams come in
 * the order they first appear in `events`, which is what lets a scenario say
 * which stream is handed over first, and each stream's events in the order
 * they were given.
 */
export const rebuildFromEvents = async (
  readModel: Rebuildable,
  events: readonly StoredEvent[],
): Promise<void> => {
  const byStream = new Map<string, StoredEvent[]>();
  for (const each of events) {
    const kept = byStream.get(each.stream);
    if (kept === undefined) byStream.set(each.stream, [each]);
    else kept.push(each);
  }
  await readModel.clear();
  for (const [stream, kept] of byStream) {
    await readModel.rebuildFromStream(stream, kept);
  }
};
