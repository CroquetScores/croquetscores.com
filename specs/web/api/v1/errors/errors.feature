@postgres
Feature: Every error the API answers has the same shape

  An app that reads an error needs the same things of every one, wherever it
  came from: a code it can rely on, the field that was wrong where one was, and
  a sentence for whoever reads a log. The code is the contract and the sentence
  is never relied on, so it may be reworded; apps never read it.

  This holds for the errors of every route under `/api/v1`, and also for those
  no route made: an address there is nothing at, and a failure nobody
  expected. The website's own interface keeps the shape it has.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: A refusal says its code, its field where it has one, and a sentence

    Scenario: A refusal says a code
      When the tournaments are asked with that key and no year
      Then the API's code is "Tournaments.YearMissing"

    Scenario: A refusal says which field was wrong
      When the tournaments are asked with that key and no year
      Then the API says the field at fault is "year"

    Scenario: A refusal says a sentence
      When the tournaments are asked with that key and no year
      Then the API says a sentence

    Scenario: A refusal for a key says a sentence
      When the tournaments of 2026 are asked with the key "cs_notakey"
      Then the API says a sentence

    Scenario: A refusal that is about no field says none
      When the tournaments of 2026 are asked with the key "cs_notakey"
      Then the API says no field was at fault

  Rule: An address there is nothing at is answered in the same shape

    Scenario: An address there is nothing at is answered not found
      When the API is asked for an address there is nothing at
      Then the API answers 404
      And the API's code is "Route.NotFound"

    Scenario: The API's own address with nothing after it is answered not found
      When the API is asked for its own address
      Then the API answers 404
      And the API's code is "Route.NotFound"

    Scenario: An address there is nothing at says a sentence
      When the API is asked for an address there is nothing at
      Then the API says a sentence

    Scenario: An id with a slash in it is answered not found
      The ids in an address are each one segment, so an encoded slash makes
      the address one that nothing is at, and not an id of some other kind.

      When the API is asked for a tournament whose id has a slash in it
      Then the API answers 404
      And the API's code is "Route.NotFound"
