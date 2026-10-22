// A score marked in text as a tie: "2 Tied", "5 Draw", "5=" or "6w tie".
const TIE = /(^|[^a-z])(?:tied|tie|draw)(?![a-z])|=/i;

// Whether any game of `document` has a score marked in text as a tie.
export const hasTieMarked = (document: object): boolean =>
  (
    (
      document as {
        Games?: {
          _Games?: readonly {
            Winner: { Score: { _Score: string } };
            Loser: { Score: { _Score: string } };
          }[];
        };
      }
    ).Games?._Games ?? []
  ).some((game) =>
    [game.Winner.Score._Score, game.Loser.Score._Score].some((score) =>
      TIE.test(score),
    ),
  );
