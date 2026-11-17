Feature: The site can be read in Welsh

  The site is offered in Welsh as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Welsh itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Welsh has words for everything English has

    A word missing from the Welsh catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Welsh catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Welsh entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Welsh one
      Given the English catalogue
      And the Welsh catalogue
      Then every entry in English has one in Welsh

    Scenario: Welsh has no entry English does not
      Given the English catalogue
      And the Welsh catalogue
      Then every entry in Welsh has one in English

    Scenario: Each Welsh entry fills in what its English one does
      Given the English catalogue
      And the Welsh catalogue
      Then every entry in Welsh fills in the same things as its English one

  Rule: The site offers Welsh

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Welsh is
    among them.

    @browser @postgres
    Scenario: A browser asking for Welsh gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "cy"
      When the home page is opened
      Then the page is in "cy"

    @browser @postgres
    Scenario: A regional form of Welsh gets Welsh
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "cy-GB"
      When the home page is opened
      Then the page is in "cy"

    @browser @postgres
    Scenario: A browser asking for a language the site does not offer still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in Welsh
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "cy"
      When the home page is opened
      Then the link "Cymorth" is visible

    @browser @postgres
    Scenario: The footer offers Welsh by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "cy" is offered as "Cymraeg"

    @browser @postgres
    Scenario: Choosing Welsh
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "cy" is chosen
      Then the page is in "cy"
