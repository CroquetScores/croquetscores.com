Feature: Archiving a tournament

  A tournament can be archived: kept, with everything it is, but set aside,
  so that one created by mistake, or never played, is out of the way. Nothing
  is taken from it, and it is found at the addresses it was found at before,
  so it can be restored as it was (`restore.feature`).

  An archived tournament can only be restored. Everything else that could be
  done to it is refused with `Tournament.Archived`, and each thing that is
  refused says so where it is specified.

  Archiving a tournament that is already archived records nothing, because
  nothing happened. Two people doing the same thing at once, or a form sent
  twice, is not a mistake worth refusing.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Archiving is recorded, and the tournament is archived

    Scenario: Archiving records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then it has recorded 1 event
      And the first thing it recorded is its archiving

    Scenario: An archived tournament is archived
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then the tournament is archived

    Scenario: A tournament rebuilt after it was archived is archived
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      When the tournament is rebuilt from the stream
      Then the tournament is archived

    Scenario: An archived tournament keeps its name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then the tournament is called "Spring Open"

    Scenario: An archived tournament is found where it was
      Given a stream where a tournament was created at "2026/ac/spring-open"
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: An archived tournament keeps its players
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then the tournament has the player "Sam Someone"

  Rule: Archiving an archived tournament records nothing

    Scenario: Archiving an archived tournament records nothing
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then it has recorded 0 events

    Scenario: Archiving an archived tournament is not refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When somebody archives the tournament
      Then it is not refused
