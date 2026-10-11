Feature: The site can be read in Polish

  The site is offered in Polish as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Polish itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Polish has words for everything English has

    A word missing from the Polish catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Polish catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Polish entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Polish one
      Given the English catalogue
      And the Polish catalogue
      Then every entry in English has one in Polish

    Scenario: Polish has no entry English does not
      Given the English catalogue
      And the Polish catalogue
      Then every entry in Polish has one in English

    Scenario: Each Polish entry fills in what its English one does
      Given the English catalogue
      And the Polish catalogue
      Then every entry in Polish fills in the same things as its English one

  Rule: The site offers Polish

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Polish is
    among them.

    @browser @postgres
    Scenario: A browser asking for Polish gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "pl"
      When the home page is opened
      Then the page is in "pl"

    @browser @postgres
    Scenario: A regional form of Polish gets Polish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "pl-PL"
      When the home page is opened
      Then the page is in "pl"

    @browser @postgres
    Scenario: A browser asking for neither still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in Polish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "pl"
      When the home page is opened
      Then the link "Pomoc" is visible

    @browser @postgres
    Scenario: The footer offers Polish by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "pl" is offered as "Polski"

    @browser @postgres
    Scenario: Choosing Polish
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "pl" is chosen
      Then the page is in "pl"
