Feature: Linking a Google account to an account

  An account can be linked to a Google account, so that signing in with Google
  signs in to it. It is linked by the subject Google knows that account by,
  which never changes and is never given to another Google account, and not
  by the email address, which can change hands where a subject cannot
  (`SETUP.md` §7.6). Whether a Google sign-in should be linked to an account
  at all is the application's to decide (`SignInWithGoogle.feature`); this is
  what linking does once it has been decided.

  Linking is an event of its own, stamped with the moment it was asked for,
  and says the subject. An account is linked to one Google account: linking it
  again to the same one records nothing, and linking it to another is refused,
  so that a second Google account cannot be added to somebody's account by
  whoever holds its email address for a while.

  Only a confirmed account is linked. An account whose address has not been
  confirmed has nobody behind it yet, and one that has been forgotten has
  nobody behind it any more. A forgotten account is linked to nothing, so that
  signing in with the Google account it had cannot find it.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Linking records the Google account, once

    Scenario: Linking records that a Google account was linked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then it has recorded 1 event
      And the first thing it recorded is a Google account being linked

    Scenario: What linking recorded says the subject
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then its Google account being linked says the subject "google-subject-1"

    Scenario: A linked account is linked to that Google account
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then the account is linked to the Google account "google-subject-1"

    Scenario: An account rebuilt from its stream is linked as linking left it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      When the account is rebuilt from the stream
      Then the account is linked to the Google account "google-subject-1"

    Scenario: An account never linked is linked to no Google account
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is linked to no Google account

    Scenario: Linking the same Google account again records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then it has recorded 0 events

  Rule: An account is linked to one Google account

    Scenario: Linking another Google account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Google account "google-subject-2" is linked to the account
      Then it is refused with "Account.GoogleAccountAlreadyLinked"

    Scenario: A refused linking leaves the first Google account linked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Google account "google-subject-2" is linked to the account
      Then the account is linked to the Google account "google-subject-1"

  Rule: Only a confirmed account that is not forgotten is linked

    Scenario: An account not yet confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then it is refused with "Account.NotConfirmed"

    Scenario: A forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then it is refused with "Account.Forgotten"

    Scenario: Forgetting an account unlinks its Google account
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And it was forgotten
      When the account is rebuilt from the stream
      Then the account is linked to no Google account
