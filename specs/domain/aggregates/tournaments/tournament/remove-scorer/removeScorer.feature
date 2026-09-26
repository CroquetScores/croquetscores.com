Feature: Taking an account off a tournament's scorers

  A manager can take any scorer off the tournament's scorers. Taking off an
  account that does not score the tournament records nothing, because nothing
  happened.

  Only a manager can take a scorer off (`onlyManagers.feature`). An archived
  tournament can only be restored (`restore.feature`), so taking a scorer off
  one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: An account taken off the scorers no longer scores the tournament

    Scenario: Taking a scorer off records it
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers
      Then it has recorded 1 event
      And the first thing it recorded is a scorer being taken off

    Scenario: An account taken off the scorers no longer scores the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" does not score the tournament

    Scenario: A tournament rebuilt after a scorer was taken off is not scored by them
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was taken off its scorers
      When the tournament is rebuilt from the stream
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" does not score the tournament

  Rule: Taking off an account that does not score the tournament records nothing

    Scenario: Taking off an account that does not score records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers
      Then it has recorded 0 events

    Scenario: Taking off an account that does not score is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers
      Then it is not refused

  Rule: A scorer cannot be taken off an archived tournament

    Scenario: Taking a scorer off an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And it was archived
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is taken off the scorers
      Then it is refused with "Tournament.Archived"
