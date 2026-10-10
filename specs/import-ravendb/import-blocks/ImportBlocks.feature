@postgres
Feature: Importing the old sites' blocks

  A block is brought over as every competition is (`importCompetition.feature`).
  What is a block's own is said here: what each of its matches is the best
  of, and what each player carried forward into it. The old sites kept some
  blocks as the best of 0, which no match can be. What such a block's matches
  were the best of is worked out from its games, as a knockout's rounds are
  (`ImportKnockouts.feature`): the most games any two of its players played,
  made odd by one more where it is even, or 1 where none played more than one
  or none played at all.

  Some managers kept a block as the best of 3, say, and played it as three
  rounds of single games: every player played every other the best-of's
  number of games, which the site would find decided after two wins, and
  refuse the third. A block kept as the best of more than 1 where every pair
  of its players played exactly that many games is the best of 1, played in
  rounds, which is what it was (`addGame.feature`). That is said as
  corrected (`AcceptedImportErrors.feature`). A best-of worked out from the
  games, where it was kept as less than 1, is not kept, and is left as it is.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And the blocks are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported
    And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Sam Someone"

  Rule: A block is added to its tournament as a block

    Scenario: A block becomes a block
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is a block

    Scenario: A block's matches are the best of what they were
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block kept as the best of 0 with no games is the best of 1
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 0
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 1

    Scenario: A block kept as the best of 0 whose players met once is the best of 1
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 0
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 1

    Scenario: A block kept as the best of 0 whose players met three times is the best of 3
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 0
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block kept as the best of 0 whose players met twice is the best of 3
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 0
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 7
      And game 2 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block kept as the best of less than 0 is worked out the same
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of -1
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 1

  Rule: A block whose every pair played the best-of's number of games is the best of 1

    Scenario: A block whose every pair played its best-of's games is the best of 1
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 7
      And game 2 was lost by player 3
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 1

    Scenario: A block of three players whose every pair played its best-of's games is the best of 1
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And player 5 of "tournaments/12" on "croquetscores.com" is imported as "Pat Third"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And player 5 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 3 was won by player 7
      And game 3 was lost by player 3
      And game 4 was won by player 7
      And game 4 was lost by player 5
      And game 5 was won by player 5
      And game 5 was lost by player 7
      And game 6 was won by player 7
      And game 6 was lost by player 5
      And game 7 was won by player 3
      And game 7 was lost by player 5
      And game 8 was won by player 5
      And game 8 was lost by player 3
      And game 9 was won by player 3
      And game 9 was lost by player 5
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 1

    Scenario: Every game of a block played in rounds is added
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 7
      And game 2 was lost by player 3
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 3 games

    Scenario: A block played in rounds is not an error
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 7
      And game 2 was lost by player 3
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A block made the best of 1 is said as corrected
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 7
      And game 2 was lost by player 3
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then "croquetscores.com/blocks/30" is corrected as "ImportBlocks.PlayedInRounds"

    Scenario: A block whose pair played fewer games than its best-of keeps its best-of
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block where one pair played fewer games than another keeps its best-of
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And player 5 of "tournaments/12" on "croquetscores.com" is imported as "Pat Third"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And player 5 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 3 was won by player 7
      And game 3 was lost by player 3
      And game 4 was won by player 7
      And game 4 was lost by player 5
      And game 5 was won by player 5
      And game 5 was lost by player 7
      And game 6 was won by player 7
      And game 6 was lost by player 5
      And game 7 was won by player 3
      And game 7 was lost by player 5
      And game 8 was won by player 5
      And game 8 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block where a player played no one keeps its best-of
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And player 5 of "tournaments/12" on "croquetscores.com" is imported as "Pat Third"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And player 5 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 3 was won by player 7
      And game 3 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is the best of 3

    Scenario: A block that keeps its best-of is not said as corrected
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 3
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 2 was won by player 3
      And game 2 was lost by player 7
      When the competition is imported
      Then nothing is corrected of "croquetscores.com/blocks/30"

    Scenario: A block of single games is not said as corrected
      Given player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the block's matches are the best of 1
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then nothing is corrected of "croquetscores.com/blocks/30"

  Rule: A block with no players and no games, of a tournament finished before 1 October 2026, is left behind

    The old sites kept blocks that were added to a tournament and never used:
    no player was entered in them and no game played. One of a tournament
    that finished before 1 October 2026 is left behind without an error. One
    of a tournament finishing on that day or later may yet be filled, and is
    brought over.

    Scenario: An empty block of a tournament that finished before 1 October 2026 is not kept
      Given a tournament "tournaments/14" on "croquetscores.com" finishing on "2026-09-30T00:00:00.0000000" is imported
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      When the competition is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving an empty block of a finished tournament behind is not an error
      Given a tournament "tournaments/14" on "croquetscores.com" finishing on "2026-09-30T00:00:00.0000000" is imported
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: An empty block of a tournament that finishes on 1 October 2026 is kept
      Given a tournament "tournaments/14" on "croquetscores.com" finishing on "2026-10-01T00:00:00.0000000" is imported
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is a block

    Scenario: A block with a player, of a tournament that finished before 1 October 2026, is kept
      Given a tournament "tournaments/14" on "croquetscores.com" finishing on "2026-09-30T00:00:00.0000000" is imported
      And player 7 of "tournaments/14" on "croquetscores.com" is imported as "Sam Someone"
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      And player 7 is in the competition
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" is a block

  Rule: What a player carried forward is carried forward, unless it was nothing

    The old sites kept the six counts a player carried forward as numbers,
    each 0 unless a manager typed another. The site keeps a count nobody gave
    as nothing rather than as 0 (`CarryForward.feature`), and shows a player
    carrying anything forward differently from one carrying nothing. So a
    player whose six counts are all 0 carries nothing forward, and one with
    any count other than 0 carries forward all six as they were.

    Scenario: A player whose counts were all 0 carries nothing forward
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      When the competition is imported
      Then "Sam Someone" carries nothing forward in the competition kept for "blocks/30" on "croquetscores.com"

    Scenario: A count other than 0 is carried forward
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 2 match wins
      When the competition is imported
      Then "Sam Someone" carries forward 2 match wins in the competition kept for "blocks/30" on "croquetscores.com"

    Scenario: A count of 0 beside one that is not is carried forward as 0
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 2 match wins
      When the competition is imported
      Then "Sam Someone" carries forward 0 match losses in the competition kept for "blocks/30" on "croquetscores.com"

    Scenario Outline: Each count is carried forward as the count it was
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 carried forward 0 of each count
      And player 7 carried forward 5 <count>
      When the competition is imported
      Then "Sam Someone" carries forward 5 <count> in the competition kept for "blocks/30" on "croquetscores.com"

      Examples:
        | count         |
        | match wins    |
        | match losses  |
        | game wins     |
        | game losses   |
        | hoops for     |
        | hoops against |
