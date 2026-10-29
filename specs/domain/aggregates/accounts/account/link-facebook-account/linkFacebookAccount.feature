Feature: Linking a Facebook account to an account

  An account can be linked to a Facebook account, so that signing in with
  Facebook signs in to it. It is linked by the id Facebook knows that account
  by, which is the same for the same person every time they sign in to this
  site and is never given to another Facebook account, and not by the email
  address, which can change hands where an id cannot (`SETUP.md` §7.6). The id
  is Facebook's own for this site and is not the one another site would be
  given for the same person, which is of no concern here. Whether a Facebook
  sign-in should be linked to an account at all is the application's to decide
  (`SignInWithFacebook.feature`); this is what linking does once it has been
  decided.

  Linking is an event of its own, stamped with the moment it was asked for,
  and says the id. An account is linked to one Facebook account: linking it
  again to the same one records nothing, and linking it to another is refused,
  so that a second Facebook account cannot be added to somebody's account by
  whoever holds its email address for a while.

  Linking to Facebook is apart from linking to Google
  (`linkGoogleAccount.feature`). An account may be linked to one of each, and
  neither stands in the way of the other.

  Only a confirmed account is linked. An account whose address has not been
  confirmed has nobody behind it yet, and one that has been forgotten has
  nobody behind it any more. Signing in with the Facebook account a forgotten
  account had does not find it, and gets a new account instead
  (`SignInWithFacebook.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Linking records the Facebook account, once

    Scenario: Linking records that a Facebook account was linked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it has recorded 1 event
      And the first thing it recorded is a Facebook account being linked

    Scenario: What linking recorded says the id
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then its Facebook account being linked says the id "facebook-id-1"

    Scenario: A linked account is linked to that Facebook account
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then the account is linked to the Facebook account "facebook-id-1"

    Scenario: An account rebuilt from its stream is linked as linking left it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      When the account is rebuilt from the stream
      Then the account is linked to the Facebook account "facebook-id-1"

    Scenario: An account never linked is linked to no Facebook account
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is linked to no Facebook account

    Scenario: Linking the same Facebook account again records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it has recorded 0 events

    Scenario: Linking the same Facebook account again is not refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it is not refused

  Rule: An account is linked to one Facebook account

    Scenario: Linking another Facebook account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-2" is linked to the account
      Then it is refused with "Account.FacebookAccountAlreadyLinked"

    Scenario: A refused linking leaves the first Facebook account linked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-2" is linked to the account
      Then the account is linked to the Facebook account "facebook-id-1"

  Rule: Linking to Facebook and linking to Google are apart

    Scenario: An account linked to Google can be linked to Facebook
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it is not refused

    Scenario: An account linked to Google is linked to Facebook as well
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then the account is linked to the Facebook account "facebook-id-1"

    Scenario: Linking to Facebook leaves the Google account linked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Google account "google-subject-1" was linked to it
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then the account is linked to the Google account "google-subject-1"

    Scenario: An account linked to Facebook can be linked to Google
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the Facebook account "facebook-id-1" was linked to it
      And the account is rebuilt from the stream
      When the Google account "google-subject-1" is linked to the account
      Then it is not refused

  Rule: Only a confirmed account that is not forgotten is linked

    Scenario: An account not yet confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it is refused with "Account.NotConfirmed"

    Scenario: A forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the Facebook account "facebook-id-1" is linked to the account
      Then it is refused with "Account.Forgotten"
