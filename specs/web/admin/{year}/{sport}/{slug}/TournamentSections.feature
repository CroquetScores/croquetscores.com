@browser @postgres
Feature: The section bar of a tournament and its competitions

  A tournament's page and each of its competitions' pages (`view.feature`
  beneath each) have a section bar, which is for moving between pages
  (`LAYOUT.md`). It leads to the tournament's page, as Tournament, and to the
  page of each of its competitions, by the competition's name, so that a
  manager or a scorer moves from the tournament to a competition and between
  competitions without going back through the Competitions tab.

  Tournament comes first, since the competitions are the tournament's, and the
  competitions follow in the tournament's order, the order its Competitions
  tab lists them in (`competitions-tab.feature`). Only the competitions in use
  are there: an archived competition's page refuses to open
  (`Tournament.CompetitionArchived`), so leading to it would lead nowhere.

  The page being read is marked, as the section bar marks the section being
  read (`LAYOUT.md`): Tournament on the tournament's page, and the competition
  on its own. The bar is the same for a scorer as for a manager, since a
  scorer opens the competitions' pages too.

  Tournament and the bar's own name are words of the reader's language. A
  competition's name is what the manager typed, and nobody's language. The
  bar wraps rather than widening the page, as every section bar does, since
  the competitions are the tournament's own and hiding any would hide them.

  The admin draws the pages itself, so every scenario here runs scripts, and
  they are read on a phone's width, as the rest of the admin is.

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
    And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"

  Rule: The tournament's page leads to the tournament and each of its competitions

    Scenario: The tournament's page has a section bar
      When the page of "Spring Open" is opened
      Then the page has a section bar

    Scenario: The section bar offers the tournament
      When the page of "Spring Open" is opened
      Then the section "Tournament" is offered

    Scenario: The section bar offers each competition
      When the page of "Spring Open" is opened
      Then the section "Block A" is offered
      And the section "Final Stage" is offered

    Scenario: Tournament comes first
      When the page of "Spring Open" is opened
      Then the first section is "Tournament"

    Scenario: The competitions follow in the tournament's order
      When the page of "Spring Open" is opened
      Then the second section is "Block A"

    Scenario: The competitions follow in the tournament's order once one is moved
      Given "organiser@example.com" has moved the competition "Final Stage" in "Spring Open" up
      When the page of "Spring Open" is opened
      Then the second section is "Final Stage"

    Scenario: Tournament leads to the tournament's page
      When the page of "Spring Open" is opened
      Then the section "Tournament" leads to "/admin/2026/ac/spring-open"

    Scenario: A competition leads to its page
      When the page of "Spring Open" is opened
      Then the section "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: Pressing a competition opens its page
      Given the page of "Spring Open" is open
      When the section "Block A" is pressed
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: Tournament is marked on the tournament's page
      When the page of "Spring Open" is opened
      Then the section "Tournament" is marked as current

    Scenario: No competition is marked on the tournament's page
      When the page of "Spring Open" is opened
      Then the section "Block A" is not marked as current

  Rule: A competition's page has the same section bar, with the competition marked

    Scenario: A competition's page has a section bar
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the page has a section bar

    Scenario: A competition's page offers the tournament
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the section "Tournament" is offered

    Scenario: A competition's page offers the other competitions
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the section "Final Stage" is offered

    Scenario: The competition is marked on its own page
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the section "Block A" is marked as current

    Scenario: Tournament is not marked on a competition's page
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the section "Tournament" is not marked as current

    Scenario: Pressing Tournament goes back to the tournament's page
      Given the page of the competition "Block A" in "Spring Open" is open
      When the section "Tournament" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: Pressing another competition opens its page
      Given the page of the competition "Block A" in "Spring Open" is open
      When the section "Final Stage" is pressed
      Then the address is "/admin/2026/ac/spring-open/competitions/final-stage"

  Rule: Only the competitions in use are offered

    Scenario: An archived competition is not offered
      Given "organiser@example.com" has archived the competition "Final Stage" in "Spring Open"
      When the page of "Spring Open" is opened
      Then the section "Final Stage" is not offered

    Scenario: A tournament with no competitions offers Tournament alone
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And "organiser@example.com" has archived the competition "Final Stage" in "Spring Open"
      When the page of "Spring Open" is opened
      Then 1 section is offered

  Rule: A scorer is offered the same

    Scenario: A scorer is offered the tournament
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the section "Tournament" is offered

    Scenario: A scorer is offered each competition
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Open" is opened
      Then the section "Block A" is offered
      And the section "Final Stage" is offered

  Rule: Every word the bar says is in the reader's language

    Scenario: Tournament is in the reader's language
      Given a browser that asks for "en-XA"
      When the page of "Spring Open" is opened
      Then the first section is in the test locale

    Scenario: The section bar is named in the reader's language
      Given a browser that asks for "en-XA"
      When the page of "Spring Open" is opened
      Then the section bar is named in the test locale

  Rule: The bar is laid out for a phone first

    The bar is as tall as every section bar is, its words with a little
    above and below (`LAYOUT.md`), which clears the 24 pixels WCAG 2.2 asks
    of anything pressed.

    Scenario: A section can be pressed
      When the page of "Spring Open" is opened
      Then the section "Block A" is at least 24 pixels tall

    Scenario: Many competitions wrap rather than widening the page
      Given "organiser@example.com" has added the block "The Very Long Named Championship Block" to "Spring Open"
      And "organiser@example.com" has added the block "The Other Long Named Plate Block" to "Spring Open"
      When the page of "Spring Open" is opened
      Then the page is no wider than the window
