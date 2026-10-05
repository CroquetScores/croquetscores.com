import type { Reference } from "./Tournament.js";

/** One comment in a commentary, as the old sites kept it. */
export interface Comment {
  readonly Content: string;
  /** As Newtonsoft wrote a `DateTime`, with no zone. */
  readonly CreatedAt: string;
  /** How many readers were watching when it was written, which nothing here keeps. */
  readonly Readers?: number | null;
  readonly IsArchived: boolean;
}

/**
 * A `Commentary` document as the old sites kept it in RavenDB: a writer's
 * account of a tournament as it was played, its comments in the order they
 * were written.
 */
export interface Commentary {
  readonly Tournament: Reference;
  /** The user who wrote it. */
  readonly Commentator: Reference;
  readonly Title: string;
  readonly Comments: readonly Comment[];
  readonly IsArchived: boolean;
}
