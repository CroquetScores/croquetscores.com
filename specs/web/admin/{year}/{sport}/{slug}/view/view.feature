@browser @postgres
Feature: A tournament's page in the admin

  /admin/{year}/{sport}/{slug} is where a manager runs a tournament, having
  pressed its name or Manage in their list (`tournaments.feature`). It is
  headed by the tournament's name, and what there is to run is in four tabs,
  in this order: Players, Competitions, Managers and Scorers.

  The tabs are the page's sections, so they are in the section bar, as every
  page's sections are (`LAYOUT.md`), and the tab being read is marked as a
  section is. The tabs are parts of the one page rather than pages of their
  own, so they have no addresses: the page opens on Players, the first, and
  choosing another leaves the address as it was. A link to the page is a link
  to the tournament, and the browser's back button leaves the page rather
  than going back through its tabs.

  Each tab says what it holds in a feature of its own
  (`players-tab.feature`, `competitions-tab.feature`, `managers-tab.feature`
  and `scorers-tab.feature`).

  Only a manager runs a tournament, so the page is refused as changing the
  tournament is (`edit.feature`), by the refusal's code in place of the tabs:
  `Tournament.NotAManager` for a scorer or anybody else, `Tournament.Archived`
  for an archived tournament, which can only be restored, and
  `UpdateTournament.NoSuchTournament` where no tournament has been found. A
  scorer is sent here by Scores in their list, and is refused until the page
  where scores are entered is written. An address the tournament has moved on
  from sends the reader to where it is now.

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

  Rule: What there is to run is in four tabs, in the section bar

    Scenario Outline: The page has each tab
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is offered

      Examples:
        | tab          |
        | Players      |
        | Competitions |
        | Managers     |
        | Scorers      |

    Scenario Outline: The tabs are in their order
      When the page of "Spring Open" is opened
      Then the tab "<tab>" is the <place> tab

      Examples:
        | tab          | place  |
        | Players      | first  |
        | Competitions | second |
        | Managers     | third  |
        | Scorers      | fourth |

    Scenario: The tabs are in the section bar
      When the page of "Spring Open" is opened
      Then the tab "Players" is in the section bar

    Scenario: The tabs keep to one row on a phone
      When the page of "Spring Open" is opened
      Then the tabs are on one row

    Scenario: A tab can be pressed with a thumb
      When the page of "Spring Open" is opened
      Then the tab "Players" is at least 44 pixels tall

  Rule: The page opens on Players, and the tab chosen is marked

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

  Rule: Only a manager of a tournament there is sees the page

    Scenario: A scorer is told they cannot run the tournament
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManager"

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
      Then the section bar is named in the test locale

    Scenario: A refused page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page of "Spring Open" is opened
      Then every word in the admin's content is in the test locale
