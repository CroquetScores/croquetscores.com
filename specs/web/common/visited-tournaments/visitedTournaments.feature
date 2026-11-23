@browser @postgres
Feature: The home page lists the tournaments a reader visited lately

  A reader who follows a tournament comes back to it again and again, and
  should not have to find it in the lists each time. So the device remembers
  the tournaments it has visited, and the home page lists them, headed "Your
  Recent Tournaments", between the filter and the recent results
  (`home.feature`), each as a row of the other lists are, leading to the
  tournament.

  What is remembered is the five tournaments visited most lately, the latest
  first. Visiting a tournament puts it first, and if it was already in the
  list it is moved there and not listed twice. A sixth visit pushes the one
  visited longest ago out.

  A tournament is visited by opening its own page, at its year, its sport and
  its name (`tournament.feature`). The page of one of its players or
  competitions is not its page, and does not count, so a reader who only ever
  reads a player's results is not shown tournaments they never opened. Nor
  does an address that is no tournament's.

  It is kept in a cookie, as the sorting and the filter are
  (`rememberedSorting.feature`), because the home page is drawn by the server
  before any script could read it, and so that nothing is kept about who the
  reader is. A device that has visited nothing has no cookie, and its home
  page has no such list, rather than a heading over nothing.

  The list is the reader's own, so the filter does not narrow it: a reader who
  has chosen a country is still shown the tournament they were reading. It is
  listed as the tournaments are, by what each is called now, and a tournament
  that is archived or gone is left out of it without a word, since the
  reader made no mistake (`TournamentsAtAddresses.feature`).

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has created the tournament "Autumn Open"
    And "organiser@example.com" has created the tournament "Winter Open"

  Rule: A device that has visited no tournament is shown no list

    Scenario: The list is not shown before a tournament is visited
      When the home page is opened
      Then the home page has no list of visited tournaments

    Scenario: Opening the home page is not visiting a tournament
      Given the home page is open
      When the home page is opened
      Then the home page has no list of visited tournaments

    Scenario: Opening a tournament that is not there is not visiting one
      Given the page at "/2026/ac/no-such-open" is open
      When the home page is opened
      Then the home page has no list of visited tournaments

  Rule: A visited tournament is listed

    Scenario: The list is headed
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened
      Then the content has the heading "Your Recent Tournaments"

    Scenario: A tournament visited is listed
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened
      Then 1 visited tournament is listed

    Scenario: The tournament visited is the one listed
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened
      Then the first of the visited tournaments is "Spring Open"

    Scenario: A tournament's players page is not a second visit
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/spring-open/players" is open
      When the home page is opened
      Then 1 visited tournament is listed

    Scenario: The list is below the filter
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened
      Then the visited tournaments are below the filter

    Scenario: The list is above the recent results
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened
      Then the visited tournaments are above the recent results

    Scenario: A row leads to its tournament
      Given the page at "/2026/ac/spring-open" is open
      And the home page is open
      When the name of "Spring Open" in the visited tournaments is pressed
      Then the address is "/2026/ac/spring-open"

    Scenario: The filter does not narrow the list
      Given the page at "/2026/ac/spring-open" is open
      When the home page is opened for the country "au"
      Then the first of the visited tournaments is "Spring Open"

  Rule: The tournament visited latest is first

    Scenario: The latest visited is first
      Given the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      When the home page is opened
      Then the first of the visited tournaments is "Autumn Open"

    Scenario: The one before is second
      Given the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      When the home page is opened
      Then the second of the visited tournaments is "Spring Open"

  Rule: A tournament visited again moves to the top and is not listed twice

    Background:
      Given the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And the page at "/2026/ac/winter-open" is open
      And the page at "/2026/ac/spring-open" is open

    Scenario: The tournament visited again is first
      When the home page is opened
      Then the first of the visited tournaments is "Spring Open"

    Scenario: The one visited last before it is second
      When the home page is opened
      Then the second of the visited tournaments is "Winter Open"

    Scenario: The one visited before that is third
      When the home page is opened
      Then the third of the visited tournaments is "Autumn Open"

    Scenario: The tournament is listed once
      When the home page is opened
      Then 3 visited tournaments are listed

  Rule: Only the five visited latest are listed

    Background:
      Given "organiser@example.com" has created the tournament "Summer Open"
      And "organiser@example.com" has created the tournament "Cup Open"
      And "organiser@example.com" has created the tournament "Plate Open"
      And the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And the page at "/2026/ac/winter-open" is open
      And the page at "/2026/ac/summer-open" is open
      And the page at "/2026/ac/cup-open" is open
      And the page at "/2026/ac/plate-open" is open

    Scenario: Five are listed
      When the home page is opened
      Then 5 visited tournaments are listed

    Scenario: The latest is first
      When the home page is opened
      Then the first of the visited tournaments is "Plate Open"

    Scenario: The one visited longest ago is left out
      When the home page is opened
      Then "Spring Open" is not among the visited tournaments

    Scenario: The one visited just before is the last
      When the home page is opened
      Then the fifth of the visited tournaments is "Autumn Open"

  Rule: Visiting a tournament already listed pushes none out

    Scenario: A list of five visited again is still five
      Given "organiser@example.com" has created the tournament "Summer Open"
      And "organiser@example.com" has created the tournament "Cup Open"
      And the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And the page at "/2026/ac/winter-open" is open
      And the page at "/2026/ac/summer-open" is open
      And the page at "/2026/ac/cup-open" is open
      And the page at "/2026/ac/cup-open" is open
      When the home page is opened
      Then 5 visited tournaments are listed

    Scenario: The one visited longest ago is still listed
      Given "organiser@example.com" has created the tournament "Summer Open"
      And "organiser@example.com" has created the tournament "Cup Open"
      And the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And the page at "/2026/ac/winter-open" is open
      And the page at "/2026/ac/summer-open" is open
      And the page at "/2026/ac/cup-open" is open
      And the page at "/2026/ac/cup-open" is open
      When the home page is opened
      Then the fifth of the visited tournaments is "Spring Open"

  Rule: A tournament that is gone is left out

    Scenario: An archived tournament is not listed
      Given the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the home page is opened
      Then "Spring Open" is not among the visited tournaments

    Scenario: The others are still listed
      Given the page at "/2026/ac/spring-open" is open
      And the page at "/2026/ac/autumn-open" is open
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the home page is opened
      Then the first of the visited tournaments is "Autumn Open"

    Scenario: The list is not shown once none is left
      Given the page at "/2026/ac/spring-open" is open
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the home page is opened
      Then the home page has no list of visited tournaments

  Rule: What is remembered stays on the device

    Scenario: Another device is shown none
      Given the page at "/2026/ac/spring-open" is open
      And the reader opens another browser
      When the home page is opened
      Then the home page has no list of visited tournaments

    Scenario: What is remembered does not name the reader
      Given a reader signed in as "organiser@example.com"
      And the page at "/2026/ac/spring-open" is open
      Then the cookie that remembers the visited tournaments does not name "organiser@example.com"

    Scenario: A cookie nobody can make sense of is taken as none
      Given the cookie that remembers the visited tournaments is set to "%E0%A4%A"
      When the home page is opened
      Then the home page has no list of visited tournaments

  Rule: On a phone a tournament of this year says no year, and one of another year says it beneath its dates

    The list is of tournaments of any year, so its dates say their year
    (`home.feature` says the other lists' do not). On a phone the room is wanted
    for the names, and most of what a reader visited lately is of the year they
    are in, so a year that is this year, by the server's clock, is left out of
    the dates, and any other is put on a line of its own beneath them, where it
    does not make the column wider. From a tablet's width there is room, and
    every year is said beside the dates as it was.

    Background:
      Given a viewport 375 pixels wide
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      And the tournament "Autumn Open" starts on "2025-10-10"
      And the tournament "Autumn Open" finishes on "2025-10-12"
      And the page at "/2026/ac/spring-open" is open
      And the page at "/2025/ac/autumn-open" is open

    Scenario: A tournament of this year says no year
      When the home page is opened
      Then the dates of "Spring Open" in the visited tournaments are on 1 line
      And the first line of the dates of "Spring Open" in the visited tournaments is "10-12 Oct"

    Scenario: A tournament of another year says its year on a second line
      When the home page is opened
      Then the dates of "Autumn Open" in the visited tournaments are on 2 lines
      And the first line of the dates of "Autumn Open" in the visited tournaments is "10-12 Oct"
      And the second line of the dates of "Autumn Open" in the visited tournaments is "2025"

    Scenario: The dates fit their column
      When the home page is opened
      Then the dates of the visited tournaments fit their column

    Scenario: From a tablet's width a tournament of this year says its year beside its dates
      Given a viewport 768 pixels wide
      When the home page is opened
      Then the dates of "Spring Open" in the visited tournaments are on 1 line
      And "Spring Open" is dated "10-12 Oct 2026" in the visited tournaments
