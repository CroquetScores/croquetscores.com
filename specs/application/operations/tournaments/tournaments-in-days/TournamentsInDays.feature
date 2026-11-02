@postgres
Feature: The tournaments starting from one day to another, a page at a time

  A reader can ask a list of tournaments for those starting from a day they
  choose to another (`TournamentFilter.feature`), and the list is answered a
  page at a time, a hundred to a page, so that a website with many years of
  tournaments never sends a reader every one at once. The pages are the
  application's to cut, since the web pages and the admin list ask the same
  and must agree on where one page ends.

  Both days are included, and it is a tournament's start that is compared. The
  tournaments are answered the soonest first, and those starting on the same
  day by name, as a year's are (`TournamentsInYear.feature`), so that a
  tournament is on the same page from one visit to the next and is never on
  two.

  The reader can sort the list by the tournament's start or by its name, from
  the smallest or from the largest, and it is the whole range that is sorted
  before it is cut into pages, so that the first page holds the first of the
  tournaments in that order and not the first of the start order. Names are
  ordered as the reader's language orders them, which the question names, since
  "Östersund" comes after "Zebra" in Swedish and before it in English. Rows alike in what is
  sorted by keep the order they began in, so that a tournament is on the same
  page from one visit to the next. Asked for no sorting, the list is in the
  order it begins in. A sorting that is neither is refused as
  `TournamentsInDays.NoSuchSorting`, and a language that is not one a language
  is written as, such as "en_NZ", is refused as `TournamentsInDays.NoSuchLanguage`.

  Pages are counted from the first. A page asked for beyond the last is not a
  mistake, since a reader whose list shrank under them is not at fault: it is
  answered with no tournaments, and with the number of the last page so that
  the page can send the reader there. A page that is not a whole number of at
  least one is refused as `TournamentsInDays.NoSuchPage`.

  Asked for neither day, every tournament is answered, a hundred to a page, since a
  reader who has chosen no days has not narrowed by them. One day alone is
  refused by the filter (`TournamentFilter.feature`).

  An archived tournament is not answered, and the list is of the website asked
  about (`TournamentsByWebsite.feature`).

  Where a scenario says nothing else, the tournaments are asked for from page 1.

  Background:
    Given the application's tournaments
    And the moment "2026-02-01T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be for the sport "ac"
    And the tournament is to be played in the country "nz"
    And the tournament is to be played in the region "can"

  Rule: Only tournaments starting from the first day to the last are answered

    Scenario: A tournament starting on the first day is answered
      Given the tournament is to start at "2026-03-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Spring Open" is answered

    Scenario: A tournament starting on the last day is answered
      Given the tournament is to start at "2026-03-31T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Spring Open" is answered

    Scenario: A tournament starting the day before the first day is not answered
      Given the tournament is to start at "2026-02-28T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament starting the day after the last day is not answered
      Given the tournament is to start at "2026-04-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament starting before and finishing inside the days is not answered
      Given the tournament is to start at "2026-02-27T00:00:00Z"
      And the tournament is to finish at "2026-03-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Spring Open" is not answered

  Rule: Neither day lists every tournament

    Scenario: A tournament is answered where no days are asked for
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments are asked for
      Then "Spring Open" is answered

    Scenario: A tournament in another year is answered where no days are asked for
      Given the tournament is to start at "2027-03-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments are asked for
      Then "Spring Open" is answered

    Scenario: One day alone is refused
      When the tournaments are asked for from "2026-03-01" only
      Then it is refused with "TournamentFilter.FirstDayWithoutLastDay"

  Rule: A hundred tournaments are answered to a page

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"

    Scenario: A hundred tournaments are answered on the first page
      Given "organiser@example.com" has created 100 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then 100 tournaments are answered

    Scenario: A hundred and one tournaments are answered a hundred on the first page
      Given "organiser@example.com" has created 101 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then 100 tournaments are answered

    Scenario: A hundred and one tournaments are answered one on the second page
      Given "organiser@example.com" has created 101 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 2
      Then 1 tournament is answered

    Scenario: The soonest hundred are on the first page
      Given "organiser@example.com" has created 100 tournaments
      And the tournament is to start at "2026-03-30T00:00:00Z"
      And "organiser@example.com" has created the tournament "Late Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then "Late Open" is not answered

    Scenario: Tournaments starting on the same day are cut by name
      Given "organiser@example.com" has created 101 tournaments
      And "organiser@example.com" has created the tournament "Aardvark Open"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then the first tournament answered is "Aardvark Open"

    Scenario: The number of tournaments in all is answered with a page
      Given "organiser@example.com" has created 101 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then the number of tournaments in all is 101

    Scenario: The number of the last page is answered with a page
      Given "organiser@example.com" has created 101 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then the last page is 2

    Scenario: No tournaments is answered as one page with nothing on it
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for
      Then the last page is 1

  Rule: The whole range is sorted before it is cut into pages

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 101 tournaments
      And the tournament is to start at "2026-03-30T00:00:00Z"
      And "organiser@example.com" has created the tournament "Aardvark Open"

    Scenario: Asked for no sorting the latest start is on the last page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 2
      Then "Aardvark Open" is answered

    Scenario: Sorted by name from the smallest, the first name is on the first page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the smallest
      Then the first tournament answered is "Aardvark Open"

    Scenario: Sorted by name from the largest, the first name is on the last page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the largest, page 2
      Then "Aardvark Open" is answered

    Scenario: Sorted by start from the largest, the latest start is on the first page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by date from the largest
      Then the first tournament answered is "Aardvark Open"

    Scenario: Sorted by start from the smallest, the latest start is on the last page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by date from the smallest, page 2
      Then "Aardvark Open" is answered

  Rule: Names are ordered as the reader's language orders them

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Zebra Open"
      And "organiser@example.com" has created the tournament "Östersund Open"

    Scenario: In English a name beginning with Ö comes before Z
      Given the reader reads the language "en"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the smallest
      Then the first tournament answered is "Östersund Open"

    Scenario: In Swedish a name beginning with Ö comes after Z
      Given the reader reads the language "sv"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the smallest
      Then the first tournament answered is "Zebra Open"

  Rule: A sorting there is not is refused

    Scenario: A column there is not is refused
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by colour from the smallest
      Then it is refused with "TournamentsInDays.NoSuchSorting"

  Rule: A language there is not is refused

    Scenario: A language written with an underscore is refused
      Given the reader reads the language "en_NZ"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the smallest
      Then it is refused with "TournamentsInDays.NoSuchLanguage"

    Scenario: A language with a region is not refused
      Given the reader reads the language "en-NZ"
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, sorted by name from the smallest
      Then 0 tournaments are answered

  Rule: A page there is not is refused or is empty

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 101 tournaments

    Scenario: A page beyond the last is answered with no tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 3
      Then 0 tournaments are answered

    Scenario: A page beyond the last is answered with the number of the last page
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 3
      Then the last page is 2

    Scenario: Page 0 is refused
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 0
      Then it is refused with "TournamentsInDays.NoSuchPage"

    Scenario: A page that is not a whole number is refused
      When the tournaments from "2026-03-01" to "2026-03-31" are asked for, page 1.5
      Then it is refused with "TournamentsInDays.NoSuchPage"
