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
  says so. A link in a comment is marked as one the site does not vouch for,
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
  refused is said beneath the box, and what was typed is put back.

  The writer is offered too, beside each comment, a way to edit it, which
  leads to the comment's own page (`editComment.feature`), so that the writer
  can scroll back through the commentary and correct any comment in it.
  Anybody else, signed in or not, is offered neither the box nor a way to
  edit: they read.

  The page needs no scripting. An archived tournament has no commentary
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

  Rule: Only the commentary's writer is offered a way to edit each comment

    Scenario: The writer is offered a way to edit each comment
      Given "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      And "writer@example.com" has added the comment "Alex has pegged out" to "Day one" of "Spring Open"
      And the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the first comment offers a way to edit it
      And the second comment offers a way to edit it

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

  Rule: Only a commentary a reader is sent to has a page

    Scenario: A slug no commentary has is not a page
      When the page at "/2026/ac/spring-open/commentaries/day-two" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's commentary is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A commentary whose writer has been forgotten is not found
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the commentary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/commentaries/day-one" is opened
      Then the address is "/2026/gc/spring-open/commentaries/day-one"
