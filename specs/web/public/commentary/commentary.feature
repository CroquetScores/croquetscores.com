@browser @postgres
Feature: A commentary's page shows its comments, and its writer adds to them

  A commentary's page is at the tournament's commentaries page followed by
  the commentary's slug, as "/2026/ac/spring-open/commentaries/day-one"
  (`commentaries.feature`). It is headed by the tournament's name, as each of
  the tournament's pages is, with the commentary's title as the heading of
  its content, and its writer's name beneath the title. The title is plain
  text, drawn as the words it is: Markdown in it is not drawn, so
  "**Day one**" is shown with its asterisks (`CommentaryTitle.feature`). Its
  sections are the tournament's, with Commentary marked as the section being
  read.

  Its comments are shown in the order they were written, the first written
  first, so that it reads from the start as the play did
  (`PublicCommentaryOfTournament.feature`). Each shows what it says, drawn
  from its Markdown, so that a word made bold is bold and a link is a link,
  and when it was written, said as how long ago a game was added is on the
  tournament's page (`tournament.feature`). A comment that has been edited
  says so. A comment is drawn as the old site drew one. A line beginning with
  a number and a full stop or a bracket, as "5. Sam roquets Alex", is drawn
  as it was written, not as an item of a numbered list: a commentator numbers
  turns, and a list would number "5." and "7." as 5 and 6. Inside a block of
  code, fenced by three backticks, a line is drawn exactly as it was written
  already, and is left to be. A web address
  written out with its "https://", and an email address, are drawn as links,
  without the Markdown a link is otherwise written in, since that is how a
  commentator types one on a phone. A link in a comment is marked as one the site does not vouch for,
  so that search engines give it nothing, which is what a link put in a
  commentary to sell something is after. Nothing in a comment is drawn as
  HTML: there is none in what was kept (`CommentText.feature`), and the
  Markdown is drawn with HTML turned off, so that nothing kept by any other
  way is drawn as HTML either.

  The commentary's writer, and only its writer, is offered a box beneath the
  last comment to write the next one in, four lines tall, which is enough to
  see what is being written on a phone without the box filling the screen.
  It is beneath because the comments read downwards, and the next one goes
  where it will be read. A comment written there is added, and the page
  shown again with it as the last comment and the box empty. One that is
  refused is said beneath the box, and what was typed is put back. Ctrl and
  Enter pressed together in the box send it, as the button does, so that a
  writer with a keyboard need not reach for the mouse between comments; on a
  Mac, Command and Enter do the same, since that is the Mac's way of saying
  it. Enter alone starts a new line, as it does in any box of several lines.

  The writer is offered too, beside each comment, a pencil, named Edit, which
  leads to the comment's own page (`editComment.feature`), so that the writer
  can scroll back through the commentary and correct any comment in it; and
  beside the pencil a trash can, named Delete, which deletes the comment. A
  deleted comment cannot be brought back (`deleteComment.feature`), so the
  trash can asks first, in a modal dialog over the commentary (`STYLE.md`
  §5c) that shows the comment and offers Delete comment and Cancel. Only
  Delete comment takes it away, and the commentary is shown again without
  it; Cancel and Escape close the dialog and take nothing away. A browser
  with scripting off has no modal dialog to open, so there the trash can
  leads to a page of its own that asks the same (`editComment.feature`).
  The writer is offered as well a pencil to the right of the commentary's
  title, which leads to the page that changes it
  (`changeCommentaryTitle.feature`). Anybody else, signed in or not, is
  offered neither the box nor a pencil nor a trash can: they read.

  Where there is scripting, a comment written in the box is added in place:
  it is sent without the page being drawn again, and shown as the last
  comment, with the box emptied and the writer still where they were in the
  commentary, so that writing comment after comment through a game is not
  interrupted by the page jumping back to its top each time. One that is
  refused is said beneath the box in place, with what was typed left in it.
  A comment added in place has its pencil and its trash can as any other
  does. A comment is sent once and never again by the page, since a comment
  sent twice would be kept twice: where the server sends the page elsewhere,
  as it does a writer signed out since the page was opened, to sign in, the
  page goes there, and where the comment could not be sent, or was sent and
  not answered, the page says so beneath the box and that loading the page
  again will show whether it was kept.

  Once a comment has been sent, by the button or by Ctrl and Enter, the page
  is scrolled so that the Add comment button is at the bottom of the window:
  the comment just added, or what is wrong with it, is then just above it,
  and the box is where the next comment is written, without the writer
  having to find it again.

  A reader is shown new comments without loading the page again. Where there
  is scripting, the page asks every quarter of a minute for the comments as
  they are now, and draws them again where they have changed, so that a
  comment written since the page was opened appears in its place, and one
  edited or deleted since reads as it does now. The comments are drawn again
  only when one has been written, edited or deleted, so that whatever a
  reader has pressed or tabbed to in them keeps the focus; how long ago each
  was written is kept up to date in its place. An answer asked for before a
  comment was added in place, and coming after it, is an answer about the
  comments as they were, and is not drawn; and a comment added in place that
  the comments asked for again have shown already is not added a second
  time when the answer to adding it comes. A quarter of a minute is
  soon enough to follow a game a stroke at a time, and seldom enough that a
  commentary read by many costs little. The page asks only while it can be
  seen, and asks again as soon as it can be seen once more. It needs nobody
  signed in, and the writer's own page asks too, so that a comment they
  wrote from another device appears. Without scripting, a reader loads the
  page again to see what is new, as on any other page.

  The page needs no scripting: what scripting adds, adding a comment in
  place, the modal dialog and Ctrl and Enter, is a quicker way to what can be
  done without it. An
  archived tournament has no commentary
  pages, nor one the website has never had, and a slug no commentary on the
  tournament has is not a page. An address the tournament has moved on from
  leads to the commentary where it is found now, so that a link kept from
  before still works.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"

  Rule: The page is the commentary's, for anybody

    Scenario: The page is headed by the tournament's name
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page is headed "Spring Open"

    Scenario: The commentary's title heads the content
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the content has the heading "Day one"

    Scenario: Markdown in the title is not drawn
      Given "writer@example.com" has started the commentary "**Day two**" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-two" is opened
      Then the content has the heading "**Day two**"

    Scenario: The commentary's writer is named
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the commentary is shown as written by "Wren Writer"

    Scenario: A reader not signed in is shown the comments
      Given nobody is signed in
      And "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment says "Sam is two hoops up"

    Scenario: Commentary is marked as the section being read
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the section "Commentary" is marked as current

  Rule: The comments are shown the first written first

    Scenario: The comments are shown in the order they were written
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment says "Sam is two hoops up"
      And the second comment says "Alex has pegged out"

    Scenario: A commentary with no comments says so
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the commentary page says there are no comments

  Rule: Each comment shows what it says, drawn from its Markdown, and when it was written

    Scenario: A word made bold in Markdown is drawn bold
      Given "writer@example.com" has added the comment "Sam is **two hoops** up" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment draws "two hoops" bold

    Scenario: A link in Markdown is drawn as a link
      Given "writer@example.com" has added the comment "See [the draw](https://example.com/draw)" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's link "the draw" leads to "https://example.com/draw"

    Scenario: A line beginning with a turn's number is not numbered again
      Given "writer@example.com" has added the comment "5. Sam roquets Alex\n7. Alex runs hoop 3" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment shows the line "7. Alex runs hoop 3"

    Scenario: Lines beginning with turns' numbers are drawn as no numbered list
      Given "writer@example.com" has added the comment "5. Sam roquets Alex\n7. Alex runs hoop 3" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment draws no numbered list

    Scenario: A line beginning with a number and a bracket is drawn as it was written
      Given "writer@example.com" has added the comment "3) Kim pegs out" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment shows the line "3) Kim pegs out"

    Scenario: A line beginning with a number in a block of code is drawn exactly as written
      Given "writer@example.com" has added the comment "```\n1. a\n```" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's code says "1. a"

    Scenario: A web address written out is drawn as a link
      Given "writer@example.com" has added the comment "Results at https://example.com/results" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's link "https://example.com/results" leads to "https://example.com/results"

    Scenario: A web address written out is a link the site does not vouch for
      Given "writer@example.com" has added the comment "Results at https://example.com/results" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's link "https://example.com/results" is marked as not vouched for

    Scenario: A name with no "https://" is not drawn as a link
      Given "writer@example.com" has added the comment "Results at example.com" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment has no link

    Scenario: An email address is drawn as a link to write to it
      Given "writer@example.com" has added the comment "Write to sam@example.com" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's link "sam@example.com" leads to "mailto:sam@example.com"

    Scenario: A link in a comment is one the site does not vouch for
      Given "writer@example.com" has added the comment "See [the draw](https://example.com/draw)" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment's link "the draw" is marked as not vouched for

    Scenario: A comment shows how long ago it was written
      Given the server's clock reads "2026-10-03T09:48:00Z"
      And "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the server's clock reads "2026-10-03T10:00:00Z"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment was written "12 min" ago

    Scenario: An edited comment says it has been edited
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has edited the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment says it has been edited

    Scenario: A comment never edited does not say it has been
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment does not say it has been edited

  Rule: Only the commentary's writer is offered a box to write the next comment

    Scenario: The writer is offered a box to write a comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page offers a box to write a comment

    Scenario: The box is four lines tall
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the comment box is 4 lines tall

    Scenario: The box comes after the last comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the comment box comes after the last comment

    Scenario: A reader signed in who is not the writer is offered no box
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page does not offer a box to write a comment

    Scenario: A reader not signed in is offered no box
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page does not offer a box to write a comment

  Rule: A comment written in the box is added, as the last comment

    Scenario: A comment written is added to the commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: A comment written is shown as the last comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "Alex has pegged out" is typed
      When the comment is submitted
      Then the second comment says "Alex has pegged out"

    Scenario: The box is empty once the comment is added
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the comment box is empty

    Scenario: The reader stays on the commentary's page
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the address is "/2026/ac/spring-open/commentaries/day-one"

    Scenario: A comment written in a commentary titled in another script is shown with it
      Given "writer@example.com" has started the commentary "День два" on "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/день-два" is open
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the first comment says "Sam is two hoops up"

    Scenario: A comment can be written with scripting off
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting off
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the first comment says "Sam is two hoops up"

  Rule: A comment that is refused is said beneath the box, and adds nothing

    Scenario: A missing comment is said beneath the box
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "   " is typed
      When the comment is submitted
      Then the comment box says the message for "CommentText.Missing"

    Scenario: The page shown again for a refused comment returns its choices to the commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "   " is typed
      When the comment is submitted
      Then the theme and the language chosen return to "/2026/ac/spring-open/commentaries/day-one"

    Scenario: What was typed is put back
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And a comment of 10001 characters is typed
      When the comment is submitted
      Then the comment box holds what was typed

    Scenario: A comment that is refused adds nothing
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the comment "   " is typed
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has no comments

  Rule: With scripting, a comment is added in place, without the page being drawn again

    Background:
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"

    Scenario: The comment is shown as the last comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Alex has pegged out" is typed
      When the comment is submitted
      Then the last comment says "Alex has pegged out"

    Scenario: The page is not drawn again
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the page as it is now is remembered
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the last comment says "Sam is two hoops up"
      And the page is the one remembered

    Scenario: The comment is added to the commentary
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: The box is empty once the comment is added
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the last comment says "Sam is two hoops up"
      And the comment box is empty

    Scenario: The first comment takes the place of saying there are none
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the last comment says "Sam is two hoops up"
      And the commentary page does not say there are no comments

    Scenario: A comment added in place is drawn from its Markdown
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is **two hoops** up" is typed
      When the comment is submitted
      Then the last comment draws "two hoops" bold

    Scenario: A comment added in place has a pencil and a trash can
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the last comment offers a way to edit it
      And the last comment offers a way to delete it

    Scenario: A comment added in place is deleted from its trash can, asking first
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      And the comment is submitted
      When the way to delete the last comment is pressed
      Then the modal dialog names "Sam is two hoops up"

    Scenario: A comment refused is said beneath the box in place
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the page as it is now is remembered
      And the comment "   " is typed
      When the comment is submitted
      Then the comment box says the message for "CommentText.Missing"
      And the page is the one remembered

    Scenario: What was typed is left in the box when it is refused in place
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And a comment of 10001 characters is typed
      When the comment is submitted
      Then the comment box says the message for "CommentText.TooLong"
      And the comment box holds what was typed

    Scenario: A comment kept but not answered is not sent again
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the next comment sent is kept and answered with a server error
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up" once

    Scenario: A comment kept but not answered is said beneath the box
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the next comment sent is kept and answered with a server error
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the comment box says the words for "commentary.notSent"

    Scenario: A writer signed out since the page was opened is sent to sign in
      Given the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the reader has signed out
      And the comment "Sam is two hoops up" is typed
      When the comment is submitted
      Then the sign in page is shown

  Rule: Once a comment is sent, the Add comment button is at the bottom of the window

    Background:
      Given a viewport 375 pixels wide
      And "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Chris is on the peg" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Pat has run hoop six" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Kim has a lift" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Lee has a contact" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Sam has pegged out" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex wins 26 to 17" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the page is scrolled to its top

    Scenario: Pressing Add comment brings the button to the bottom of the window
      Given the comment "Lee wins the next game" is typed
      When the comment is submitted
      Then the Add comment button is at the bottom of the window

    Scenario: Ctrl and Enter bring the button to the bottom of the window
      Given the comment "Lee wins the next game" is typed
      When Control and Enter are pressed in the comment box
      Then the Add comment button is at the bottom of the window

    Scenario: A comment refused brings the button to the bottom of the window too
      Given the comment "   " is typed
      When the comment is submitted
      Then the Add comment button is at the bottom of the window

  Rule: A reader is shown new comments without loading the page again

    Background:
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And nobody is signed in
      And the browser has scripting on
      And the browser's clock is held by the scenario
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the page as it is now is remembered

    Scenario: A comment written since the page was opened is shown within a quarter of a minute
      Given "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When a quarter of a minute passes
      Then the last comment says "Alex has pegged out"

    Scenario: The page is not loaded again to show it
      Given "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When a quarter of a minute passes
      Then the last comment says "Alex has pegged out"
      And the page is the one remembered

    Scenario: A comment written since is not shown before a quarter of a minute has passed
      Given "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When 10 seconds pass on the browser's clock
      Then the last comment says "Sam is two hoops up"

    Scenario: A comment edited since reads as it does now
      Given "writer@example.com" has edited the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      When a quarter of a minute passes
      Then the first comment says "Sam is three hoops up"

    Scenario: A comment deleted since is taken away
      Given "writer@example.com" has deleted the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      When a quarter of a minute passes
      Then the commentary page says there are no comments

    Scenario: The first comment written takes the place of saying there are none
      Given "writer@example.com" has started the commentary "Day two" on "Spring Open"
      And the page at "/2026/ac/spring-open/commentaries/day-two" is open
      And "writer@example.com" has added the comment "Kim has a lift" to "Day two" of "Spring Open"
      When a quarter of a minute passes
      Then the last comment says "Kim has a lift"

    Scenario: How long ago a comment was written is kept up to date
      Given the server's clock reads "2026-10-03T10:12:00Z"
      When a quarter of a minute passes
      Then the first comment was written "12 min" ago

    Scenario: A comment shown since offers a reader not signed in no way to edit it
      Given "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      When a quarter of a minute passes
      Then the last comment says "Alex has pegged out"
      And the last comment does not offer a way to edit it

  Rule: What has the focus in the comments keeps it while nothing has changed

    Background:
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the browser has scripting on
      And the browser's clock is held by the scenario
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open

    Scenario: The pencil keeps the focus when the comments are asked for again
      Given the way to edit the first comment is given the focus
      And the server's clock reads "2026-10-03T10:12:00Z"
      When a quarter of a minute passes
      Then the way to edit the first comment has the focus

  Rule: An answer about the comments as they were does not take away one added in place

    Scenario: A comment added in place is kept when an older answer comes after it
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the browser has scripting on
      And the browser's clock is held by the scenario
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the next answer about the comments is held back
      And "writer@example.com" has added the comment "Kim has a lift" to "Day one" of "Spring Open"
      And 15 seconds pass on the browser's clock
      And the comment "Alex has pegged out" is typed
      And the comment is submitted
      When the answer held back is let through
      Then the last comment says "Alex has pegged out"

  Rule: A comment already shown is not shown again when the answer to adding it comes

    Scenario: A comment shown by the comments asked for again is not added a second time
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the browser has scripting on
      And the browser's clock is held by the scenario
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      And the answer to the next comment sent is held back
      And the comment "Sam is two hoops up" is typed
      And the Add comment button is pressed
      And a quarter of a minute passes
      When the answer held back is let through
      Then the comment "Sam is two hoops up" is shown once

  Rule: Ctrl and Enter in the box send the comment

    Scenario: Ctrl and Enter send the comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When Control and Enter are pressed in the comment box
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: Command and Enter send the comment
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When Meta and Enter are pressed in the comment box
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: Enter alone starts a new line
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on
      And the comment "Sam is two hoops up" is typed
      When Enter is pressed in the comment box
      Then the commentary "Day one" of "Spring Open" has no comments

  Rule: Only the commentary's writer is offered a pencil to edit each comment

    Scenario: The writer is offered a way to edit each comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment offers a way to edit it
      And the second comment offers a way to edit it

    Scenario: The way to edit a comment is a pencil named Edit
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to edit the first comment is a pencil named "Edit"

    Scenario: The way to edit a comment leads to its own page
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open
      When the way to edit the first comment is pressed
      Then the page to edit the comment "Sam is two hoops up" is shown

    Scenario: A reader signed in who is not the writer is offered no way to edit
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment does not offer a way to edit it

    Scenario: A reader not signed in is offered no way to edit
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment does not offer a way to edit it

  Rule: Only the commentary's writer is offered a trash can beside the pencil to delete each comment

    Scenario: The writer is offered a way to delete each comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment offers a way to delete it
      And the second comment offers a way to delete it

    Scenario: The way to delete a comment is a trash can named Delete
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to delete the first comment is a trash can named "Delete"

    Scenario: The trash can comes after the pencil
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the way to delete the first comment comes after the way to edit it

    Scenario: A reader signed in who is not the writer is offered no way to delete
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment does not offer a way to delete it

    Scenario: A reader not signed in is offered no way to delete
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment does not offer a way to delete it

  Rule: The trash can asks first, in a modal dialog, and only Delete comment takes the comment away

    Background:
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting on

    Scenario: Pressing the trash can asks in a modal dialog
      When the way to delete the first comment is pressed
      Then the modal dialog titled "Delete comment" is open

    Scenario: The modal dialog shows the comment
      When the way to delete the first comment is pressed
      Then the modal dialog names "Sam is two hoops up"

    Scenario: The modal dialog offers Delete comment first
      When the way to delete the first comment is pressed
      Then the modal dialog's first button is "Delete comment"

    Scenario: The modal dialog offers Cancel
      When the way to delete the first comment is pressed
      Then the modal dialog's second button is "Cancel"

    Scenario: Pressing the trash can alone takes nothing away
      When the way to delete the first comment is pressed
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: Delete comment takes the comment away
      Given the way to delete the first comment is pressed
      When "Delete comment" is pressed in the modal dialog
      Then the commentary "Day one" of "Spring Open" does not have the comment "Sam is two hoops up"

    Scenario: The commentary is shown again without the deleted comment
      Given the way to delete the first comment is pressed
      When "Delete comment" is pressed in the modal dialog
      Then the commentary page says there are no comments

    Scenario: Cancel takes nothing away
      Given the way to delete the first comment is pressed
      When "Cancel" is pressed in the modal dialog
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: Cancel closes the modal dialog
      Given the way to delete the first comment is pressed
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: Escape closes the modal dialog
      Given the way to delete the first comment is pressed
      When Escape is pressed
      Then no modal dialog is open

  Rule: With scripting off, the trash can leads to a page that asks first

    Scenario: The trash can leads to the page that asks whether to delete the comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      And the page at "/2026/ac/spring-open/commentaries/day-one" is open with scripting off
      When the way to delete the first comment is pressed
      Then the page asks whether to delete the comment "Sam is two hoops up"

  Rule: Only a commentary a reader is sent to has a page

    Scenario: A slug no commentary has is not a page
      When the page at "/2026/ac/spring-open/commentaries/day-two" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's commentary is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A commentary whose writer has been forgotten is not found
      Given the account for "writer@example.com" has been forgotten
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to a commentary titled in another script where the tournament is now
      Given "writer@example.com" has started the commentary "День два" on "Spring Open"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/commentaries/день-два" is opened
      Then the content has the heading "День два"

    Scenario: An old address leads to the commentary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the address is "/2026/gc/spring-open/commentaries/day-one"
