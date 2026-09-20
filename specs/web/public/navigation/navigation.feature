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
