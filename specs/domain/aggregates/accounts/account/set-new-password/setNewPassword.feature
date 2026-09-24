Feature: Setting a new password on an account

  A reader who has forgotten their password is sent a link that sets a new one
  (`forgotPassword.feature`), and a reader signed in who knows the one they
  have can change it (`ChangePassword.feature`). The account records both the
  same way, since both are somebody choosing the password it is signed in
  with, and whether that somebody was entitled to is decided before the
  account is asked. What the account keeps of it is the new hash and the
  moment it was set, which is when somebody last chose the password the
  account is signed in with.

  An account that has not been confirmed is refused with
  `Account.NotConfirmed`: it has no password to replace, and giving it one
  here would let somebody who never showed they read mail at the address have
  an account at it. A forgotten account is refused with `Account.Forgotten`,
  as it is for everything else.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A new password replaces whatever hash the account had, and says when

    Scenario: Setting a new password records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it has recorded 1 event
      And the first thing it recorded is its password being set

    Scenario: What setting a new password recorded does not hold the password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the new password "correct horse battery staple" is set on the account
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: An account rebuilt after a new password was set has the new hash
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a new password was set on the account
      When the account is rebuilt from the stream
      Then the account's password hash is the one it was set with

    Scenario: An account rebuilt after a new password was set no longer has an imported password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And a new password was set on the account
      When the account is rebuilt from the stream
      Then the account's password is not imported

    Scenario: An account knows when its password was set
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a new password was set on the account at "2026-09-19T11:00:00Z"
      When the account is rebuilt from the stream
      Then the account's password was set at "2026-09-19T11:00:00Z"

    Scenario: An account knows when confirming gave it its password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone" at "2026-09-19T10:30:00Z"
      When the account is rebuilt from the stream
      Then the account's password was set at "2026-09-19T10:30:00Z"

    Scenario: Setting a new password on an account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it is refused with "Account.NotConfirmed"

    Scenario: Setting a new password on a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it is refused with "Account.Forgotten"
