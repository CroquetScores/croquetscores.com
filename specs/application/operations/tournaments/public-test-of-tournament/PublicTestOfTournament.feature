@postgres
Feature: A test of a tournament played by teams, for anybody to read

  A test is a match between two teams of a tournament played by teams, its
  matches each between a player of one team and a player of the other. Its
  pages show it two ways, as the old site's did: as a grid of its matches
  (`test.feature`) and in order of play (`orderOfPlay.feature`). The
  application answers both: the test, found by its slug, with its two teams,
  the first first, by their names and their short names; what each of its
  matches is the best
  of; each match played, with its two sides and its games; how many matches,
  games and hoops each team has; and every game of the test in use, in the order they
  were added, each with when it was added.

  A match is answered once any game of it is played, in the order the first
  game of each was added. Its first side is always the first team's player
  and its second the second team's, whoever won, so that a reader reads the
  first team down one side. Each of its games is answered with each side's
  score as typed, the first side's first, and which side won it, or that it
  was drawn; and the match with the side that won it once it is decided, as
  the competition decides it (`PublicTeamSummaryOfTournament.feature`).

  Each team's matches are the matches its players have won in the test, a
  match counting once it is decided and not before, its games the games its
  players have won in the test, and its
  hoops the points they scored, the points being the number a score starts
  with, so that "26tp" is 26. An archived game is not answered, and counts
  for nothing, as everywhere games are counted.

  A player of a team is answered by their name, and, as the tournament's
  page shows them (`GamesOfTournament.feature`), with the team they play for
  as what they represent, and its flag, for the order of play.

  The pages are a section of the tournament's, so the tournament is answered
  with it as with its games: its name, where it is found now, and its tests
  in use with where each is found.

  Only a test is answered here. A block, a knockout or a Swiss is shown
  otherwise, and asking for one here is refused as
  `PublicTestOfTournament.NotATest`. A slug no competition of the tournament
  has, or an archived competition's, is refused as
  `PublicTestOfTournament.NoSuchCompetition`, and an address no tournament of
  the website has been found at, or an archived tournament's, as
  `PublicTestOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found
  now.

  Nobody need be signed in to ask, and every scenario here asks with nobody
  signed in.

  Where a scenario says nothing else, "Spring Tests" is played by teams, its
  teams "Australia", "AUS", with "Pat Player" and "Pam Partner", and
  "England", "ENG", with "Kim Keeper" and "Ken Kicker", and its test between
  them is expected to have 2 matches, each the best of 1.

  The tournament's subtitle is answered with it, in Markdown as it is kept
  (`TournamentSubtitle.feature`), since every page of a tournament shows it
  beneath its name in the header (`layout.feature`). A tournament with no
  subtitle is answered with none.

  So are its manager's notes, each by its id with when it last changed
  (`PublicManagerNotesOfTournament.feature`), since every page of a
  tournament marks its Notes section while a reader has a note there they
  have not read as it is now (`notes.feature`).

  So are its commentaries, each by its id with when it last changed
  (`CommentariesByTournament.feature`), since every page of a tournament
  marks its Commentary section the same way (`commentaries.feature`).

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the team is to be known for short as "AUS"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And the team is to be known for short as "ENG"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

  Rule: The test is answered by its slug, with its teams and what its matches are the best of

    Scenario: The first team is answered by its short name
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test answered is "AUS"

    Scenario: The first team is answered by its name
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test answered is called "Australia"

    Scenario: The second team is answered by its short name
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the second team of the test answered is "ENG"

    Scenario: What each match is the best of is answered
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the test answered is the best of 3

    Scenario: The tournament is answered with the test
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is called "Spring Tests"

    Scenario: The tournament's subtitle is answered
      Given the tournament "Spring Tests" has the subtitle "Lunch is at **noon**"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered has the subtitle "Lunch is at **noon**"

    Scenario: A tournament with no subtitle is answered with none
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered has no subtitle

    Scenario: The tournament's manager notes are answered with when each last changed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Tests"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Tests" to "Lunch is at one"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first manager note of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: The tournament's commentaries are answered with when each last changed
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Tests"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first commentary of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the tournament answered is found at "2026/gc/spring-tests"

  Rule: Each match played is answered, the first team's player first, in the order it began

    Scenario: A match's first side is the first team's player
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first side of the first match of the test answered is "Pat Player"

    Scenario: A match's second side is the second team's player
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the second side of the first match of the test answered is "Kim Keeper"

    Scenario: The first team's player is the first side whoever won
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first side of the first match of the test answered is "Pat Player"

    Scenario: The matches are in the order they began
      Given "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first side of the first match of the test answered is "Pam Partner"
      And the first side of the second match of the test answered is "Pat Player"

    Scenario: A match not played is not answered
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then 1 match of the test is answered

  Rule: A match is answered with its games, each side's score as typed, and its winner once decided

    Scenario: A game is answered with the first side's score first
      Given "Kim Keeper" has beaten "Pat Player" 26tp to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first side scored "17" in the first game of the first match of the test answered
      And the second side scored "26tp" in the first game of the first match of the test answered

    Scenario: A game is answered with the side that won it
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game of the first match of the test answered was won by the second side

    Scenario: A match's games are oldest first
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game of the first match of the test answered was won by the second side
      And the second game of the first match of the test answered was won by the first side

    Scenario: A match decided is answered with the side that won it
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first match of the test answered was won by its second side

    Scenario: A match not yet decided has no winner
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first match of the test answered is not yet decided

    Scenario: An archived game is not answered
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Pat Player" beating "Kim Keeper" in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then 0 matches of the test are answered

  Rule: Each team is answered with its matches won, its games won and its hoops

    Scenario: A team's matches are the matches its players won
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test is answered with 1 match

    Scenario: The other team's matches are its own players' wins
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the second team of the test is answered with 0 matches

    Scenario: A match not yet decided counts for neither team
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test is answered with 0 matches

    Scenario: A team's games are the games its players won
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test is answered with 1 game

    Scenario: A team's hoops are the points its players scored
      Given "Pat Player" has beaten "Kim Keeper" 26tp to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first team of the test is answered with 46 hoops

    Scenario: The other team's hoops are its own players' points
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the second team of the test is answered with 43 hoops

  Rule: Every game of the test in use is answered, in the order they were added

    Scenario: The games are answered in the order they were added
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game of the test answered was won by "Pat Player"
      And the second game of the test answered was won by "Ken Kicker"

    Scenario: A game's winner is answered as representing their team
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game of the test answered was won by a player representing "Australia"

    Scenario: A game is answered with when it was added
      Given the moment "2026-10-03T10:00:00Z"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then the first game of the test answered was added at "2026-10-03T10:00:00Z"

  Rule: Only a test of a tournament a reader is sent to is answered

    Scenario: A slug no competition has is refused
      When the test "aus-v-nz" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicTestOfTournament.NoSuchCompetition"

    Scenario: A competition that is not a test is refused
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the test "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicTestOfTournament.NotATest"

    Scenario: An address no tournament has been found at is refused
      When the test "aus-v-eng" of the tournament at "2026/ac/autumn-tests" is asked for
      Then it is refused with "PublicTestOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the test "aus-v-eng" of the tournament at "2026/ac/spring-tests" is asked for
      Then it is refused with "PublicTestOfTournament.NoSuchTournament"
