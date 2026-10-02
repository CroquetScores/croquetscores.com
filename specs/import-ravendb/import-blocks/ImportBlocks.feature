@postgres
Feature: Importing the old sites' blocks

  A block is brought over as every competition is (`importCompetition.feature`).
  What is a block's own is said here: what each of its matches is the best
  of, and what each player carried forward into it.

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
