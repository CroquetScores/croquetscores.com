@browser
Feature: A reader who has registered is told to check their email

  Registering ends at the welcome page. What happens next happens by email: a
  new address is sent a link to confirm it, and an address that already has an
  account is told so there, where only its owner reads it. The page itself says
  the same thing to everyone — that an email is on its way, and to follow it —
  because a page that read differently for an address already registered would
  tell anyone who tried which addresses have accounts.

  So the page knows nothing of who arrives at it, and shows nothing of them:
  not their name, and not their address, which would have to reach it in the
  page's own address, and an email address in a URL ends up in logs and in the
  browser's history. Nobody needs to be signed in to see it, since nobody is,
  and it needs no scripting.

  That registering arrives here, whoever the address belongs to, is specified
  with registering.

  Rule: The welcome page tells the reader to check their email

    Scenario: The reader is told an email is on its way
      Given a viewport 1200 pixels wide
      When the welcome page is opened
      Then the reader is told to check their email

    Scenario: It needs nobody signed in, and no scripting
      Given a viewport 1200 pixels wide
      When the welcome page is opened
      Then the welcome page is shown

  Rule: The welcome page is in the reader's language

    Scenario: Every word on the page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the welcome page is opened
      Then every word in the page's content is in the test locale
