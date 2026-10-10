@postgres
Feature: Adding a comment to a commentary

  The writer of a commentary, the account that started it, can add a comment
  to it, and nobody else can: anybody else, a manager of the tournament
  among them, is refused with `Commentary.NotTheWriter`
  (`addComment.feature`). The commentary is named by its tournament's id and
  its own; a tournament there is not, or a commentary the tournament does not
  have, is refused as `AddComment.NoSuchCommentary`. The comment is given a
  new id, and the answer is that id.

  What the comment says is asked its own rules on the way in, and kept as it
  was typed, HTML and all (`CommentText.feature`); a request that breaks one
  is refused with `Request.Invalid` and the first rule it breaks.

  A commentary does not know whether its tournament is archived, so that is
  asked of the tournament here: an archived tournament can only be restored
  (`restore.feature`), and a comment on one is refused with
  `Tournament.Archived`, as starting a commentary on one is.

  A forgotten account writes nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"

  Rule: A sound comment is added and kept

    Scenario: The comment is one of the commentary's comments
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

    Scenario: The answer is the comment's id
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      Then it is answered with the id of the comment "Sam is two hoops up" in "Day one" of "Spring Open"

    Scenario: The comment is kept as it was typed, HTML and all
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is <b>two hoops</b> up" to "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is <b>two hoops</b> up"

    Scenario: Adding the comment is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      Then the last thing the commentary "Day one" of "Spring Open" recorded was caused by the account for "writer@example.com"

  Rule: Only the commentary's writer can add a comment

    Scenario: A reader who did not start the commentary is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the comment "Alex has pegged out" to "Day one" of "Spring Open"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A manager of the tournament who did not start the commentary is refused
      When the reader signed in to the account for "organiser@example.com" adds the comment "Alex has pegged out" to "Day one" of "Spring Open"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A comment from somebody other than the writer is not added
      When the reader signed in to the account for "organiser@example.com" adds the comment "Alex has pegged out" to "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" has no comments

  Rule: What the comment says must break none of its own rules

    Scenario: A comment that is nothing but spaces is refused for being missing
      When the reader signed in to the account for "writer@example.com" adds the comment "   " to "Day one" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentText.Missing"

    Scenario: A comment longer than 100,000 characters is refused for it
      When the reader signed in to the account for "writer@example.com" adds a comment of 100001 characters to "Day one" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentText.TooLong"

    Scenario: A comment that breaks a rule is not added
      When the reader signed in to the account for "writer@example.com" adds the comment "" to "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" has no comments

  Rule: A comment on an archived tournament is refused

    Scenario: Adding a comment to a commentary on an archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a commentary there is can have a comment added

    Scenario: Adding a comment to a commentary the tournament does not have is refused
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to a commentary of "Spring Open" there is not
      Then it is refused with "AddComment.NoSuchCommentary"

    Scenario: Adding a comment to another tournament's commentary is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "writer@example.com" has started the commentary "Day two" on "Autumn Open"
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to "Day two" of "Autumn Open" as a commentary of "Spring Open"
      Then it is refused with "AddComment.NoSuchCommentary"

    Scenario: Adding a comment to a commentary of a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" adds the comment "Sam is two hoops up" to a commentary of a tournament there is not
      Then it is refused with "AddComment.NoSuchCommentary"

  Rule: A forgotten account writes nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account adds the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      Then it is refused with "Account.Forgotten"
