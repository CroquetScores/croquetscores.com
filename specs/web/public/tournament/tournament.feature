@browser @postgres
Feature: A tournament's page lists its games, the most recent first

  A tournament's page is where a reader follows it, at its year, its sport
  and its name, as "/2026/ac/spring-open", which is where the home page's
  lists and a year's lead (`home.feature`, `year.feature`). The tournament's
  name is in the header, where every page of the tournament has it, so the
  content does not repeat it above the games: it is the list of every game
  played in it that is in use, the most recently added first
  (`GamesOfTournament.feature`), so that a reader who comes back sees what
  has happened since without looking for it. The list is headed "Recent" and
  drawn as the players' page draws its players, in the section bar's colours
  with every other game on a tint (`players.feature`).

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
  order. A tournament played by teams has the same sections, Players among
  them, with Summary after Recent, the place its teams' standing will be
  shown; and its competitions are its tests, each said as its two teams'
  short names as they are now, the first team's first, with "vs" between,
  as "AUS vs ENG". A Standard tournament has no Summary, since its standing
  is in its competitions. The players' page lists the players
  (`players.feature`), and Commentary leads to the commentaries page, at
  the tournament's address followed by "commentaries", as the old site had
  it, so that a link kept from there still works (`commentaries.feature`);
  the pages of the other sections besides this one do not exist yet, so each
  leads to an address that answers `404` until the feature that provides it
  lands.

  A withdrawn game, and every game of a player who has withdrawn from the
  competition it was played in, is listed, since it was played, but struck
  through and said to be withdrawn, since it counts for nothing
  (`GamesOfTournament.feature`).

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

    Scenario: The tournament's name is in the header
      When the page at "/2026/ac/spring-open" is opened
      Then the header names the tournament "Spring Open"

    Scenario: The content does not begin with the tournament's name
      When the page at "/2026/ac/spring-open" is opened
      Then the page's content has no main heading

    Scenario: The games are under a heading of their own
      When the page at "/2026/ac/spring-open" is opened
      Then the content has the heading "Recent"

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
      Then the header names the tournament "Spring Open"

    Scenario: An old address in another script leads to the tournament's address now
      Given "organiser@example.com" has created the tournament "Кубок"
      And "organiser@example.com" has moved the tournament "Кубок" to the sport "gc"
      When the page at "/2026/ac/кубок" is opened
      Then the header names the tournament "Кубок"

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

  Rule: A game that counts for nothing is struck through

    Scenario: A withdrawn game is marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is marked as withdrawn

    Scenario: A withdrawn game is struck through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is struck through

    Scenario: A withdrawn player's game is marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is marked as withdrawn

    Scenario: A withdrawn player's game is struck through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is struck through

    Scenario: A game that counts is not marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the first game is not marked as withdrawn

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
        | Commentary | /2026/ac/spring-open/commentaries          |
        | Block A    | /2026/ac/spring-open/competitions/block-a  |

    Scenario: A Standard tournament offers no Summary
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Summary" is not offered

    Scenario: An archived competition is not offered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Block B" is not offered

  Rule: A tournament played by teams has Summary after Recent, and its tests said as its teams' short names

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the team is to be known for short as "NZ"
      And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "New Zealand" to "Spring Tests"

    Scenario Outline: The sections are Recent, Summary, Players, Notes, Commentary and the tests in order
      When the page at "/2026/ac/spring-tests" is opened
      Then the <place> section is "<section>"

      Examples:
        | place   | section    |
        | first   | Recent     |
        | second  | Summary    |
        | third   | Players    |
        | fourth  | Notes      |
        | fifth   | Commentary |
        | sixth   | AUS vs ENG |
        | seventh | ENG vs NZ  |

    Scenario: Summary leads to the tournament's summary
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "Summary" leads to "/2026/ac/spring-tests/summary"

    Scenario: Players leads to the tournament's players
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "Players" leads to "/2026/ac/spring-tests/players"

    Scenario: A test leads to its page under the tests
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "AUS vs ENG" leads to "/2026/ac/spring-tests/tests/aus-v-eng"

    Scenario: A test is said as its teams' short names as they are now
      Given "organiser@example.com" has given the team "England" of "Spring Tests" the short name "GBR"
      When the page at "/2026/ac/spring-tests" is opened
      Then the sixth section is "AUS vs GBR"

  Rule: A group of tests is one section, in place of its tests, and a tournament with one has no Summary

    A test can be in a group, as "Block A" (`TestGroup.feature`), whose tests
    are played among themselves, as on the old site, whose "WCF GC World Team
    Championship Tiers 2 & 3" offered Block A, Block B, Tier 2 Championship
    and the rest as its sections. So a group is one section, named as the
    group is, leading to the group's own page (`group.feature`), in place of
    its tests, which the group's page offers. It stands where the first of
    its tests would, and a test in no group stands where it is, as before. A
    tournament with a test in a group has no Summary, as the old site's had
    none: each group's page shows how the teams of that group stand, and one
    table of every team across groups that were never played against each
    other would rank nothing.

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the team is to be known for short as "NZ"
      And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "New Zealand" to "Spring Tests"
      And the test is to be in the group "Block A"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "New Zealand" to "Spring Tests"

    Scenario Outline: The group stands where its first test would, and a test in no group where it is
      When the page at "/2026/ac/spring-tests" is opened
      Then the <place> section is "<section>"

      Examples:
        | place  | section    |
        | first  | Recent     |
        | second | Players    |
        | third  | Notes      |
        | fourth | Commentary |
        | fifth  | AUS vs NZ  |
        | sixth  | Block A    |

    Scenario: The group leads to its page under the groups
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "Block A" leads to "/2026/ac/spring-tests/groups/block-a"

    Scenario: A test in a group is not offered as a section of its own
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "AUS vs ENG" is not offered

    Scenario: The group is offered once however many tests are in it
      When the page at "/2026/ac/spring-tests" is opened
      Then 6 sections are offered

    Scenario: A tournament with a test in a group offers no Summary
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "Summary" is not offered

    Scenario: A group whose tests are all archived is not offered
      Given the test is to be in the group "Block B"
      And "organiser@example.com" has added the test between "New Zealand" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "NZ v ENG" in "Spring Tests"
      When the page at "/2026/ac/spring-tests" is opened
      Then the section "Block B" is not offered

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
