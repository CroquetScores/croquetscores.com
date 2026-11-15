@browser
Feature: The footer leads a reader to how the site is put on their home screen

  An iPhone never tells a page that the site can be installed, so there is no
  button to show on one (`webAppManifest.feature`), and a reader who would
  like the site on their home screen has no way to learn that they can. The
  help says how (`helpHomeScreen.feature`); this is what leads a reader to it.
  It is a link in the footer, with the ones to the privacy page, the terms of
  use and a bug report, because the footer is where a reader looks for what a
  site can do that is not on the page in front of them.

  The link is not worked out from the reader's phone. Reading which phone it is
  from what the browser says about itself goes wrong each time a phone or a
  browser changes, and the one reader it must not miss is the one whose phone
  the site does not recognise. So every reader has the link, and the button
  takes its place for those whose browser has said it can install the site,
  since a link beside a button that already does it would be a second way to
  the same place, and a longer one.

  The link is the words of the reader's language, and leads to the help in the
  same language (`help.feature`). It is on every page the footer is on, the
  admin's included, since the footer is the shell's and not any page's.

  A try website offers nothing of this kind (`webAppManifest.feature`), and an
  installed site has already been put there, so neither has the link.

  Rule: A reader is offered the link

    Scenario: The footer offers the link
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer offers the link "Add to home screen"

    Scenario: The link leads to the page about the home screen
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer link "Add to home screen" leads to "/help/readers/home-screen"

    Scenario: The admin's footer offers it too
      Given a viewport 1200 pixels wide
      When the admin is opened
      Then the footer offers the link "Add to home screen"

    Scenario: A reader without scripting is offered the link
      Given scripting is switched off
      When the sign in page is opened
      Then the footer offers the link "Add to home screen"

    Scenario: A reader whose browser has said nothing is offered the link
      Given scripting is switched on
      When the home page is opened
      Then the footer offers the link "Add to home screen"

  Rule: The link is in the reader's language

    Scenario: The link is in the language the reader has chosen
      Given the reader has chosen German
      When the sign in page is opened
      Then the footer offers the link "Zum Home-Bildschirm hinzufügen"

    Scenario: The link leads to the page in the language the reader has chosen
      Given the reader has chosen German
      When the sign in page is opened
      And the footer link "Zum Home-Bildschirm hinzufügen" is followed
      Then the page is in German

  Rule: The link is among the footer's links

    The links are on a row of their own, at the right (`layout.feature`), and
    this one is the last of them. Report a bug stays third, where it is.

    Scenario: The link is the fourth of the footer's links
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the fourth footer link is "Add to home screen"

    Scenario: The link is on the row of the footer's links
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer's links are side by side

    Scenario: The link is as tall as a thumb needs
      Given a viewport 400 pixels wide
      When the sign in page is opened
      Then the footer link "Add to home screen" is at least 44 pixels tall

  Rule: The button takes the link's place

    Scenario: A reader whose browser says the site can be installed is not offered the link
      Given scripting is switched on
      And the home page is open
      When the browser says the site can be installed
      Then the footer does not offer the link "Add to home screen"

    # A reader who turns the offer down has still not put the site there, and
    # the browser will not make the offer again at once, so the link is the
    # one way left to learn how.
    Scenario: The link is back when the reader turns the offer down
      Given scripting is switched on
      And the home page is open
      And the browser says the site can be installed
      And the install button is pressed
      When the reader turns the offer down
      Then the footer offers the link "Add to home screen"

    Scenario: The link stays away once the site is installed
      Given scripting is switched on
      And the home page is open
      And the browser says the site can be installed
      And the install button is pressed
      When the browser says the site has been installed
      Then the footer does not offer the link "Add to home screen"

  Rule: An installed site and a try website are not offered the link

    Scenario: A reader on the site as an installed app is not offered the link
      Given scripting is switched on
      When the site is opened as an installed app
      Then the footer does not offer the link "Add to home screen"

    Scenario: A try website does not offer the link
      Given a viewport 1200 pixels wide
      When the try website's home page is opened
      Then the footer does not offer the link "Add to home screen"
