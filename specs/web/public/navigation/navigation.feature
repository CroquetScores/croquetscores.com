@browser
Feature: Finding your way around the public site

  The public pages are required to work with JavaScript switched off, so the
  navigation has to as well. Every scenario here runs in a browser that has
  been given no scripting at all, which is what makes the claim a test rather
  than an intention.

  Rule: The navigation suits the width it is shown at

    Scenario: On a wide screen the links are in the open
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Admin" is visible
      And the menu button is not visible

    Scenario: On a narrow screen the links are behind a button
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the menu button is visible
      And the link "Admin" is not visible

  Rule: The menu needs no scripting

    Scenario: Pressing the button reveals the links
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Admin" is visible

    Scenario: The links can be pressed by a thumb
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Admin" is at least 44 pixels tall

  Rule: A page says which one it is

    Scenario: The page being read is marked as current
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Scores" is marked as the current page
      And the link "Admin" is not marked as the current page
