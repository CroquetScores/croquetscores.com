@browser @postgres
Feature: The teams tab of a tournament's page

  A tournament played by teams has a Teams tab where a Standard tournament has
  Players, and it is the tab the page opens on (`view.feature`), since the
  teams are the first thing set up. It is where a manager sees the
  tournament's teams, adds them, corrects them, puts them in order, archives
  the ones added by mistake and restores them.

  It does what the Players tab does (`players-tab.feature`), for teams rather
  than players, and what is said there is said here unless this says
  otherwise. Add Team, above the list, opens the team dialog to add teams,
  and a team's name or its Edit opens it to change the team
  (`team.feature`). Whenever the dialog adds a team or saves one, the list is
  asked for again.

  A team has players of its own, which are on a page of its own
  (`view.feature` beneath the team), so each team in use offers View as well,
  which leads to that page. Edit comes before View, as it does for a
  competition (`competitions-tab.feature`), so that what is done to a team is
  offered ahead of going to it.

  The teams in use come first, in the tournament's order
  (`TeamsOfTournament.feature`). Each says its name, then its short name, and
  then its flag where it flies one, as "Australia (AUS)" and then the flag,
  and offers Edit, View, Archive, Up and Down, Up and Down last and shown as
  arrows, as a player's are. The flag is shown as its picture, and is named
  for a reader who cannot see it by the country it is the flag of, in the
  reader's language.

  A team playing in a test in use cannot be archived (`archiveTeam.feature`),
  so such a team is not offered Archive. A team whose only tests are archived
  is offered it. Archiving a team loses nothing: its players stay with it and
  come back when it is restored. So Archive does not ask first, and nor do Up,
  Down and Restore. Whatever is pressed, the list is asked for again.

  The archived teams come after those in use, under a heading of their own, in
  the order they were archived. Each is struck through, and says in words
  that it is archived as well. Each offers Restore alone, since an archived
  team can only be restored, so its name does not open the dialog and it does
  not offer View: its page refuses to open while it is archived.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page, whose first tab this is, which is what opening the teams
  of a tournament does. Unless a scenario says otherwise, a team's short name
  is the first three letters of its name in capitals (`Team.feature`).

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

  Rule: The teams in use are listed in the tournament's order

    Scenario: A team added is listed
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is listed

    Scenario: The teams are in the tournament's order
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has moved the team "England" in "Spring Tests" up
      When the teams of "Spring Tests" are opened
      Then the first team listed is "England"

    Scenario: The teams are not in order of their names
      Given "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the first team listed is "England"

    Scenario: A tournament with no teams says so
      When the teams of "Spring Tests" are opened
      Then the tab says there are no teams

  Rule: Each team says its short name and the flag it flies

    Scenario: A team says its short name
      Given the team is to be known for short as "Oz"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is shown known for short as "Oz"

    Scenario: A team shows the flag it flies
      Given the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is shown flying the flag "au"

    Scenario: A flag is named by its country, for a reader who cannot see it
      Given the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the flag of the team "Australia" is named "Australia"

    Scenario: A team flying no flag shows none
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is shown flying no flag

  Rule: Add Team, a team's name and Edit open the team dialog

    Scenario: The tab offers Add Team
      When the teams of "Spring Tests" are opened
      Then the tab offers "Add Team"

    Scenario: The tab does not offer Add Player
      When the teams of "Spring Tests" are opened
      Then the tab does not offer "Add Player"

    Scenario: Add Team is above the teams
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then "Add Team" is above the teams

    Scenario: Add Team opens the dialog to add a team
      Given the teams of "Spring Tests" are open
      When "Add Team" is pressed
      Then the team dialog is titled "Add Team"

    Scenario: A team's name opens the dialog to change it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When the name of the team "Australia" is pressed
      Then the team dialog is titled "Edit Team"

    Scenario: Edit opens the dialog to change it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Edit" is pressed on the team "Australia"
      Then the team dialog is titled "Edit Team"

    Scenario: A team added in the dialog is listed
      Given the teams of "Spring Tests" are open
      And "Add Team" is pressed
      And "Australia" is typed as the "Name"
      And "AUS" is typed as the "Short Name"
      When "Add" is pressed
      Then the team "Australia" is listed

    Scenario: A team renamed in the dialog is listed by its new name
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      And "Edit" is pressed on the team "Australia"
      And "Australia A" is typed as the "Name"
      When "Save" is pressed
      Then the team "Australia A" is listed

  Rule: View leads to the team's page

    Scenario: View leads to the team's page
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then "View" on the team "Australia" leads to "/admin/2026/ac/spring-tests/teams/aus"

    Scenario: Pressing View opens the team's page
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When "View" is pressed on the team "Australia"
      Then the address is "/admin/2026/ac/spring-tests/teams/aus"

  Rule: What a team offers is what can be done to it

    Scenario Outline: A team in use offers what can be done to it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "England" offers "<option>"

      Examples:
        | option  |
        | Edit    |
        | View    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: Edit comes before View
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then "Edit" on the team "Australia" comes before "View"

    Scenario: View comes before Archive
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then "View" on the team "Australia" comes before "Archive"

    Scenario: The first team does not offer Up
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" does not offer "Up"

    Scenario: The last team does not offer Down
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "England" does not offer "Down"

  Rule: A team in a test in use is not offered Archive

    Scenario: A team in no test is offered Archive
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" offers "Archive"

    Scenario: A team in a test is not offered Archive
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" does not offer "Archive"

    Scenario: A team whose only test is archived is offered Archive
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" offers "Archive"

  Rule: The archived teams are listed after those in use, struck through

    Scenario: An archived team is listed among the archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is listed among the archived

    Scenario: The archived teams come after those in use
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is listed after "England"

    Scenario: The archived teams are under a heading of their own
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the archived teams are headed "Archived teams"

    Scenario: No heading for the archived is shown where none is archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then no heading for the archived teams is shown

    Scenario: An archived team is struck through
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is struck through

    Scenario: An archived team is said to be archived to a screen reader
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is announced as archived

    Scenario: An archived team offers Restore
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" offers "Restore"

    Scenario Outline: An archived team offers nothing but Restore
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the team "England" does not offer "<option>"

      Examples:
        | option  |
        | Edit    |
        | View    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: An archived team's name does not open the dialog
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the name of the team "Australia" cannot be pressed

  Rule: Up and Down move a team a place

    Scenario: Up moves a team before the team above
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Up" is pressed on the team "England"
      Then the first team listed is "England"

    Scenario: Down moves a team after the team below
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Down" is pressed on the team "Australia"
      Then the first team listed is "England"

    Scenario: A team moved is kept in its new place
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And the teams of "Spring Tests" are open
      And "Up" is pressed on the team "England"
      When the teams of "Spring Tests" are opened
      Then the first team listed is "England"

  Rule: Archive and Restore move a team between those in use and the archived, without asking

    Scenario: Archiving a team lists it among the archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Archive" is pressed on the team "Australia"
      Then the team "Australia" is listed among the archived

    Scenario: Archiving a team does not ask first
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Archive" is pressed on the team "Australia"
      Then no modal dialog is open

    Scenario: A team archived from the tab is kept archived
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the teams of "Spring Tests" are open
      And "Archive" is pressed on the team "Australia"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is listed among the archived

    Scenario: Restoring a team lists it among those in use
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      And the teams of "Spring Tests" are open
      When "Restore" is pressed on the team "Australia"
      Then the team "Australia" is not listed among the archived

    Scenario: A team restored from the tab is kept restored
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      And the teams of "Spring Tests" are open
      And "Restore" is pressed on the team "Australia"
      When the teams of "Spring Tests" are opened
      Then the team "Australia" is not listed among the archived

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A team's name and its short
    name are what the manager typed, and nobody's language. A flag's name is
    a word of the reader's language, and is looked at.

    Scenario: The teams in use are in the reader's language
      Given a browser that asks for "en-XA"
      And the team is to fly the flag "au"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then every word in the tab but the teams' own is in the test locale

    Scenario: The archived teams are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then every word in the tab but the teams' own is in the test locale

    Scenario: A tournament with no teams says so in the reader's language
      Given a browser that asks for "en-XA"
      When the teams of "Spring Tests" are opened
      Then every word in the tab but the teams' own is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Team can be pressed with a thumb
      When the teams of "Spring Tests" are opened
      Then the button "Add Team" is at least 44 pixels tall

    Scenario Outline: What a team offers can be pressed with a thumb
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then "<option>" on the team "<team>" is at least 44 pixels tall

      Examples:
        | team      | option  |
        | Australia | Edit    |
        | Australia | View    |
        | Australia | Archive |
        | Australia | Down    |
        | Scotland  | Up      |
        | England   | Restore |

    Scenario: A long name wraps rather than widening the page
      Given the team is to be known for short as "Northdists"
      And "organiser@example.com" has added the team "The Very Long Named Croquet And Lawn Bowls Club Of The Northern Districts" to "Spring Tests"
      When the teams of "Spring Tests" are opened
      Then the page is no wider than the window
