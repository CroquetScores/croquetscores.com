Feature: Making an account a manager of a tournament

  A tournament is run by its managers. A manager can do everything that can
  be done to it: change what it is, archive and restore it, and add, change,
  archive and restore its players and competitions, as well as everything a
  scorer can. Whoever creates a tournament is its first manager
  (`create.feature`), and a manager can make any other account one too.

  An account is named by its id. Whether it is an account that can sign in is
  not the tournament's to know, and is asked by whatever asks for it to be
  made a manager.

  A scorer made a manager is no longer a scorer: a manager can do everything
  a scorer can, and holding both would leave a manager who is taken off the
  managers still able to score, which nobody asked for. Making a manager of an
  account that already manages the tournament records nothing, because
  nothing happened.

  Only a manager can make another (`onlyManagers.feature`). An archived
  tournament can only be restored (`restore.feature`), so making a manager of
  one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: An account made a manager manages the tournament

    Scenario: Making a manager records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is made a manager
      Then it has recorded 1 event
      And the first thing it recorded is a manager being made

    Scenario: An account made a manager manages the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is made a manager
      Then the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" manages the tournament

    Scenario: The managers there were still manage the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is made a manager
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" manages the tournament

    Scenario: A tournament rebuilt after a manager was made is managed by them
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      When the tournament is rebuilt from the stream
      Then the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" manages the tournament

  Rule: A scorer made a manager is no longer a scorer

    Scenario: A scorer made a manager manages the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a manager
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" manages the tournament

    Scenario: A scorer made a manager no longer scores the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a manager
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" does not score the tournament

  Rule: Making a manager of a manager records nothing

    Scenario: Making a manager of a manager records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is made a manager
      Then it has recorded 0 events

    Scenario: Making a manager of a manager is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is made a manager
      Then it is not refused

  Rule: A manager cannot be made in an archived tournament

    Scenario: Making a manager in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is made a manager
      Then it is refused with "Tournament.Archived"
