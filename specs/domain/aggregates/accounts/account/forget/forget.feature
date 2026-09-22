Feature: Forgetting an account

  Forgetting is recorded as an event that holds nothing about the person,
  alongside deleting the account's key: the key makes what is kept of them
  unreadable, and the event is what tells every read model to stop finding the
  account by what it holds, such as the row it is found by. A forgotten account
  cannot be signed in to, confirmed, registered again, have its password
  hashed again or be given a new one, or have a role added or removed, with
  `Account.Forgotten`; each of those refusals is specified with what it
  refuses. Its email address is free for a new account instead. An account is
  forgotten once: forgetting it again records nothing, so that whatever acts
  on its being forgotten acts once.

  A forgotten account holds no role, whatever it held before. Nobody can sign
  in to it to use one, but whatever asks an account what it may do should not
  have to know that to get the right answer.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A forgotten account is recorded as forgotten, once

    Scenario: Forgetting records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 1 event
      And the first thing it recorded is its being forgotten

    Scenario: What forgetting recorded holds nothing about the person
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is forgotten
      Then what it recorded does not contain "Sam Someone"
      And what it recorded does not contain "someone@example.com"

    Scenario: Forgetting a forgotten account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 0 events

  Rule: A forgotten account holds no role

    Scenario Outline: Forgetting an account takes away its roles
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the account is forgotten
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |

    Scenario Outline: An account rebuilt after it was forgotten holds no role
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And it was forgotten
      When the account is rebuilt from the stream
      Then the account does not hold the role "<role>"

      Examples:
        | role                  |
        | Administrator         |
        | World Ranking Officer |
