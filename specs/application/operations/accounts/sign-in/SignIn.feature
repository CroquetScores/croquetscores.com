@postgres
Feature: Signing in with an email address and a password

  Signing in is asked for with an email address and a password, by nobody
  signed in, and answers with the account signed in to. Holding the session
  that follows is the web layer's; this says only whose it is.

  A wrong password, an address with no account, and an account that has been
  forgotten are refused alike, with `SignIn.Failed`, and take as long: the
  password is checked against a hash whether or not the address has an account,
  since checking is slow on purpose and an answer that came back sooner for an
  address with none would say so.

  Nothing is said here about an account whose email address is not confirmed,
  because no such account has a password to be given: an account is given its
  password by whoever confirms its address (`ConfirmEmailAddress.feature`), so
  an unconfirmed one refuses every password alike, as an address with no
  account does. `Account.NotConfirmed` stays the account's own refusal, for
  whatever reaches it another way.

  Signing in is recorded on the account, as an event of its own. And an
  account imported from the old site has its password hashed again today's way
  the first time it signs in, since that is the first time the password is to
  hand; from then on it is an account like any other.

  These scenarios run against Postgres, with the application's event store and
  read models, and a password hasher.

  Background:
    Given the application's signing in
    And the moment "2026-09-19T10:00:00Z"

  Rule: The right password for a confirmed account signs in to it

    Scenario: The right password signs in to the account
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The email address is found in any case
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When signing in as "Someone@Example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: Signing in is recorded on the account
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then the last thing the account for "someone@example.com" recorded is its signing in

  Rule: A wrong password and an unknown email address are refused alike

    Scenario: A wrong password is refused
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "not the right password" is sent
      Then it is refused with "SignIn.Failed"

    Scenario: An email address with no account is refused the same
      When signing in as "nobody@example.com" with the password "correct horse battery staple" is sent
      Then it is refused with "SignIn.Failed"

    Scenario: A password is checked for an email address with no account
      When signing in as "nobody@example.com" with the password "correct horse battery staple" is sent
      Then a password was checked against a hash

    Scenario: A refused signing in records nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "not the right password" is sent
      Then the account for "someone@example.com" has recorded 2 events

    Scenario: A forgotten account is refused like an address with none
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the account for "someone@example.com" has been forgotten
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is refused with "SignIn.Failed"

  Rule: An account imported from the old site is hashed again today's way when it signs in

    Scenario: An account brought over signs in with its old password
      Given "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: An imported account that signs in no longer has an imported password
      Given "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then the account for "someone@example.com" no longer has an imported password

    Scenario: An imported account's password still signs in once hashed again
      Given "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      And signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: A wrong password leaves an imported account's password as it was
      Given "someone@example.com" has an account brought over from the old site, with the password "correct horse battery staple"
      When signing in as "someone@example.com" with the password "not the right password" is sent
      Then the account for "someone@example.com" still has an imported password
