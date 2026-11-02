@browser @postgres
Feature: A competition's page in the admin

  /admin/{year}/{sport}/{slug}/competitions/{competition slug} is where a
  manager runs one of a tournament's competitions, having pressed its name or
  View on the tournament's Competitions tab (`competitions-tab.feature`), and
  where a scorer enters its scores. It is headed by the competition's name,
  and what there is to run is in two tabs, in this order: Players and Scores.

  The tabs are laid out and chosen as the tournament's are (`view.feature`
  beneath the tournament): they are a tab control in the panel, beneath the
  competition's name, not in the section bar, which leads to the tournament
  and its competitions (`TournamentSections.feature`), the one being read is
  marked, and they have no addresses, so the page opens on Players and
  choosing Scores leaves the address as it was. Players is first because the
  players are entered before anything is played.

  Each tab says what it holds in a feature of its own
  (`competition-players-tab.feature` and `scores-tab.feature`).

  A knockout's manager is offered a third tab, Losers, after Scores, for the
  knockouts that take the losers of its rounds (`losers-tab.feature`). No
  other kind of competition has it.

  A manager of the tournament sees both tabs. A scorer sees Scores alone,
  since who plays in a competition is the manager's to say and the scores are
  what a scorer is there for, so the page opens on Scores for a scorer.
  Anybody else is refused by the refusal's code in place of the tabs, as the
  tournament's page refuses them: `Tournament.NotAManagerOrScorer` for
  somebody with no part in the tournament, `Tournament.Archived` for an
  archived tournament, `Tournament.CompetitionArchived` for an archived
  competition, which can only be restored from the Competitions tab, and
  `Tournament.NoSuchCompetition` where the tournament has no competition at
  the address. An address the tournament has moved on from sends the reader
  to the competition where it is now.

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
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: Only a reader signed in sees the page

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the page
      Given the reader has signed out
      And the page of the competition "Block A" in "Spring Open" is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

  Rule: The page is headed by the competition's name

    Scenario: The page is headed by the competition's name
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the page is headed "Block A"

  Rule: A manager can edit the competition from beside its name

    Beside the name is a pencil, named Edit, that opens the competition dialog
    (`competition.feature`), as Edit does on the Competitions tab. It is the
    manager's, as editing is: a scorer is there to enter scores, so is not
    offered it. Keeping the change closes the dialog and the page says the name
    the competition has now.

    Scenario: A manager is offered Edit beside the competition's name
      When the page of the competition "Block A" in "Spring Open" is opened
      Then Edit is beside the page's heading

    Scenario: Edit beside the competition's name is a pencil
      When the page of the competition "Block A" in "Spring Open" is opened
      Then Edit beside the page's heading is a pencil

    Scenario: Edit beside the competition's name opens the competition dialog
      Given the page of the competition "Block A" in "Spring Open" is open
      When Edit beside the page's heading is pressed
      Then the competition dialog is titled "Edit Competition"

    Scenario: A name kept from there is the name the page is headed by
      Given the page of the competition "Block A" in "Spring Open" is open
      And Edit beside the page's heading is pressed
      And "Block B" is typed as the "Name"
      When "Save" is pressed
      Then the page is headed "Block B"

    Scenario: A scorer is not offered Edit beside the competition's name
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then Edit is not offered beside the page's heading

  Rule: What there is to run is in two tabs, in the panel beneath the competition's name

    Scenario Outline: The page has each tab
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "<tab>" is offered

      Examples:
        | tab     |
        | Players |
        | Scores  |

    Scenario Outline: The tabs are in their order
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "<tab>" is the <place> tab

      Examples:
        | tab     | place  |
        | Players | first  |
        | Scores  | second |

    Scenario: The tabs are in the panel
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is in the panel

    Scenario: The tabs are beneath the competition's name
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is beneath the page's heading

    Scenario: A tab can be pressed with a thumb
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is at least 44 pixels tall

  Rule: The page opens on Players, and the tab chosen is marked

    Scenario: The page opens on the Players tab
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario: Only the tab being read is marked
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Scores" is not the one being read

    Scenario: Choosing a tab marks it as the one being read
      Given the page of the competition "Block A" in "Spring Open" is open
      When the tab "Scores" is chosen
      Then the tab "Scores" is the one being read

    Scenario: Choosing a tab no longer marks the one before
      Given the page of the competition "Block A" in "Spring Open" is open
      When the tab "Scores" is chosen
      Then the tab "Players" is not the one being read

  Rule: The tabs have no addresses

    Scenario: Choosing a tab leaves the address as it was
      Given the page of the competition "Block A" in "Spring Open" is open
      When the tab "Scores" is chosen
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: Opening the page again opens it on Players
      Given the page of the competition "Block A" in "Spring Open" is open
      And the tab "Scores" is chosen
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is the one being read

    Scenario: An address beneath the page is not one of its tabs
      When the page at "/admin/2026/ac/spring-open/competitions/block-a/scores" is opened
      Then no tab is offered

  Rule: A scorer sees the Scores tab alone

    Background:
      Given "scorer@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the reader has signed in as "scorer@example.com" with the password "another horse battery staple"

    Scenario: A scorer is offered the Scores tab
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Scores" is offered

    Scenario: A scorer is not offered the Players tab
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is not offered

    Scenario: The page opens on Scores for a scorer
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Scores" is the one being read

    Scenario: A scorer made a manager is offered the Players tab
      Given "organiser@example.com" has made "scorer@example.com" a manager of "Spring Open"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is offered

  Rule: Only a manager or a scorer of a tournament there is sees a competition there is

    Scenario: A reader with no part in the tournament is told they cannot see the competition
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManagerOrScorer"

    Scenario: A refused page offers no tabs
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then no tab is offered

    Scenario: A competition in an archived tournament says the tournament can only be restored
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An archived competition says it can only be restored
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the page is refused with "Tournament.CompetitionArchived"

    Scenario: An address no competition has been found at says so
      When the page at "/admin/2026/ac/spring-open/competitions/no-such-block" is opened
      Then the page is refused with "Tournament.NoSuchCompetition"

    Scenario: An address no tournament has been found at says so
      When the page at "/admin/2026/ac/no-such-open/competitions/block-a" is opened
      Then the page is refused with "UpdateTournament.NoSuchTournament"

  Rule: An address the tournament has moved on from sends the reader to where it is

    Scenario: The old address of a competition in a tournament moved to another sport leads to it
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/admin/2026/ac/spring-open/competitions/block-a" is opened
      Then the address is "/admin/2026/gc/spring-open/competitions/block-a"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). The competition's name is
    what its manager called it, and is nobody's language.

    Scenario: The tabs are in the reader's language
      Given a browser that asks for "en-XA"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then every word in the tabs is in the test locale

    Scenario: The tabs are named in the reader's language
      Given a browser that asks for "en-XA"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tabs are named in the test locale

    Scenario: A refused page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then every word in the admin's content is in the test locale

  Rule: An administrator sees a competition as a manager does

    Scenario: An administrator's page opens on the Players tab
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "other@example.com" has been given the role "Administrator"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Players" is the one being read

  Rule: Each tab has a help icon at the end of the row that leads to the help for it

    As the tournament's page's tabs have (`view.feature` beside the
    tournament's).

    Scenario Outline: Each tab leads to its page of the help
      Given the page of the competition "Block A" in "Spring Open" is open
      When the tab "<tab>" is chosen
      Then the tab row's help icon leads to "/help/tournament-managers/standard-tournament/<page>"

      Examples:
        | tab     | page                               |
        | Players | entering-players-in-a-competition  |
        | Scores  | scores                             |
