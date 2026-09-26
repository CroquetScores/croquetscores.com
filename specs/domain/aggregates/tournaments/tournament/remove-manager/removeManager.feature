Feature: Taking an account off a tournament's managers

  A manager can take any manager off the tournament's managers, themselves
  among them, and the account taken off can then do nothing to the tournament
  that it could not do before it was made a manager.

  A tournament always has a manager, since nobody else can change it: one with
  none could never be changed again, and nobody could be made a manager of it
  either. So taking off the last manager is refused. Taking off an account
  that does not manage the tournament records nothing, because nothing
  happened.

  Only a manager can take a manager off (`onlyManagers.feature`). An archived
  tournament can only be restored (`restore.feature`), so taking a manager off
  one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: An account taken off the managers no longer manages the tournament

    Scenario: Taking a manager off records it
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers
      Then it has recorded 1 event
      And the first thing it recorded is a manager being taken off

    Scenario: An account taken off the managers no longer manages the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers
      Then the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" does not manage the tournament

    Scenario: A manager can take themselves off
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is taken off the managers
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" does not manage the tournament

    Scenario: A tournament rebuilt after a manager was taken off is not managed by them
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was taken off its managers
      When the tournament is rebuilt from the stream
      Then the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" does not manage the tournament

  Rule: A tournament always has a manager

    Scenario: Taking off the last manager is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is taken off the managers
      Then it is refused with "Tournament.LastManager"

    Scenario: The last manager refused being taken off still manages the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is taken off the managers
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" manages the tournament

  Rule: Taking off an account that does not manage the tournament records nothing

    Scenario: Taking off an account that does not manage records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers
      Then it has recorded 0 events

    Scenario: Taking off an account that does not manage is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers
      Then it is not refused

  Rule: A manager cannot be taken off an archived tournament

    Scenario: Taking a manager off an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And it was archived
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is taken off the managers
      Then it is refused with "Tournament.Archived"
