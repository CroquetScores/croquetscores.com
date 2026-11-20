@postgres
Feature: Finding who a key is

  Every request an app makes under the API sends a key, and the site works out
  from it who is asking and what that key may do before it does anything else.
  It cannot replay an account's events to find out, since an account's events
  include every time its owner signed in, so a read model keeps the answer: a
  table of the keys that work, found by the hash of the key. Each row holds
  what the check needs and nothing more: the account, whether the key may read
  and whether it may write, the one tournament it is limited to, and the
  requests it may make a minute and a day.

  A key that no longer works has no row, so a key is never found and then
  asked about. A key is revoked, or its account is forgotten, and the row is
  taken out. An account that is not confirmed cannot make a key at all
  (`Account.NotConfirmed`), and one that is confirmed never becomes
  unconfirmed, so whether the account is confirmed is not kept: a row that
  exists is one of a confirmed account.

  The table holds the hash of a key, which the event holds too, and never a
  key.

  The projection is safe to run twice, and the table can be made again from
  the events in any order of accounts, as every read model can (SETUP.md §5).

  Background:
    Given the accounts by API key read model
    And the moment "2026-09-19T10:00:00Z"
    And an account for "someone@example.com" is registered
    And the account for "someone@example.com" confirms its address

  Rule: A key made is found by its hash

    Scenario: A key is found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then a key is found

    Scenario: A key is found for the account that made it
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found belongs to the account for "someone@example.com"

    Scenario: A key is found by its own hash and not another's
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "Inter-Counties" is looked for
      Then no key is found

    Scenario: A key of an account not yet confirmed is never made
      Given an account for "other@example.com" is registered
      When the account for "other@example.com" makes the key "CroquetUniverse"
      Then it is refused with "Account.NotConfirmed"

    Scenario: A key refused leaves no row
      Given an account for "other@example.com" is registered
      And the account for "other@example.com" makes the key "CroquetUniverse"
      Then the table of keys holds 0 rows

  Rule: A row says what the key may do

    Scenario: A key made to read may read
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found may read

    Scenario: A key made to read may not write
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found may not write

    Scenario: A key made to read and write may write
      Given the next key may read and write
      And the account for "someone@example.com" makes the key "CroquetTournament"
      When the key "CroquetTournament" is looked for
      Then the key found may write

    Scenario: A key made to read and write may also read
      Given the next key may read and write
      And the account for "someone@example.com" makes the key "CroquetTournament"
      When the key "CroquetTournament" is looked for
      Then the key found may read

    Scenario: A key limited to a tournament says which
      Given the next key is limited to a tournament
      And the account for "someone@example.com" makes the key "Inter-Counties"
      When the key "Inter-Counties" is looked for
      Then the key found is limited to that tournament

    Scenario: A key limited to no tournament says so
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found is limited to no tournament

    Scenario: A key says the requests it may make a minute
      Given the next key is to make 30 requests a minute
      And the next key is to make 5000 requests a day
      And the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found may make 30 requests a minute

    Scenario: A key says the requests it may make a day
      Given the next key is to make 30 requests a minute
      And the next key is to make 5000 requests a day
      And the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found may make 5000 requests a day

    Scenario: A key is told from another key of the same account
      Given the next key may read and write
      And the account for "someone@example.com" makes the key "CroquetTournament"
      And the account for "someone@example.com" makes the key "CroquetUniverse"
      When the key "CroquetUniverse" is looked for
      Then the key found may not write

  Rule: Changing the limits of a key changes its row

    So that the limit an administrator sets is the one the next request is held
    to, with nothing in between to be out of date.

    Scenario: The new limit a minute is found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      Given the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      When the limits of the key "CroquetUniverse" are changed
      And the key "CroquetUniverse" is looked for
      Then the key found may make 10 requests a minute

    Scenario: The new limit a day is found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      Given the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      When the limits of the key "CroquetUniverse" are changed
      And the key "CroquetUniverse" is looked for
      Then the key found may make 100 requests a day

    Scenario: Another key keeps its limits
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "someone@example.com" makes the key "Inter-Counties"
      Given the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      When the limits of the key "CroquetUniverse" are changed
      And the key "Inter-Counties" is looked for
      Then the key found may make 60 requests a minute

    Scenario: What the key may do is kept when its limits change
      Given the next key may read and write
      And the account for "someone@example.com" makes the key "CroquetTournament"
      Given the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      When the limits of the key "CroquetTournament" are changed
      And the key "CroquetTournament" is looked for
      Then the key found may write

  Rule: A key that no longer works is found by nothing

    Scenario: A revoked key is not found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the account for "someone@example.com" revokes the key "CroquetUniverse"
      And the key "CroquetUniverse" is looked for
      Then no key is found

    Scenario: A revoked key leaves the account's other key found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "someone@example.com" makes the key "Inter-Counties"
      When the account for "someone@example.com" revokes the key "CroquetUniverse"
      And the key "Inter-Counties" is looked for
      Then a key is found

    Scenario: The key of a forgotten account is not found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the account for "someone@example.com" is forgotten
      And the key "CroquetUniverse" is looked for
      Then no key is found

    Scenario: A forgotten account leaves another account's key found
      Given an account for "other@example.com" is registered
      And the account for "other@example.com" confirms its address
      And the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "other@example.com" makes the key "Inter-Counties"
      When the account for "someone@example.com" is forgotten
      And the key "Inter-Counties" is looked for
      Then a key is found

  Rule: The row says when it was last changed

    The `occurredAt` of the last event that changed it, as every read model
    keeps it (AccountsChangedAt.feature), so changing the limits moves it.

    Scenario: Making a key gives the row its moment
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      Then the row of the key "CroquetUniverse" was last changed at "2026-09-19T10:00:00Z"

    Scenario: Changing the limits moves the row's moment
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the moment "2026-09-20T10:00:00Z"
      Given the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      When the limits of the key "CroquetUniverse" are changed
      Then the row of the key "CroquetUniverse" was last changed at "2026-09-20T10:00:00Z"

  Rule: The table holds no key

    Scenario: No row holds the key itself
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      Then no row of the table of keys contains "CroquetUniverse"

  Rule: Projecting the same events again changes nothing

    Scenario: A key's making projected twice is one row
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      When the making of the key "CroquetUniverse" is projected again
      Then the table of keys holds 1 row

    Scenario: A key's limits projected twice leave the limits
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      And the limits of the key "CroquetUniverse" are changed
      When the limits of the key "CroquetUniverse" are projected again
      And the key "CroquetUniverse" is looked for
      Then the key found may make 10 requests a minute

    Scenario: A key's revoking projected twice leaves it not found
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "someone@example.com" revokes the key "CroquetUniverse"
      When the revoking of the key "CroquetUniverse" is projected again
      And the key "CroquetUniverse" is looked for
      Then no key is found

  Rule: The table can be made again from the events

    Scenario: Making it again gives the same rows
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the new limit is 10 requests a minute
      And the new limit is 100 requests a day
      And the limits of the key "CroquetUniverse" are changed
      And the rows of the table of keys are noted
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the rows of the table of keys are as they were noted

    Scenario: Making it again gives the same rows whichever account is read first
      Given an account for "other@example.com" is registered
      And the account for "other@example.com" confirms its address
      And the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "other@example.com" makes the key "Inter-Counties"
      And the rows of the table of keys are noted
      When the table of keys is made again with the newest account first
      Then it is rebuilt without failing
      And the rows of the table of keys are as they were noted

    Scenario: A revoked key is not brought back by making it again
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "someone@example.com" revokes the key "CroquetUniverse"
      When the read model is rebuilt from the events
      And the key "CroquetUniverse" is looked for
      Then no key is found

    Scenario: The key of a forgotten account is not brought back by making it again
      Given the account for "someone@example.com" makes the key "CroquetUniverse"
      And the account for "someone@example.com" is forgotten
      When the read model is rebuilt from the events
      And the key "CroquetUniverse" is looked for
      Then no key is found
