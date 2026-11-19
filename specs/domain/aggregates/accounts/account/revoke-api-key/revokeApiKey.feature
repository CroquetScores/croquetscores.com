Feature: Revoking a key of an account

  An account can revoke a key it made (`RevokeApiKey.feature`), and a key
  revoked never works again. The key stays in the account's list, marked
  revoked, so that its maker can see what they once made.

  A key already revoked records nothing, because nothing happened, so that a
  request sent twice records one event. A key the account never made is
  refused with `Account.NoSuchApiKey`, the same whoever else made it. A
  forgotten account is refused with `Account.Forgotten`.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-11-19T10:00:00Z"

  Rule: A key revoked is recorded, and is revoked

    Scenario: Revoking a key records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the account revokes the key
      Then it has recorded 1 event
      And the first thing it recorded is a key being revoked

    Scenario: What revoking recorded says which key
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the account revokes the key
      Then the key being revoked says the key it was made as

    Scenario: The key is revoked at once
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the account revokes the key
      Then the key is revoked

    Scenario: An account rebuilt after a key was revoked has it revoked
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the key was revoked
      When the account is rebuilt from the stream
      Then the key is revoked

    Scenario: Revoking a key leaves it in the list
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the account revokes the key
      Then the account holds 1 key

  Rule: A key revoked already records nothing

    Scenario: Revoking again records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the key was revoked
      And the account is rebuilt from the stream
      When the account revokes the key
      Then it has recorded 0 events

    Scenario: Revoking again is not refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the key was revoked
      And the account is rebuilt from the stream
      When the account revokes the key
      Then it is not refused

  Rule: Only a key the account made is found

    Scenario: A key never made is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account revokes the key
      Then it is refused with "Account.NoSuchApiKey"

    Scenario: A forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And it was forgotten
      And the account is rebuilt from the stream
      When the account revokes the key
      Then it is refused with "Account.Forgotten"
