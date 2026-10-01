Feature: Restoring an archived player in a tournament's team

  An archived player in a team (`archiveTeamPlayer.feature`) can be restored,
  and is then as they were before they were archived. Their name was kept for
  them, so nobody else in the team can have it. They keep the order they were
  given when they were archived, so they come back after the team's players
  who stayed in use, as a tournament's player does (`restorePlayer.feature`).

  Restoring a player who is not archived records nothing, because nothing
  happened.

  An archived team or tournament can only be restored, so restoring a player
  in one is refused: the team, or the tournament, is restored first.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the player "Sam Someone" was added to the team "Australia"

  Rule: Restoring a player in a team is recorded, and the player is no longer archived

    Scenario: Restoring a player in a team records it
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then it has recorded 1 event
      And the first thing it recorded is a player in a team being restored

    Scenario: A restored player in a team is not archived
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then the team "Australia"'s player "Sam Someone" is not archived

    Scenario: A tournament rebuilt after a player in a team was restored has the player not archived
      Given the player "Sam Someone" of the team "Australia" was archived
      And the player "Sam Someone" of the team "Australia" was restored
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s player "Sam Someone" is not archived

    Scenario: A restored player keeps the order they were given when archived
      Given the player "Alex Another" was added to the team "Australia"
      And the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then the player "Sam Someone" of the team "Australia" has the order 30000

    Scenario: A restored player comes after those that stayed in use
      Given the player "Alex Another" was added to the team "Australia"
      And the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then the team "Australia"'s first player is "Alex Another"

  Rule: Only a player there is, in a team there is, can be restored

    Scenario: Restoring a player in a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "team/123e4567-e89b-42d3-a456-426614174000" is restored by their ids
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Restoring a player the team does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "Australia" is restored by their id
      Then it is refused with "Team.NoSuchPlayer"

  Rule: Restoring a player who is not archived records nothing

    Scenario: Restoring a player in a team who is not archived records nothing
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then it has recorded 0 events

    Scenario: Restoring a player in a team who is not archived is not refused
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then it is not refused

  Rule: A player in an archived team or tournament cannot be restored

    Scenario: Restoring a player in an archived team is refused
      Given the player "Sam Someone" of the team "Australia" was archived
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then it is refused for breaking "Team.Archived"

    Scenario: Restoring a player in a team in an archived tournament is refused
      Given the player "Sam Someone" of the team "Australia" was archived
      And it was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is restored
      Then it is refused with "Tournament.Archived"
