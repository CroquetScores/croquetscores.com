@postgres
Feature: What a key may do in a tournament

  An app that writes results asks first what its key may do in a tournament, so
  that it can tell the reader before they try to send a score that they are
  not a manager or a scorer, and not after a write is refused. The answer says
  the part the key's account has in the tournament, as a manager, a scorer or
  neither, and whether the key may read and may write.

  A key may write where it was made able to write, its account is a manager or
  a scorer of the tournament, the tournament is not archived, and the key is
  not limited to another tournament. A key limited to another tournament may
  do nothing in this one, not even read. An administrator who is neither a
  manager nor a scorer is neither: the key is for the part its account plays in
  the tournament, not for what an administrator may do at the site.

  A key that is not one that works is answered with nothing, and no more is
  said of which of the reasons it was (`IdentifyApiKey.feature`). A tournament
  there is not is refused as `WhatAKeyMayDoInTournament.NoSuchTournament`,
  asked only once the key is known, so that presenting a key that does not
  work tells nobody which tournaments there are.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The part the key's account has in the tournament is said

    Scenario: A manager's key says the account is a manager
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the part of the key's account is "manager"

    Scenario: A scorer's key says the account is a scorer
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the part of the key's account is "scorer"

    Scenario: The key of an account that is neither says neither
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the part of the key's account is "neither"

  Rule: A key writes only where its account may and the key was made able to

    Scenario: A manager's key made able to write may write
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the key may write to the tournament

    Scenario: A scorer's key made able to write may write
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the key may write to the tournament

    Scenario: A key that may only read may not write
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read
      And that key is asked what it may do in "Spring Open"
      Then the key may not write to the tournament

    Scenario: The key of an account that is neither may not write
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the key may not write to the tournament

    Scenario: A key may not write to an archived tournament
      Given the reader signed in to the account for "organiser@example.com" archives the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      And that key is asked what it may do in "Spring Open"
      Then the key may not write to the tournament

  Rule: A key may read the tournament

    Scenario: A key that may read may read
      When the reader signed in to the account for "someone@example.com" makes a key labelled "Scores" that may read
      And that key is asked what it may do in "Spring Open"
      Then the key may read the tournament

  Rule: A key limited to one tournament does nothing in another

    Scenario: A key limited to this tournament may write here
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write, for the tournament called "Spring Open"
      And that key is asked what it may do in "Spring Open"
      Then the key may write to the tournament

    Scenario: A key limited to another tournament may not read here
      Given "organiser@example.com" has created the tournament "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write, for the tournament called "Autumn Open"
      And that key is asked what it may do in "Spring Open"
      Then the key may not read the tournament

    Scenario: A key limited to another tournament may not write here
      Given "organiser@example.com" has created the tournament "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write, for the tournament called "Autumn Open"
      And that key is asked what it may do in "Spring Open"
      Then the key may not write to the tournament

  Rule: A key that does not work is answered with nothing

    Scenario: A key nobody made is answered with nothing
      When the key "cs_notakey" is asked what it may do in "Spring Open"
      Then nothing is answered

    Scenario: A key revoked is answered with nothing
      Given the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      And the reader signed in to the account for "organiser@example.com" revokes that key
      When that key is asked what it may do in "Spring Open"
      Then nothing is answered

  Rule: A tournament there is not is refused once the key is known

    Scenario: A tournament there is not is refused
      Given the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      When that key is asked what it may do in a tournament there is not
      Then it is refused with "WhatAKeyMayDoInTournament.NoSuchTournament"

    Scenario: Something that is not a tournament's id is refused as one there is not
      Given the reader signed in to the account for "organiser@example.com" makes a key labelled "Scores" that may read and write
      When that key is asked what it may do in the tournament "not-an-id"
      Then it is refused with "WhatAKeyMayDoInTournament.NoSuchTournament"

    Scenario: A key nobody made is not told whether the tournament is there
      When the key "cs_notakey" is asked what it may do in a tournament there is not
      Then nothing is answered
