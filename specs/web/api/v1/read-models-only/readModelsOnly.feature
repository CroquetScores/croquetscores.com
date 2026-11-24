@postgres
Feature: The API answers from the read models and never from the events

  Every question the API answers is answered from what the site keeps ready to
  be read, its read models, and none of it from the events they are made from.
  Reading the events means building each tournament, competition and account
  again from everything that ever happened to it, for every request an app
  makes, and the API is asked far more often than anything else is.

  Nothing but a scenario keeps it so, since an endpoint that goes back to the
  events answers just the same, only slower. So a site under test can be told
  that the API may not read the events: from then on every read of the events
  for a request to `/api/v1` fails that request, and an endpoint that makes one
  is seen to. The site's own pages and commands are not held to it, since a
  command is built from the events by design, and so the scenarios set up what
  they ask about the way every other scenario does.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
    And the API may not read the events

  Rule: Every endpoint is answered without reading the events

    Scenario: The tournaments of a year
      When the tournaments of 2026 are asked with that key
      Then the API answers 200

    Scenario: A tournament
      When the tournament "Spring Open" is read with that key
      Then the API answers 200

    Scenario: What a key may do in a tournament
      When the permissions in "Spring Open" are asked with that key
      Then the API answers 200

    Scenario: A competition
      When the competition "Block A" of "Spring Open" is read with that key
      Then the API answers 200

    Scenario: A competition's standings
      When the standings of "Block A" in "Spring Open" are read with that key
      Then the API answers 200

    Scenario: A competition's games
      When the games of "Block A" in "Spring Open" are read with that key
      Then the API answers 200

  Rule: Finding who a key is does not read the events either

    Every request begins by finding who its key is, so a read there would fail
    even an answer that is a refusal. A key that works is let in by every
    scenario above.

    Scenario: A key that does not work is refused
      When the tournaments of 2026 are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"
