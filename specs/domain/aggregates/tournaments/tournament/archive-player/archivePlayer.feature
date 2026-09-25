Feature: Archiving a tournament's player

  A player can be archived: kept, with everything they are, but set aside, so
  that a player entered by mistake is out of the way. An archived player keeps
  their name, so no other player can be given it (`addPlayer.feature`), and
  can be restored (`restorePlayer.feature`), which is all that can be done to
  them until they are.

  A player who has played any games in the tournament cannot be archived,
  since the games would then be against somebody who is no longer there. The
  games are not the tournament's to know: they are played in its
  competitions. So whatever asks for a player to be archived says whether the
  player has played any, as it says which player.

  Archiving a player who is already archived records nothing, because nothing
  happened.

  An archived tournament can only be restored (`restore.feature`), so
  archiving a player in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A player who has played no games can be archived

    Scenario: Archiving a player records it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then it has recorded 1 event
      And the first thing it recorded is a player being archived

    Scenario: An archived player is archived
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then the tournament's player "Sam Someone" is archived

    Scenario: An archived player is still one of the tournament's players
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then the tournament has the player "Sam Someone"

    Scenario: A tournament rebuilt after a player was archived has the player archived
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      When the tournament is rebuilt from the stream
      Then the tournament's player "Sam Someone" is archived

  Rule: A player who has played games cannot be archived

    Scenario: Archiving a player who has played games is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played games
      When the player "Sam Someone" is archived
      Then it is refused with "Tournament.PlayerHasGames"

  Rule: Only a player there is can be archived

    Scenario: Archiving a player the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "tournament-player/123e4567-e89b-42d3-a456-426614174000" is archived by their id
      Then it is refused with "Tournament.NoSuchPlayer"

  Rule: Archiving an archived player records nothing

    Scenario: Archiving an archived player records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then it has recorded 0 events

    Scenario: Archiving an archived player is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then it is not refused

  Rule: A player in an archived tournament cannot be archived

    Scenario: Archiving a player in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" has played no games
      When the player "Sam Someone" is archived
      Then it is refused with "Tournament.Archived"
