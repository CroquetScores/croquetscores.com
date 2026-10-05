@browser @postgres
Feature: A commentary's writer can change its title

  A commentary's page shows its writer, beside the commentary's title, a
  pencil, named Edit, as each comment has (`commentary.feature`), which leads
  to the page that changes the title, at the commentary's address followed by
  "edit", as "/2026/ac/spring-open/commentaries/day-one/edit". Anybody else,
  signed in or not, is offered no pencil there.

  The page asks for a title, holding the one the commentary has now so that a
  small correction is a small edit. A title is held to the rules of a
  commentary title (`CommentaryTitle.feature`), and one that breaks a rule,
  or that another commentary on the tournament has
  (`changeCommentaryTitle.feature`), is said beneath the field, with what was
  typed put back. As on the page that starts a commentary
  (`startCommentary.feature`), the field puts no limit on what is typed. A
  sound title is kept, and the writer is taken back to the commentary, which
  is found where it was, since it keeps its slug.

  Only the commentary's writer has the page. A reader not signed in is sent
  to sign in first; anybody else is told the page is not found, as it is not
  one there is for them. It needs no scripting.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"

  Rule: Only the commentary's writer is offered a pencil beside its title

    Scenario: The writer is offered a way to change the title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to change the commentary's title is a pencil named "Edit"

    Scenario: The pencil is to the right of the title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to change the commentary's title is to the right of the title

    Scenario: The pencil leads to the page that changes the title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to change the commentary's title leads to "/2026/ac/spring-open/commentaries/day-one/edit"

    Scenario: A reader signed in who is not the writer is offered no pencil
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page offers no way to change the commentary's title

    Scenario: A reader not signed in is offered no pencil
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page offers no way to change the commentary's title

  Rule: Only the commentary's writer has the page

    Scenario: A reader not signed in is sent to sign in first
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/day-one/edit" is opened
      Then the sign in page is shown

    Scenario: A reader signed in to another account is told the page is not found
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one/edit" is opened
      Then the page says the words for "errors.notFound"

    Scenario: The writer is asked for a title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one/edit" is opened
      Then the dialog asks for a title

    Scenario: The title field holds the commentary's title
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one/edit" is opened
      Then the title field holds "Day one"

  Rule: A sound title is kept, and the writer is taken back to the commentary

    Scenario: The commentary has the title that was typed
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "Day one, morning" is typed
      When the dialog is submitted
      Then the tournament "Spring Open" has the commentary "Day one, morning"

    Scenario: The writer is taken back to the commentary where it was
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "Day one, morning" is typed
      When the dialog is submitted
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

    Scenario: The commentary is headed by the title that was typed
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "Day one, morning" is typed
      When the dialog is submitted
      Then the content has the heading "Day one, morning"

    Scenario: The title can be changed with scripting off
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open with scripting off
      And the title "Day one, morning" is typed
      When the dialog is submitted
      Then the content has the heading "Day one, morning"

  Rule: A title that is refused is said beneath the field, and changes nothing

    Scenario: A missing title is said beneath the field
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "   " is typed
      When the dialog is submitted
      Then the title field says the message for "CommentaryTitle.Missing"

    Scenario: A title another commentary has is said beneath the field
      Given "writer@example.com" has started the commentary "Day two" on "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "Day Two" is typed
      When the dialog is submitted
      Then the title field says the message for "Tournament.CommentaryTitleTaken"

    Scenario: What was typed is put back
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And a title of 101 characters is typed
      When the dialog is submitted
      Then the title field holds "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

    Scenario: A title that is refused changes nothing
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one/edit" is open
      And the title "   " is typed
      When the dialog is submitted
      Then the tournament "Spring Open" has the commentary "Day one"
