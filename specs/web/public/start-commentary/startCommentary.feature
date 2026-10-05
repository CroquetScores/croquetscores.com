@browser @postgres
Feature: A reader signed in can start a commentary on a tournament

  The page that starts a commentary is at the tournament's commentaries page
  followed by "create", as "/2026/ac/spring-open/commentaries/create", where
  the old site had it. It asks for a title, and nothing else: what the
  commentary says is written on its own page once it is started
  (`commentary.feature`). A title is held to the rules of a commentary title
  (`CommentaryTitle.feature`), no more than 100 characters, and only where
  it is kept. The field itself puts no limit on what is typed: a browser
  counts what is typed, where a title is counted as a reader counts it, with
  its tags and the spaces at either end taken out, so a limit on the field
  would cut short a title that is not too long. That is how every other form
  here holds a length.

  A title that breaks a rule, or one another commentary on the tournament
  has (`startCommentary.feature`), is said beneath the field, and what was
  typed is put back. A sound one starts the commentary, with the reader as
  its writer, and the reader is taken to its page, ready to write the first
  comment.

  Only a reader who is signed in can start one; one who is not is sent to
  sign in first. Any account will do: the reader need not manage the
  tournament or be known to it (`StartCommentary.feature`). Starting one
  needs no scripting. An archived tournament has no such page, nor one the
  website has never had.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"

  Rule: Only a reader signed in can start a commentary

    Scenario: A reader not signed in is sent to sign in first
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/create" is opened
      Then the sign in page is shown

    Scenario: A reader signed in is asked for a title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/create" is opened
      Then the dialog asks for a title

    Scenario: A reader whose account is forgotten while the page is open is sent to sign in
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the account for "writer@example.com" has been forgotten
      And the title "Day one" is typed
      When the dialog is submitted
      Then the sign in page is shown

  Rule: A sound title starts the commentary, and the reader is taken to it

    Scenario: The commentary is one of the tournament's
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "Day one" is typed
      When the dialog is submitted
      Then the tournament "Spring Open" has the commentary "Day one"

    Scenario: The reader is the commentary's writer
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "Day one" is typed
      When the dialog is submitted
      Then the writer of the commentary "Day one" of "Spring Open" is the account for "writer@example.com"

    Scenario: The reader is taken to the commentary's page
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "Day one" is typed
      When the dialog is submitted
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

  Rule: A title that is refused is said beneath the field, and starts nothing

    Scenario: A missing title is said beneath the field
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "   " is typed
      When the dialog is submitted
      Then the title field says the message for "CommentaryTitle.Missing"

    Scenario: A title longer than 100 characters is said beneath the field
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And a title of 101 characters is typed
      When the dialog is submitted
      Then the title field says the message for "CommentaryTitle.TooLong"

    Scenario: A title of 100 characters with spaces around it is not cut short
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And a title of 100 characters with spaces around it is typed
      When the dialog is submitted
      Then the tournament "Spring Open" has a commentary with a title of 100 characters

    Scenario: A title with no letter or digit is said beneath the field
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "???" is typed
      When the dialog is submitted
      Then the title field says the message for "CommentaryTitle.NoLetterOrDigit"

    Scenario: A title another commentary has is said beneath the field
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "Day One" is typed
      When the dialog is submitted
      Then the title field says the message for "Tournament.CommentaryTitleTaken"

    Scenario: What was typed is put back
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "Day One" is typed
      When the dialog is submitted
      Then the title field holds "Day One"

    Scenario: A title that is refused starts nothing
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open
      And the title "   " is typed
      When the dialog is submitted
      Then the tournament "Spring Open" has no commentaries

  Rule: The page needs no scripting

    Scenario: A commentary can be started with scripting off
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/create" is open with scripting off
      And the title "Day one" is typed
      When the dialog is submitted
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

  Rule: Only a tournament a reader is sent to has the page

    Scenario: An archived tournament has no page to start a commentary
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/create" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An address no tournament has been found at has no page to start a commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/autumn-open/commentaries/create" is opened
      Then the page says the words for "errors.notFound"
