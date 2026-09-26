Feature: Asking whether games have been played

  Some of what can be done to a tournament depends on whether games have been
  played. A player who has played any cannot be archived, a competition that
  has any cannot be archived, and a knockout's draw cannot be changed so as to
  move a player who has played in it. The tournament does not know about
  games: they are played in its competitions. So the application asks its
  games, and this is what it wants of that asking.

  Each answer is yes or no, and only that. The games are never told what to do
  about it: refusing is the tournament's, and is specified with it.

  Nothing records games yet. Until something does, the application's games
  have nothing to find, so they say that no player has played, that no
  competition has any games, and that no change to a knockout's draw moves a
  player who has played. Whatever records games will make these answers true
  ones, and is to be held to the same questions.

  This feature describes what the application wants of the games rather than
  any one way of keeping them, and every implementation is held to these
  scenarios. The step definitions decide what is behind them.

  Background:
    Given the application's games

  Rule: Nothing records games yet, so nobody has played any

    Scenario: A player has played no games
      When they are asked whether the player "tournament-player/123e4567-e89b-42d3-a456-426614174000" has played any games
      Then they say no

    Scenario: A competition has no games
      When they are asked whether the competition "competition/123e4567-e89b-42d3-a456-426614174000" has any games
      Then they say no

    Scenario: A change to a knockout's draw moves nobody who has played
      When they are asked whether changing the draw of the knockout "competition/123e4567-e89b-42d3-a456-426614174000" to 8 places moves a player who has played
      Then they say no
