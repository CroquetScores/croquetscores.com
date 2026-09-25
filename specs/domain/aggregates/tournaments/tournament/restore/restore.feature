Feature: Restoring an archived tournament

  An archived tournament (`archive.feature`) can be restored, and is then as
  it was before it was archived: everything it had, it still has, and
  everything that could be done to it can be done again.

  Restoring a tournament that is not archived records nothing, because
  nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Restoring is recorded, and the tournament is no longer archived

    Scenario: Restoring records it
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the tournament is restored
      Then it has recorded 1 event
      And the first thing it recorded is its restoring

    Scenario: A restored tournament is not archived
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the tournament is restored
      Then the tournament is not archived

    Scenario: A tournament rebuilt after it was restored is not archived
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And it was restored
      When the tournament is rebuilt from the stream
      Then the tournament is not archived

    Scenario: A restored tournament can be updated again
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And it was restored
      And the tournament is rebuilt from the stream
      And the update calls it "Spring Open Championship"
      When the tournament is updated
      Then the tournament is called "Spring Open Championship"

  Rule: Restoring a tournament that is not archived records nothing

    Scenario: Restoring a tournament that is not archived records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the tournament is restored
      Then it has recorded 0 events

    Scenario: Restoring a tournament that is not archived is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the tournament is restored
      Then it is not refused
