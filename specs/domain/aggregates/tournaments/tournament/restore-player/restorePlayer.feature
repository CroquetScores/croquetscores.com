Feature: Restoring a tournament's archived player

  An archived player (`archivePlayer.feature`) can be restored, and is then as
  they were before they were archived, in the same place in the list of
  players. Their name was kept for them while they were archived, so nobody
  else can have it.

  Restoring a player who is not archived records nothing, because nothing
  happened.

  An archived tournament can only be restored (`restore.feature`), so
  restoring a player in one is refused: the tournament is restored first.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Restoring a player is recorded, and the player is no longer archived

    Scenario: Restoring a player records it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then it has recorded 1 event
      And the first thing it recorded is a player being restored

    Scenario: A restored player is not archived
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then the tournament's player "Sam Someone" is not archived

    Scenario: A tournament rebuilt after a player was restored has the player not archived
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the player "Sam Someone" was restored
      When the tournament is rebuilt from the stream
      Then the tournament's player "Sam Someone" is not archived

    Scenario: A restored player keeps their place in the list
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then the tournament's first player is "Sam Someone"

  Rule: Only a player there is can be restored

    Scenario: Restoring a player the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "tournament-player/123e4567-e89b-42d3-a456-426614174000" is restored by their id
      Then it is refused with "Tournament.NoSuchPlayer"

  Rule: Restoring a player who is not archived records nothing

    Scenario: Restoring a player who is not archived records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then it has recorded 0 events

    Scenario: Restoring a player who is not archived is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then it is not refused

  Rule: A player in an archived tournament cannot be restored

    Scenario: Restoring a player in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And it was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is restored
      Then it is refused with "Tournament.Archived"
