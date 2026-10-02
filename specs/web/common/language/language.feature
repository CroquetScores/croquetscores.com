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

  Forms, pages saying something went wrong, and the site's own bars are all
  in the reader's language. What is left in English on a page is what that page
  brought with it, and what is left is stand-ins: the home page's prose and the
  sections it names, which go with the features that replace them.

  Rule: The browser decides until the reader says otherwise

    @postgres
    Scenario: A browser asking for a language the site has gets it
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the page is in "en-XA"

    @postgres
    Scenario: A browser asking for a language the site does not have gets English
      Given a viewport 1200 pixels wide
      And a browser that asks for "fr"
      When the home page is opened
      Then the page is in "en"

    @postgres
    Scenario: The first language the browser asks for that the site has is the one given
      Given a viewport 1200 pixels wide
      And a browser that asks for "fr, en;q=0.5, en-XA;q=0.8"
      When the home page is opened
      Then the page is in "en-XA"

    @postgres
    Scenario: A regional form of a language the site has gets that language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-AU, en-XA;q=0.5"
      When the home page is opened
      Then the page is in "en"

    @postgres
    Scenario: A browser asking for no language gets English
      Given a viewport 1200 pixels wide
      And a browser that asks for no language
      When the home page is opened
      Then the page is in "en"

  Rule: A choice overrules the browser

    @postgres
    Scenario: Choosing a language the browser did not ask for
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the home page is open
      When the language "en-XA" is chosen
      Then the page is in "en-XA"

    @postgres
    Scenario: The list opens on the language in force
      Given a viewport 1200 pixels wide
      And a browser that asks for "en"
      And the home page is open
      When the language "en-XA" is chosen
      Then the language "en-XA" is the one in force

    @postgres
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
      And the register page is open with scripting on
      When the language "en-XA" is chosen
      Then the register page is shown

  Rule: Every word in the site's own bars is in the reader's language

    The bars are the site's own rather than any page's: the pinned header with
    its navigation, the section bar beneath it, and the footer with the Donate
    button, the plea beside it, the copyright line, the theme choice and the
    language choice. Their words were written into the shell in English when it
    was built, so a reader who asked for another language has been reading the
    page in theirs and everything around it in English. The account menu in the
    header was put right first and is looked at with the menu itself
    (`accountMenu.feature`).

    Some of what is in the bars is a name rather than a word, and a name is not
    translated.

    The site's name is the site's own. It is configured rather than written
    into the shell, and it is the same name the site's emails call it by
    (`emailWriter.feature`): a site serving from this repository under another
    name should no more call itself Croquet Scores in its own footer than in
    its email. So it is not in any catalogue, and where a phrase in the bars
    names the site — the plea beside the Donate button does — the catalogue
    leaves a place for the name and the site fills it in, exactly as an email's
    subject does. A catalogue that spelled the name out would be a second place
    the site is called something, and the two would come to disagree. The same
    holds wherever else the site names itself: the link back to the home page
    that most pages carry leaves a place for the name in the same way, though
    it is a page's words rather than a bar's. Nine pages carry that link, and
    eight are looked at here. Four are reached by asking for them and nothing
    else — the page that is not there, the page shown after registering, the
    page asking for scripting, and the page saying registering is suspended.
    Four come at the end of something written down — a way back in asked for,
    a new password set, an account forgotten, an email address confirmed — so
    each is reached by doing it, with a database to write it down in. Each
    scenario says which page it is on before it reads the link, because the
    page that is not there carries the same link back: a scenario that only
    read the link would go on passing the day the page it means stops being
    served. The ninth, the page offering a new confirmation link, is held to it
    by its own scenario reading every word it shows, because a place left to
    fill counts among the words that came from somewhere other than a
    catalogue.

    Two more names stay as they are written. Each language in the list is named
    in its own language, so that a reader can find theirs, which is the rule
    below. And the copyright line holds a person and a span of years, filled
    into the catalogue's words the same way, so that what a reader sees is one
    phrase from the catalogue rather than a phrase with something bolted on the
    end of it.

    What a page puts in the bars stays the page's. The sections a page names
    are its own words, and today they are stand-ins for the ones the first
    feature with real sections will bring; the bar's own word is the one it is
    announced by to a reader who cannot see it.

    @postgres
    Scenario: Every word in the header
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the header is in the test locale

    @postgres
    Scenario: Every word in the footer
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the footer is in the test locale

    @postgres
    Scenario: The way to the content, for a reader coming by keyboard
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the way to skip to the content is in the test locale

    @postgres
    Scenario: The navigation is named for a reader who cannot see it
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the navigation is named in the test locale

    @postgres
    Scenario: The section bar is named for a reader who cannot see it
      Given a viewport 1200 pixels wide
      And a site served as "croquetscores.com"
      And a browser that asks for "en-XA"
      And "organiser@example.com" has an account, confirmed
      And "organiser@example.com" has created the tournament "Spring Open"
      When the home page is opened
      Then the section bar is named in the test locale

    @postgres
    Scenario: A site configured under another name calls itself that
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When the home page is opened
      Then the header names the site "Gateball Scores"
      And the plea names the site "Gateball Scores"

    Scenario: A site configured under another name is named in the way back to it
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When a page that is not there is opened
      Then the way back to the home page names the site "Gateball Scores"

    Scenario: The way back from the page shown after registering names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When the page shown after registering is opened
      Then the page says the words for "welcome.title"
      And the way back to the home page names the site "Gateball Scores"

    Scenario: The way back from the page asking for scripting names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When the page asking for scripting is opened
      Then the page says the words for "javaScriptRequired.title"
      And the way back to the home page names the site "Gateball Scores"

    Scenario: The way back from the page saying registering is suspended names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      When the page saying registering is suspended is opened
      Then the page says the words for "registrationsSuspended.title"
      And the way back to the home page names the site "Gateball Scores"

    @postgres
    Scenario: The way back from the page saying a way back in is on its way names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      And "someone@example.com" has an account, confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then the reader is told to check their email
      And the way back to the home page names the site "Gateball Scores"

    @postgres
    Scenario: The way back from the page saying a new password is set names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed
      And the way back to the home page names the site "Gateball Scores"

    @postgres
    Scenario: The way back from the page saying an account is forgotten names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And a link to confirm forgetting has been sent to "someone@example.com"
      And the link is followed
      When forgetting is confirmed
      Then the reader is told their account has been forgotten
      And the way back to the home page names the site "Gateball Scores"

    @postgres
    Scenario: The way back from the page saying an email address is confirmed names the site
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the confirm password typed as "correct horse battery staple"
      When the dialog is submitted
      Then the reader is told their email address is confirmed
      And the way back to the home page names the site "Gateball Scores"

    @postgres
    Scenario: The site's name is not translated for a reader of another language
      Given a viewport 1200 pixels wide
      And a site called "Gateball Scores"
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the header names the site "Gateball Scores"
      And the plea names the site "Gateball Scores"

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
      When the register page is opened with scripting on
      Then every word in the dialog is in the test locale

    Scenario: What the register page says once it has been submitted
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And the register page is open with scripting on
      When the dialog is submitted
      Then every word in the dialog is in the test locale

  Rule: A page saying something went wrong is in the reader's language

    There are four of these pages, and each of them is the last thing a reader
    sees before giving up: a page that is not there, a page whose request broke
    a rule, a page for a request the site could not deal with, and a page where
    the site itself failed. They are the pages nobody opens on purpose, and the
    easiest place for an English sentence to be written in by hand, because
    whoever adds one is thinking about what went wrong rather than about who is
    reading it. So each of them is looked at, and not only the first.

    The page where the site failed carries a reference to find the failure by in
    the log. It is filled into the catalogue's sentence rather than put beside
    it, so what the reader sees is still one phrase from the catalogue with the
    reference inside it, and a reference given a label of its own would be a
    word from nowhere.

    Each scenario says which of the four it is on before it reads it. Every
    page of the site says what it says in the reader's language, so a scenario
    that only read the words would pass just as well on the page it was meant
    to leave, and would go on passing if the reader stopped being brought here
    at all.

    Scenario: A page that is not there
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When a page that is not there is opened
      Then the page says the words for "errors.notFound"
      And every word in the page's content is in the test locale

    Scenario: A page whose request broke a rule
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When a page whose request breaks a rule is opened
      Then the page says the words for "errors.refused"
      And every word in the page's content is in the test locale

    Scenario: A page for a request the site could not deal with
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And a page on another site with a button that posts "dark" here
      When the reader presses the button on that page
      Then the page says the words for "errors.sorry"
      And every word in the page's content is in the test locale

    Scenario: A page where the site failed
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When a page that fails is opened
      Then the page says the words for "errors.failed"
      And every word in the page's content is in the test locale

  Rule: The language choice names each language in that language

    A reader looking for their own language looks for its name as they would
    write it, which is not necessarily how the page they are on would.

    @postgres
    Scenario: English is offered as English on a page in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the language "en" is offered as "English"
