@postgres
Feature: Changing the limits a key carries

  A key carries limits of its own, a number of requests a minute and a day, so
  that one partner's can be raised without any code changing and without
  anybody else's changing with it. Only an administrator changes them: a key's
  maker is not the one to say how much of the site's work they may use.

  The key is named by its id, which the account's list carries, and is found
  wherever it is kept, since the administrator asking is not the account it
  belongs to.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's changing of the limits of API keys
    And the moment "2026-11-19T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ann Administrator"
    And "admin@example.com" has been given the role "administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And the account for "someone@example.com" has the key labelled "CroquetUniverse"

  Rule: An administrator changes the limits of one key

    Scenario: The limit a minute is changed
      When the administrator "admin@example.com" changes that key to 120 requests a minute and 20000 a day
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 120 requests a minute

    Scenario: The limit a day is changed
      When the administrator "admin@example.com" changes that key to 120 requests a minute and 20000 a day
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 20000 requests a day

    Scenario: Another key keeps its limits
      Given the account for "someone@example.com" has the key labelled "Inter-Counties"
      When the administrator "admin@example.com" changes the first key to 120 requests a minute and 20000 a day
      And the keys of the account for "someone@example.com" are listed
      Then the second key may make 60 requests a minute

    Scenario: The key as it is presented carries the new limits
      When the administrator "admin@example.com" changes that key to 120 requests a minute and 20000 a day
      And that key is presented
      Then the key may make 120 requests a minute

    Scenario: Changing the limits is recorded on the account
      When the administrator "admin@example.com" changes that key to 120 requests a minute and 20000 a day
      Then the last thing the account for "someone@example.com" recorded is the limits of a key being changed

  Rule: Limits that are what the key has records nothing

    Scenario: The same limits are not recorded
      When the administrator "admin@example.com" changes that key to 60 requests a minute and 10000 a day
      Then the account for "someone@example.com" has recorded no change of the limits of a key

  Rule: The limits must be whole numbers above nothing

    Scenario Outline: Limits that break a rule are refused for it
      When the administrator "admin@example.com" changes that key to <minute> requests a minute and <day> a day
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | minute | day   | code                    |
        | 0      | 10000 | ApiKeyLimits.NoneAMinute |
        | 60     | 0     | ApiKeyLimits.NoneADay    |

    Scenario: Limits that break a rule change nothing
      When the administrator "admin@example.com" changes that key to 0 requests a minute and 10000 a day
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 60 requests a minute

  Rule: Only an administrator changes them

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" changes that key to 120 requests a minute and 20000 a day
      Then it is refused with "Account.NotAnAdministrator"

    Scenario: A refused change leaves the limits as they were
      When the reader signed in to the account for "someone@example.com" changes that key to 120 requests a minute and 20000 a day
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 60 requests a minute

  Rule: Only a key that is there is changed

    Scenario: A key that was never made is not found
      When the administrator "admin@example.com" changes a key that was never made to 120 requests a minute and 20000 a day
      Then it is refused with "ChangeApiKeyLimits.NoSuchApiKey"
