@browser @postgres
Feature: The page where an administrator reads the tournaments played in countries the world rankings do not list

  The page at /admin/administrator/countries is one of the administrator's
  pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`).

  The world rankings keep a list of the events they have ranked for
  Association Croquet and another for Golf Croquet, and each names the
  countries it has. A tournament played in a country the list of its own sport
  does not name is one whose country is worth checking: the import from the
  old sites takes a tournament's country from these lists where it can, and
  from its time zone where it cannot, which says little of where it was
  played. The page lists those tournaments, so that an administrator can
  follow each to where the old site shows it and see whether the country is
  right (`TournamentsInUnlistedCountries.feature`).

  It is headed Countries, and lists a row for each tournament played in a
  country its sport's list does not name. A row says the country, by its name,
  and the tournament, by its name, and has a link to where the old site shows
  the tournament, at croquetscores.com. The rows are in order of the country's
  name, those of one country by the day the tournament started and then by its
  name. Where there is none, the page says so rather than showing an empty
  list.

  A tournament is judged by the list of its own sport: a country only the
  Golf Croquet list names is not one an Association Croquet tournament was
  ranked in, so such a tournament is listed. A sport with no list of its own
  cannot be judged, and its tournaments are not listed.

  Who may open the page is the same as for the administrator's other pages
  (`administrator.feature`), and is not said again here.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be for the sport "ac"

  Rule: The page lists the tournaments played in a country the list of their sport does not name

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/countries" is opened
      Then the page's heading is "Countries"

    Scenario: A tournament in a country no list names is listed
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's tournament is "Fiji Open"

    Scenario: A tournament in a country the Association Croquet list names is not listed
      Given the Association Croquet world rankings list names the country "Australia"
      And the tournament is to be played in the country "au"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the page at "/admin/administrator/countries" is opened
      Then the page says no tournament is played in a country the lists do not name

    Scenario: A tournament in a country the Golf Croquet list names is not listed
      Given the Golf Croquet world rankings list names the country "New Zealand"
      And the tournament is to be for the sport "gc"
      And the tournament is to be played in the country "nz"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the page at "/admin/administrator/countries" is opened
      Then the page says no tournament is played in a country the lists do not name

    Scenario: A tournament in a country only the other sport's list names is listed
      Given the Golf Croquet world rankings list names the country "Mauritius"
      And the tournament is to be played in the country "mu"
      And "organiser@example.com" has created the tournament "Mauritius Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's tournament is "Mauritius Open"

    Scenario: The page says so where there is none
      When the page at "/admin/administrator/countries" is opened
      Then the page says no tournament is played in a country the lists do not name

  Rule: A row says the country and the tournament, and links to the old site

    Scenario: A row has the country's name
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's country is "Fiji"

    Scenario: A row links to where the old site shows the tournament
      Given the tournament is to be played in the country "fj"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's link to the old site leads to "https://croquetscores.com/2026/ac/fiji-open"

    Scenario: The link names the tournament's sport
      Given the tournament is to be played in the country "fj"
      And the tournament is to be for the sport "gc"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's link to the old site leads to "https://croquetscores.com/2026/gc/fiji-open"

  Rule: The rows are in order of country, then the day the tournament started, then its name

    Scenario: Rows are in order of the country's name
      Given the tournament is to be played in the country "ws"
      And "organiser@example.com" has created the tournament "Samoa Open"
      And the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's country is "Fiji"
      And the second row's country is "Samoa"

    Scenario: Rows of one country are in order of the day the tournament started
      Given the tournament is to be played in the country "fj"
      And the tournament is to start at "2026-10-05T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Plate"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's tournament is "Fiji Open"
      And the second row's tournament is "Fiji Plate"

    Scenario: Rows of one country and day are in order of the tournament's name
      Given the tournament is to be played in the country "fj"
      And "organiser@example.com" has created the tournament "Fiji Plate"
      And "organiser@example.com" has created the tournament "Fiji Open"
      When the page at "/admin/administrator/countries" is opened
      Then the first row's tournament is "Fiji Open"
      And the second row's tournament is "Fiji Plate"
