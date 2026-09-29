Feature: A game played in a competition

  A game is played between two of a competition's players, and has a winner
  and a loser. It is said as the result is
  said aloud: the winner and their score, and the loser and theirs, as "Sam
  Someone beat Alex Another 26 to 17". Each player is one of the
  competition's (`CompetitionPlayer.feature`), named by their id in it, and
  each score is a score (`Score.feature`).

  Nobody plays themselves, so a game with the same player as its winner and
  its loser is refused. The winner made at least as many points as the loser,
  so a game whose winner made fewer is refused, as a game put down the wrong
  way round, whether or not the winner's score is marked.

  A game won on equal points says who won it by marking the winner's score
  (`Score.feature`), as "6w" beat "6", and one on equal points with no mark is
  refused, since it says of nobody that they won. Where the tournament allows
  drawn games, which few do, a game on equal points is kept whether or not it
  is marked: its winner and loser are simply the players it was entered with.
  One with no mark is drawn, won by neither, so that a match counts it as
  played but as a win for nobody (`addGame.feature`). The game is told whether
  drawn games are allowed, since that is the tournament's. The loser did not win, so a loser's
  score marked as the winner's is refused.

  A game entered by mistake is archived rather than taken away: kept, with
  everything it says, but set aside, so that it no longer counts and can be
  restored. Whether it can be archived, and restored, is the competition's to
  say (`archiveGame.feature`), since it depends on the games around it.

  A game entered with the wrong score is corrected: given new scores, as
  anything else is given them, and keeping its result, so that its winner
  stays its winner and a drawn game stays drawn. A correction that would
  change the result is refused, since a game whose result was wrong is
  archived and added again (`correctGame.feature`). An archived game is not
  changed in any way, so correcting one is refused.

  A game is never altered: archiving, restoring and correcting each give the
  game as it is afterwards. Asking for what a game already is — archiving one that is
  archived, restoring one that is not — gives it back as it is.

  Two games are the same game when their ids are, whatever they say, since two
  games between the same players can have the same scores.

  Rule: A game has a winner and a loser, and a score for each

    Scenario: A game's winner is the player it was made with
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game's winner is "Sam Someone"

    Scenario: A game's loser is the player it was made with
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game's loser is "Alex Another"

    Scenario: A game's winner's score is the score it was made with
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game's winner's score is 26

    Scenario: A game's loser's score is the score it was made with
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game's loser's score is 17

    Scenario: A score that is not a score is refused as a score is
      When a game of "Sam Someone" beating "Alex Another" 26 to -1 is made
      Then it is refused for breaking "Score.NoPoints"

  Rule: Nobody plays themselves

    Scenario: A game with the same player as winner and loser is refused
      When a game of "Sam Someone" beating "Sam Someone" 26 to 17 is made
      Then it is refused for breaking "Game.SamePlayer"

  Rule: The winner made more points than the loser

    Scenario: A winner's score fewer than the loser's is refused
      When a game of "Sam Someone" beating "Alex Another" 17 to 26 is made
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A winner's score fewer than the loser's is refused though it is marked
      When a game of "Sam Someone" beating "Alex Another" 5w to 6 is made
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A winner's score fewer than the loser's is refused where drawn games are allowed
      Given drawn games are allowed
      When a game of "Sam Someone" beating "Alex Another" 17 to 26 is made
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A winner's score one more than the loser's is accepted
      When a game of "Sam Someone" beating "Alex Another" 26 to 25 is made
      Then the game's winner's score is 26

    Scenario: A score keeps what follows its number
      When a game of "Sam Someone" beating "Alex Another" 26tp to 17 is made
      Then the game's winner's score is written "26tp"

    Scenario: A loser's score of 0 is accepted
      When a game of "Sam Someone" beating "Alex Another" 26 to 0 is made
      Then the game's loser's score is 0

  Rule: A game on equal points says who won it, where drawn games are not allowed

    Scenario: A game on equal points with the winner's score marked is accepted
      When a game of "Sam Someone" beating "Alex Another" 6w to 6 is made
      Then the game's winner is "Sam Someone"

    Scenario: A marked score keeps its mark
      When a game of "Sam Someone" beating "Alex Another" 6w to 6 is made
      Then the game's winner's score is marked as the winner's

    Scenario: A game on equal points with no mark is refused
      When a game of "Sam Someone" beating "Alex Another" 6 to 6 is made
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A game on equal points with no mark is accepted where drawn games are allowed
      Given drawn games are allowed
      When a game of "Sam Someone" beating "Alex Another" 6 to 6 is made
      Then the game's winner is "Sam Someone"

    Scenario: A game with more points needs no mark
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game's winner's score is not marked as the winner's

  Rule: A game on equal points with no mark is drawn

    Scenario: A game on equal points with no mark is drawn
      Given drawn games are allowed
      When a game of "Sam Someone" beating "Alex Another" 6 to 6 is made
      Then the game is drawn

    Scenario: A game on equal points with the winner's score marked is not drawn
      Given drawn games are allowed
      When a game of "Sam Someone" beating "Alex Another" 6w to 6 is made
      Then the game is not drawn

    Scenario: A game with more points is not drawn
      Given drawn games are allowed
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game is not drawn

  Rule: The loser's score is not marked as the winner's

    Scenario: A loser's score marked as the winner's is refused
      When a game of "Sam Someone" beating "Alex Another" 26 to 17w is made
      Then it is refused for breaking "Game.LoserMarked"

  Rule: A game's scores can be corrected, keeping its result

    Scenario: A corrected game has its new winner's score
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 25 to 17
      Then the game's winner's score is 25

    Scenario: A corrected game has its new loser's score
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 26 to 10
      Then the game's loser's score is 10

    Scenario: A corrected game keeps its winner
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 26 to 10
      Then the game's winner is "Sam Someone"

    Scenario: Correcting an archived game is refused
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17 that is archived
      When the game is corrected to 26 to 10
      Then it is refused for breaking "Game.Archived"

    Scenario: A correction putting the loser ahead is refused
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 17 to 26
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A correction to equal points with the winner's score marked is accepted
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 17w to 17
      Then the game's winner's score is marked as the winner's

    Scenario: A correction with the loser's score marked is refused
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 26 to 17w
      Then it is refused for breaking "Game.LoserMarked"

    Scenario: A correction of a won game to a drawn one is refused where drawn games are allowed
      Given drawn games are allowed
      And a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the game is corrected to 17 to 17
      Then it is refused for breaking "Game.ResultChanged"

    Scenario: A correction of a drawn game to a won one is refused
      Given drawn games are allowed
      And a game of "Sam Someone" beating "Alex Another" 13 to 13
      When the game is corrected to 26 to 13
      Then it is refused for breaking "Game.ResultChanged"

    Scenario: A correction of a drawn game to another draw is accepted
      Given drawn games are allowed
      And a game of "Sam Someone" beating "Alex Another" 13 to 13
      When the game is corrected to 12 to 12
      Then the game is drawn

  Rule: A game can be archived, and restored

    Scenario: A new game is not archived
      When a game of "Sam Someone" beating "Alex Another" 26 to 17 is made
      Then the game is not archived

    Scenario: A game archived is archived
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the competition archives the game
      Then the game is archived

    Scenario: An archived game keeps what it says
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the competition archives the game
      Then the game's winner's score is 26

    Scenario: An archived game restored is not archived
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17 that is archived
      When the competition restores the game
      Then the game is not archived

    Scenario: An archived game archived again is still archived
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17 that is archived
      When the competition archives the game
      Then the game is archived

    Scenario: Restoring a game that is not archived leaves it not archived
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      When the competition restores the game
      Then the game is not archived

  Rule: Two games are the same when their ids are

    Scenario: Games with the same id and different scores are the same game
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      And another game with the same id of "Sam Someone" beating "Alex Another" 26 to 10
      When the games are compared
      Then they are the same game

    Scenario: Games with different ids and the same scores are different games
      Given a game of "Sam Someone" beating "Alex Another" 26 to 17
      And another game of "Sam Someone" beating "Alex Another" 26 to 17
      When the games are compared
      Then they are different games
