@postgres
Feature: Creating a key an app can use in place of a password

  A reader signed in to an account can make a key for it, so that an app can
  act for them without ever being given their password. A key is the way in
  for those who signed in with Google as well, who have no password to give.
  It is asked for by the reader signed in, for the account they are signed in
  to, and for no other: which account that is, is the web layer's to say, from
  the session.

  A key is a long random secret, and the site keeps only a hash of it. The
  key itself is in the answer to the one request that made it and nowhere
  after, so a reader who did not write it down makes another, and nothing the
  site holds can be turned back into a way in.

  A key is given a label by whoever makes it, so that they can tell their keys
  apart, such as the app it is for. It is what they typed, so it is kept as
  personal to the account, and forgetting the account takes it out
  (`AccountKeys.feature`).

  A key may only read or may read and write, and may be limited to one
  tournament, so that a captain or manager can give an app a key that can do
  nothing else. It carries limits of its own, a number of requests a minute and
  a day, so that a limit can be raised for one key alone and no other
  (`ChangeApiKeyLimits.feature`). Making a key gives it the usual limits.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's creating of API keys
    And the moment "2026-11-19T10:00:00Z"

  Rule: A key is made, and shown once

    Scenario: The answer carries the key
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      Then the answer carries a key

    Scenario: The account lists the key
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the account has 1 key

    Scenario: The list does not carry the key
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the list does not carry the key that was made

    Scenario: Nothing kept holds the key
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      Then nothing kept for the account for "someone@example.com" holds the key that was made

    Scenario: Making a key is recorded on the account
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      Then the last thing the account for "someone@example.com" recorded is a key being made

    Scenario: Making a key emails nothing
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      Then nothing is queued to be sent

    Scenario: Two keys made are two keys
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the reader signed in to the account for "someone@example.com" makes a key labelled "Inter-Counties" that may read
      Then the second key made is not the first

    Scenario: A key of one account is not listed for another
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "another@example.com" has an account, confirmed, called "Alex Another"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "another@example.com" are listed
      Then the account has no keys

  Rule: A key says what it is for

    Scenario: A key is called what its maker called it
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key is labelled "CroquetUniverse"

    Scenario: A label typed with spaces around it is kept without them
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "  CroquetUniverse  " that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key is labelled "CroquetUniverse"

    Scenario: A key that may read may read
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key may read

    Scenario: A key that may read may not write
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key may not write

    Scenario: A key that may read and write may read
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetTournament" that may read and write
      And the keys of the account for "someone@example.com" are listed
      Then the first key may read

    Scenario: A key that may read and write may write
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetTournament" that may read and write
      And the keys of the account for "someone@example.com" are listed
      Then the first key may write

    Scenario: A key is not limited to a tournament unless it is said
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key is not limited to a tournament

    Scenario: A key can be limited to one tournament
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Inter-Counties" that may read and write, for a tournament
      And the keys of the account for "someone@example.com" are listed
      Then the first key is limited to that tournament

    Scenario: A key is given the usual limit a minute
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 60 requests a minute

    Scenario: A key is given the usual limit a day
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key may make 10000 requests a day

    Scenario: A key says when it was made
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key was made at "2026-11-19T10:00:00Z"

    Scenario: A key is not revoked when it is made
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      And the keys of the account for "someone@example.com" are listed
      Then the first key is not revoked

  Rule: The label, the scope and the tournament must break none of their own rules

    Scenario: A label of nothing is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "   " that may read
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ApiKeyLabel.Missing"

    Scenario: A label that is too long is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key with a label of 61 letters that may read
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ApiKeyLabel.TooLong"

    Scenario: A label of the most letters is kept
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key with a label of 60 letters that may read
      Then the answer carries a key

    Scenario: A scope that is not known is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" with the scope "everything"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ApiKeyScope.Unknown"

    Scenario: A tournament that is not an id is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Inter-Counties" that may read, for the tournament "spring-open"
      Then it is refused with "Request.Invalid"

    Scenario: A refused key is not recorded
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" with the scope "everything"
      And the keys of the account for "someone@example.com" are listed
      Then the account has no keys

  Rule: Only an account in use is given a key

    Scenario: An account that is not confirmed is refused
      Given "someone@example.com" has an account, not confirmed
      When the reader signed in to the account for "someone@example.com" makes a key labelled "CroquetUniverse" that may read
      Then it is refused with "Account.NotConfirmed"

    Scenario: An account that has been forgotten is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to that account makes a key labelled "CroquetUniverse" that may read
      Then it is refused with "Account.Forgotten"
