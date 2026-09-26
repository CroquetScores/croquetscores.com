@browser
Feature: Finding your way around the public site

  The public pages are required to work with JavaScript switched off, so the
  navigation has to as well. Every scenario here runs in a browser that has
  been given no scripting at all, which is what makes the claim a test rather
  than an intention.

  What the primary navigation holds is the stand-ins: everything to do with an
  account is in the account menu beside it (`accountMenu.feature`). So these
  scenarios watch "Tournaments", which is in the navigation itself, rather than
  anything of an account's.

  Rule: The primary navigation suits the width it is shown at

    Scenario: On a wide screen the links are in the open
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Tournaments" is visible
      And the menu button is not visible

    Scenario: On a narrow screen the links are behind a button
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the menu button is visible
      And the link "Tournaments" is not visible

  Rule: The page being read is marked as the current section is

    The navigation marks the page being read the way the section bar marks the
    section being read: a tile of its own, black in light and pale in dark,
    with no line under the words. An underline read as a link like any other
    rather than as where the reader is, and one mark for being here, wherever
    it is on the page, is one thing to learn rather than two (`LAYOUT.md`).

    Scenario: The page being read is marked
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Home" is marked as the page being read

    Scenario: A page not being read is not marked
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Help" is not marked as the page being read

    Scenario: The page being read is on black in light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the home page is opened
      Then the link "Home" is on black

    Scenario: The page being read is on the current section's colour in dark
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the home page is opened
      Then the link "Home" is on the colour the current section is on

    Scenario: The page being read is not underlined
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Home" is not underlined

    Scenario: The page being read is on black in the menu on a phone
      Given a viewport 375 pixels wide
      And a machine that prefers light
      And the home page is open
      When the menu button is pressed
      Then the link "Home" is on black

  Rule: The menu needs no scripting

    Scenario: Pressing the button reveals the links
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Tournaments" is visible

    Scenario: The links can be pressed by a thumb
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Tournaments" is at least 44 pixels tall

  Rule: A page's own sections are never hidden

    The sections are the page. Collapsing them behind a control would hide what
    the reader came for, so they wrap onto as many rows as they need instead.

    Scenario: The sections are shown on a wide screen
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the section "AC" is visible

    Scenario: The sections are still shown on a narrow screen
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the section "AC" is visible

  Rule: A page says which section is being read

    Scenario: The current section is marked
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the section "All" is marked as current
      And the section "AC" is not marked as current
