Feature: Moving an account to another email address

  An account is at the email address it was registered or brought over at,
  until its owner moves it (`ChangeEmailAddress.feature`). Moving it is
  recorded as an event that holds the new address, kept as the address it was
  registered at is kept, and the new address's hash, carried in the event as
  registering carries it, so that whatever finds an account by its address
  can follow it without the account's key (`AccountsByEmailAddress.feature`).
  The hash is made by whoever moves the account and handed in, as it is when
  an account is registered: the account does not hold the key it is made
  with.

  Moving changes the address and nothing else. The account keeps its name, its
  password, its roles and any Google account linked to it, because the account
  is who it was, reached somewhere else.

  The address the account has already, however it is written, records
  nothing, because nothing happened.

  An account that has not been confirmed is refused with
  `Account.NotConfirmed`: its address is the one thing about it that has not
  been shown to be anybody's, and moving it before it has been would let the
  account be made at one address and kept at another nobody has shown they
  read. A forgotten account is refused with `Account.Forgotten`, as it is for
  everything else.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A new address is recorded, and is where the account is

    Scenario: Moving records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then it has recorded 1 event
      And the first thing it recorded is its email address being changed

    Scenario: What moving recorded says the new address's hash
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then its email address being changed says the email address hash "hash-of-sam"

    Scenario: The account is at the new address at once
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then the account is reached at "sam@example.org"

    Scenario: An account rebuilt after it was moved is at the new address
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account is reached at "sam@example.org"

    Scenario: An account brought over is moved the same way
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then the account is reached at "sam@example.org"

  Rule: Moving changes the address and nothing else

    Scenario: A moved account keeps its name
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account is called "Sam Someone"

    Scenario: A moved account keeps its password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-the-password"
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account's password hash is "hash-of-the-password"

    Scenario: A moved account keeps its roles
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "Administrator" was added to it
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account holds the role "Administrator"

    Scenario: A moved account keeps the Google account linked to it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account is linked to the Google account "google-subject-1"

    Scenario: A moved account is still confirmed
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was moved to "sam@example.org"
      When the account is rebuilt from the stream
      Then the account is confirmed

  Rule: The address the account has already records nothing

    Scenario Outline: The same address records nothing, however it is written
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is moved to "<address>" with the email address hash "hash-of-someone"
      Then it has recorded 0 events

      Examples:
        | address             |
        | someone@example.com |
        | Someone@Example.COM |

  Rule: Only a confirmed account that has not been forgotten can be moved

    Scenario: Moving an account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then it is refused with "Account.NotConfirmed"

    Scenario: Moving a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is moved to "sam@example.org" with the email address hash "hash-of-sam"
      Then it is refused with "Account.Forgotten"
