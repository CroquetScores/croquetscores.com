@browser @postgres
Feature: A team's page in the admin

  /admin/{year}/{sport}/{slug}/teams/{team slug} is where a manager sees one
  of a tournament's teams and its players, having pressed the team's name or
  its View on the tournament's Teams tab (`teams-tab.feature`). It is headed
  by the team's name with its short name after it in brackets, as "Australia
  (AUS)", as the Teams tab shows a team, and its flag beside it, so that a
  manager who came to the wrong team sees so at once.

  It has one thing to show, the team's players (`team-players.feature`), so it
  has no tabs: the list is the page.

  The page has the tournament's section bar (`TournamentSections.feature`),
  which on a team's page is Tournament and then each team in use, by its
  short name, with this team marked as the section being read, and
  Tournament leads back to the tournament's page.

  A team's players are the managers' to say, and a scorer has no part in
  them: a scorer enters a test's scores, and is offered the test's players
  there (`test-score.feature`). So the page is refused to anybody but a
  manager, by the refusal's code in place of the list, as the tournament's
  page refuses them (`view.feature` beneath the tournament):
  `Tournament.NotAManager` for a scorer or a reader with no part in the
  tournament, `Tournament.Archived` for an archived tournament,
  `Tournament.TeamArchived` for an archived team, which can only be restored
  from the Teams tab, and `Tournament.NoSuchTeam` where the tournament has no
  team at the address. An address the tournament has moved on from sends the
  reader to the team where it is now.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is. Unless a scenario
  says otherwise, a team's short name is the first three letters of its name
  in capitals (`Team.feature`).

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the tournament "Spring Tests" starts on "2026-10-03"
    And the tournament "Spring Tests" is for the sport "ac"
    And the tournament "Spring Tests" is played in the format "Teams"
    And the team is to fly the flag "au"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"

  Rule: Only a reader signed in sees the page

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the page
      Given the reader has signed out
      And the page of the team "Australia" in "Spring Tests" is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2026/ac/spring-tests/teams/aus"

  Rule: The page is headed by the team's name and its short name, with its flag

    Scenario: The page is headed by the team's name and its short name
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page is headed "Australia (AUS)"

    Scenario: The heading says the team's own short name
      Given the team is to be known for short as "Kiwis"
      And "organiser@example.com" has added the team "New Zealand" to "Spring Tests"
      When the page of the team "New Zealand" in "Spring Tests" is opened
      Then the page is headed "New Zealand (Kiwis)"

    Scenario: The heading shows the team's flag
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the heading shows the flag "au"

    Scenario: The page has no tabs
      When the page of the team "Australia" in "Spring Tests" is opened
      Then no tab is offered

    Scenario: The page lists the team's players
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page offers "Add Player"

  Rule: The page has the tournament's section bar, with the team marked

    Scenario: The page has a section bar
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page has a section bar

    Scenario: The team is marked on its page
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the section "AUS" is marked as current

    Scenario: Pressing Tournament goes back to the tournament's page
      Given the page of the team "Australia" in "Spring Tests" is open
      When the section "Tournament" is pressed
      Then the address is "/admin/2026/ac/spring-tests"

    Scenario: Going back to the tournament's page opens it on Teams
      Given the page of the team "Australia" in "Spring Tests" is open
      When the section "Tournament" is pressed
      Then the tab "Teams" is the one being read

  Rule: Only a manager of a tournament there is sees a team there is

    Scenario: A scorer is told they cannot see the team
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page is refused with "Tournament.NotAManager"

    Scenario: A reader with no part in the tournament is told they cannot see the team
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page is refused with "Tournament.NotAManager"

    Scenario: A refused page offers no players
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page does not offer "Add Player"

    Scenario: An archived tournament says it can only be restored
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An archived team says it can only be restored
      Given "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then the page is refused with "Tournament.TeamArchived"

    Scenario: An address no team has been found at says so
      When the page at "/admin/2026/ac/spring-tests/teams/no-such-team" is opened
      Then the page is refused with "Tournament.NoSuchTeam"

  Rule: An address the tournament has moved on from sends the reader to where it is

    Scenario: The old address of a team in a tournament moved to another sport leads to it
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the page at "/admin/2026/ac/spring-tests/teams/aus" is opened
      Then the address is "/admin/2026/gc/spring-tests/teams/aus"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). The team's name and its
    short name are what the manager typed, and nobody's language.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then every word in the admin's content but the team's and its players' own is in the test locale

    Scenario: A refused page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the page of the team "Australia" in "Spring Tests" is opened
      Then every word in the admin's content is in the test locale

  Rule: The page is laid out for a phone first

    Scenario: A long name wraps rather than widening the page
      Given the team is to be known for short as "Northdists"
      And "organiser@example.com" has added the team "The Very Long Named Croquet And Lawn Bowls Club Of The Northern Districts" to "Spring Tests"
      When the page of the team "The Very Long Named Croquet And Lawn Bowls Club Of The Northern Districts" in "Spring Tests" is opened
      Then the page is no wider than the window
