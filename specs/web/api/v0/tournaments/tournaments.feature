@postgres
Feature: An app lists a year's tournaments

  An app that follows the sport asks the API for a year's tournaments, at
  `/api/v0/tournaments`, and is told, for each one, what it is called, when it
  starts and finishes, where it is played, which sport it is, where it is found
  on the site, and whether its organiser ticked national or international. The
  sport is part of each tournament's answer, so a year of every sport is one
  request, and an app that wants one sport says which. The id is the one the
  published files carry (`tournamentId`), so that a tournament renamed or moved
  is still the same one. Where the API takes a tournament's id in an address, it
  is the part after "tournament/".

  A tournament says when it last changed, which is when anything was last kept
  of it or of any of its competitions. Nothing says a tournament is finished,
  since the site cannot know, so an app keeps what it was told as long as it
  likes and asks again. It asks cheaply: every answer carries an `ETag` and a
  `Last-Modified`, and the same question asked again with what they said is
  answered `304` and no more. An app that reads a year again asks only for what
  changed since the last time, with `changedSince`.

  A year has several hundred tournaments at most, so an answer is a page of at
  most 100, with the way to the next.

  A caller with no key is answered as a caller with a key is: reading is for
  anybody, and a key only says whose allowance is used (`rateLimit.feature`).
  A key that does not work is refused, since an app that thinks it is sending
  one needs to be told it is not.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: A year's tournaments are listed with what an app needs of each

    Scenario: A tournament of the year is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the API answers 200
      And the tournaments listed are "Spring Open"

    Scenario: A tournament says which one it is
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says its id

    Scenario: A tournament says when it starts
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it starts on "2026-10-03"

    Scenario: A tournament says when it finishes
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it finishes on "2026-10-05"

    Scenario: A tournament says its country
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says its country is "au"

    Scenario: A tournament says its region
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says its region is "vic"

    Scenario: A tournament says its sport
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says its sport is "ac"

    Scenario: A tournament says where the API tells of it
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says where the API tells of it

    Scenario: A tournament says where it is found on the site
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says where it is found

    Scenario: A tournament that is neither national nor international says so
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it is not national
      And the tournament "Spring Open" says it is not international

    Scenario: A national tournament says so
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" is national
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it is national

    Scenario: An international tournament says so
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" is international
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it is international

    Scenario: The tournaments of every sport are listed together
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Spring Golf" starting at "2026-04-04T00:00:00Z" in the sport "gc"
      When the tournaments of 2026 are asked with that key
      Then the tournaments listed are "Spring Golf" and "Spring Open"

    Scenario: The tournaments of one sport are listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Spring Golf" starting at "2026-04-04T00:00:00Z" in the sport "gc"
      When the tournaments of 2026 in the sport "gc" are asked with that key
      Then the tournaments listed are "Spring Golf"

    Scenario: The tournaments of another year are not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2025 are asked with that key
      Then no tournaments are listed

    Scenario: The tournaments are listed with no key
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with no key
      Then the API answers 200
      And the tournaments listed are "Spring Open"

    Scenario: A key that does not work is refused
      When the tournaments of 2026 are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: An answer is a page of at most 100

    Scenario: A page says how many tournaments there are in all
      Given "organiser@example.com" has created 3 tournaments
      When the tournaments of 2026 are asked with that key and a page size of 2
      Then the page lists 2 tournaments
      And the API says there are 3 tournaments in all

    Scenario: A page says where the next one is
      Given "organiser@example.com" has created 3 tournaments
      When the tournaments of 2026 are asked with that key and a page size of 2
      Then the API says the next page is 2

    Scenario: The last page says there is no next one
      Given "organiser@example.com" has created 3 tournaments
      When the tournaments of 2026 are asked for page 2 with that key and a page size of 2
      Then the page lists 1 tournaments
      And the API says there is no next page

    Scenario: A page size over 100 is 100
      When the tournaments of 2026 are asked with that key and a page size of 500
      Then the API says the page size is 100

    Scenario: A page size is 100 when none is asked for
      When the tournaments of 2026 are asked with that key
      Then the API says the page size is 100

    Scenario: A page that is not a whole number is refused
      When the tournaments of 2026 are asked for page "first" with that key
      Then the API answers 400
      And the API's code is "Tournaments.PageNotWhole"
      And the API says the field at fault is "page"

    Scenario: A page too large to count is refused
      When the tournaments of 2026 are asked for page "99999999999999999999" with that key
      Then the API answers 400
      And the API's code is "Tournaments.PageNotWhole"

    Scenario: A year too large to count is refused
      When the tournaments of "99999999999999999999" are asked with that key
      Then the API answers 400
      And the API's code is "Tournaments.YearNotWhole"

    Scenario: A page size that is not a whole number is refused
      When the tournaments of 2026 are asked with that key and a page size of "many"
      Then the API answers 400
      And the API's code is "Tournaments.PageSizeNotWhole"
      And the API says the field at fault is "pageSize"

  Rule: An app asks only for what has changed

    Scenario: What changed since a moment is all that is listed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open" starting at "2026-04-04T00:00:00Z" in the sport "ac"
      When the tournaments of 2026 are asked with that key changed since "2026-03-01T12:00:00Z"
      Then the tournaments listed are "Autumn Open"

    Scenario: A tournament changed again is listed again
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the tournament "Spring Open" is national
      When the tournaments of 2026 are asked with that key changed since "2026-03-01T12:00:00Z"
      Then the tournaments listed are "Spring Open"

    Scenario: Nothing is listed where nothing changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key changed since "2026-03-01T12:00:00Z"
      Then no tournaments are listed

    Scenario: A tournament says the moment it last changed
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the server's clock reads "2026-03-02T10:00:00Z"
      And the tournament "Spring Open" is national
      When the tournaments of 2026 are asked with that key
      Then the tournament "Spring Open" says it last changed at "2026-03-02T10:00:00.000Z"

    Scenario: A tournament changed at the very moment asked about is not listed again
      Given the server's clock reads "2026-03-01T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key changed since "2026-03-01T10:00:00.000Z"
      Then no tournaments are listed

    Scenario: A moment with no zone is refused
      When the tournaments of 2026 are asked with that key changed since "2026-03-01T10:00:00"
      Then the API answers 400
      And the API's code is "Tournaments.ChangedSinceNotAMoment"

    Scenario: A moment that is not one is refused
      When the tournaments of 2026 are asked with that key changed since "yesterday"
      Then the API answers 400
      And the API's code is "Tournaments.ChangedSinceNotAMoment"
      And the API says the field at fault is "changedSince"

  Rule: An answer unchanged is answered not modified

    Scenario: An answer carries a mark of what it said
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the API gives a mark of its answer

    Scenario: An answer says when it last changed
      Given "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments of 2026 are asked with that key
      Then the API says when its answer last changed

    Scenario: The same question is answered not modified once its mark is sent
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournaments of 2026 are asked with that key
      When the tournaments of 2026 are asked again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: The same question is answered not modified once its date is sent
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournaments of 2026 are asked with that key
      When the tournaments of 2026 are asked again with that key and the date it gave
      Then the API answers 304

    Scenario: A change is answered in full
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournaments of 2026 are asked with that key
      And the tournament "Spring Open" is national
      When the tournaments of 2026 are asked again with that key and the mark it gave
      Then the API answers 200
      And the tournament "Spring Open" says it is national

    Scenario: A year of no tournaments has no date to give
      When the tournaments of 2026 are asked with that key
      Then the API says nothing of when its answer last changed

  Rule: A year is asked for, and a sport there is not is refused

    Scenario: A request that names no year is refused
      When the tournaments are asked with that key and no year
      Then the API answers 400
      And the API's code is "Tournaments.YearMissing"
      And the API says the field at fault is "year"

    Scenario: A year that is not a whole number is refused
      When the tournaments of "next" are asked with that key
      Then the API answers 400
      And the API's code is "Tournaments.YearNotWhole"
      And the API says the field at fault is "year"

    Scenario: A sport there is not is refused
      When the tournaments of 2026 in the sport "quidditch" are asked with that key
      Then the API answers 400
      And the API's code is "Tournaments.SportUnknown"
      And the API says the field at fault is "sport"

  Rule: An app may keep an answer but asks again before it uses it

    Scenario: The answer is kept by the app and not by anybody between
      When the tournaments of 2026 are asked with that key
      Then the API says the answer is for the app to keep and to check before it uses it
