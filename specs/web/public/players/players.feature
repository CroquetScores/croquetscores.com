@browser @postgres
Feature: A tournament's players' page lists its players by name

  A tournament's page has a section of its players, at its address followed
  by "players", as "/2026/ac/spring-open/players" (`tournament.feature`). It
  lists every player of the tournament who is not archived, in alphabetical
  order of their names, so that a reader can find one by name
  (`PublicPlayersOfTournament.feature`). Each is shown as they are on the
  tournament's page: their name, what they represent in brackets, drawn
  lighter than the name, and the flag they fly, where they have either. Each
  leads to the player's own page, at the players' page's address followed by
  their slug, as "/2026/ac/spring-open/players/sam-someone"
  (`addPlayer.feature`), which does not exist yet and so answers `404` until
  the feature that provides it lands.

  The tournament's name is in the header, so the content does not repeat it:
  the players are under a heading of their own, and its sections are the
  tournament's, with Players marked as the section being read.

  A tournament played by teams has no players of its own, only its teams', so
  its players' page lists them team by team: each team under a heading of its
  name, as "Australia", coloured as the section bar is, in the tournament's
  order of its teams, and its players beneath it in alphabetical order of
  their names, each by their name alone, since their team is the heading
  above them, and leading to their own page (`player.feature`). There is no
  heading of "Players" above the teams, since the section bar says it already
  and the teams' names head the lists. An archived tournament has no players'
  page, nor one the website has never had. An address the tournament has
  moved on from leads to its players' page where it is found now, so that a
  link kept from before still works.

  Where a scenario says nothing else, a tournament is for the sport "ac",
  starts on 3 October 2026, and its players represent nothing and fly no flag.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The page is the tournament's players, for anybody

    Scenario: The tournament's name is in the header
      When the page at "/2026/ac/spring-open/players" is opened
      Then the header names the tournament "Spring Open"

    Scenario: The content does not begin with the tournament's name
      When the page at "/2026/ac/spring-open/players" is opened
      Then the page's content has no main heading

    Scenario: The players are under a heading of their own
      When the page at "/2026/ac/spring-open/players" is opened
      Then the content has the heading "Players"

    Scenario: A reader not signed in is shown the players
      Given nobody is signed in
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then "Sam Someone" is among the players

    Scenario: A tournament with no players says so
      When the page at "/2026/ac/spring-open/players" is opened
      Then the players' page says there are no players

    Scenario: A tournament with players does not say there are none
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the players' page does not say there are no players

  Rule: Every player not archived is listed, in alphabetical order

    Scenario: The players are listed in alphabetical order of their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the first player is "Alex Another"
      And the second player is "Sam Someone"

    Scenario: An archived player is not listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then "Sam Someone" is not among the players

    Scenario: A player who represents nothing has nothing in brackets
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the player "Alex Another" represents nothing

  Rule: Each player is shown with what they represent and their flag, and leads to their page

    Background:
      Given the player is to represent "Canterbury Croquet Club"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"

    Scenario: What a player represents is shown in brackets
      When the page at "/2026/ac/spring-open/players" is opened
      Then the player "Sam Someone" represents "(Canterbury Croquet Club)"

    Scenario: What a player represents is drawn lighter than their name
      When the page at "/2026/ac/spring-open/players" is opened
      Then what the player "Sam Someone" represents is lighter than their name

    Scenario: The flag a player flies is shown
      When the page at "/2026/ac/spring-open/players" is opened
      Then the player "Sam Someone" shows the flag of "nz"

    Scenario: The flag is named for a screen reader by its country
      When the page at "/2026/ac/spring-open/players" is opened
      Then the flag "Sam Someone" flies is named "New Zealand"

    Scenario: A player's name leads to their page
      Given the page at "/2026/ac/spring-open/players" is open
      When the player "Sam Someone" is pressed
      Then the address is "/2026/ac/spring-open/players/sam-someone"

  Rule: Its sections are the tournament's, with Players marked

    Scenario: Players is marked as the section being read
      When the page at "/2026/ac/spring-open/players" is opened
      Then the section "Players" is marked as current

    Scenario: Recent is not marked
      When the page at "/2026/ac/spring-open/players" is opened
      Then the section "Recent" is not marked as current

    Scenario: Recent leads to the tournament's page
      When the page at "/2026/ac/spring-open/players" is opened
      Then the section "Recent" leads to "/2026/ac/spring-open"

  Rule: A tournament played by teams lists its players under each team's name

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"

    Scenario: Each team is headed by its name, in the tournament's order
      When the page at "/2026/ac/spring-tests/players" is opened
      Then the first team on the players' page is headed "Australia"
      And the second team on the players' page is headed "England"

    Scenario: The teams are under no heading of "Players"
      When the page at "/2026/ac/spring-tests/players" is opened
      Then the content has no heading "Players"

    Scenario: A team's players are beneath it in alphabetical order
      When the page at "/2026/ac/spring-tests/players" is opened
      Then the first player of the team "Australia" on the players' page is "Pam Partner"
      And the second player of the team "Australia" on the players' page is "Pat Player"

    Scenario: A team's player leads to their own page
      Given the page at "/2026/ac/spring-tests/players" is open
      When the player "Kim Keeper" is pressed
      Then the address is "/2026/ac/spring-tests/players/kim-keeper"

    Scenario: Players is marked as the section being read
      When the page at "/2026/ac/spring-tests/players" is opened
      Then the section "Players" is marked as current

  Rule: An address with no players' page a reader is sent to is not a page

    Scenario: An address no tournament has been found at is not found
      When the page at "/2026/ac/autumn-open/players" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's players are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the players' page where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the address is "/2026/gc/spring-open/players"

    Scenario: An old address in another script leads to the players' page where the tournament is now
      Given "organiser@example.com" has created the tournament "Кубок"
      And "organiser@example.com" has moved the tournament "Кубок" to the sport "gc"
      When the page at "/2026/ac/кубок/players" is opened
      Then the header names the tournament "Кубок"

  Rule: The page fits a phone

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "organiser@example.com" has added the player "Bartholomew Montgomery-Fitzwilliam" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then the page is no wider than the window

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the tournament's name, and its players' names and what they
    represent, which are what its manager called them. A tournament played by
    teams says nothing else, its teams' names being its managers' too.

    Scenario: The players are in the reader's language
      Given a browser that asks for "en-XA"
      And the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the page at "/2026/ac/spring-open/players" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: A page with no players says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-open/players" is opened
      Then every word in the page's content but the tournament's own is in the test locale
