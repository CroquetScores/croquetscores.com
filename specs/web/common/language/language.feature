@browser
Feature: A reader is spoken to in their own language

  The site is written to be read in more than one language. Every word a page
  shows comes from a catalogue for the reader's language, looked up by what the
  word is for, rather than being written into the page; so a page can be put
  into another language by adding a catalogue, and by nothing else.

  Which language is the browser's to say, until the reader says otherwise. A
  browser says which languages its reader reads, best first, and the reader
  gets the first of them the site has — a regional form such as Australian
  English counting as the language it is a form of. Where the site has none of
  them, the reader gets English. A reader can also choose a language from a
  list in the footer, and is taken at their word on every page afterwards and
  on every visit after that, as with the theme. The list opens on the language
  in force. The choice is a form that gets posted, by a button beside the list,
  and a cookie that comes back, and needs no scripting: a list that sent itself
  the moment it changed would need scripting to do it, and would leave a
  keyboard reader choosing whatever they passed on the way down.

  A page says which language it is in, so that a screen reader reads it in the
  right voice and a browser offers to translate only what it should.

  To prove that every word comes from a catalogue, the scenarios have a test
  locale as well as English. It is English with every phrase marked where it
  begins and ends, made from the English catalogue rather than written by hand,
  so a word with no English entry cannot be in it either. A word on a page in
  the test locale that is not marked came from somewhere other than a
  catalogue. The test locale exists only where the scenarios run; nobody else
  is offered it.

  This change puts forms, and pages saying something went wrong, into the
  reader's language. The words in the site's own bars — the header, the section
  navigation and the footer — follow in a change of their own, and until then
  are English whatever the reader's language is, the language choice itself
  excepted.

  Rule: The browser decides until the reader says otherwise

    Scenario: A browser asking for a language the site has gets it
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the page is in "en-XA"

    Scenario: A browser asking for a language the site does not have gets English
      Given a viewport 1200 pixels wide
      And a browser that asks for "fr"
      When the home page is opened
      Then the page is in "en"

    Scenario: The first language the browser asks for that the site has is the one given
      Given a viewport 1200 pixels wide
      And a browser that asks for "fr, en;q=0.5, en-XA;q=0.8"
      When the home page is opened
      Then the page is in "en-XA"

    Scenario: A regional form of a language the site has gets that language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-AU, en-XA;q=0.5"
      When the home page is opened
      Then the page is in "en"

    Scenario: A browser asking for no language gets English
      Given a viewport 1200 pixels wide
      And a browser that asks for no language
      When the home page is opened
      Then the page is in "en"

  Rule: A choice overrules the browser

    Scenario: Choosing a language the browser did not ask for
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the home page is open
      When the language "en-XA" is chosen
      Then the page is in "en-XA"

    Scenario: The list opens on the language in force
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the home page is open
      When the language "en-XA" is chosen
      Then the language "en-XA" is the one in force

    Scenario: The choice outlasts the page it was made on
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the home page is open
      And the language "en-XA" is chosen
      When a page that is not there is opened
      Then the page is in "en-XA"

    Scenario: Choosing brings the reader back to the page they chose on
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the register page is open
      When the language "en-XA" is chosen
      Then the register page is shown

  Rule: Every word a form shows is in the reader's language

    Scenario: A form opened fresh
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the example form is opened
      Then every word in the dialog is in the test locale

    Scenario: A form shown again once refused
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And the example form is open
      And "-1" is typed into the start field
      When the dialog is submitted
      Then every word in the dialog is in the test locale

    Scenario: A rule about more than one field
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And the example form is open
      And "5" is typed into the start field
      And "1" is typed into the end field
      When the dialog is submitted
      Then every word in the dialog is in the test locale

    Scenario: The register page
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the register page is opened
      Then every word in the dialog is in the test locale

    Scenario: What the register page says once it has been submitted
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And the register page is open
      When the dialog is submitted
      Then every word in the dialog is in the test locale

  Rule: A page saying something went wrong is in the reader's language

    Scenario: A page that is not there
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When a page that is not there is opened
      Then every word in the page's content is in the test locale

  Rule: The language choice names each language in that language

    A reader looking for their own language looks for its name as they would
    write it, which is not necessarily how the page they are on would.

    Scenario: English is offered as English on a page in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the language "en" is offered as "English"
