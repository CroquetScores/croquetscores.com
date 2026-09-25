Feature: Changing what an account is called

  An account is called what it was confirmed as (`confirm.feature`), or what
  it was brought over as, until its owner changes it (`ChangeName.feature`).
  Changing it is recorded as an event that holds the new name, which is kept
  as the name the account was confirmed with is kept: it is about the person,
  and is made unreadable with everything else about them when the account is
  forgotten.

  A name the account has already records nothing, because nothing happened,
  and the account's history is what happened to it.

  An account that has not been confirmed is refused with
  `Account.NotConfirmed`: it has no name yet, and is given its first by
  confirming. A forgotten account is refused with `Account.Forgotten`, as it is
  for everything else.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A new name is recorded, and is what the account is called

    Scenario: Changing the name records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then it has recorded 1 event
      And the first thing it recorded is its name being changed

    Scenario: What changing the name recorded says the new name
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then its name being changed says the name "Samantha Someone"

    Scenario: The account is called the new name at once
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then the account is called "Samantha Someone"

    Scenario: An account rebuilt after its name was changed is called the new name
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And its name was changed to "Samantha Someone"
      When the account is rebuilt from the stream
      Then the account is called "Samantha Someone"

    Scenario: An account brought over changes the name it came with
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then the account is called "Samantha Someone"

    Scenario: Changing the name leaves the password as it was
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-the-password"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then the account's password hash is "hash-of-the-password"

  Rule: A name the account has already records nothing

    Scenario: The same name records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's name is changed to "Sam Someone"
      Then it has recorded 0 events

    Scenario: The same name is not refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's name is changed to "Sam Someone"
      Then it is not refused

  Rule: Only a confirmed account that has not been forgotten has a name to change

    Scenario: Changing the name of an account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then it is refused with "Account.NotConfirmed"

    Scenario: Changing the name of a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account's name is changed to "Samantha Someone"
      Then it is refused with "Account.Forgotten"
