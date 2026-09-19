@postgres
Feature: Finding an account by its email address

  Registering asks whether an address already has an account, and asking for a
  way back in asks which account an address belongs to. Neither can replay
  every account's events to find out, so a read model keeps the answer: a
  table of accounts by email address, kept by a projection as accounts are
  registered, and asked by a query.

  The table does not hold the address. It holds a keyed hash of the address in
  lower case — an HMAC, whose key is a setting like any other secret — which is
  enough to find an account by, and useless to anyone who takes the table
  without the key: a plain hash of an address can be matched by hashing
  guesses, and would tell them which addresses have accounts.

  An account that is forgotten keeps its row, marked as forgotten when its
  forgetting is projected, and a row so marked is never found: the account is
  not to be found by its old address, and the address is free to be
  registered again as a new account, with a row of its own. No row is ever
  deleted.

  An address has one account at a time. Forgotten accounts keep their rows, so
  the table cannot hold each hash once; it holds each hash once among the rows
  not marked forgotten, and a second is refused with
  `AccountsByEmailAddress.AddressTaken`. That is what stops two registrations
  of one new address, sent at the same moment, from each looking, finding
  nothing, and each making an account: the projection runs in the transaction
  of the append that registers, so the second append is refused with it, and
  nothing of the second account is kept.

  The hash is made when the account is registered, and carried in the event
  that says so, beside the address encrypted with the account's own key. The
  projection takes it from there rather than making it, so that rebuilding
  the read model needs no account's key: a forgotten account's key is gone,
  and its address can no longer be read to be hashed. The cost is that the
  hash outlives forgetting, in the table and in the event, so whoever holds
  the site's hash key and guesses a forgotten account's address can tell that
  it was that account's. That is accepted: it tells them an address they
  already had, and nothing else about the person.

  Rebuilding is a deliberate act rather than a background one, and an
  infrastructure task rather than an application one, as SETUP.md §5 says of
  every read model: a maintenance script reads every event kept and puts the
  table together again from them. That script is not written yet, and until it
  is, only the scenarios rebuild; the application neither offers rebuilding nor
  needs it, since a read model is never behind.

  The projection is safe to run twice, as rebuilding the read model does:
  projecting an account's registering again changes nothing, and projecting
  it again after its forgetting leaves it forgotten.

  Background:
    Given the accounts by email address read model, with its key

  Rule: An account is found by its address, in any case

    Scenario: A registered account is found by its address
      Given an account for "someone@example.com" is registered
      When the account for "someone@example.com" is looked for
      Then it is found

    Scenario: It is found by its address in another case
      Given an account for "someone@example.com" is registered
      When the account for "Someone@Example.COM" is looked for
      Then it is found

    Scenario: An address nobody registered finds nothing
      Given an account for "someone@example.com" is registered
      When the account for "nobody@example.com" is looked for
      Then nothing is found

  Rule: The table does not hold the address

    Scenario: No row holds the address
      Given an account for "someone@example.com" is registered
      Then no row of the read model contains "someone@example.com"

    Scenario: No row holds a plain hash of the address
      Given an account for "someone@example.com" is registered
      Then no row of the read model contains the SHA-256 of "someone@example.com"

  Rule: A forgotten account is not found, and its address can be found again

    Scenario: A forgotten account is not found by its address
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      When the account for "someone@example.com" is looked for
      Then nothing is found

    Scenario: A forgotten account keeps its row
      Given an account for "someone@example.com" is registered
      When the account for "someone@example.com" is forgotten
      Then the read model holds 1 row

    Scenario: The address of a forgotten account finds the new account registered with it
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      And another account for "someone@example.com" is registered
      When the account for "someone@example.com" is looked for
      Then the other account is found

  Rule: Projecting the same events again changes nothing

    Scenario: An account's registering projected twice is one row
      Given an account for "someone@example.com" is registered
      When its registering is projected again
      Then the read model holds 1 row

    Scenario: An account's forgetting projected twice leaves it not found
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      When its forgetting is projected again
      And the account for "someone@example.com" is looked for
      Then nothing is found

  Rule: An address has one account at a time

    Scenario: A second account for an address that has one is refused
      Given an account for "someone@example.com" is registered
      When another account for "someone@example.com" is registered
      Then it is refused with "AccountsByEmailAddress.AddressTaken"

    Scenario: A second account for an address in another case is refused
      Given an account for "someone@example.com" is registered
      When another account for "Someone@Example.COM" is registered
      Then it is refused with "AccountsByEmailAddress.AddressTaken"

    Scenario: A second account refused for its address leaves one row
      Given an account for "someone@example.com" is registered
      When another account for "someone@example.com" is registered
      Then the read model holds 1 row

    Scenario: A second account for the address of one forgotten is kept
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      When another account for "someone@example.com" is registered
      Then the read model holds 2 rows

  Rule: The read model is rebuilt from the events alone, forgotten accounts and all

    A rebuild is handed every event there is, one stream at a time, and which
    stream comes first says nothing: nothing records an order across streams,
    and a stream is named by a random uuid. So a rebuild works out which
    accounts were forgotten before it writes a single row, and writes each row
    once, already marked. Reading a stream and writing as it goes would refuse
    an address as taken whenever the account that has it now was read before
    the one that gave it up.

    Every scenario here says the rebuild did not fail as well as what the
    table holds afterwards, because a rebuild that fails is rolled back with
    the transaction it ran in, which leaves the table exactly as it was before
    and every other assertion true.

    Scenario: A forgotten account rebuilt is still not found
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      When the read model is rebuilt from the events
      And the account for "someone@example.com" is looked for
      Then it is rebuilt without failing
      And nothing is found

    Scenario: A forgotten account rebuilt keeps its row
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
      And the read model holds 1 row

    Scenario: The address of a forgotten account finds the new account once rebuilt
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      And another account for "someone@example.com" is registered
      When the read model is rebuilt from the events
      And the account for "someone@example.com" is looked for
      Then it is rebuilt without failing
      And the other account is found

    Scenario: The address of a forgotten account finds the new account whichever account's stream is read first
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      And another account for "someone@example.com" is registered
      When the read model is rebuilt from the events, the newest account first
      And the account for "someone@example.com" is looked for
      Then it is rebuilt without failing
      And the other account is found

    Scenario: Rebuilding needs no account's key
      Given an account for "someone@example.com" is registered
      And the account for "someone@example.com" is forgotten
      And every account's key is deleted
      When the read model is rebuilt from the events
      Then it is rebuilt without failing
