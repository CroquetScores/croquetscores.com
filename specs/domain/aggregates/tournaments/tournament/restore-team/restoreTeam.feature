Feature: Restoring a tournament's archived team

  An archived team (`archiveTeam.feature`) can be restored, and is then as it
  was before it was archived, with every one of its players. Its name and its
  short name were kept for it while it was archived, so nobody else can have
  them. It keeps the order it was given when it was archived, so it comes
  back after the teams that stayed in use, as a restored player does
  (`restorePlayer.feature`).

  Restoring a team that is not archived records nothing, because nothing
  happened.

  An archived tournament can only be restored (`restore.feature`), so
  restoring a team in one is refused: the tournament is restored first.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Restoring a team is recorded, and the team is no longer archived

    Scenario: Restoring a team records it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then it has recorded 1 event
      And the first thing it recorded is a team being restored

    Scenario: A restored team is not archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then the tournament's team "Australia" is not archived

    Scenario: A restored team has its players
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the player "Sam Someone" was added to the team "Australia"
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then the tournament's team "Australia" has the player "Sam Someone"

    Scenario: A tournament rebuilt after a team was restored has the team not archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the team "Australia" was restored
      When the tournament is rebuilt from the stream
      Then the tournament's team "Australia" is not archived

    Scenario: A restored team keeps the order it was given when archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then the tournament's team "Australia" has the order 30000

    Scenario: A restored team comes after those that stayed in use
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then the tournament's first team is "England"

  Rule: Only a team there is can be restored

    Scenario: Restoring a team the tournament does not have is refused
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "team/123e4567-e89b-42d3-a456-426614174000" is restored by its id
      Then it is refused with "Tournament.NoSuchTeam"

  Rule: Restoring a team that is not archived records nothing

    Scenario: Restoring a team that is not archived records nothing
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then it has recorded 0 events

    Scenario: Restoring a team that is not archived is not refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then it is not refused

  Rule: A team in an archived tournament cannot be restored

    Scenario: Restoring a team in an archived tournament is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And it was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is restored
      Then it is refused with "Tournament.Archived"
