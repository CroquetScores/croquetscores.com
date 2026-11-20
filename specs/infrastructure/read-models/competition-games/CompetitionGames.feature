@postgres
Feature: The games of a competition, kept for the API

  The API tells an app every game of a competition, who won it and who lost
  it, and for a knockout the round it was played in, and for a test the match
  it is in (`games.feature`). It asks the events nothing, so a read model keeps
  what a game is and the players of the competition, as the competition's own
  events say it.

  A game is kept with who won it and who lost it, by the id the competition
  gives its players, each score as it was typed, whether nobody won, whether it
  is archived, and whether it was withdrawn: played, but counting for nothing.
  The games are kept in the order they are shown, which is the order they were
  added in, but for a test's, which can be moved. A player is kept with their
  place in the competition's order, whether they have withdrawn and which
  withdrawal of the competition's theirs was, and a knockout's byes with their
  places. What the games are played out against, so far as the competition's
  own events say it, is kept; the rest is the tournament's (`TournamentContents.feature`).

  It is kept event by event, so that an event changes only the rows it is
  about. It is written from a competition's own events, which do not say which
  tournament it is in, so no stream has to come before another when the read
  models are made again, and the projection is safe to run twice.

  What is worked out of what is kept, a game's round in a knockout and the
  matches of a test, is not kept: each depends on the games before it, and
  is worked out when it is asked for (`games.feature`).

  Where a scenario names no website, the tournament is on croquetscores.com,
  is for the sport "ac", and is played in the region "vic" of the country "au".

  Background:
    Given the competition games read model
    And a tournament "Spring Open" to start on "2026-10-03"
    And "Spring Open" is created by the account for "organiser@example.com"
    And a block named "Block A" is made in "Spring Open"
    And the player "Sam Someone" is made in "Spring Open"
    And the player "Alex Another" is made in "Spring Open"
    And the player "Chris Third" is made in "Spring Open"
    And the player "Sam Someone" is entered in "Block A" of "Spring Open"
    And the player "Alex Another" is entered in "Block A" of "Spring Open"
    And the player "Chris Third" is entered in "Block A" of "Spring Open"

  Rule: A game is kept as the competition says it

    Scenario: A game added is kept
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the games kept are "the first"

    Scenario: A game is kept with who won it
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as won by "Sam Someone"

    Scenario: A game is kept with who lost it
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as lost by "Alex Another"

    Scenario: A game is kept with its scores as they were typed
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept with the scores "26" and "17"

    Scenario: A peel is kept in the score as it was typed
      Given "Sam Someone" beat "Alex Another" 26tp to 12 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept with the scores "26tp" and "12"

    Scenario: A game that somebody won is kept as not drawn
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as not drawn

    Scenario: A game that nobody won is kept as drawn
      Given a block named "Block D" that allows drawn results is made in "Spring Open"
      And the player "Sam Someone" is entered in "Block D" of "Spring Open"
      And the player "Alex Another" is entered in "Block D" of "Spring Open"
      And "Sam Someone" beat "Alex Another" 13 to 13 in "Block D" of "Spring Open" as "the first"
      When the games of "Block D" of "Spring Open" are read back
      Then the game "the first" is kept as drawn

    Scenario: The games are kept in the order they were added
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And "Alex Another" beat "Chris Third" 26 to 3 in "Block A" of "Spring Open" as "the second"
      And "Chris Third" beat "Sam Someone" 26 to 20 in "Block A" of "Spring Open" as "the third"
      When the games of "Block A" of "Spring Open" are read back
      Then the games kept are "the first", "the second" and "the third"

    Scenario: A game of another competition is not kept with this one's
      Given a block named "Block B" is made in "Spring Open"
      And the player "Sam Someone" is entered in "Block B" of "Spring Open"
      And the player "Alex Another" is entered in "Block B" of "Spring Open"
      And "Sam Someone" beat "Alex Another" 26 to 17 in "Block B" of "Spring Open" as "the other"
      When the games of "Block A" of "Spring Open" are read back
      Then no games are kept

  Rule: A game corrected, archived, restored or withdrawn is the same game

    Scenario: A game corrected is kept with the new scores
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is corrected to 26 to 20
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept with the scores "26" and "20"

    Scenario: A game corrected is still the one game
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is corrected to 26 to 20
      When the games of "Block A" of "Spring Open" are read back
      Then the games kept are "the first"

    Scenario: A game archived is kept as archived
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is archived
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as archived

    Scenario: A game restored is kept as not archived
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is archived
      And the game "the first" in "Block A" of "Spring Open" is restored
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as not archived

    Scenario: A game withdrawn is kept as withdrawn
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is withdrawn
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as withdrawn

    Scenario: A game's withdrawal reversed is kept as not withdrawn
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is withdrawn
      And the withdrawal of the game "the first" in "Block A" of "Spring Open" is reversed
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as not withdrawn

    Scenario: A game that was not withdrawn is kept as not withdrawn
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as not withdrawn

  Rule: A test's game moved is put in the place of the one beside it

    Background:
      Given a tournament "Spring Tests" to start on "2026-10-03"
      And "Spring Tests" is created by the account for "organiser@example.com"
      And "Spring Tests" is played by teams
      And a test between "Australia" and "England" is made in "Spring Tests"

    Scenario: The games of a test are kept in the order they were added
      Given the team players "Pat Player" and "Kim Keeper" play in the test of "Spring Tests"
      And the team players "Lee Long" and "Max Moore" play in the test of "Spring Tests"
      And "Pat Player" beat "Kim Keeper" 26 to 17 in the test of "Spring Tests" as "the first"
      And "Lee Long" beat "Max Moore" 26 to 9 in the test of "Spring Tests" as "the second"
      When the games of the test of "Spring Tests" are read back
      Then the games kept are "the first" and "the second"

    Scenario: A game moved down is kept after the one beside it
      Given the team players "Pat Player" and "Kim Keeper" play in the test of "Spring Tests"
      And the team players "Lee Long" and "Max Moore" play in the test of "Spring Tests"
      And "Pat Player" beat "Kim Keeper" 26 to 17 in the test of "Spring Tests" as "the first"
      And "Lee Long" beat "Max Moore" 26 to 9 in the test of "Spring Tests" as "the second"
      And the game "the first" in the test of "Spring Tests" is moved down
      When the games of the test of "Spring Tests" are read back
      Then the games kept are "the second" and "the first"

    Scenario: A game moved up is kept before the one beside it
      Given the team players "Pat Player" and "Kim Keeper" play in the test of "Spring Tests"
      And the team players "Lee Long" and "Max Moore" play in the test of "Spring Tests"
      And "Pat Player" beat "Kim Keeper" 26 to 17 in the test of "Spring Tests" as "the first"
      And "Lee Long" beat "Max Moore" 26 to 9 in the test of "Spring Tests" as "the second"
      And the game "the second" in the test of "Spring Tests" is moved up
      When the games of the test of "Spring Tests" are read back
      Then the games kept are "the second" and "the first"

  Rule: A game that names a player nobody keeps is not told

    Scenario: A game of a player the read models lack is refused
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back without who played them
      Then telling them is refused

  Rule: A player is kept as the competition says them

    Scenario: The players are kept in the competition's order
      When the players of "Block A" of "Spring Open" are read back
      Then the players kept are "Sam Someone", "Alex Another" and "Chris Third"

    Scenario: A player moved down is kept in their new place
      Given the player "Sam Someone" in "Block A" of "Spring Open" is moved down
      When the players of "Block A" of "Spring Open" are read back
      Then the players kept are "Alex Another", "Sam Someone" and "Chris Third"

    Scenario: A player who has not withdrawn is kept as not withdrawn
      When the players of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" is kept as not withdrawn

    Scenario: A player withdrawn is kept as withdrawn
      Given the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" is kept as withdrawn

    Scenario: A player withdrawn is kept after the rest
      Given the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" of "Spring Open" are read back
      Then the players kept are "Alex Another", "Chris Third" and "Sam Someone"

    Scenario: The players withdrawn are kept in the order they withdrew
      Given the player "Chris Third" in "Block A" of "Spring Open" is withdrawn
      And the player "Sam Someone" in "Block A" of "Spring Open" is withdrawn
      When the players of "Block A" of "Spring Open" are read back
      Then the players withdrawn kept are "Chris Third" and then "Sam Someone"

    Scenario: A player's withdrawal reversed is kept as not withdrawn
      Given the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      And the withdrawal of the player "Alex Another" in "Block A" of "Spring Open" is reversed
      When the players of "Block A" of "Spring Open" are read back
      Then the player "Alex Another" is kept as not withdrawn

    Scenario: A player removed is not kept
      Given the player "Chris Third" in "Block A" of "Spring Open" is removed
      When the players of "Block A" of "Spring Open" are read back
      Then the players kept are "Sam Someone" and "Alex Another"

    Scenario: A player withdrawn counts their games for nothing where the block is told
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is told as withdrawn

    Scenario: A game of players who have not withdrawn is not told as withdrawn
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is told as not withdrawn

  Rule: A knockout's byes are kept with their places

    Background:
      Given a knockout named "Finals" is made in "Spring Open"

    Scenario: A bye entered is kept
      Given a bye is entered in "Finals" of "Spring Open"
      When the byes of "Finals" of "Spring Open" are read back
      Then 1 bye is kept

    Scenario: A bye moved is kept in its new place
      Given the player "Sam Someone" is entered in "Finals" of "Spring Open"
      And a bye is entered in "Finals" of "Spring Open"
      And the bye of "Finals" of "Spring Open" is moved up
      When the byes of "Finals" of "Spring Open" are read back
      Then 1 bye is kept before the player "Sam Someone" of "Finals" of "Spring Open"

    Scenario: A bye removed is not kept
      Given a bye is entered in "Finals" of "Spring Open"
      And the bye of "Finals" of "Spring Open" is removed
      When the byes of "Finals" of "Spring Open" are read back
      Then no byes are kept

  Rule: Projecting the same events again changes nothing

    Scenario: A game projected twice is one game
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      When the events of the competition "Block A" of "Spring Open" are projected again
      And the games of "Block A" of "Spring Open" are read back
      Then the games kept are "the first"

    Scenario: A game corrected and projected twice keeps its correction
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is corrected to 26 to 20
      When the events of the competition "Block A" of "Spring Open" are projected again
      And the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept with the scores "26" and "20"

    Scenario: A game archived and projected twice is still archived
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the game "the first" in "Block A" of "Spring Open" is archived
      When the events of the competition "Block A" of "Spring Open" are projected again
      And the games of "Block A" of "Spring Open" are read back
      Then the game "the first" is kept as archived

    Scenario: A player projected twice is one player
      When the events of the competition "Block A" of "Spring Open" are projected again
      And the players of "Block A" of "Spring Open" are read back
      Then the players kept are "Sam Someone", "Alex Another" and "Chris Third"

  Rule: The read model is rebuilt from the events alone

    Every scenario here says the rebuild did not fail as well as what is kept
    afterwards, because a rebuild that fails is rolled back with the
    transaction it ran in, which leaves the tables as they were.

    Scenario: Games rebuilt are kept as they were
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And "Alex Another" beat "Chris Third" 26 to 3 in "Block A" of "Spring Open" as "the second"
      And the game "the first" in "Block A" of "Spring Open" is corrected to 26 to 20
      And the game "the second" in "Block A" of "Spring Open" is archived
      When the read model is rebuilt from the events
      And the games of "Block A" of "Spring Open" are read back
      Then it is rebuilt without failing
      And the games kept are "the first" and "the second"
      And the game "the first" is kept with the scores "26" and "20"
      And the game "the second" is kept as archived

    Scenario: Players rebuilt are kept as they were
      Given the player "Sam Someone" in "Block A" of "Spring Open" is moved down
      And the player "Alex Another" in "Block A" of "Spring Open" is withdrawn
      When the read model is rebuilt from the events
      And the players of "Block A" of "Spring Open" are read back
      Then it is rebuilt without failing
      And the player "Alex Another" is kept as withdrawn

    Scenario: A rebuild with the competitions' streams first is kept as it was
      Given "Sam Someone" beat "Alex Another" 26 to 17 in "Block A" of "Spring Open" as "the first"
      And the competitions' streams are to be rebuilt before the tournament's
      When the read model is rebuilt from the events
      And the games of "Block A" of "Spring Open" are read back
      Then it is rebuilt without failing
      And the games kept are "the first"
