@postgres
Feature: An administrator lists the keys that work, of every account

  An administrator changes the limits of one partner's key without any code
  changing (`ChangeApiKeyLimits.feature`), and to do that has to see which keys
  there are and whose. Each is listed with the name of the account it belongs
  to, what it is called, what it may do and the limits it carries, and never
  with the key itself, which the site does not keep.

  Only an administrator can ask, so that nobody else learns by asking which
  keys there are or whose. A key revoked works for nobody and is not listed,
  and neither are the keys of an account that has been forgotten.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's listing of every account's API keys
    And the moment "2026-11-19T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ann Administrator"
    And "admin@example.com" has been given the role "administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "another@example.com" has an account, confirmed, called "Alex Another"

  Rule: Only an administrator can list them

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" lists the keys of every account
      Then it is refused with "Account.NotAnAdministrator"

  Rule: Every key that works is listed with whose it is

    Scenario: A key is listed
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the administrator "admin@example.com" lists the keys of every account
      Then 1 key is listed of every account

    Scenario: A key is listed by its label
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the administrator "admin@example.com" lists the keys of every account
      Then the first key of every account is labelled "CroquetUniverse"

    Scenario: A key is listed with the name of its account
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the administrator "admin@example.com" lists the keys of every account
      Then the first key of every account belongs to "Sam Someone"

    Scenario: A key is listed with its limits a minute
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the administrator "admin@example.com" lists the keys of every account
      Then the first key of every account may make 60 requests a minute

    Scenario: A key is listed with its limits a day
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the administrator "admin@example.com" lists the keys of every account
      Then the first key of every account may make 10000 requests a day

    Scenario: A key whose limits were changed is listed with the new limits
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the administrator "admin@example.com" changes that key to 120 requests a minute and 20000 a day
      When the administrator "admin@example.com" lists the keys of every account
      Then the first key of every account may make 120 requests a minute

    Scenario: The keys of different accounts are listed in the order they were made
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "another@example.com" has the key labelled "Inter-Counties"
      When the administrator "admin@example.com" lists the keys of every account
      Then the second key of every account belongs to "Alex Another"

  Rule: A key that works for nobody is not listed

    Scenario: A key revoked is not listed
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the reader signed in to the account for "someone@example.com" revokes that key
      When the administrator "admin@example.com" lists the keys of every account
      Then 0 keys are listed of every account

    Scenario: The keys of an account forgotten are not listed
      Given the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "someone@example.com" has been forgotten
      When the administrator "admin@example.com" lists the keys of every account
      Then 0 keys are listed of every account
