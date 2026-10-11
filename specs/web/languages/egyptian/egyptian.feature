Feature: The site can be read in Egyptian Arabic

  The site is offered in Egyptian Arabic as well as English. How a reader comes
  to be spoken to in a language — the browser's word first, then their own
  choice — is `language.feature`'s, and is proved there with English and a test
  locale. This is about Egyptian itself: that the site offers it, that what it
  says in it is the whole of what it says in English, and that a page in it is
  laid out the way Arabic is read.

  Rule: Egyptian has words for everything English has

    A word missing from the Egyptian catalogue is said in English instead, so a
    page with one missing would be half in each language and nothing would
    fail. So the Egyptian catalogue is held to the English one: the same
    entries, and in each, the same things filled in — a site's name, a link, an
    email address — since an Egyptian entry that dropped one would send a
    reader an email with no link in it.

    Scenario: Every English entry has an Egyptian one
      Given the English catalogue
      And the Egyptian catalogue
      Then every entry in English has one in Egyptian

    Scenario: Egyptian has no entry English does not
      Given the English catalogue
      And the Egyptian catalogue
      Then every entry in Egyptian has one in English

    Scenario: Each Egyptian entry fills in what its English one does
      Given the English catalogue
      And the Egyptian catalogue
      Then every entry in Egyptian fills in the same things as its English one

  Rule: The site offers Egyptian

    Every other scenario runs the site with English and the test locale, so
    that it can prove every word came from a catalogue. These run it with the
    languages it is served with, which is the only way to see that Egyptian is
    among them.

    @browser @postgres
    Scenario: A browser asking for Egyptian gets it
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ar-EG"
      When the home page is opened
      Then the page is in "ar-EG"

    @browser @postgres
    Scenario: A browser asking for neither still gets English
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ga"
      When the home page is opened
      Then the page is in "en"

    @browser @postgres
    Scenario: The site's bars are in Egyptian
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ar-EG"
      When the home page is opened
      Then the link "المساعدة" is visible

    @browser @postgres
    Scenario: The footer offers Egyptian by its own name
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the language "ar-EG" is offered as "العربية (مصر)"

    @browser @postgres
    Scenario: Choosing Egyptian
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      And the home page is open
      When the language "ar-EG" is chosen
      Then the page is in "ar-EG"

  Rule: Egyptian is written from right to left

    Arabic reads right to left, so a page in it says so. Without that, the
    browser lays the page out from left to right and sets the punctuation of an
    Arabic sentence on the wrong end of it, so everything on the page comes out
    reversed.

    @browser @postgres
    Scenario: A page in Egyptian reads from right to left
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "ar-EG"
      When the home page is opened
      Then the page reads from right to left

    @browser @postgres
    Scenario: A page in English reads from left to right
      Given a viewport 1200 pixels wide
      And a site offering the languages it is served with
      And a browser that asks for "en"
      When the home page is opened
      Then the page reads from left to right
