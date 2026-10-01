Feature: Moving a test's game up or down

  A competition lists its games in the order they were added
  (`addGame.feature`). A test's games are set out by team on its page, and
  are entered in whatever order their scores come in, so a manager or a
  scorer can move one up or down a place, to list them as they were played.

  Moving a game swaps it with the game in use next to it, above or below:
  the order is only how the games are listed, and nothing is decided by it,
  since in a test no game depends on another (`gamesInATest.feature`). An
  archived game is listed after the games in use, so it is passed over, and
  is not moved itself, since it is out of the way (`archiveGame.feature`):
  moving one is refused as the game refuses it, with `Game.Archived`.
  Moving the first game up or the last down records nothing, since there is
  nowhere for it to go.

  Only a test's games are moved. A knockout's are played round by round, and
  which game came first can decide who went through, so the order of a
  block's, a knockout's and a Swiss's games is the order they were added, and
  moving one of theirs is refused with `Competition.NotATest`, which is asked
  before anything else about the game.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a test between the teams "Australia" and "England"
    And the test is expected to have 21 matches
    And "Sam Someone" plays for "Australia"
    And "Alex Another" plays for "Australia"
    And "Chris Third" plays for "England"
    And "Pat Fourth" plays for "England"
    And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
    And the game of "Alex Another" beating "Pat Fourth" 26 to 3 was added to it

  Rule: A game moved swaps places with the game in use next to it

    Scenario: Moving a game records it
      Given the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a game being moved

    Scenario: A game moved up comes before the one above it
      Given the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is moved up
      Then the competition's first game is of "Alex Another" beating "Pat Fourth"

    Scenario: A game moved down comes after the one below it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is moved down
      Then the competition's first game is of "Alex Another" beating "Pat Fourth"

    Scenario: A competition rebuilt after a game was moved has it moved
      Given the game of "Alex Another" beating "Pat Fourth" 26 to 3 was moved up
      When the competition is rebuilt from its stream
      Then the competition's first game is of "Alex Another" beating "Pat Fourth"

  Rule: An archived game is passed over

    Scenario: A game moved up passes over an archived game above it
      Given the game of "Chris Third" beating "Alex Another" 26 to 20 was added to it
      And the game of "Alex Another" beating "Pat Fourth" 26 to 3 was archived
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Alex Another" 26 to 20 is moved up
      Then the competition's first game is of "Chris Third" beating "Alex Another"

    Scenario: Moving an archived game is refused
      Given the game of "Alex Another" beating "Pat Fourth" 26 to 3 was archived
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is moved up
      Then it is refused for breaking "Game.Archived"

    Scenario: The last game in use moved down records nothing, whatever is archived after it
      Given the game of "Chris Third" beating "Alex Another" 26 to 20 was added to it
      And the game of "Chris Third" beating "Alex Another" 26 to 20 was archived
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is moved down
      Then it has recorded 0 events

  Rule: Moving a game where there is nowhere to go records nothing

    Scenario: Moving the first game up records nothing
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is moved up
      Then it has recorded 0 events

    Scenario: Moving the last game down records nothing
      Given the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is moved down
      Then it has recorded 0 events

  Rule: Only a game there is, in a test, can be moved

    Scenario: Moving a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174099" is moved up by its id
      Then it is refused with "Competition.NoSuchGame"

    Scenario: Moving a block's game is refused
      Given the competition is a block, each match the best of 1
      And the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174099" is moved up by its id
      Then it is refused with "Competition.NotATest"
