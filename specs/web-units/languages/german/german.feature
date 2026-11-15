Feature: The site can be read in German

  The site is offered in German as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about German itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: German has words for everything English has

    A word missing from the German catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the German catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a German entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a German one
      Given the English catalogue
      And the German catalogue
      Then every entry in English has one in German

    Scenario: German has no entry English does not
      Given the English catalogue
      And the German catalogue
      Then every entry in German has one in English

    Scenario: Each German entry fills in what its English one does
      Given the English catalogue
      And the German catalogue
      Then every entry in German fills in the same things as its English one

  Rule: The site offers German

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that German is
    among them.

    @browser @postgres
    Scenario: A browser asking for German gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "de"
      When the home page is opened
      Then the page is in "de"

    @browser @postgres
    Scenario: A regional form of German, as spoken in Austria, gets German
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "de-AT"
      When the home page is opened
      Then the page is in "de"

    @browser @postgres
    Scenario: A browser asking for a language the site lacks still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in German
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "de"
      When the home page is opened
      Then the link "Hilfe" is visible

    @browser @postgres
    Scenario: The footer offers German by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "de" is offered as "Deutsch"

    @browser @postgres
    Scenario: Choosing German
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "de" is chosen
      Then the page is in "de"
