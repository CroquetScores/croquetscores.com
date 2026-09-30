Feature: Making an account a scorer of a tournament

  A tournament's scorers enter the scores of its games: they can add, correct,
  archive and restore scores (`addGame.feature`, `correctGame.feature`,
  `archiveGame.feature`, `restoreGame.feature`), and nothing else. What a
  scorer cannot do is anything else to the tournament
  (`onlyManagers.feature`). A manager can make any account a scorer.

  A manager is not made a scorer: a manager can already do everything a scorer
  can, and a manager who wants to do less is taken off the managers
  (`removeManager.feature`) and made a scorer then. So making a manager a
  scorer is refused. Making a scorer of an account that already scores the
  tournament records nothing, because nothing happened.

  Only a manager can make a scorer. An archived tournament can only be
  restored (`restore.feature`), so making a scorer of one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: An account made a scorer scores the tournament

    Scenario: Making a scorer records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then it has recorded 1 event
      And the first thing it recorded is a scorer being made

    Scenario: An account made a scorer scores the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" scores the tournament

    Scenario: An account made a scorer does not manage the tournament
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" does not manage the tournament

    Scenario: A tournament rebuilt after a scorer was made is scored by them
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      When the tournament is rebuilt from the stream
      Then the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" scores the tournament

  Rule: A manager is not made a scorer

    Scenario: Making a manager a scorer is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the account "account/123e4567-e89b-42d3-a456-426614174000" is made a scorer
      Then it is refused with "Tournament.AlreadyAManager"

  Rule: Making a scorer of a scorer records nothing

    Scenario: Making a scorer of a scorer records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then it has recorded 0 events

    Scenario: Making a scorer of a scorer is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then it is not refused

  Rule: A scorer cannot be made in an archived tournament

    Scenario: Making a scorer in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" is made a scorer
      Then it is refused with "Tournament.Archived"
