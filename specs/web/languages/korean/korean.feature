Feature: The site can be read in Korean

  The site is offered in Korean as well as English. How a reader comes to be
  spoken to in a language — the browser's word first, then their own choice —
  is `language.feature`'s, and is proved there with English and a test locale.
  This is about Korean itself: that the site offers it, and that what it says
  in it is the whole of what it says in English.

  Rule: Korean has words for everything English has

    A word missing from the Korean catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Korean catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link,
    an email address — since a Korean entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has a Korean one
      Given the English catalogue
      And the Korean catalogue
      Then every entry in English has one in Korean

    Scenario: Korean has no entry English does not
      Given the English catalogue
      And the Korean catalogue
      Then every entry in Korean has one in English

    Scenario: Each Korean entry fills in what its English one does
      Given the English catalogue
      And the Korean catalogue
      Then every entry in Korean fills in the same things as its English one

  Rule: The site offers Korean

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Korean is
    among them.

    @browser @postgres
    Scenario: A browser asking for Korean gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ko"
      When the home page is opened
      Then the page is in "ko"

    @browser @postgres
    Scenario: A regional form of Korean gets Korean
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ko-KR"
      When the home page is opened
      Then the page is in "ko"

    @browser @postgres
    Scenario: A browser asking for neither still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in Korean
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ko"
      When the home page is opened
      Then the link "도움말" is visible

    @browser @postgres
    Scenario: The footer offers Korean by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "ko" is offered as "한국어"

    @browser @postgres
    Scenario: Choosing Korean
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "ko" is chosen
      Then the page is in "ko"
