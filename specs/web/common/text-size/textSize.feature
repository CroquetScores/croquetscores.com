@browser @postgres
Feature: Changing the size of the text by pinching and pulling

  On a touch screen a reader pinches to make the text smaller and pulls to make
  it larger, on every page. Pinching is two fingers moving together, and
  pulling is two fingers moving apart. What changes is the size of the text and
  nothing else: the page is still as wide as the screen, so a reader who has
  made the text larger is never left scrolling sideways to read a line, which
  is what the browser's own zoom does to a page.

  The text size is the reader's, not the page's, so it is kept in the browser
  and is the same on every page and on every visit after. It is an addition to
  the page rather than something the page needs, so a reader whose browser has
  no scripting gets the page at its usual size and loses nothing else. Scripting
  is off in these scenarios unless one switches it on, as it does wherever a
  reader pinches.

  Rule: Pinching makes the text smaller and pulling makes it larger

    Scenario: Pulling on the home page
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pulled apart
      Then the text is larger than it was

    Scenario: Pinching on the home page
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pinched together
      Then the text is smaller than it was

    Scenario: A page that is not the home page
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the help page is open
      When two fingers are pulled apart
      Then the text is larger than it was

  Rule: The page stays as wide as the screen

    Scenario: The page is not zoomed
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pulled apart
      Then the page is not zoomed

    Scenario: Nothing has to be scrolled sideways
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pulled apart
      Then the page is no wider than the screen

  Rule: The text size stops at half and at double

    A reader who goes too far should not lose the page: text too small to read
    or too large for a word to fit is no better than none.

    Scenario: Pulling a long way
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pulled apart a long way
      Then the text is 200 percent of its usual size

    Scenario: Pinching a long way
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When two fingers are pinched together a long way
      Then the text is 50 percent of its usual size

  Rule: The text size is kept

    Scenario: Another page
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      And two fingers are pulled apart
      When the help page is opened
      Then the text is as large as it was on the home page

    Scenario: Another visit
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      And two fingers are pulled apart
      When the browser is closed and opened again with what pages stored in it
      And the home page is opened
      Then the text is as large as it was before the browser was closed

  Rule: The admin is no different

    The admin is a page of its own that the site's layout does not draw, so it
    is told about the text size separately and is held to the same size as every
    other page. A reader who is not signed in is sent to the sign in page instead
    of the admin, which would pass for it, so these readers are signed in.

    Scenario: Pulling on the admin
      Given a viewport 400 pixels wide
      And a reader signed in as "someone@example.com"
      And scripting is switched on
      And the admin is open
      When two fingers are pulled apart
      Then the text is larger than it was

    Scenario: The size is carried into the admin
      Given a viewport 400 pixels wide
      And a reader signed in as "someone@example.com"
      And scripting is switched on
      And the home page is open
      And two fingers are pulled apart
      When the admin is opened
      Then the text is as large as it was on the home page

  Rule: One finger is not a pinch

    Scenario: Scrolling is left alone
      Given a viewport 400 pixels wide
      And scripting is switched on
      And the home page is open
      When one finger is dragged down the page
      Then the text is its usual size

  Rule: A browser with no scripting gets the page as it is

    Scenario: The page is at its usual size
      Given a viewport 400 pixels wide
      When the home page is opened
      Then the text is its usual size
