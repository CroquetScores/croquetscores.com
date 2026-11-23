@postgres
Feature: The API holds each caller to an allowance

  Every request under `/api/v0` counts against an allowance, so that one app
  cannot take the site's database from the others. A caller with a key counts
  against the key's own allowance, a minute's and a day's, which an
  administrator can raise for one partner (`apiKeys.feature`): a key starts
  with 60 a minute and 10,000 a day. A caller with no key counts against its
  address, with a smaller allowance of 10 a minute and 500 a day. A key that
  does not work, or a request for one that none was sent with, counts against
  the address too, so that making keys up is no way to have an allowance.

  Every request counts the same, whatever it asks for: a list counts as much
  as the reading of one tournament, and has no allowance of its own. The
  allowance is the one set on the key, and nothing else is hidden behind it.

  A caller that has used its allowance is answered `429`, with how long to wait
  and what the allowance was, so that it can wait and not guess. What is said
  is for the caller who asked now, so nobody keeps it. A request answered `304`
  counts like any other, so that an app that asks again and again cannot take
  as much as it likes because the answer is unchanged. The counts are kept in
  this process, so a second one would give a caller an allowance in each.

  The website's own pages and `/api/site` are outside the limit. Nothing here
  is for them.

  No browser is needed: these scenarios send plain requests, each from an
  address of its own, which the site is told of as something in front of it
  would tell it, so that one scenario's requests are not counted against
  another's.

  Background:
    Given a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the caller is at the address "203.0.113.1"

  Rule: A caller with a key has the key's allowance

    Scenario: A key's answer says what the minute's allowance was
      Given "reader@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API says the allowance was 60

    Scenario: A key's answer says what is left of it
      Given "reader@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API says 59 are left

    Scenario: A key's answer says when the allowance is made again
      Given "reader@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API says when the allowance is made again

    Scenario: A key that has used its minute is told to wait
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 4 a minute
      And the permissions in "Spring Open" have been asked 4 times with that key
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 429
      And the API's code is "RateLimit.PerMinute"

    Scenario: A key that has used its day is told to wait
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 3 a day
      And the permissions in "Spring Open" have been asked 3 times with that key
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 429
      And the API's code is "RateLimit.PerDay"

    Scenario: A key's allowance is its own and not its address's
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 4 a minute
      And the permissions in "Spring Open" have been asked 4 times with that key
      And "organiser@example.com" has made a key that may only read
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 200

    Scenario: A key's limit raised by an administrator is the limit
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 70 a minute
      When the permissions in "Spring Open" are asked with that key
      Then the API says the allowance was 70

  Rule: A caller with no key has the address's allowance

    Scenario: A request refused for its key is counted against the address
      Given the permissions in "Spring Open" have been asked 10 times with the key "cs_notakey"
      When the permissions in "Spring Open" are asked with the key "cs_notakey"
      Then the API answers 429
      And the API's code is "RateLimit.PerMinute"

    Scenario: A request with no key is counted against the address
      Given the permissions in "Spring Open" have been asked 10 times with no key
      When the permissions in "Spring Open" are asked with no key
      Then the API answers 429

    Scenario: Another address has an allowance of its own
      Given the permissions in "Spring Open" have been asked 10 times with no key
      And the caller is at the address "203.0.113.2"
      When the permissions in "Spring Open" are asked with no key
      Then the API answers 401

    Scenario: An answer says the address's allowance was 10
      When the permissions in "Spring Open" are asked with no key
      Then the API says the allowance was 10

  Rule: What a reader signed in to the website changes is not counted

    The website's own pages call the API to change things, as they called
    `/api/site` before, which was never counted. A reader's changes are not
    counted against the address, so that moving a route here does not hold a
    reader of the website to what an app with no key is held to.

    Scenario: A signed-in reader's changes are not held to the address's allowance
      Given the caller is signed in as "organiser@example.com"
      And a tournament with no name has been created 11 times
      When a tournament with no name is created
      Then the API answers 422

    Scenario: A caller that is not signed in is held to it
      Given a tournament with no name has been created 10 times
      When a tournament with no name is created
      Then the API answers 429

    Scenario: What a signed-in reader asks of an address there is nothing at is counted
      Given the caller is signed in as "organiser@example.com"
      And an address there is nothing at has been posted to 10 times
      When an address there is nothing at is posted to
      Then the API answers 429

    Scenario: A key's changes are counted against the key, whoever is signed in
      Given "organiser@example.com" has made a key that may read and write
      And the key of "Ollie Organiser" is limited to 3 a minute
      And the caller is signed in as "organiser@example.com"
      And the caller sends that key
      And a tournament with no name has been created 3 times
      When a tournament with no name is created
      Then the API answers 429

  Rule: A list counts like any other request

    Scenario: A list is answered with the allowance of the key
      Given "reader@example.com" has made a key that may only read
      When the tournaments of 2026 are asked with that key
      Then the API says the allowance was 60

    Scenario: A key may ask for lists up to its whole minute's allowance
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 6 a minute
      And the tournaments of 2026 have been asked 6 times with that key
      When the tournaments of 2026 are asked with that key
      Then the API answers 429
      And the API's code is "RateLimit.PerMinute"

    Scenario: A key may ask for a list as its last request of the minute
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 6 a minute
      And the tournaments of 2026 have been asked 5 times with that key
      When the tournaments of 2026 are asked with that key
      Then the API answers 200

    Scenario: A caller with no key may ask for lists up to 10 in a minute
      Given the tournaments of 2026 have been asked 10 times with no key
      When the tournaments of 2026 are asked with no key
      Then the API answers 429

    Scenario: A list and a reading of one tournament count together
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 6 a minute
      And the tournaments of 2026 have been asked 2 times with that key
      When the permissions in "Spring Open" are asked with that key
      Then the API says 3 are left

  Rule: An address there is nothing at counts like any other request

    Scenario: Asking for what is not there uses up the allowance
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 2 a minute
      And the API has been asked for an address there is nothing at 2 times
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 429

  Rule: A request answered not modified counts like any other

    Scenario: A request answered not modified is counted
      Given "reader@example.com" has made a key that may only read
      And the key of "Rae Reader" is limited to 2 a minute
      And the tournaments of 2026 are asked with that key
      And the tournaments of 2026 are asked again with that key and the mark it gave
      When the tournaments of 2026 are asked again with that key and the mark it gave
      Then the API answers 429

  Rule: A caller that is refused is told how long to wait

    Scenario: A refused caller is told how many seconds to wait
      Given the permissions in "Spring Open" have been asked 10 times with no key
      When the permissions in "Spring Open" are asked with no key
      Then the API tells the caller to wait a number of seconds

    Scenario: A refused caller is told what is left
      Given the permissions in "Spring Open" have been asked 10 times with no key
      When the permissions in "Spring Open" are asked with no key
      Then the API says 0 are left

    Scenario: A refused caller is told what the allowance was
      Given the permissions in "Spring Open" have been asked 10 times with no key
      When the permissions in "Spring Open" are asked with no key
      Then the API says the allowance was 10

    Scenario: What a refused caller is told is for that caller only
      Given the permissions in "Spring Open" have been asked 10 times with no key
      When the permissions in "Spring Open" are asked with no key
      Then the API says the answer is not to be kept

  Rule: The website's own interface is outside the limit

    Scenario: The site's own interface is not limited
      When the site's own interface is asked 15 times
      Then none of the answers was 429
