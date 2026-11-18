@postgres
Feature: Knowing who a key belongs to

  An app sends a key with each request, and the site works out from it which
  account is acting, what the key may do, and what limits it carries. This is
  the whole of how a key is told from any other string: it is hashed and the
  hash is looked up, so nothing is compared that could be read back as a key.

  A key that is not known, one that has been revoked, and one whose account is
  forgotten are all answered with nothing, and look the same to the one asking,
  since which of them it was is what must not be said.

  A key says who made it and what it may do, and the account's own roles are
  not the key's: a key of an administrator's account acts as that account and
  is limited by the key's own scope and tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's identifying of API keys
    And the moment "2026-11-19T10:00:00Z"

  Rule: A key made is known

    Scenario: A key is known to its account
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When that key is presented
      Then the key belongs to the account for "someone@example.com"

    Scenario: A key says it may read
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse" that may read
      When that key is presented
      Then the key may read

    Scenario: A key that may only read may not write
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse" that may read
      When that key is presented
      Then the key may not write

    Scenario: A key that may read and write may write
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetTournament" that may read and write
      When that key is presented
      Then the key may write

    Scenario: A key says which tournament it is limited to
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "Inter-Counties" that may read and write, for a tournament
      When that key is presented
      Then the key is limited to that tournament

    Scenario: A key limited to no tournament says so
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When that key is presented
      Then the key is not limited to a tournament

    Scenario: A key says its limits
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When that key is presented
      Then the key may make 60 requests a minute

    Scenario: A key is told from another key of the same account
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "someone@example.com" has the key labelled "Inter-Counties"
      When the second key is presented
      Then the key is the second key

  Rule: What is not a key made, or no longer one, is known to nobody

    Scenario: A string that was never a key is known to nobody
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the key "not-a-key-anybody-made" is presented
      Then the key is known to nobody

    Scenario: A key that was changed by a letter is known to nobody
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When that key is presented with its last letter changed
      Then the key is known to nobody

    Scenario: A key that has been revoked is known to nobody
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the reader signed in to the account for "someone@example.com" revokes that key
      When that key is presented
      Then the key is known to nobody

    Scenario: A key of a forgotten account is known to nobody
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When that key is presented
      Then the key is known to nobody

    Scenario: A key that is not text is refused
      When something that is not text is presented as a key
      Then it is refused with "IdentifyApiKey.NotText"
