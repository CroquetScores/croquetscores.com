@postgres
Feature: The accounts' read models keep when each row last changed

  Every read model keeps when each of its rows last changed, for possible
  future use (`TournamentReadModelsChangedAt.feature` is the tournaments').
  Nothing reads it yet. The moment is the `occurredAt` of the last event that
  changed the row, and never the moment the row was written, so that making the
  read model again from the events gives the moment the live projection did.

  An account's events are rewritten when it is forgotten
  (`AccountEventSealing.ts`), but only its name, its email address and its
  Google account, never when an event occurred, so a row's moment is the same
  after.

  A row's moment moves only when an event changes that row: what happens to
  another account's leaves it where it was.

  Background:
    Given the accounts by email address read model, with its key
    And the moment "2026-09-19T10:00:00Z"

  Rule: An account found by its email address

    Scenario: A registered account's row is as changed as its registering
      Given an account for "someone@example.com" is registered
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-19T10:00:00Z"

    Scenario: Confirming its address changes the row
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-20T10:00:00Z"
      When the account for "someone@example.com" confirms its address
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

    Scenario: Moving to another address changes the row
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-21T10:00:00Z"
      When the account for "someone@example.com" is moved to "sam@example.org"
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-21T10:00:00Z"

    Scenario: Forgetting the account changes the row
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-22T10:00:00Z"
      When the account for "someone@example.com" is forgotten
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-22T10:00:00Z"

    Scenario: Another account's change leaves the row where it was
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-20T10:00:00Z"
      And an account for "sam@example.org" is registered
      And the moment "2026-09-21T10:00:00Z"
      When the account for "sam@example.org" confirms its address
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-19T10:00:00Z"

    Scenario: Projecting its registering again leaves the moment as it was
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-20T10:00:00Z"
      And the account for "someone@example.com" confirms its address
      When its registering is projected again
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

    Scenario: Making the read model again gives the same moment
      Given an account for "someone@example.com" is registered
      And the moment "2026-09-20T10:00:00Z"
      And the account for "someone@example.com" confirms its address
      When the read model is rebuilt from the events
      Then the email address row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

  Rule: An account found by its Google account

    Scenario: Linking a Google account gives the row its moment
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" confirms its address
      And the moment "2026-09-20T10:00:00Z"
      When the account for "someone@example.com" has the Google account "subject-1" linked
      Then the Google account row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

  Rule: An account found by its role

    Scenario: Being given a role gives the row its moment
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" confirms its address
      And the moment "2026-09-20T10:00:00Z"
      When the account for "someone@example.com" is given the role "administrator"
      Then the role row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"

  Rule: An account found by its API key

    Scenario: Making a key gives the row its moment
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" confirms its address
      And the moment "2026-09-20T10:00:00Z"
      When the account for "someone@example.com" makes an API key
      Then the API key row of the account for "someone@example.com" was last changed at "2026-09-20T10:00:00Z"
