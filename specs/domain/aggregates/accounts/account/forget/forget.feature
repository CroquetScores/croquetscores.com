Feature: Forgetting an account

  Forgetting is recorded as an event that holds nothing about the person,
  alongside deleting the account's key: the key makes what is kept of them
  unreadable, and the event is what tells every read model to stop finding the
  account by what it holds, such as the row it is found by. A forgotten account
  cannot be signed in to, confirmed, registered again, have its password
  hashed again or be given a new one, with `Account.Forgotten`; each of those
  refusals is specified with what it refuses. Its email address is free for a
  new account instead. An account is forgotten once: forgetting it again
  records nothing, so that whatever acts on its being forgotten acts once.

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
