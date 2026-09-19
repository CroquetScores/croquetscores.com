@browser
Feature: A reader without scripting is told registering needs it, before filling anything in

  Registering is guarded by reCAPTCHA v3, which judges the reader by running
  Google's script in their browser. Without scripting there is no judgement to
  send, and a registration without one cannot be let through. Rather than let
  a reader fill in the whole form and be turned away at the end, a reader
  without scripting is sent to /accounts/java-script-required the moment the
  register page arrives.

  That needs no scripting itself. The register page carries a refresh inside a
  noscript element, which a browser acts on only when scripting is off: with
  it on, the reader stays where they are, and with it off, they are taken to
  the page that says why. It says that registering needs scripting switched on
  for this site, and offers the way back to the register page for when it is,
  and the way home.

  Only registering is guarded this way. Asking for a way back in is limited by
  how often it can be asked instead, and needs no scripting.

  Scenarios that open the register page to do anything on it switch scripting
  on first, and say so.

  Rule: A reader without scripting is sent away before filling anything in

    Scenario: The register page sends a reader without scripting to be told why
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the java script required page is shown

    Scenario: A reader with scripting stays on the register page
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the register page is shown

  Rule: The page says why, and offers the ways on

    Scenario: The page says registering needs scripting
      Given a viewport 1200 pixels wide
      When the java script required page is opened
      Then the reader is told registering needs scripting switched on

    Scenario: The page offers the way back to the register page
      Given a viewport 1200 pixels wide
      When the java script required page is opened
      Then the page offers a way to the register page

    Scenario: The page offers the way home
      Given a viewport 1200 pixels wide
      When the java script required page is opened
      Then the page offers a way to the home page

    Scenario: Every word on the page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the java script required page is opened
      Then every word in the page's content is in the test locale
