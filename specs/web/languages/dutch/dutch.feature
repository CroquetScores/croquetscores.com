Feature: The site can be read in Dutch

  The site is offered in Dutch as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Dutch itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Dutch has words for everything English has

    A word missing from the Dutch catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Dutch catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Dutch entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Dutch one
      Given the English catalogue
      And the Dutch catalogue
      Then every entry in English has one in Dutch

    Scenario: Dutch has no entry English does not
      Given the English catalogue
      And the Dutch catalogue
      Then every entry in Dutch has one in English

    Scenario: Each Dutch entry fills in what its English one does
      Given the English catalogue
      And the Dutch catalogue
      Then every entry in Dutch fills in the same things as its English one

  Rule: The site offers Dutch

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Dutch is
    among them. There is no scenario that a bar is in Dutch by one of its links,
    as the other languages have, because Dutch writes "Help" and "Home" as
    English does and it would pass on an English page.

    @browser @postgres
    Scenario: A browser asking for Dutch gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "nl"
      When the home page is opened
      Then the page is in "nl"

    @browser @postgres
    Scenario: A regional form of Dutch gets Dutch
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "nl-BE"
      When the home page is opened
      Then the page is in "nl"

    @browser @postgres
    Scenario: A browser asking for a language the site lacks still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The footer offers Dutch by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "nl" is offered as "Nederlands"

    @browser @postgres
    Scenario: Choosing Dutch
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "nl" is chosen
      Then the page is in "nl"
