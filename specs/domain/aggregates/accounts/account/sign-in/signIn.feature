Feature: Signing in to an account

  Signing in is recorded, and only for a confirmed account: one whose email
  address is not confirmed is refused, with `Account.NotConfirmed`, whoever
  asks. It has no password to have been given, so nobody reaches that refusal
  by signing in the ordinary way; it is there so that the account itself, and
  not only whatever asks it, says an unconfirmed account is not signed in to.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Signing in to a confirmed account is recorded, and an unconfirmed one is refused

    Scenario: Signing in to a confirmed account records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 1 event
      And the first thing it recorded is its signing in

    Scenario: Signing in to an unconfirmed account is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.NotConfirmed"

    Scenario: Signing in to an unconfirmed account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 0 events

  Rule: A forgotten account cannot be signed in to

    Scenario: A forgotten account cannot be signed in to
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.Forgotten"
