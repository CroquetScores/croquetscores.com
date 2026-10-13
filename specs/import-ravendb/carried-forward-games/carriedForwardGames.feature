@postgres
Feature: Importing the games a Swiss counted as its own as what its players carried forward

  The old sites could name earlier competitions whose games a Swiss counted
  as its own, and showed those games in its standings beside the Swiss's own.
  The site has no such thing: a Swiss's standings begin from what each player
  carried forward into it (`CarryForward.feature`). So a Swiss that named
  competitions is brought over with what those games came to, counted for
  each player as their carry forward, and its standings are the same as they
  were. The games themselves are not brought over into the Swiss, since they
  were played in a competition of their own and are not the Swiss's.

  A game is counted for the players it was played between. As a Swiss played
  single games (`ImportSwisses.feature`), a game won is a match won and a game
  won both, and one lost is a match lost and a game lost. The hoops are the
  points each player scored, which are the digits their score begins with, so
  that "26tp" is 26.

  What a player carried forward by hand into the Swiss is kept, and the games
  are counted on top of it, count by count. Where the player carried nothing
  forward by hand, they carry forward what the games came to.

  The competitions are read from the old documents, so they need not be
  brought over themselves, or before the Swiss.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And the Swisses are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported
    And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Sam Someone"
    And player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"

  Rule: A game of a competition the Swiss counted is carried forward by the players who played it

    Scenario Outline: The winner of a game carries it forward as a win
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "26"
      And game 1's loser scored "5"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward <number> <count> in the competition kept for "swisses/30" on "croquetscores.com"

      Examples:
        | count         | number |
        | match wins    | 1      |
        | match losses  | 0      |
        | game wins     | 1      |
        | game losses   | 0      |
        | hoops for     | 26     |
        | hoops against | 5      |

    Scenario Outline: The loser of a game carries it forward as a loss
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "26"
      And game 1's loser scored "5"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Alex Other" carries forward <number> <count> in the competition kept for "swisses/30" on "croquetscores.com"

      Examples:
        | count         | number |
        | match wins    | 0      |
        | match losses  | 1      |
        | game wins     | 0      |
        | game losses   | 1      |
        | hoops for     | 5      |
        | hoops against | 26     |

    Scenario: The games of a player are added up
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "26"
      And game 1's loser scored "5"
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 2's winner scored "26"
      And game 2's loser scored "20"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 46 hoops for in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: The games of every competition the Swiss counted are added up
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And the block "blocks/32" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      And the Swiss counts the games of "blocks/32" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 2 game wins in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A score typed with more than its points is counted for its points
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "26tp"
      And game 1's loser scored "5"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 26 hoops for in the competition kept for "swisses/30" on "croquetscores.com"

  Rule: What a player carried forward by hand is kept, and the games are counted on top of it

    Scenario: A count carried forward by hand has the games added to it
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 4 game wins
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 5 game wins in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A player with none of the counted games keeps what they carried forward
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 3 is in the competition
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 4 game wins
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 4 game wins in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A player who played none of the games carries nothing forward
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 3 is in the competition
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "swisses/30" on "croquetscores.com"

  Rule: Only the Swiss's players carry the games forward

    A player who played the games and is not in the Swiss has nobody to carry
    them forward, and is not brought into the Swiss for them: the Swiss's
    players are the ones it listed. The Swiss's own games are the Swiss's, and
    are not counted a second time as carried forward.

    Scenario: A player not in the Swiss is not brought in for the games they played
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then the competition kept for "swisses/30" on "croquetscores.com" has 1 player

    Scenario: The Swiss's own games are not carried forward
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "swisses/30" on "croquetscores.com"

  Rule: A competition that is not there, or was archived, counts for nothing

    The old sites archived a competition to be rid of it
    (`importCompetition.feature`), and a name left in a Swiss after the
    competition it named was deleted names nothing. Neither is an error, since
    the Swiss was shown without them.

    Scenario: The games of an archived competition are not counted
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And the competition was archived
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A competition that is not there counts for nothing
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And the Swiss counts the games of "blocks/99" as its own
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A competition that is not there is not an error
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And the Swiss counts the games of "blocks/99" as its own
      When the competition is imported
      Then importing the competition is not refused

  Rule: A game on equal points is won by whoever the old site said won it

    The old sites kept who won a game as well as its scores, and the site
    says a game on equal points was won by the player whose score is marked
    (`importCompetition.feature`). A game is counted as it is when its
    competition is brought over, so that the Swiss's standings are what they
    were.

    Scenario: A game on equal points carries its hoops forward
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "13"
      And game 1's loser scored "13"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 13 hoops for in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A game on equal points is won by the player the old site said won it
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "13"
      And game 1's loser scored "13"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Sam Someone" carries forward 1 game wins in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A game the old site said was won by the player who scored less is won by the player who scored more
      Given the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's winner scored "5"
      And game 1's loser scored "26"
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And the Swiss counts the games of "blocks/31" as its own
      When the competition is imported
      Then "Alex Other" carries forward 1 game wins in the competition kept for "swisses/30" on "croquetscores.com"
