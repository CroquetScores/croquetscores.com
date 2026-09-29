Feature: Restoring a competition's archived game

  An archived game (`archiveGame.feature`) can be restored, and then counts
  again, in the place among the games it was added in. It counts as a game
  added counts (`addGame.feature`), so restoring it is refused where adding it
  would be: where both its players have since met in a match that is decided
  without it, where one of them has withdrawn, or, in a knockout, where they
  are no longer drawn to meet. So in a knockout, a game of a match whose
  winner has played on is never restored, as it is never archived
  (`archiveGame.feature`): the match is decided without it.

  Restoring a game that is not archived records nothing, because nothing
  happened.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it
    And the tournament player "Alex Another" was entered in it
    And the tournament player "Chris Third" was entered in it
    And the tournament player "Pat Fourth" was entered in it

  Rule: A game restored is recorded, and counts again

    Scenario: Restoring a game records it
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it has recorded 1 event
      And the first thing it recorded is a game being restored

    Scenario: A restored game is not archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived

    Scenario: A restored game is back in the place it was added in
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Chris Third" beating "Pat Fourth" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then the competition's first game is of "Sam Someone" beating "Alex Another"

    Scenario: A restored game decides its match again
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was restored
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A competition rebuilt after a game was restored has it not archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was restored
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived

  Rule: Only a game there is can be restored

    Scenario: Restoring a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174000" is restored by its id
      Then it is refused with "Competition.NoSuchGame"

  Rule: Restoring a game that is not archived records nothing

    Scenario: Restoring a game that is not archived records nothing
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it has recorded 0 events

    Scenario: Restoring a game that is not archived is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it is not refused

  Rule: A game is restored only where it could be added

    Scenario: A game whose match has since been decided without it is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it is refused with "Competition.MatchDecided"

    Scenario: A game with a player who has since withdrawn is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A game in a knockout whose match has since been decided without it is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then it is refused with "Competition.MatchDecided"

    Scenario: A game in a knockout whose match's winner has played on is refused
      Given the competition is a knockout of 4 places, its first round the best of 3 and its second the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was archived
      And the game of "Sam Someone" beating "Alex Another" 26 to 5 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 1 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 2 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is restored
      Then it is refused with "Competition.MatchDecided"

    Scenario: A refused game stays archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
