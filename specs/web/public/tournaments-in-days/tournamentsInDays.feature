@browser @postgres
Feature: A page lists the tournaments starting from one day to another

  The home page, a year's page and a sport's page in a year each have a filter
  of a country, a region and a sport (`TournamentFilter.feature`). Each now has
  two days before the Filter button, From and To, for a reader after the
  tournaments of a month or a season rather than of a year. Choosing both and
  pressing Filter does not narrow the page the reader is on, whose lists are of
  something else: the home page's are the last seven days and the next sixty,
  and a year's are the year's. It opens a page of its own, at "/tournaments",
  that lists the tournaments starting from the first day to the last,
  both included (`TournamentsInDays.feature`).

  The page's list looks and behaves as a year's does (`year.feature`): the
  dates, the sport on a tablet or wider, the flag, the name, a row that leads
  to the tournament, a flag that narrows by its country, and the column
  headings that sort it. It is filtered by the country, region and sport the
  reader had chosen, which go with them to the new page, and it has the same
  form, so a reader can change the days or the filter without going back.

  A hundred tournaments are listed to a page. Beneath the list are "Previous"
  and "Next" links and the words "Page 2 of 5", which are left out where all
  the tournaments fit on one page. "Previous" is not offered on the first page
  nor "Next" on the last, since a link that goes nowhere is only a thing to
  press by mistake. The links carry the days, the filter and the sorting, and
  the page's number is in the address, so a page can be linked to and the back
  button undoes a turn.

  The way to the previous page is written "<< Previous" and the way to the next
  "Next >>", the marks pointing the way the page turns. They are drawn for
  those who see them and left out of what a screen reader says, which says
  "Previous" and "Next" as it would without them.

  A page beyond the last, which a reader whose list shrank might open from a
  link they kept, sends them to the last page rather than showing nothing.

  A column heading sorts the whole range and not only the page in view, and
  sends the reader back to the first page in that order, so that what they
  sorted by is what they are shown first: the names from A, say, beginning on
  page 1 whichever page they were on. The sorting stays as the pages are
  turned (`TournamentsInDays.feature`).

  The way to the previous page is written "<< Previous" and the way to the next
  "Next >>", the marks pointing the way the page turns. They are drawn for
  those who see them and left out of what a screen reader says, which says
  "Previous" and "Next" as it would without them.

  A page beyond the last, which a reader whose list shrank might open from a
  link they kept, sends them to the last page rather than showing nothing.

  A column heading sorts the page the reader is looking at and not the whole
  range, since the range is cut into pages in the order the tournaments start,
  by the application (`TournamentsInDays.feature`), which does not know the
  reader's language and so cannot order names as the reader's page does. The
  first page is always the soonest hundred.

  As everywhere on the public pages, nothing here needs scripting, and what was
  asked is in the address (`navigation.feature`). Both days are asked for or
  neither: opening the page with one is the reader's mistake, and so are days
  that are not days or a first after the last, each refused as the filter
  refuses them (`errors.feature`). Opening the page with neither lists every
  tournament, a hundred to a page.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: The days chosen on another page open this one

    Scenario: The days chosen on the home page open the page of tournaments in them
      Given the home page is open
      And "2026-03-01" is chosen as From
      And "2026-03-31" is chosen as To
      When "Filter" is pressed
      Then the content has the heading "Tournaments from 01 Mar 2026 to 31 Mar 2026"

    Scenario: The days chosen on a year's page open the page of tournaments in them
      Given the page for 2026 is open
      And "2026-03-01" is chosen as From
      And "2026-03-31" is chosen as To
      When "Filter" is pressed
      Then the content has the heading "Tournaments from 01 Mar 2026 to 31 Mar 2026"

    Scenario: A filter chosen goes with the days
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "2026-03-01" is chosen as From
      And "2026-03-31" is chosen as To
      When "Filter" is pressed
      Then "New Zealand" is the country chosen

    Scenario: No days chosen leaves the reader on the page they are on
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the content has the heading "Recent Results"

  Rule: The days chosen on a sport's page keep its sport

    Scenario: The sport of the page is the sport chosen
      Given the page for "gc" in 2026 is open
      And "2026-03-01" is chosen as From
      And "2026-03-31" is chosen as To
      When "Filter" is pressed
      Then "Golf Croquet" is the sport chosen

  Rule: Only tournaments starting from the first day to the last are listed

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-10"

    Scenario: A tournament starting inside the days is listed
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then "Spring Open" is in the days' tournaments

    Scenario: A tournament starting outside the days is not listed
      When the tournaments from "2026-04-01" to "2026-04-30" are opened
      Then "Spring Open" is not in the days' tournaments

    Scenario: Neither day chosen lists every tournament
      When the tournaments are opened
      Then "Spring Open" is in the days' tournaments

  Rule: Each row's dates say their year

    Scenario: A row's dates say the year
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-10"
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then "Spring Open" is dated "10 Mar 2026" in the days' tournaments

  Rule: A hundred tournaments are listed to a page

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 101 tournaments

    Scenario: A hundred are listed on the first page
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then 100 of the days' tournaments are listed

    Scenario: The rest are listed on the next page
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 2
      Then 1 of the days' tournaments is listed

    Scenario: The page is said to be the first of two
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the page is said to be "Page 1 of 2"

    Scenario: The first page offers Next
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the way to turn to the next page is offered

    Scenario: The first page does not offer Previous
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the way to turn to the previous page is not offered

    Scenario: The last page offers Previous
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 2
      Then the way to turn to the previous page is offered

    Scenario: The last page does not offer Next
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 2
      Then the way to turn to the next page is not offered

    Scenario: The way to the previous page is marked with two arrows pointing back
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 2
      Then the way to turn to the previous page reads "<< Previous"

    Scenario: The way to the next page is marked with two arrows pointing on
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the way to turn to the next page reads "Next >>"

    Scenario: A screen reader is not read the arrows
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the way to turn to the next page is named "Next"

    Scenario: Pressing Next lists the next page
      Given the tournaments from "2026-03-01" to "2026-03-31" are open
      When the way to turn to the next page is pressed
      Then 1 of the days' tournaments is listed

    Scenario: Pressing Previous lists the page before
      Given the tournaments from "2026-03-01" to "2026-03-31" are open at page 2
      When the way to turn to the previous page is pressed
      Then 100 of the days' tournaments are listed

    Scenario: A page beyond the last is sent to the last page
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 9
      Then the page is said to be "Page 2 of 2"

  Rule: Where everything fits on one page there is nothing to turn

    Scenario: A hundred tournaments say nothing of pages
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 100 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then no page is said

    Scenario: A hundred tournaments offer neither Previous nor Next
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 100 tournaments
      When the tournaments from "2026-03-01" to "2026-03-31" are opened
      Then the way to turn to the next page is not offered

  Rule: Sorting the list goes back to the first page in that order

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 101 tournaments
      And the tournament is to start at "2026-03-30T00:00:00Z"
      And "organiser@example.com" has created the tournament "Aardvark Open"

    Scenario: The latest start is on the second page to begin with
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 2
      Then "Aardvark Open" is in the days' tournaments

    Scenario: Sorting from the second page goes back to the first
      Given the tournaments from "2026-03-01" to "2026-03-31" are open at page 2
      When the column "Name" of the days' tournaments is pressed
      Then the page is said to be "Page 1 of 2"

    Scenario: Sorting from the second page lists the first name first
      Given the tournaments from "2026-03-01" to "2026-03-31" are open at page 2
      When the column "Name" of the days' tournaments is pressed
      Then the first of the days' tournaments is "Aardvark Open"

    Scenario: The sorting is kept on the second page
      Given the tournaments from "2026-03-01" to "2026-03-31" are open
      And the column "Name" of the days' tournaments is pressed
      When the way to turn to the next page is pressed
      Then "Aardvark Open" is not in the days' tournaments

  Rule: Turning the page keeps what the reader asked

    Background:
      Given the tournament is to start at "2026-03-10T00:00:00Z"
      And "organiser@example.com" has created 101 tournaments

    Scenario: The days are kept
      Given the tournaments from "2026-03-01" to "2026-03-31" are open
      When the way to turn to the next page is pressed
      Then "2026-03-01" is From

    Scenario: The sorting is kept
      Given the tournaments from "2026-03-01" to "2026-03-31" are open
      And the column "Name" of the days' tournaments is pressed
      When the way to turn to the next page is pressed
      Then the column "Name" of the days' tournaments is marked as sorted from the smallest

  Rule: A filter that cannot be is the reader's mistake

    Scenario: A first day without a last is refused
      When the tournaments are opened from "2026-03-01" only
      Then the page is refused with "TournamentFilter.FirstDayWithoutLastDay"

    Scenario: A last day without a first is refused
      When the tournaments are opened to "2026-03-31" only
      Then the page is refused with "TournamentFilter.LastDayWithoutFirstDay"

    Scenario: A first day after the last is refused
      When the tournaments from "2026-04-01" to "2026-03-31" are opened
      Then the page is refused with "TournamentFilter.FirstDayAfterLastDay"

    Scenario: Words that are not a day are refused
      When the tournaments from "soon" to "later" are opened
      Then the page is refused with "TournamentFilter.DayNotADay"

    Scenario: A day with a month there is not is refused
      When the tournaments from "2026-13-45" to "2026-03-31" are opened
      Then the page is refused with "TournamentFilter.DayNotADay"

    Scenario: A day before the year 1000 is refused
      When the tournaments from "0000-01-01" to "2026-01-01" are opened
      Then the page is refused with "TournamentFilter.DayOutOfRange"

    Scenario: A day that is not a day is refused
      When the tournaments from "2026-02-30" to "2026-03-31" are opened
      Then the page is refused with "TournamentFilter.DayNotADay"

    Scenario: A page that is not a whole number is refused
      When the tournaments from "2026-03-01" to "2026-03-31" are opened at page 0
      Then the page is refused with "TournamentsInDays.NoSuchPage"
