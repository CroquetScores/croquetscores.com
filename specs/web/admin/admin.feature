@browser
Feature: The admin is served as the site it belongs to

  The admin is a single-page application whose page is built once, ahead of
  time, and was sent as it was built. So it could say nothing that is only
  known once a request has come in: it called the site Croquet Scores whatever
  the site is configured as, it carried no banner on a try website, and it
  took the machine's word on light or dark over the reader's own. Each of
  those is something every page a reader is served says, because the server
  says it into the page as it sends it (`language.feature`, `layout.feature`,
  `theme.feature`). The admin's page is now said into the same way, so the
  three are settled together by one change to how the admin is served rather
  than by three.

  What the admin says is held to the same words as the pages it sits beside:
  the site's name as it is configured, and the try website's banner in the
  reader's language. The admin's own words are not yet in any catalogue, and
  that is not what this is about.

  Scripting is off, as it is for every @browser scenario, except where what is
  looked at is drawn by the admin itself. Everything else here is on the page
  before a script runs, and is looked at with none, so that a scenario cannot
  pass on something the application drew after the server failed to.

  Rule: The admin calls the site by the name it is given

    Scenario: The admin's tab names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When the admin is opened
      Then the tab names the site "Gateball Scores"

    Scenario: The admin's bar names the site
      Given a viewport 1200 pixels wide
      And a browser that runs scripts
      And a site called "Gateball Scores"
      When the admin is opened
      Then the header names the site "Gateball Scores"

  Rule: The admin of a try website says so

    A reader who has come to the admin of a try website is no less in need of
    knowing where they are than one reading any other of its pages: what they
    set up there may be cleared away at any time (`layout.feature`).

    Scenario: The admin of a try website carries its banner
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      When the admin is opened
      Then the page carries the try website's banner

    Scenario: The admin of any other website does not
      Given a viewport 1200 pixels wide
      And a site served as "croquetscores.com"
      When the admin is opened
      Then the page carries no try website's banner

    Scenario: The admin's banner is in the reader's language
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      And a browser that asks for "en-XA"
      When the admin is opened
      Then every word in the try website's banner is in the test locale

  Rule: The admin takes the reader at their word on light or dark

    The choice is kept in a cookie only the server can read, and is kept that
    way on purpose (`theme.feature`), so the admin cannot read it for itself
    and is not made to. The server says it into the admin's page as it does
    into every other, which also means the admin is never drawn once in the
    machine's colours and then again in the reader's.

    Scenario: Wanting dark on a machine that prefers light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And the home page is open
      And the theme "Dark" is chosen
      When the admin is opened
      Then the page is dark

    Scenario: Wanting light on a machine that prefers dark
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      And the home page is open
      And the theme "Light" is chosen
      When the admin is opened
      Then the page is light

    Scenario: A reader who has chosen nothing gets what their machine asks for
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the admin is opened
      Then the page is dark

  Rule: The admin offers the choice of light or dark itself

    A reader who wants the admin dark should not have to leave it for a public
    page to say so. The admin offers the same choice the public pages do, in
    the same words and made the same way, so that there is one choice rather
    than two that could come to disagree: made in the admin, it holds on the
    public pages, as one made there holds here. Like the choice on a public
    page it is made with scripting off, and brings the reader back to where
    they made it.

    Scenario: Wanting dark in the admin on a machine that prefers light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And the admin is open
      When the theme "Dark" is chosen
      Then the page is dark

    Scenario: Wanting light in the admin on a machine that prefers dark
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      And the admin is open
      When the theme "Light" is chosen
      Then the page is light

    Scenario: The choice brings the reader back to the admin
      Given a viewport 1200 pixels wide
      And the admin is open
      When the theme "Dark" is chosen
      Then the admin is shown

    Scenario: The admin says which theme is in force when nothing has been chosen
      Given a viewport 1200 pixels wide
      When the admin is opened
      Then the theme "System" is the one in force

    Scenario: The admin says which theme is in force once one has been chosen
      Given a viewport 1200 pixels wide
      And the admin is open
      When the theme "Light" is chosen
      Then the theme "Light" is the one in force

    Scenario: A choice made in the admin holds on the public pages
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And the admin is open
      And the theme "Dark" is chosen
      When the home page is opened
      Then the page is dark

    Scenario: The choice is in the reader's language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the admin is opened
      Then every word in the theme choice is in the test locale

    Scenario: The choice can be made with a thumb
      Given a viewport 375 pixels wide
      When the admin is opened
      Then the theme button "Light" is at least 44 pixels tall
      And the theme button "Light" is at least 44 pixels wide
