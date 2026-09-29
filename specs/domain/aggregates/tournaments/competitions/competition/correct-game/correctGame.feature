Feature: Correcting a competition's game

  A game entered with the wrong score is corrected: its scores are changed,
  and everything else about it is kept, its players and its place among the
  games. An archived game is not changed in any way (`Game.feature`), so
  correcting one is refused, even to the scores it has; it is restored first,
  and corrected then. What a correction may change is what
  the game says (`Game.feature`): its winner stays its winner, and a drawn
  game stays drawn, so the result is the result it was, and no match is
  decided otherwise for it. So a game is corrected whatever has been played
  since, even in a knockout whose next round it sent its winner to
  (`archiveGame.feature`). A game whose result was wrong is archived and
  added again, as archiving and adding allow.

  Whether drawn games are allowed is the tournament's (`create.feature`), and
  a knockout never allows them (`addGame.feature`), so whatever corrects a
  game says so, as it does when adding one. A game with a player who has
  withdrawn since can be corrected, since what it says happened before they
  withdrew.

  Correcting a game not archived to the scores it has records nothing,
  because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it
    And the tournament player "Alex Another" was entered in it
    And the tournament player "Chris Third" was entered in it
    And the tournament player "Pat Fourth" was entered in it

  Rule: A game corrected is recorded, and has its new scores

    Scenario: Correcting a game records it
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then it has recorded 1 event
      And the first thing it recorded is a game being corrected

    Scenario: A corrected game has its new scores
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 10

    Scenario: A corrected game keeps its place among the games
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition's first game is of "Sam Someone" beating "Alex Another"

    Scenario: A corrected game can be marked as won on equal points
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17w to 17
      Then the competition has the game of "Sam Someone" beating "Alex Another" 17w to 17

    Scenario: A competition rebuilt after a game was corrected has its new scores
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was corrected to 26 to 10
      When the competition is rebuilt from its stream
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 10

    Scenario: A game with a player who has withdrawn since can be corrected
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 10

  Rule: Only a game there is can be corrected

    Scenario: Correcting a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174000" is corrected to 26 to 10 by its id
      Then it is refused with "Competition.NoSuchGame"

  Rule: An archived game is not corrected

    Scenario: Correcting an archived game is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then it is refused for breaking "Game.Archived"

    Scenario: Correcting an archived game to the scores it has is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 17
      Then it is refused for breaking "Game.Archived"

    Scenario: A refused archived game keeps its scores
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: An archived game restored can be corrected
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was restored
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 10

  Rule: A correction keeps the game's result

    Scenario: A correction putting the loser ahead is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 26
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A correction to equal points with no mark is refused where drawn games are not allowed
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 17
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A correction of a won game to a drawn one is refused where drawn games are allowed
      Given drawn games are allowed
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 17
      Then it is refused for breaking "Game.ResultChanged"

    Scenario: A correction of a drawn game to a won one is refused
      Given drawn games are allowed
      And the game of "Sam Someone" beating "Alex Another" 13 to 13 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 13 to 13 is corrected to 26 to 13
      Then it is refused for breaking "Game.ResultChanged"

    Scenario: A correction of a drawn game to another draw is not refused
      Given drawn games are allowed
      And the game of "Sam Someone" beating "Alex Another" 13 to 13 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 13 to 13 is corrected to 12 to 12
      Then the competition has the game of "Sam Someone" beating "Alex Another" 12 to 12

    Scenario: A correction to equal points with no mark in a knockout is refused where drawn games are allowed
      Given drawn games are allowed
      And the competition is a knockout of 4 places, each round the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 17
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A refused correction leaves the game as it was
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 26
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

  Rule: In a knockout, a game of a match whose winner has played on can be corrected

    The knockout has four places, its first round the best of 3 and its
    second the best of 1, and Sam Someone has beaten Alex Another 2 to 0 and
    played on in the final.

    Background:
      Given the competition is a knockout of 4 places, its first round the best of 3 and its second the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 5 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 1 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 2 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it

    Scenario: A game whose winner has played on is corrected, keeping its winner
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 10
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 10

    Scenario: A game whose winner has played on is not corrected to another winner
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 17 to 26
      Then it is refused for breaking "Game.WinnerNotAhead"

  Rule: Correcting a game not archived to the scores it has records nothing

    Scenario: Correcting a game to its own scores records nothing
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 17
      Then it has recorded 0 events

    Scenario: Correcting a game to its own scores is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 17
      Then it is not refused
