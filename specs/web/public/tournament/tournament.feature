@browser @postgres
Feature: A tournament's page lists its games, the most recent first

  A tournament's page is where a reader follows it, at its year, its sport
  and its name, as "/2026/ac/spring-open", which is where the home page's
  lists and a year's lead (`home.feature`, `year.feature`). It is headed by
  the tournament's name, and lists every game played in it that is in use,
  the most recently added first (`GamesOfTournament.feature`), so that a
  reader who comes back sees what has happened since without looking for it.

  A game takes two lines. The first is the winner: their name, what they
  represent in brackets, the flag they fly, their score, and "beat". The
  second is the loser: their name, what they represent, their flag and their
  score. A player who represents nothing, or flies no flag, has nothing in
  its place. What a player represents is drawn lighter than their name, since
  the names are what a reader is looking for. A drawn game says "drew with"
  where a game won says "beat".

  Beside the two lines, on a screen at least 38rem wide, is a column of what
  the game was part of: the competition it was played in, which leads to the
  competition's page, beside the winner, and how long ago it was added beside
  the loser, against the column's right edge. On a phone there is no room
  beside the names, so the column comes beneath them. The games are no wider
  than 38rem, so that on a wide screen the column stays within a glance of the
  names, and a light line runs between one game and the next, so that a pair
  of lines is read as one game rather than run on into the next.

  How long ago is said as a reader would say it: in seconds under a minute,
  "20 sec"; in minutes under an hour, "12 min"; in hours under a day, "1 hour"
  or "5 hours", each counted down to the whole second, minute or hour; and
  from a day on, the day it was added, in UTC as a tournament's days are,
  "02 Oct 2026", its month named in the reader's language. It is worked out
  when the page is drawn, by the server's clock.

  The secondary navigation is the tournament's sections: Recent, which is
  this page and is marked as the section being read, then Players, Notes and
  Commentary, then each of its competitions in use, in the tournament's
  order. A test is among the competitions, by its name. The pages of the
  sections besides this one do not exist yet, so each leads to an address
  that answers `404` until the feature that provides it lands.

  An address a tournament has moved on from leads to where it is found now,
  so that a link kept from before still works. An address no tournament of
  the website has been found at is not a page, and nor is an archived
  tournament's.

  Where a scenario says nothing else, a tournament is for the sport "ac",
  starts on 3 October 2026, and is played in the region "vic" of the country
  "au", and its players represent nothing and fly no flag.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The page is the tournament's, for anybody

    Scenario: The page is headed by the tournament's name
      When the page at "/2026/ac/spring-open" is opened
      Then the page is headed "Spring Open"

    Scenario: A reader not signed in is shown the games
      Given nobody is signed in
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is of "Sam Someone" beating "Alex Another"

    Scenario: A tournament with no games says so
      When the page at "/2026/ac/spring-open" is opened
      Then the page says there are no games

    Scenario: A tournament with games does not say there are none
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the page does not say there are no games

  Rule: An address with no tournament a reader is sent to is not a page

    Scenario: An address no tournament has been found at is not found
      When the page at "/2026/ac/autumn-open" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's page is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A tournament on another website is not found
      Given a site served as "gateballscores.com"
      When the page at "/2026/ac/spring-open" is opened
      Then the page says the words for "errors.notFound"

  Rule: An address the tournament has moved on from leads to where it is now

    Scenario: An old address leads to the tournament's address now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open" is opened
      Then the address is "/2026/gc/spring-open"

    Scenario: The tournament is shown at its address now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open" is opened
      Then the page is headed "Spring Open"

  Rule: Every game in use is listed, the most recently added first

    Scenario: The game added most recently is first
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is of "Chris Third" beating "Sam Someone"
      And the second game is of "Sam Someone" beating "Alex Another"

    Scenario: An archived game is not listed
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the page says there are no games

  Rule: A game is the winner on one line and the loser on the next

    Background:
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The winner is on the first line
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game names "Sam Someone"

    Scenario: The loser is on the second line
      When the page at "/2026/ac/spring-open" is opened
      Then the second line of the first game names "Alex Another"

    Scenario: The winner's score is on the first line
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game scores "26"

    Scenario: The loser's score is on the second line
      When the page at "/2026/ac/spring-open" is opened
      Then the second line of the first game scores "17"

    Scenario: The winner beat the loser
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game ends with "beat"

    Scenario: A player who represents nothing has nothing in brackets
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game represents nothing

    Scenario: A player who flies no flag has no flag
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game shows no flag

  Rule: A player is shown with what they represent, drawn lighter than their name, and their flag

    Background:
      Given the player is to represent "Canterbury Croquet Club"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"

    Scenario: What a player represents is shown in brackets
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game represents "(Canterbury Croquet Club)"

    Scenario: The flag a player flies is shown
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game shows the flag of "nz"

    Scenario: The flag is named for a screen reader by its country
      When the page at "/2026/ac/spring-open" is opened
      Then the flag on the first line of the first game is named "New Zealand"

    Scenario: What a player represents is drawn lighter than their name
      When the page at "/2026/ac/spring-open" is opened
      Then what the first line of the first game represents is lighter than its name

  Rule: A drawn game says the two drew

    Scenario: A drawn game says "drew with"
      Given "organiser@example.com" has created the tournament "Autumn Open" allowing drawn games
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Autumn Open"
      When the page at "/2026/ac/autumn-open" is opened
      Then the first line of the first game ends with "drew with"

  Rule: Beside a game is its competition and how long ago it was added

    Background:
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The competition is beside the winner
      When the page at "/2026/ac/spring-open" is opened
      Then the first line of the first game is beside "Block A"

    Scenario: The competition leads to its page
      Given the page at "/2026/ac/spring-open" is open
      When the competition of the first game is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a"

    Scenario: How long ago it was added is beside the loser
      Given the server's clock reads "2026-10-03T10:12:00Z"
      When the page at "/2026/ac/spring-open" is opened
      Then the second line of the first game is beside "12 min"

    Scenario Outline: How long ago is said as a reader would say it
      Given the server's clock reads "<now>"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game was added "<ago>" ago

      Examples:
        | now                  | ago         |
        | 2026-10-03T10:00:00Z | 0 sec       |
        | 2026-10-03T10:00:20Z | 20 sec      |
        | 2026-10-03T10:00:59Z | 59 sec      |
        | 2026-10-03T10:01:00Z | 1 min       |
        | 2026-10-03T10:01:59Z | 1 min       |
        | 2026-10-03T10:59:59Z | 59 min      |
        | 2026-10-03T11:00:00Z | 1 hour      |
        | 2026-10-03T12:59:00Z | 2 hours     |
        | 2026-10-04T09:59:00Z | 23 hours    |
        | 2026-10-04T10:00:00Z | 03 Oct 2026 |
        | 2026-11-20T08:00:00Z | 03 Oct 2026 |

    Scenario: The day it was added is the day in UTC
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-03T23:30:00Z"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-05T10:00:00Z"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game was added "03 Oct 2026" ago

    Scenario: The day's month is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And the server's clock reads "2026-10-05T10:00:00Z"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game was added "03 oct 2026" ago

  Rule: The column beside the games is beside them from a width of 38rem, and beneath them on a phone

    Background:
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: On a screen wider than 38rem the competition is to the right of the winner
      Given a viewport 800 pixels wide
      When the page at "/2026/ac/spring-open" is opened
      Then the competition of the first game is to the right of its winner

    Scenario: On a phone the competition is beneath the loser
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open" is opened
      Then the competition of the first game is beneath its loser

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open" is opened
      Then the page is no wider than the window

  Rule: The sections are Recent, Players, Notes, Commentary and the competitions

    Scenario Outline: The tournament's own sections come first
      When the page at "/2026/ac/spring-open" is opened
      Then the <place> section is "<section>"

      Examples:
        | place  | section    |
        | first  | Recent     |
        | second | Players    |
        | third  | Notes      |
        | fourth | Commentary |
        | fifth  | Block A    |

    Scenario: Recent is marked as the section being read
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Recent" is marked as current

    Scenario: A competition is not marked
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Block A" is not marked as current

    Scenario Outline: Each section leads to its page
      When the page at "/2026/ac/spring-open" is opened
      Then the section "<section>" leads to "<address>"

      Examples:
        | section    | address                                    |
        | Recent     | /2026/ac/spring-open                       |
        | Players    | /2026/ac/spring-open/players               |
        | Notes      | /2026/ac/spring-open/notes                 |
        | Commentary | /2026/ac/spring-open/commentary            |
        | Block A    | /2026/ac/spring-open/competitions/block-a  |

    Scenario: An archived competition is not offered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Block B" is not offered

    Scenario: A test leads to its page under the tests
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "AUS v ENG" leads to "/2026/ac/spring-tests/tests/aus-v-eng"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the tournament's name, its players' names and what they
    represent, which are what its manager called them, the competitions'
    names, the scores, which are as they were typed, and the day a game was
    added, whose month is named in the reader's language but whose day and
    year are numbers.

    Scenario: The games are in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-03T10:12:00Z"
      When the page at "/2026/ac/spring-open" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: A page with no games says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-open" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: The sections are named in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-open" is opened
      Then the first section is in the test locale
