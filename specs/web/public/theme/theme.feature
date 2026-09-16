@browser
Feature: Choosing a theme

  A reader can say whether they want the site light or dark, and be taken at
  their word on every page afterwards and on every visit after that. The public
  pages have no JavaScript, so the choice is a form that gets posted and a
  cookie that comes back. Every scenario here runs in a browser that has been
  given no scripting at all.

  Rule: The machine decides until somebody says otherwise

    Scenario: A reader who has chosen nothing gets what their machine asks for
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the home page is opened
      Then the page is dark
      And the theme "System" is the one in force

    Scenario: The same reader on a machine that prefers light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the home page is opened
      Then the page is light

  Rule: A choice overrules the machine

    Scenario: Wanting light on a machine that prefers dark
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      And the home page is open
      When the theme "Light" is chosen
      Then the page is light
      And the theme "Light" is the one in force

    Scenario: Wanting dark on a machine that prefers light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And the home page is open
      When the theme "Dark" is chosen
      Then the page is dark

  Rule: A choice outlasts the page it was made on

    Scenario: The choice holds on a page that does not exist
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And the home page is open
      And the theme "Dark" is chosen
      When a page that is not there is opened
      Then the page is dark

    Scenario: Choosing System hands the decision back to the machine
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      And the home page is open
      And the theme "Light" is chosen
      When the theme "System" is chosen
      Then the page is dark
      And the theme "System" is the one in force

  Rule: The choice is kept where only the server can read it

    It is a colour preference and nothing of value leaks with it. It is held to
    the same standard as a session cookie anyway, because the next cookie this
    site sets will be one, and the way this one is set is the way that one will
    be copied.

    Scenario: The cookie is never sent in the clear
      Given a viewport 1200 pixels wide
      And the home page is open
      When the theme "Dark" is chosen
      Then the choice is kept in a cookie marked Secure

    Scenario: The cookie cannot be read by a script on the page
      Given a viewport 1200 pixels wide
      And the home page is open
      When the theme "Dark" is chosen
      Then the choice is kept in a cookie marked HttpOnly

  Rule: The choice can be made with a thumb

    Scenario: The theme buttons are big enough to press on a phone
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the theme button "Light" is at least 44 pixels tall
      And the theme button "Light" is at least 44 pixels wide

  Rule: Another site cannot make the choice

    A page elsewhere can put a button in front of a reader that posts to this
    site. The reader's browser would carry the result straight back here and
    keep it for a year.

    Scenario: A button on another site does not change the theme
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      And a page on another site with a button that posts "dark" here
      When the reader presses the button on that page
      And the home page is opened
      Then the page is light
