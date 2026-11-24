@postgres
Feature: An app asks what its key may do in a tournament

  An app that writes results asks the API what its key may do in a tournament
  before it tries to send a score, so that it can tell the reader that they
  are not a manager or a scorer, and not after a write is refused
  (`WhatAKeyMayDoInTournament.feature` says what the answer is made of). It
  asks at `/api/v1/tournaments/{id}/permissions`, with the tournament named by
  the part of its id after "tournament/", and answers with the part the key's
  account has there, as a manager, a scorer or neither, and whether the key may
  read and whether it may write.

  An app sends its key with every request as a bearer token, in the
  Authorization header, and nowhere else: a key in an address would be kept by
  every proxy and log it passed. A request with no key is answered `401` with
  `ApiKey.Missing`, which the app can mend by sending one. A key that does not
  work, whether it was never made or was revoked, is answered `401` with
  `ApiKey.Invalid` and no more, since which of the reasons it was is what must
  not be told. A tournament there is not is answered `404` with
  `Tournament.NotFound`, once the key is known.

  Every error is a code the app can rely on and a sentence for people reading a
  log; apps never rely on the wording. What is answered is for the key that
  asked, and so is never kept for anybody else.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: An app sends its key as a bearer token

    Scenario: A request with no key is told the key is missing
      When the permissions in "Spring Open" are asked with no key
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A key sent in the address is not read
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key in the address
      Then the API answers 401
      And the API's code is "ApiKey.Missing"

    Scenario: A key that was never made is told it does not work
      When the permissions in "Spring Open" are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

    Scenario: A request refused for its key says how to send one
      When the permissions in "Spring Open" are asked with no key
      Then the API asks for a bearer token

  Rule: The answer says the part the key's account has

    Scenario: A manager's key says the account is a manager
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 200
      And the API says the part is "manager"

    Scenario: A scorer's key says the account is a scorer
      Given "organiser@example.com" has made "someone@example.com" a scorer of "Spring Open"
      And "someone@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the part is "scorer"

    Scenario: The key of an account that is neither says neither
      Given "someone@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the part is "neither"

  Rule: The answer says whether the key may write

    Scenario: A manager's key made able to write may write
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the key may write

    Scenario: A key made only to read may not write
      Given "organiser@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API says the key may not write

    Scenario: The key of an account that is neither may not write
      Given "someone@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the key may not write

    Scenario: A key may read
      Given "someone@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API says the key may read

  Rule: A tournament there is not is answered not found

    Scenario: A tournament there is not is answered not found
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in a tournament there is not are asked with that key
      Then the API answers 404
      And the API's code is "Tournament.NotFound"

    Scenario: A key that does not work is not told whether the tournament is there
      When the permissions in a tournament there is not are asked with the key "cs_notakey"
      Then the API answers 401

  Rule: What is answered is not kept for anybody else

    Scenario: The answer is not cached
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the answer is not to be kept

    Scenario: The answer says it depends on the key sent
      Given "organiser@example.com" has made a key that may read and write
      When the permissions in "Spring Open" are asked with that key
      Then the API says the answer depends on the Authorization header
