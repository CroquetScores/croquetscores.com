@postgres
Feature: Signing in with Google

  Signing in with Google is asked for with what Google has said about the
  reader: the subject it knows them by, their email address, whether it has
  verified that address, and their name. What Google said has been checked to
  be Google's by the time it gets here; this is what the site does with it. It
  answers with the account signed in to, as signing in with a password does
  (`SignIn.feature`), and holding the session that follows is the web layer's.

  A Google account already linked to an account signs in to that account, and
  is found by its subject alone, whatever email address it carries now.

  One not yet linked is matched by its email address. This is the decision
  `SETUP.md` §7.6 asks to be made in the open, and it is made this way: an
  email address Google has verified belongs to the reader as surely as one
  they followed a link from, which is all confirming an address or setting a
  new password asks of them. So an account at that address is linked to the
  Google account and signed in to, keeping the name and the password it had.
  An account at that address not yet confirmed is confirmed by it, called
  what Google calls the reader. An address Google has not verified proves
  nothing, and is refused before anything is looked up. An account already
  linked to another Google account is refused rather than linked again or
  taken over (`linkGoogleAccount.feature`).

  An address with no account gets one, confirmed, called what Google calls
  the reader, and linked. It is given a password of 50 characters made at
  random and told to nobody, since an account has a password and nobody
  should be able to guess this one; a reader who wants to sign in without
  Google sets their own by the way back in (`forgotPassword.feature`). An
  account that has been forgotten is not there to be found, so its address
  gets a new account, as registering it again would.

  An account is called something, and a reader who registers with Google is
  called what Google calls them. Google does not always say, and where it
  does not and a name is needed — for a new account, or one being confirmed —
  the reader is refused rather than given a name they did not choose. Where
  the account already has a name, Google's is not needed and not asked for.

  These scenarios run against Postgres, with the application's event store and
  read models, and a password hasher.

  Background:
    Given the application's signing in with Google
    And the moment "2026-09-19T10:00:00Z"

  Rule: A Google account already linked signs in to its account

    Scenario: A linked Google account signs in to its account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: A linked Google account is found whatever email address it now carries
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "sam@example.org"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: Signing in with Google is recorded on the account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the last thing the account for "someone@example.com" recorded is its signing in

  Rule: A Google account not yet linked is linked to the account at its verified email address

    Scenario: The account at the email address is signed in to
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The account at the email address is linked to the Google account
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is linked to the Google account "google-subject-1"

    Scenario: The email address is found in any case
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "Someone@Example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The account keeps the name it had
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Samantha Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The account keeps the password it had
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And signing in with Google has been sent
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: An account not yet confirmed is confirmed
      Given "someone@example.com" has an account, not confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is confirmed

    Scenario: An account not yet confirmed is called what Google calls the reader
      Given "someone@example.com" has an account, not confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: An account not yet confirmed is linked to the Google account
      Given "someone@example.com" has an account, not confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is linked to the Google account "google-subject-1"

  Rule: An email address Google has not verified is refused

    Scenario: An unverified email address with an account is refused
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has not verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is refused with "SignInWithGoogle.EmailAddressNotVerified"

    Scenario: An unverified email address links nothing
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has not verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is linked to no Google account

    Scenario: An unverified email address with no account makes none
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has not verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then "someone@example.com" has no account

  Rule: An account linked to another Google account is not linked again

    Scenario: A second Google account for the same email address is refused
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-2"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is refused with "SignInWithGoogle.LinkedToAnother"

    Scenario: The first Google account stays linked
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-2"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is linked to the Google account "google-subject-1"

  Rule: A Google account that gives no name is refused where a name is needed

    Scenario: No name with no account is refused
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      When signing in with Google is sent
      Then it is refused with "SignInWithGoogle.NameMissing"

    Scenario: No name with no account makes none
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      When signing in with Google is sent
      Then "someone@example.com" has no account

    Scenario: No name for an account not yet confirmed is refused
      Given "someone@example.com" has an account, not confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      When signing in with Google is sent
      Then it is refused with "SignInWithGoogle.NameMissing"

    Scenario: No name leaves an account not yet confirmed as it was
      Given "someone@example.com" has an account, not confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      When signing in with Google is sent
      Then the account for "someone@example.com" is not confirmed

    Scenario: No name for a confirmed account signs in to it
      Given "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

  Rule: An email address with no account gets one

    Scenario: The reader is signed in to a new account
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The new account is confirmed
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is confirmed

    Scenario: The new account is called what Google calls the reader
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The new account is linked to the Google account
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the account for "someone@example.com" is linked to the Google account "google-subject-1"

    Scenario: The new account is given a password of 50 characters
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then the password the new account was given is 50 characters long

    Scenario: Two new accounts are given different passwords
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And signing in with Google has been sent
      And Google knows the reader as "google-subject-2"
      And Google gives the email address "somebody@example.com"
      And Google has verified the email address
      And Google calls the reader "Sasha Somebody"
      When signing in with Google is sent
      Then the two new accounts were given different passwords

    Scenario: Nothing is emailed about the new account
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then nothing is queued to be sent

    Scenario: A forgotten account's email address gets a new account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" has been forgotten
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with a new account for "someone@example.com"

    Scenario: A Google account linked to a forgotten account gets a new account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And the account for "someone@example.com" has been forgotten
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When signing in with Google is sent
      Then it is answered with a new account for "someone@example.com"

  Rule: A second signing in that looked before the first had linked signs in too

    Two first signings in with the same Google account can arrive together, as
    a double click sends them. Both look for the Google account before either
    has linked it, and neither finds it. The first links it to the account at
    its email address, making the account if there was none. The second then
    finds that account linked to the Google account it is signing in with,
    which is not another Google account, so it signs in rather than being
    refused.

    Scenario: A second signing in that looked too early is answered with the account
      Given Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And signing in with Google has been sent
      And the next signing in with Google looks for its Google account before it is linked
      When signing in with Google is sent
      Then it is answered with the account for "someone@example.com"
