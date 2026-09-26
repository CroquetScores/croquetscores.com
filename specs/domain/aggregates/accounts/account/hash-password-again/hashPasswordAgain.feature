Feature: Hashing an account's password again

  A password's hash is made again when a better way of making it is to hand,
  which for an account brought over from the old site is the first time it
  signs in. That is an event of its own, holding the new hash, so that
  rebuilding the account from its stream gives the hash it has now.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A password hashed again keeps its new hash

    Scenario: Hashing a password again records it
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 1 event
      And the first thing it recorded is its password being hashed again

    Scenario: What it recorded holds the new hash, and not the password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When its password "correct horse battery staple" is hashed again
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: An account rebuilt after its password was hashed again has the new hash
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And its password was hashed again
      When the account is rebuilt from the stream
      Then the account's password hash is the one it was hashed again with

  Rule: A forgotten account's password cannot be hashed again

    A new hash would be something new kept of the person after forgetting was
    to have kept nothing more (`forget.feature`).

    Scenario: A forgotten account's password cannot be hashed again
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account's password hashed again records nothing
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 0 events
