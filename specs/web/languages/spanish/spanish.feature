Feature: The site can be read in Spanish

  The site is offered in Spanish as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Spanish itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Spanish has words for everything English has

    A word missing from the Spanish catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Spanish catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Spanish entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Spanish one
      Given the English catalogue
      And the Spanish catalogue
      Then every entry in English has one in Spanish

    Scenario: Spanish has no entry English does not
      Given the English catalogue
      And the Spanish catalogue
      Then every entry in Spanish has one in English

    Scenario: Each Spanish entry fills in what its English one does
      Given the English catalogue
      And the Spanish catalogue
      Then every entry in Spanish fills in the same things as its English one

  Rule: The site offers Spanish

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Spanish is
    among them.

    @browser
    Scenario: A browser asking for Spanish gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "es"
      When the home page is opened
      Then the page is in "es"

    @browser
    Scenario: A regional form of Spanish gets Spanish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "es-MX"
      When the home page is opened
      Then the page is in "es"

    @browser
    Scenario: A browser asking for neither still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "fr"
      When the home page is opened
      Then the page is in "en"

    @browser
    Scenario: The site's bars are in Spanish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "es"
      When the home page is opened
      Then the link "Ayuda" is visible

    @browser
    Scenario: The footer offers Spanish by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "es" is offered as "Español"

    @browser
    Scenario: Choosing Spanish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "es" is chosen
      Then the page is in "es"
