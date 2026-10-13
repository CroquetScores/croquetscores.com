@postgres
Feature: Importing the old sites' Swisses

  A Swiss is brought over as every competition is (`importCompetition.feature`).
  What is a Swiss's own is said here.

  The old sites played a Swiss a game at a time, and kept no best-of for one,
  so each is brought over as the best of 1. What a player carried forward is
  brought over as it is for a block (`ImportBlocks.feature`), since the site
  shows it in a Swiss's standings as it does in a block's.

  The old sites could also name earlier competitions whose games a Swiss
  counted as its own. The site has nothing like it, so the games are not
  brought over into the Swiss: what they came to is carried forward by the
  players who played them (`carriedForwardGames.feature`).

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And the Swisses are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported
    And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Sam Someone"

  Rule: A Swiss is added to its tournament as a Swiss of single games

    Scenario: A Swiss becomes a Swiss
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      When the competition is imported
      Then the competition kept for "swisses/30" on "croquetscores.com" is a Swiss

    Scenario: A Swiss's matches are the best of 1
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      When the competition is imported
      Then the competition kept for "swisses/30" on "croquetscores.com" is the best of 1

  Rule: What a player carried forward is carried forward, unless it was nothing

    Scenario: A player whose counts were all 0 carries nothing forward
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: A count other than 0 is carried forward
      Given the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 4 game wins
      When the competition is imported
      Then "Sam Someone" carries forward 4 game wins in the competition kept for "swisses/30" on "croquetscores.com"
