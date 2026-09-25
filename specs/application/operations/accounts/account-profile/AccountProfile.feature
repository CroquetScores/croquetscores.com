@postgres
Feature: What an account is called, and where it is reached

  The account's own pages show a reader signed in what their account is
  called and the email address it is reached at: the profile shows both, and
  changing the name starts from the name the account has now. This is how
  they ask. It is asked for the account the reader is signed in to, which is
  the web layer's to say, from the session, and it changes nothing.

  It answers with the name and the address as the account has them now, after
  every change made to them, and with whether the account has a password. An
  account made by signing in with Google has none (`SignInWithGoogle.feature`),
  and the pages that ask for the password the account has now are neither
  offered to it nor there for it (`profile.feature`, `accountMenu.feature`). An account with nothing to show answers with
  nothing: one that has been forgotten, whose name and address are gone, and
  one that has never been confirmed, which has no name yet and cannot be signed
  in to. The pages treat an answer of nothing as nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's finding of profiles
    And the moment "2026-09-19T10:00:00Z"

  Rule: An account is answered with what it is called and where it is reached

    Scenario: The profile says what the account is called
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the profile of the account for "someone@example.com" is asked for
      Then the profile says the name "Sam Someone"

    Scenario: The profile says where the account is reached
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the profile of the account for "someone@example.com" is asked for
      Then the profile says the email address "someone@example.com"

    Scenario: The profile says the name the account was changed to
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the reader signed in to the account for "someone@example.com" changes its name to "Samantha Someone"
      When the profile of the account for "someone@example.com" is asked for
      Then the profile says the name "Samantha Someone"

  Rule: The profile says whether the account has a password

    Scenario: The profile says an account with a password has one
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When the profile of the account for "someone@example.com" is asked for
      Then the profile says the account has a password

    Scenario: The profile says an account with no password has none
      Given "someone@example.com" has an account, confirmed, with no password
      When the profile of the account for "someone@example.com" is asked for
      Then the profile says the account has no password

  Rule: An account with nothing to show is answered with nothing

    Scenario: A forgotten account has no profile
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the profile of that account is asked for
      Then there is no profile

    Scenario: An account not yet confirmed has no profile
      Given "someone@example.com" has an account, not confirmed
      When the profile of the account for "someone@example.com" is asked for
      Then there is no profile
