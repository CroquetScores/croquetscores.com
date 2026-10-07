Feature: Who an account asks as

  Whatever asks for something to be done is known by the id of the account
  asking, and that is what every event records as its cause. An account that
  holds the Administrator role (`addRole.feature`) asks as an administrator:
  the same id, known to be an administrator's, so that what it asks of a
  tournament is let through as a manager's would be (`onlyManagers.feature`)
  without the tournament having to know anything of anybody's roles. An
  account asks as an administrator only while it holds the role: one never
  given it, and one it was taken from, asks as itself and nothing more, and
  so does a forgotten account, whatever it held. Holding the World Ranking
  Officer role says nothing about it.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"
    And a stream where an account was registered at "someone@example.com"
    And its email address was confirmed as "Sam Someone"

  Rule: An account asks as an administrator while it holds the role

    Scenario: An account given the Administrator role asks as an administrator
      Given the role "Administrator" was added to it
      When the account is rebuilt from the stream
      Then the account asks as an administrator

    Scenario: An account never given the role does not ask as an administrator
      When the account is rebuilt from the stream
      Then the account does not ask as an administrator

    Scenario: An account the role was taken from does not ask as an administrator
      Given the role "Administrator" was added to it
      And the role "Administrator" was removed from it
      When the account is rebuilt from the stream
      Then the account does not ask as an administrator

    Scenario: A forgotten account does not ask as an administrator
      Given the role "Administrator" was added to it
      And it was forgotten
      When the account is rebuilt from the stream
      Then the account does not ask as an administrator

    Scenario: An account holding only the World Ranking Officer role does not ask as an administrator
      Given the role "World Ranking Officer" was added to it
      When the account is rebuilt from the stream
      Then the account does not ask as an administrator

  Rule: An account asks as itself, whatever it holds

    Scenario: An administrator asks by its own id
      Given the role "Administrator" was added to it
      When the account is rebuilt from the stream
      Then the account asks as "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: An account that is no administrator asks by its own id
      When the account is rebuilt from the stream
      Then the account asks as "account/123e4567-e89b-42d3-a456-426614174000"
