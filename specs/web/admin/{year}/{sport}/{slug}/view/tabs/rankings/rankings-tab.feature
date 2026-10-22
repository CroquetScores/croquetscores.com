@browser @postgres
Feature: The rankings tab of a tournament's page

  The Rankings tab is where a manager has the tournament's results as the file
  the world rankings are sent (`view.feature`), which the old site gave from
  a Rankings button on this page. The file itself is found at the
  tournament's own address followed by "rankings" (`rankings.feature`), and
  is the same for anybody; the tab is where a manager is led to it, and told
  what to do with it, since a manager sending results is not likely to know
  an address.

  The tab says what the file is, in the same words whatever the sport, since
  what is done with it afterwards is not the tab's to tell.

  Beneath that is one link, "Download rankings", which leads to the file. It
  is a link rather than a button because it goes to an address and changes
  nothing, as the tournament's other links do. It is offered whether or not
  the tournament has a game yet, since a file with nothing in it is still
  what is asked for, and a manager who presses it early learns what it will
  hold.

  The tab is only in the page of a tournament that counts towards the world
  rankings, since only one has a file (`rankings.feature`). A manager of one
  that does not is not offered a tab to say so; the address says why if it is
  followed. The tab is a manager's, and is not offered to a scorer, who enters scores
  and does nothing else to a tournament (`view.feature`). It has no address of
  its own, so a scenario opens the tournament's page and chooses the tab.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser", with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The tab says what the file is

    Scenario: The file is explained
      When the rankings of "Spring Open" are opened
      Then the tab says the words for "admin.rankings.file"

  Rule: One link leads to the file

    Scenario: The link is offered
      When the rankings of "Spring Open" are opened
      Then the tab's link "Download rankings" is offered

    Scenario: The link leads to the tournament's rankings
      Given the rankings of "Spring Open" are open
      Then the tab's link "Download rankings" leads to "/2026/ac/spring-open/rankings"

    Scenario: Following the link gives a file
      Given the rankings of "Spring Open" are open
      When the tab's link "Download rankings" is followed
      Then a file is given

    Scenario: The link can be pressed with a thumb
      When the rankings of "Spring Open" are opened
      Then the tab's link "Download rankings" is at least 44 pixels tall

  Rule: A tournament played by teams has it too

    Scenario: A test's tournament is offered the link
      Given the tournament "Spring Open" is played in the format "Teams"
      When the rankings of "Spring Open" are opened
      Then the tab's link "Download rankings" is offered

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language is
    left out: the tournament's name and the file's.

    Scenario: The tab is in the reader's language
      Given a browser that asks for "en-XA"
      When the rankings of "Spring Open" are opened
      Then every word in the tab is in the test locale
