/**
 * What a list says of a player beside their name: their handicap and what they
 * represent, with a comma between them only where there are both. Nothing is
 * left where they have neither. The public pages put the same in brackets
 * (tournamentPages.ts); a list has the room for them to stand bare.
 */
export const aboutPlayer = ({
  handicap,
  representing,
}: {
  readonly handicap?: string | undefined;
  readonly representing?: string | undefined;
}): string =>
  [handicap, representing].filter((each) => each !== undefined).join(", ");
