@browser @postgres
Feature: A commentary's writer can edit or delete any of its comments

  Each comment in a commentary has its own page, where its writer edits it,
  reached from the way to edit it offered beside it on the commentary's page
  (`commentary.feature`). It is at the commentary's address followed by
  "comments", the comment id's own characters and "edit", so that the
  address says which comment it is whatever the comment says. It holds what
  the comment says now in a box four lines tall, as the box a comment is
  written in is, so that a correction is a small edit.

  An edit is held to the rules of a comment, and kept as it was typed
  (`CommentText.feature`). One that breaks a rule is said beneath the box,
  and what was typed is put back. A sound one is kept, and the writer is
  taken back to the commentary, which shows the comment as edited. Ctrl and
  Enter pressed together in the box save it, as they send a comment from the
  commentary's own box (`commentary.feature`), and Command and Enter on a
  Mac.

  The page edits and does nothing else: it offers no way to delete the
  comment. That is the trash can beside the comment's pencil on the
  commentary (`commentary.feature`), which asks first in a modal dialog. A
  browser with scripting off has no modal dialog, so there the trash can
  leads instead to a page of the comment's own that asks the same, at the
  commentary's address followed by "comments", the comment id's own
  characters and "delete". Deleting cannot be undone
  (`deleteComment.feature`), so only a delete confirmed there takes the
  comment away, and the writer is then taken back to the commentary, which no
  longer shows it; calling it off goes back to the commentary as it was.

  Only the commentary's writer can edit or delete its comments
  (`EditComment.feature`, `DeleteComment.feature`). A reader who is not
  signed in is sent to sign in first; one signed in to any other account is
  told the page is not found, as the page is not one there is for them. The
  page needs no scripting. A comment that has been deleted has no page.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"
    And "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"

  Rule: Only the commentary's writer can edit its comments

    Scenario: A reader not signed in is sent to sign in first
      Given nobody is signed in
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the sign in page is shown

    Scenario: A reader signed in to another account is told the page is not found
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the page says the words for "errors.notFound"

    Scenario: The writer is shown the comment to edit
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the comment box holds "Sam is two hoops up"

    Scenario: The box is four lines tall
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the comment box is 4 lines tall

  Rule: A sound edit is kept, and the writer is taken back to the commentary

    Scenario: The comment says what it was edited to
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And the comment "Sam is three hoops up" is typed in place of what it held
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is three hoops up"

    Scenario: The writer is taken back to the commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And the comment "Sam is three hoops up" is typed in place of what it held
      When the comment is submitted
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

    Scenario: The commentary shows the comment as edited
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And the comment "Sam is three hoops up" is typed in place of what it held
      When the comment is submitted
      Then the first comment says "Sam is three hoops up"

    Scenario: A comment can be edited with scripting off
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open with scripting off
      And the comment "Sam is three hoops up" is typed in place of what it held
      When the comment is submitted
      Then the first comment says "Sam is three hoops up"

  Rule: A commentary titled in another script is edited in as any is

    Background:
      Given "writer@example.com" has started the commentary "День два" on "Spring Open"
      And "writer@example.com" has added the comment "Kim has a lift" to "День два" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"

    Scenario: An edit is shown in a commentary titled in another script
      Given the page to edit the comment "Kim has a lift" is open
      And the comment "Kim has a second lift" is typed in place of what it held
      When the comment is submitted
      Then the first comment says "Kim has a second lift"

    Scenario: A comment deleted from a commentary titled in another script is gone from it
      Given the page to delete the comment "Kim has a lift" is open
      When the delete is confirmed
      Then the commentary page says there are no comments

  Rule: An edit that is refused is said beneath the box, and changes nothing

    Scenario: A missing comment is said beneath the box
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And the comment "   " is typed in place of what it held
      When the comment is submitted
      Then the comment box says the message for "CommentText.Missing"

    Scenario: What was typed is put back
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And a comment of 10001 characters is typed in place of what it held
      When the comment is submitted
      Then the comment box holds what was typed

    Scenario: An edit that is refused changes nothing
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open
      And the comment "   " is typed in place of what it held
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

  Rule: Ctrl and Enter in the box save the edit

    Scenario: Ctrl and Enter save the edit
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to edit the comment "Sam is two hoops up" is open with scripting on
      And the comment "Sam is three hoops up" is typed in place of what it held
      When Control and Enter are pressed in the comment box
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is three hoops up"

  Rule: The page edits the comment, and offers no way to delete it

    Scenario: The page does not offer to delete the comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the page does not offer the button "Delete"

  Rule: Without scripting, deleting asks first on a page of its own, and only a delete confirmed takes the comment away

    Scenario: The page asks whether to delete the comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to delete the comment "Sam is two hoops up" is opened
      Then the page asks whether to delete the comment "Sam is two hoops up"

    Scenario: Opening the page alone takes nothing away
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to delete the comment "Sam is two hoops up" is opened
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: A delete confirmed takes the comment away
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to delete the comment "Sam is two hoops up" is open
      When the delete is confirmed
      Then the commentary "Day one" of "Spring Open" does not have the comment "Sam is two hoops up"

    Scenario: The writer is taken back to the commentary once the comment is deleted
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to delete the comment "Sam is two hoops up" is open
      When the delete is confirmed
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

    Scenario: The commentary no longer shows a deleted comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to delete the comment "Sam is two hoops up" is open
      When the delete is confirmed
      Then the commentary page says there are no comments

    Scenario: A delete called off goes back to the commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to delete the comment "Sam is two hoops up" is open
      When the delete is called off
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

    Scenario: A delete called off takes nothing away
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page to delete the comment "Sam is two hoops up" is open
      When the delete is called off
      Then the first comment says "Sam is two hoops up"

    Scenario: A reader not signed in is sent to sign in first
      Given nobody is signed in
      When the page to delete the comment "Sam is two hoops up" is opened
      Then the sign in page is shown

    Scenario: A reader signed in to another account is told the page is not found
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page to delete the comment "Sam is two hoops up" is opened
      Then the page says the words for "errors.notFound"

  Rule: A deleted comment has no page

    Scenario: The page of a deleted comment is not found
      Given "writer@example.com" has deleted the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page to edit the comment "Sam is two hoops up" is opened
      Then the page says the words for "errors.notFound"
