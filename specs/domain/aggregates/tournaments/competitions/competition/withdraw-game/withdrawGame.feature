Feature: Withdrawing a competition's game, and reversing it

  A game is withdrawn where it was played but is not to count: a player who
  withdraws partway through a block that is played twice over, as the
  Australian President's Eights is, has the games of the second time round
  withdrawn, so that the players they did not get to play again are not left
  behind those they did. It is not archived (`archiveGame.feature`), which is
  for a game entered by mistake: a withdrawn game was played, so it is still
  listed as played, and still sent to the world rankings with the player's
  other results. It no longer counts in the competition, so it no longer
  decides its match, and the two players can play it again. A player with a
  withdrawn game has still played, so it keeps them in the competition, as a
  game that counts does.

  Only a block's or a Swiss's games are withdrawn, since there a game counts
  only towards the standings. A knockout's game decides who goes through, and
  a test's which team won, so taking one out would change more than a table,
  and is refused with `Competition.NotABlockOrSwiss`.

  A withdrawn game's withdrawal can be reversed, and it then counts again,
  where it could be added now: refused as adding it would be, as restoring an
  archived game is (`restoreGame.feature`). So it is refused where the two
  players have since played their match again without it, and where either of
  them has withdrawn, whose withdrawal is reversed first.

  An archived game is set aside, and is neither withdrawn nor has its
  withdrawal reversed: both are refused as the game refuses changing it. A
  withdrawn game entered by mistake is still archived, and is withdrawn still
  when it is restored, so restoring it asks nothing of its match. Corrected,
  it stays withdrawn, and correcting it to other players asks nothing of their
  match either.

  Withdrawing a game that is withdrawn, or reversing the withdrawal of one
  that is not, records nothing, because nothing happened.

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

  Rule: A game withdrawn is recorded, and no longer counts

    Scenario: Withdrawing a game records it
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then it has recorded 1 event
      And the first thing it recorded is a game being withdrawn

    Scenario: A withdrawn game is withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn

    Scenario: A withdrawn game is not archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived

    Scenario: A withdrawn game is still one of the competition's games
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: A competition rebuilt after a game was withdrawn has it withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn

    Scenario: A withdrawn game no longer decides its match
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is not refused

    Scenario: A player whose only game is withdrawn has played
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      When the competition is rebuilt from its stream
      Then the player "Alex Another" has a game in use

  Rule: Only a game there is can be withdrawn

    Scenario: Withdrawing a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game "game/123e4567-e89b-42d3-a456-426614174000" is withdrawn by its id
      Then it is refused with "Competition.NoSuchGame"

  Rule: Withdrawing a withdrawn game records nothing

    Scenario: Withdrawing a withdrawn game records nothing
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then it has recorded 0 events

    Scenario: Withdrawing a withdrawn game is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then it is not refused

  Rule: Only a block's or a Swiss's game is withdrawn

    Scenario: A game in a Swiss is withdrawn
      Given the competition is a Swiss
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn

    Scenario: A game in a knockout is refused
      Given the tournament player "Pat Fourth" was entered in it
      And the competition is a knockout of 4 places, each round the best of 1
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then it is refused with "Competition.NotABlockOrSwiss"

    Scenario: A game in a test is refused
      Given a test between the teams "Australia" and "England"
      And "Pat Fourth" plays for "Australia"
      And "Kim Fifth" plays for "England"
      And the game of "Pat Fourth" beating "Kim Fifth" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Pat Fourth" beating "Kim Fifth" 26 to 17 is withdrawn
      Then it is refused with "Competition.NotABlockOrSwiss"

  Rule: An archived game is not withdrawn

    Scenario: Withdrawing an archived game is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then it is refused with "Game.Archived"

    Scenario: An archived game refused is not withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not withdrawn

  Rule: A withdrawn game's withdrawal is reversed, and it counts again

    Scenario: Reversing a game's withdrawal records it
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it has recorded 1 event
      And the first thing it recorded is a game's withdrawal being reversed

    Scenario: A game whose withdrawal is reversed is not withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not withdrawn

    Scenario: A game whose withdrawal is reversed decides its match again
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 was reversed
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A competition rebuilt after a game's withdrawal was reversed has it not withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 was reversed
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not withdrawn

    Scenario: Reversing the withdrawal of a game the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the withdrawal of the game "game/123e4567-e89b-42d3-a456-426614174000" is reversed by its id
      Then it is refused with "Competition.NoSuchGame"

  Rule: Reversing the withdrawal of a game not withdrawn records nothing

    Scenario: Reversing the withdrawal of a game not withdrawn records nothing
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it has recorded 0 events

    Scenario: Reversing the withdrawal of a game not withdrawn is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it is not refused

  Rule: A withdrawal is reversed only where the game could be added

    Scenario: A game whose match has since been played without it is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it is refused with "Competition.MatchDecided"

    Scenario: A game with a player who has withdrawn is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A refused game stays withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn

    Scenario: Reversing the withdrawal of an archived game is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the withdrawal of the game of "Sam Someone" beating "Alex Another" 26 to 17 is reversed
      Then it is refused with "Game.Archived"

  Rule: A withdrawn game is archived, and restored withdrawn

    Scenario: A withdrawn game is archived
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is archived

    Scenario: A withdrawn game restored is still withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn

    Scenario: A withdrawn game is restored whatever its match
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is restored
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived

  Rule: A withdrawn game corrected stays withdrawn

    Scenario: A withdrawn game corrected is still withdrawn
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to 26 to 18
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 18 is withdrawn

    Scenario: A withdrawn game is corrected to other players whatever their match
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was withdrawn
      And the game of "Sam Someone" beating "Chris Third" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is corrected to "Sam Someone" beating "Chris Third" 26 to 17
      Then it is not refused
