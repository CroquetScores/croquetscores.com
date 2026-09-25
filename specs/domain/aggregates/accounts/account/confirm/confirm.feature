Feature: Confirming an account's email address

  Confirming is an event of its own, stamped with the moment it was asked for
  like every other, and says the name the account is called and the hash of
  the password it is signed in to with. The password is never part of it: only
  its hash is. An account confirmed by signing in with Google is confirmed
  with no password at all (`SignInWithGoogle.feature`), and has none until
  somebody sets one. An account is confirmed once: confirming it again records
  nothing and changes neither, so that a link followed twice leaves one event
  and not two, and a link left in an inbox is not a way to take over an
  account that has since been confirmed.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Confirming gives an account its name, and its password if it has one, once

    Scenario: Confirming records that the email address was confirmed
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then it has recorded 1 event
      And the first thing it recorded is its email address being confirmed

    Scenario: A confirmed account is confirmed
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then the account is confirmed

    Scenario: A confirmed account is called what it was confirmed as
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then the account is called "Sam Someone"

    Scenario: A confirmed account has the password hash it was confirmed with
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password hash "hash-of-a-password"
      Then the account's password hash is "hash-of-a-password"

    Scenario: An account confirmed with no password is confirmed
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with no password
      Then the account is confirmed

    Scenario: An account confirmed with no password has no password hash
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with no password
      Then the account has no password hash

    Scenario: What confirming recorded does not hold the password
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password "correct horse battery staple"
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: Confirming a confirmed account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Somebody Else"
      Then it has recorded 0 events

    Scenario: Confirming a confirmed account does not rename it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Somebody Else"
      Then the account is called "Sam Someone"

    Scenario: Confirming a confirmed account does not change its password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-a-password"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password hash "hash-of-another"
      Then the account's password hash is "hash-of-a-password"

    Scenario: An account rebuilt from its confirming is confirmed
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is confirmed

    Scenario: An account rebuilt from its confirming is called what it was confirmed as
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is called "Sam Someone"

    Scenario: An account rebuilt from its confirming has the password hash it was confirmed with
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-a-password"
      When the account is rebuilt from the stream
      Then the account's password hash is "hash-of-a-password"

    Scenario: An account rebuilt from its confirming with no password has no password hash
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with no password
      When the account is rebuilt from the stream
      Then the account has no password hash

  Rule: A forgotten account cannot be confirmed

    Scenario: A forgotten account cannot be confirmed
      Given a stream where an account was registered at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then it is refused with "Account.Forgotten"
