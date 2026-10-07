@browser @postgres
Feature: A tournament's page in the admin

  /admin/{year}/{sport}/{slug} is where a manager runs a tournament, having
  pressed its name or Manage in their list, and where a scorer finds its
  competitions, having pressed Scores (`tournaments.feature`). It is headed by
  the tournament's name, and what there is to run is in five tabs, in this
  order: Players, Competitions, Notes, Managers and Scorers. Notes comes
  after what is played, since a note is written about the players and the
  competitions, and before who runs the tournament.

  A scorer enters scores and does nothing else to a tournament
  (`addScorer.feature`), and scores are entered in its competitions. So a
  scorer is offered the Competitions tab alone, and the page opens on it: the
  players, the notes, the managers and the scorers are the managers' to
  change, and a
  tab a scorer could only look at would be a tab of things they cannot use.

  The tabs are a tab control in the panel, beneath the tournament's name
  (`STYLE.md` §5d), and the tab being read is marked. The tabs are parts of
  the one page rather than pages of their own, so they are not in the section
  bar, which is for moving between pages: it leads to the tournament and its
  competitions (`TournamentSections.feature`). Nor do they
  have addresses: the page opens on Players, the first, and
  choosing another leaves the address as it was, and a scorer's opens on
  Competitions, the one tab they have. A link to the page is a link
  to the tournament, and the browser's back button leaves the page rather
  than going back through its tabs.

  Each tab says what it holds in a feature of its own
  (`players-tab.feature`, `competitions-tab.feature`, `notes-tab.feature`,
  `managers-tab.feature` and `scorers-tab.feature`).

  A tournament whose format is played by teams (`TournamentFormat.feature`)
  is found at the same address, and is run in the same page, but has teams
  and tests where a Standard tournament has players and competitions
  (`addTeam.feature`, `addTest.feature`). So its five tabs are Teams, Tests,
  Notes, Managers and Scorers, in that order (`teams-tab.feature`,
  `tests-tab.feature`), and the page opens on Teams. A scorer is offered
  Tests alone, as they are offered Competitions alone in a Standard
  tournament, and their page opens on it.

  Only a tournament's managers and scorers have anything to do here, so the
  page is refused to anybody else, by the refusal's code in place of the tabs,
  as changing the tournament is (`edit.feature`): `Tournament.NotAManager` for
  a reader with no part in it, `Tournament.Archived` for an archived
  tournament, which can only be restored, to a scorer as to a manager, and
  `UpdateTournament.NoSuchTournament` where no tournament has been found. An
  address the tournament has moved on from sends the reader to where it is
  now.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: Only a reader signed in sees the page

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the page of "Spring Open" is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the page
      Given the reader has signed out
      And the page of "Spring Open" is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2026/ac/spring-open"

  Rule: The page is headed by the tournament's name

    Scenario: The page is headed by the tournament's name
      When the page of "Spring Open" is opened
      Then the page is headed "Spring Open"

  Rule: What there is to run is in five tabs, in the panel beneath the tournament's name

    Scenario Outline: The page has each tab
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is offered

      Examples:
        | tab          |
        | Players      |
        | Competitions |
        | Notes        |
        | Managers     |
        | Scorers      |

    Scenario Outline: The tabs are in their order
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is the <place> tab

      Examples:
        | tab          | place  |
        | Players      | first  |
        | Competitions | second |
        | Notes        | third  |
        | Managers     | fourth |
        | Scorers      | fifth  |

    Scenario: The tabs are in the panel
      When the page of "Spring Open" is opened
      Then the tab "Players" is in the panel

    Scenario: The tabs are beneath the tournament's name
      When the page of "Spring Open" is opened
      Then the tab "Players" is beneath the page's heading

    Scenario: The tabs keep to one row on a phone
      When the page of "Spring Open" is opened
      Then the tabs are on one row

    Scenario: A tab can be pressed with a thumb
      When the page of "Spring Open" is opened
      Then the tab "Players" is at least 44 pixels tall

  Rule: A manager's page opens on Players, and the tab chosen is marked

    Scenario: The page opens on the Players tab
      When the page of "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario: Only the tab being read is marked
      When the page of "Spring Open" is opened
      Then the tab "Competitions" is not the one being read

    Scenario: Choosing a tab marks it as the one being read
      Given the page of "Spring Open" is open
      When the tab "Competitions" is chosen
      Then the tab "Competitions" is the one being read

    Scenario: Choosing a tab no longer marks the one before
      Given the page of "Spring Open" is open
      When the tab "Competitions" is chosen
      Then the tab "Players" is not the one being read

  Rule: The tabs have no addresses

    Scenario: Choosing a tab leaves the address as it was
      Given the page of "Spring Open" is open
      When the tab "Competitions" is chosen
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: Opening the page again opens it on Players
      Given the page of "Spring Open" is open
      And the tab "Competitions" is chosen
      When the page of "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario: An address beneath the page is not one of its tabs
      When the page at "/admin/2026/ac/spring-open/competitions" is opened
      Then no tab is offered

  Rule: A scorer is offered the Competitions tab alone

    Scenario: A scorer is offered the Competitions tab
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Competitions" is offered

    Scenario Outline: A scorer is not offered the managers' tabs
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is not offered

      Examples:
        | tab      |
        | Players  |
        | Notes    |
        | Managers |
        | Scorers  |

    Scenario: A scorer's page opens on the Competitions tab
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Competitions" is the one being read

    Scenario: A scorer's page is headed by the tournament's name
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the page is headed "Spring Open"

  Rule: A tournament played by teams has Teams, Tests, Notes, Managers and Scorers

    Scenario Outline: The tabs of a tournament played by teams are in their order
      Given the tournament "Spring Open" is played in the format "Teams"
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is the <place> tab

      Examples:
        | tab      | place  |
        | Teams    | first  |
        | Tests    | second |
        | Notes    | third  |
        | Managers | fourth |
        | Scorers  | fifth  |

    Scenario Outline: A tournament played by teams has no tab of a Standard tournament's own
      Given the tournament "Spring Open" is played in the format "Teams"
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is not offered

      Examples:
        | tab          |
        | Players      |
        | Competitions |

    Scenario Outline: Every format played by teams has the Teams tab
      Given the tournament "Spring Open" is played in the format "<format>"
      When the page of "Spring Open" is opened
      Then the tab "Teams" is offered

      Examples:
        | format                     |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

    Scenario: A Standard tournament has no Teams tab
      When the page of "Spring Open" is opened
      Then the tab "Teams" is not offered

    Scenario: The page of a tournament played by teams opens on Teams
      Given the tournament "Spring Open" is played in the format "Teams"
      When the page of "Spring Open" is opened
      Then the tab "Teams" is the one being read

    Scenario: Choosing Tests leaves the address as it was
      Given the tournament "Spring Open" is played in the format "Teams"
      And the page of "Spring Open" is open
      When the tab "Tests" is chosen
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: A scorer of a tournament played by teams is offered Tests
      Given the tournament "Spring Open" is played in the format "Teams"
      And "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Tests" is the one being read

    Scenario Outline: A scorer of a tournament played by teams is not offered the managers' tabs
      Given the tournament "Spring Open" is played in the format "Teams"
      And "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is not offered

      Examples:
        | tab      |
        | Teams    |
        | Managers |
        | Scorers  |

    Scenario: The tabs of a tournament played by teams are named in the reader's language
      Given a browser that asks for "en-XA"
      And the tournament "Spring Open" is played in the format "Teams"
      When the page of "Spring Open" is opened
      Then the tabs are named in the test locale

  Rule: Only a manager or a scorer of a tournament there is sees the page

    Scenario: A reader with no part in the tournament is told they cannot run it
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManager"

    Scenario: A refused page offers no tabs
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then no tab is offered

    Scenario: An archived tournament says it can only be restored
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page of "Spring Open" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An archived tournament says so to a scorer too
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An address no tournament has been found at says so
      When the page at "/admin/2026/ac/no-such-open" is opened
      Then the page is refused with "UpdateTournament.NoSuchTournament"

  Rule: An address the tournament has moved on from sends the reader to where it is

    Scenario: The old address of a tournament moved to another sport leads to it
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/admin/2026/ac/spring-open" is opened
      Then the address is "/admin/2026/gc/spring-open"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). The tournament's name is
    what its manager called it, and is nobody's language.

    Scenario: The tabs are in the reader's language
      Given a browser that asks for "en-XA"
      When the page of "Spring Open" is opened
      Then every word in the tabs is in the test locale

    Scenario: The tabs are named in the reader's language
      Given a browser that asks for "en-XA"
      When the page of "Spring Open" is opened
      Then the tabs are named in the test locale

    Scenario: A refused page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page of "Spring Open" is opened
      Then every word in the admin's content is in the test locale

  Rule: An administrator sees every tournament's page as a manager does

    An account that administers the site can do anything a manager can, to
    every tournament (`onlyManagers.feature`), so it is offered what a manager
    is offered, though it is none of the tournament's managers.

    Scenario: An administrator's page opens on the Players tab
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "other@example.com" has been given the role "Administrator"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario: An administrator is offered the managers' tabs
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "other@example.com" has been given the role "Administrator"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Managers" is offered

    Scenario: An account the role was taken from is told it cannot run the tournament
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "other@example.com" has been given the role "Administrator"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      And "other@example.com" has had the role "Administrator" taken away
      When the page of "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManager"

  Rule: A world ranking officer is offered the players, and what its part offers

    An account that holds the World Ranking Officer role may change any
    player's world ranking name (`changeWorldRankingName.feature`). So a
    tournament's page offers it the players, a Standard tournament's on the
    Players tab and one played by teams' on the Teams tab, where a manager's
    are offered, besides whatever its part in the tournament offers: every
    tab to a manager, and the competitions to a scorer, with the players
    after them.

    Scenario: A world ranking officer with no part is offered the Players tab
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario Outline: A world ranking officer with no part is not offered the managers' tabs
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is not offered

      Examples:
        | tab          |
        | Competitions |
        | Notes        |
        | Managers     |
        | Scorers      |

    Scenario: A world ranking officer who scores the tournament is offered the Competitions tab
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And "organiser@example.com" has made "ranker@example.com" a scorer of "Spring Open"
      When the page of "Spring Open" is opened
      Then the tab "Competitions" is offered

    Scenario: A world ranking officer who scores the tournament is offered the Players tab too
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And "organiser@example.com" has made "ranker@example.com" a scorer of "Spring Open"
      When the page of "Spring Open" is opened
      Then the tab "Players" is offered

    Scenario: A world ranking officer is offered a tournament played by teams' Teams tab
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      When the page of "Spring Tests" is opened
      Then the tab "Teams" is the one being read
