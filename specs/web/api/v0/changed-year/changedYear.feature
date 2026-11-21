@postgres
Feature: An app lists the tournaments whose year has changed

  A tournament is found by the year it starts in, and an organiser can move it
  to another. An app that keeps a year's tournaments (`tournaments.feature`)
  would go on holding one that has left it, and would never ask for one that
  has come into a year it already read, so it asks the API which tournaments
  have changed their year, at `/api/v0/tournaments/changed-year`.

  Each is told by its id (`tournamentId`, the one the list gives), the year it
  was in before it came into the year it is in now (`previousYear`), that year
  (`newYear`) and an `etag` of what is said of it, as the rows of the other
  lists have. A tournament moved twice says the year it was in just before the
  last move, and one moved and moved back says the year it was moved back from,
  since an app that read that year still holds it. A tournament moved within
  its year has not changed it, and one that is archived is not listed, as it is
  not in the list of its year.

  An app that reads this again asks only for what changed since the last time,
  with `changedSince`, which is the moment the tournament came into the year it
  is in now. The answer is a page of at most 100, with the way to the next, and
  follows the conventions of the list: a caller with no key is answered as one
  with a key is, a key that does not work is refused, and every answer carries
  an `ETag` and a `Last-Modified`, so that one the app already has is answered
  `304`.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: A tournament moved to another year is listed

    Scenario: A tournament moved to the next year is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the API answers 200
      And the tournaments listed as having changed year are "Spring Open"

    Scenario: A tournament says which one it is
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says its id

    Scenario: A tournament says the year it was in before
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says its previous year is 2026

    Scenario: A tournament says the year it is in now
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says its new year is 2027

    Scenario: A tournament that changed year carries a mark of itself
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says a mark of itself

    Scenario: A tournament moved twice says the year it was in before the last move
      Given the tournament is to start at "2025-03-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-03-01" and finish on "2026-03-03"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says its previous year is 2026
      And the tournament "Spring Open" that changed year says its new year is 2027

    Scenario: A tournament that changed year is listed once however often it was updated
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And "organiser@example.com" has renamed the tournament "Spring Open" to "Spring Classic"
      When the tournaments that changed year are asked with that key
      Then the tournaments listed as having changed year are "Spring Classic"

    Scenario: A tournament that did not change year is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments that changed year are asked with that key
      Then no tournaments are listed as having changed year

    Scenario: A tournament moved within its year is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-11-01" and finish on "2026-11-03"
      When the tournaments that changed year are asked with that key
      Then no tournaments are listed as having changed year

    Scenario: A tournament moved and moved back says the year it was moved back from
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-05"
      When the tournaments that changed year are asked with that key
      Then the tournament "Spring Open" that changed year says its previous year is 2027
      And the tournament "Spring Open" that changed year says its new year is 2026

    Scenario: A tournament archived is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the tournaments that changed year are asked with that key
      Then no tournaments are listed as having changed year

    Scenario: The tournaments that changed year are listed with no key
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with no key
      Then the API answers 200
      And the tournaments listed as having changed year are "Spring Open"

    Scenario: A key that does not work is refused
      When the tournaments that changed year are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: An app asks only for what has changed

    Scenario: A tournament moved back since a moment is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-05"
      When the tournaments that changed year are asked with that key changed since "2026-03-01T12:00:00Z"
      Then the tournaments listed as having changed year are "Spring Open"

    Scenario: A tournament that came into its year since a moment is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key changed since "2026-03-01T12:00:00Z"
      Then the tournaments listed as having changed year are "Spring Open"

    Scenario: A tournament that came into its year before a moment is not listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      When the tournaments that changed year are asked with that key changed since "2026-03-01T12:00:00Z"
      Then no tournaments are listed as having changed year

    Scenario: A tournament renamed since is not listed again for its year
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has renamed the tournament "Spring Open" to "Spring Classic"
      When the tournaments that changed year are asked with that key changed since "2026-03-01T12:00:00Z"
      Then no tournaments are listed as having changed year

    Scenario: A moment with no zone is refused
      When the tournaments that changed year are asked with that key changed since "2026-03-01T10:00:00"
      Then the API answers 400
      And the API's code is "Tournaments.ChangedSinceNotAMoment"
      And the API says the field at fault is "changedSince"

  Rule: An answer is a page of at most 100

    Scenario: A page says how many tournaments there are in all
      Given "organiser@example.com" has created 3 tournaments
      And every tournament has been moved to the year 2027
      When the tournaments that changed year are asked with that key and a page size of 2
      Then the page lists 2 tournaments that changed year
      And the API says there are 3 tournaments in all

    Scenario: A page says where the next one is
      Given "organiser@example.com" has created 3 tournaments
      And every tournament has been moved to the year 2027
      When the tournaments that changed year are asked with that key and a page size of 2
      Then the API says the next page is 2

    Scenario: The last page says there is no next one
      Given "organiser@example.com" has created 3 tournaments
      And every tournament has been moved to the year 2027
      When the tournaments that changed year are asked for page 2 with that key and a page size of 2
      Then the page lists 1 tournaments that changed year
      And the API says there is no next page

    Scenario: A page size over 100 is 100
      When the tournaments that changed year are asked with that key and a page size of 500
      Then the API says the page size is 100

    Scenario: A page that is not a whole number is refused
      When the tournaments that changed year are asked for page "first" with that key
      Then the API answers 400
      And the API's code is "Tournaments.PageNotWhole"
      And the API says the field at fault is "page"

    Scenario: A page size that is not a whole number is refused
      When the tournaments that changed year are asked with that key and a page size of "many"
      Then the API answers 400
      And the API's code is "Tournaments.PageSizeNotWhole"
      And the API says the field at fault is "pageSize"

  Rule: An answer unchanged is answered not modified, by its mark

    Scenario: An answer carries a mark of what it said
      When the tournaments that changed year are asked with that key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2027-03-01" and finish on "2027-03-03"
      And the tournaments that changed year are asked with that key
      When the tournaments that changed year are asked again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: The answer is kept by the app and not by anybody between
      When the tournaments that changed year are asked with that key
      Then the API says the answer is for the app to keep and to check before it uses it
