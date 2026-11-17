Feature: The site can be read in Swedish

  The site is offered in Swedish as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Swedish itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Swedish has words for everything English has

    A word missing from the Swedish catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Swedish catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Swedish entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Swedish one
      Given the English catalogue
      And the Swedish catalogue
      Then every entry in English has one in Swedish

    Scenario: Swedish has no entry English does not
      Given the English catalogue
      And the Swedish catalogue
      Then every entry in Swedish has one in English

    Scenario: Each Swedish entry fills in what its English one does
      Given the English catalogue
      And the Swedish catalogue
      Then every entry in Swedish fills in the same things as its English one

  Rule: The site offers Swedish

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Swedish is
    among them.

    @browser @postgres
    Scenario: A browser asking for Swedish gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "sv"
      When the home page is opened
      Then the page is in "sv"

    @browser @postgres
    Scenario: A regional form of Swedish gets Swedish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "sv-FI"
      When the home page is opened
      Then the page is in "sv"

    @browser @postgres
    Scenario: A browser asking for neither still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in Swedish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "sv"
      When the home page is opened
      Then the link "Hjälp" is visible

    @browser @postgres
    Scenario: The footer offers Swedish by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "sv" is offered as "Svenska"

    @browser @postgres
    Scenario: Choosing Swedish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "sv" is chosen
      Then the page is in "sv"
