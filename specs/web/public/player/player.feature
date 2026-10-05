@browser @postgres
Feature: A player's page shows their games and their competitions

  A tournament's players' page leads to each player's own, at its address
  followed by the player's slug, as "/2026/ac/spring-open/players/sam-someone"
  (`players.feature`). It is headed by the player's name, and shows two
  things (`PublicPlayerOfTournament.feature`).

  Their games, the most recently added first, each said as the player played
  it: "beat", "lost to" or "drew with", the opponent's name, and the score,
  the player's first, as "26 to 17". The opponent's name leads to the
  opponent's own page, since a reader following one player is soon following
  who they played.

  Their competitions, the last of the tournament's first, each leading to the
  competition's page, which does not exist yet and so answers `404` until the
  feature that provides it lands.

  On a screen of medium width or wider, 38rem as the tournament's page has
  it (`tournament.feature`), the games and the competitions are two columns
  side by side, the games first. On a phone there is room for one, and the
  competitions come first, since they are short and say where the player is
  playing before the games say how.

  Its sections are the tournament's, with Players marked, since a player is
  one of the tournament's players.

  A player in a team of a tournament played by teams has a page too, at the
  same address followed by their slug, as
  "/2026/ac/spring-tests/players/pat-player", reached from the team they are
  listed under on the players' page. It is the same page: their games in the
  tests, each against a player of the other team whose name leads to that
  player's page, followed by that team's short name in brackets, as
  "lost to Kim Keeper (ENG) 17 to 26", and the tests their team plays in, each said as the section
  bar says it, by the two teams' short names with "vs" between, as
  "AUS vs ENG", and leading to the test's page.

  A player who is archived, a player of an archived team, and a slug no
  player has are not pages; nor is any player of an archived tournament, or
  one the website never had. An address the
  tournament has moved on from leads to the player where the tournament is
  now.

  Where a scenario says nothing else, the tournament is for the sport "ac"
  and starts on 3 October 2026, and its block is the best of 3, so that two
  players can meet more than once.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The page is the player's, for anybody

    Scenario: The page is headed by the player's name
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the page is headed "Sam Someone"

    Scenario: The games are headed
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the content has the heading "Games"

    Scenario: The competitions are headed
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the content has the heading "Competitions"

    Scenario: A reader not signed in is shown the player's games
      Given nobody is signed in
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the first of the player's games says "beat Alex Another 26 to 17"

  Rule: Each game is said as the player played it, the most recently added first

    Scenario: A game won says the player beat their opponent
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the first of the player's games says "beat Alex Another 26 to 17"

    Scenario: A game lost says the player lost to their opponent, their own score first
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the first of the player's games says "lost to Alex Another 17 to 26"

    Scenario: A drawn game says the player drew with their opponent
      Given "organiser@example.com" has created the tournament "Autumn Open" allowing drawn games
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Autumn Open"
      When the page at "/2026/ac/autumn-open/players/sam-someone" is opened
      Then the first of the player's games says "drew with Alex Another 17 to 17"

    Scenario: The game added most recently is first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the first of the player's games says "lost to Alex Another 20 to 26"
      And the second of the player's games says "beat Alex Another 26 to 17"

    Scenario: An archived game is not shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the page says the player has no games

    Scenario: A player with games does not say they have none
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the page does not say the player has no games

    Scenario: The opponent leads to their own page
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the page at "/2026/ac/spring-open/players/sam-someone" is open
      When the opponent in the first of the player's games is pressed
      Then the address is "/2026/ac/spring-open/players/alex-another"

  Rule: The competitions are the last of the tournament's first, each leading to its page

    Scenario: The competitions are in reverse of the tournament's order
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the first of the player's competitions is "Block B"
      And the second of the player's competitions is "Block A"

    Scenario: A competition the player is not entered in is not shown
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then "Block B" is not among the player's competitions

    Scenario: A competition leads to its page
      Given the page at "/2026/ac/spring-open/players/sam-someone" is open
      When the competition "Block A" of the player is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a"

    Scenario: A player in no competition says so
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      When the page at "/2026/ac/spring-open/players/chris-third" is opened
      Then the page says the player is in no competition

  Rule: The games and the competitions are side by side from a medium width, and the competitions first on a phone

    Background:
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: On a screen of medium width the competitions are to the right of the games
      Given a viewport 800 pixels wide
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the player's competitions are to the right of their games

    Scenario: On a phone the competitions are above the games
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the player's competitions are above their games

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the page is no wider than the window

  Rule: Its sections are the tournament's, with Players marked

    Scenario: Players is marked as the section being read
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the section "Players" is marked as current

    Scenario: Players leads to the tournament's players
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the section "Players" leads to "/2026/ac/spring-open/players"

  Rule: A player in a team has a page as a tournament's own player has

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

    Scenario: A team's player's page is headed by their name
      When the page at "/2026/ac/spring-tests/players/pat-player" is opened
      Then the page is headed "Pat Player"

    Scenario: A team's player's game in a test is said as they played it
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/players/pat-player" is opened
      Then the first of the player's games says "lost to Kim Keeper (ENG) 17 to 26"

    Scenario: A team's player's opponent leads to their own page
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page at "/2026/ac/spring-tests/players/pat-player" is open
      When the opponent in the first of the player's games is pressed
      Then the address is "/2026/ac/spring-tests/players/kim-keeper"

    Scenario: The test a team's player's team plays in is said by its teams' short names
      When the page at "/2026/ac/spring-tests/players/pat-player" is opened
      Then the first of the player's competitions is "AUS vs ENG"

    Scenario: The test leads to its page
      Given the page at "/2026/ac/spring-tests/players/pat-player" is open
      When the competition "AUS vs ENG" of the player is pressed
      Then the address is "/2026/ac/spring-tests/tests/aus-v-eng"

    Scenario: A team's player is reached from the players' page
      Given the page at "/2026/ac/spring-tests/players" is open
      When the player "Pat Player" is pressed
      Then the address is "/2026/ac/spring-tests/players/pat-player"

    Scenario: Players is marked as the section being read on a team's player's page
      When the page at "/2026/ac/spring-tests/players/pat-player" is opened
      Then the section "Players" is marked as current

    Scenario: A player of an archived team is not found
      Given "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      And "organiser@example.com" has added the player "Nat Newman" to the team "New Zealand" of "Spring Tests"
      And "organiser@example.com" has archived the team "New Zealand" in "Spring Tests"
      When the page at "/2026/ac/spring-tests/players/nat-newman" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A team's player's page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/players/pat-player" is opened
      Then every word in the page's content but the tournament's own is in the test locale

  Rule: An address with no player a reader is sent to is not a page

    Scenario: A slug no player has is not found
      When the page at "/2026/ac/spring-open/players/pat-player" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived player is not found
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has archived the player "Pat Player" in "Spring Open"
      When the page at "/2026/ac/spring-open/players/pat-player" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's players are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the player where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then the address is "/2026/gc/spring-open/players/sam-someone"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the player's name and their opponents', the competitions'
    names and the scores, which are what the tournament's managers and scorers
    typed.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/players/sam-someone" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: A player with nothing yet says so in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      When the page at "/2026/ac/spring-open/players/chris-third" is opened
      Then every word in the page's content but the tournament's own is in the test locale
