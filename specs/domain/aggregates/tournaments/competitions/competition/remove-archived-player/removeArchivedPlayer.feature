Feature: Removing a competition's player whose tournament player is archived

  A tournament's player who has no games in any of its competitions can be
  archived (`archivePlayer.feature`), and an archived player is out of the
  way: they are in no competition. So archiving them removes them from every
  competition they are in (`ArchivePlayer.feature`), as a player entered by
  mistake is removed (`removePlayer.feature`): taken out, and not kept or able
  to be put back. Restoring the tournament player does not put them back; they
  are entered again as anybody is.

  The competition is told which tournament player is archived, since it names
  its players by the tournament player they are. It knows whether they have
  any games in it, since the games are its own (`addGame.feature`), and a
  player with games cannot be removed, since the games would then be against
  somebody who is no longer there; an archived game counts, since it can be
  restored. The tournament archives only a player with no games in any of its
  competitions, so this is a mistake caught rather than a refusal a manager
  meets.

  A knockout is drawn in the competition's order, so once it has a game,
  archived or not, removing anybody from it is refused, and archiving a
  tournament player who is in one is refused with it. Whatever asks says what
  kind of competition it is; the scenarios here are about a block unless they
  say otherwise.

  A withdrawn player is removed as well. A player is withdrawn when they will
  play no more (`withdrawPlayer.feature`), and one withdrawn with no games has
  nothing in the competition but their place; an archived tournament player
  left in a competition as withdrawn would be somebody out of the way who is
  still in it. Removing a player one at a time asks for their withdrawal to be
  reversed first; this does not, since there is nobody to ask it of.

  A tournament player who is not in the competition records nothing, because
  nothing happened.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it

  Rule: The player of an archived tournament player with no games is removed

    Scenario: Removing the player records it
      Given the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then it has recorded 1 event
      And the first thing it recorded is a player being removed

    Scenario: The player removed is not in the competition
      Given the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then the competition does not have the tournament player "Sam Someone"

    Scenario: The players left keep their orders
      Given the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then the competition's player "Alex Another" has the order 20000

    Scenario: A competition rebuilt after the player was removed does not have them
      Given the archived tournament player "Sam Someone" was removed from it
      When the competition is rebuilt from its stream
      Then the competition does not have the tournament player "Sam Someone"

  Rule: A withdrawn player is removed too

    Scenario: Removing a withdrawn player records it
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then it has recorded 1 event
      And the first thing it recorded is a player being removed

    Scenario: A withdrawn player removed is not in the competition
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then the competition does not have the tournament player "Sam Someone"

  Rule: A player with games is not removed

    Scenario: Removing a player with games is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then it is refused for breaking "CompetitionPlayer.HasGames"

    Scenario: Removing a player whose only game is archived is refused
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then it is refused for breaking "CompetitionPlayer.HasGames"

    Scenario: A player refused is still in the competition
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then the competition has the tournament player "Sam Someone"

  Rule: A knockout with a game has its draw fixed

    Scenario: Removing a player with no games from a knockout with a game is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the game of "Alex Another" beating "Sam Someone" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the archived tournament player "Pat Player" is removed
      Then it is refused with "Competition.DrawFixed"

  Rule: A tournament player not in the competition records nothing

    Scenario: Removing a tournament player not in the competition records nothing
      Given the competition is rebuilt from its stream
      When the archived tournament player "Alex Another" is removed
      Then it has recorded 0 events

    Scenario: Removing a tournament player not in the competition is not refused
      Given the competition is rebuilt from its stream
      When the archived tournament player "Alex Another" is removed
      Then it is not refused

    Scenario: A tournament player already removed records nothing
      Given the player "Sam Someone" was removed from it
      And the competition is rebuilt from its stream
      When the archived tournament player "Sam Someone" is removed
      Then it has recorded 0 events
