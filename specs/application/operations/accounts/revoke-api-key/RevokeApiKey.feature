@postgres
Feature: Revoking a key

  A reader signed in to an account can revoke one of its keys, so that an app
  that is lost, or no longer wanted, can do nothing more. It is asked for by
  the reader signed in, for the account they are signed in to and a key of
  that account, and for no other: a key of another account is not found, as if
  there were none, so that nobody can tell by asking which keys exist.

  A key revoked stays in the account's list, marked revoked, so that its
  maker can see what they once made. It never works again, and is never made
  to: revoking is for good, and a new key is made in its place.

  A key revoked that is already revoked records nothing, since nothing
  happened, and is not refused, so that a request sent twice does no harm.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's revoking of API keys
    And the moment "2026-11-19T10:00:00Z"

  Rule: A key revoked is revoked

    Scenario: The key is revoked
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      And the keys of the account for "someone@example.com" are listed
      Then the first key is revoked

    Scenario: The key stays in the list
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      And the keys of the account for "someone@example.com" are listed
      Then the account has 1 key

    Scenario: Another key is not revoked with it
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "someone@example.com" has the key labelled "Inter-Counties"
      When the reader signed in to the account for "someone@example.com" revokes the first key
      And the keys of the account for "someone@example.com" are listed
      Then the second key is not revoked

    Scenario: Revoking is recorded on the account
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      Then the last thing the account for "someone@example.com" recorded is a key being revoked

    Scenario: Revoking emails nothing
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      Then nothing is queued to be sent

  Rule: A key revoked already records nothing

    Scenario: A second revoking is not recorded
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      And the reader signed in to the account for "someone@example.com" revokes that key
      Then the account for "someone@example.com" has recorded 1 revoking of a key

    Scenario: A second revoking is not refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes that key
      And the reader signed in to the account for "someone@example.com" revokes that key
      Then it is answered with the account for "someone@example.com"

  Rule: Only a key of the account is found

    Scenario: A key that was never made is not found
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" revokes a key that was never made
      Then it is refused with "Account.NoSuchApiKey"

    Scenario: A key of another account is not found
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "another@example.com" has an account, confirmed, called "Alex Another"
      And the account for "another@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes the key of the account for "another@example.com"
      Then it is refused with "Account.NoSuchApiKey"

    Scenario: A key of another account is left as it was
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "another@example.com" has an account, confirmed, called "Alex Another"
      And the account for "another@example.com" has the key labelled "CroquetUniverse"
      When the reader signed in to the account for "someone@example.com" revokes the key of the account for "another@example.com"
      And the keys of the account for "another@example.com" are listed
      Then the first key is not revoked

    Scenario: Something that is not an id is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" revokes the key "not-a-key"
      Then it is refused with "Request.Invalid"

  Rule: A forgotten account has no keys to revoke

    Scenario: A forgotten account is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the account for "someone@example.com" has the key labelled "CroquetUniverse"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to that account revokes that key
      Then it is refused with "Account.Forgotten"
