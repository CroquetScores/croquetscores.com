@postgres
Feature: Editing a comment in a commentary

  The writer of a commentary can edit any of its comments, and nobody else
  can: anybody else, a manager of the tournament among them, is refused with
  `Commentary.NotTheWriter` (`editComment.feature`). The comment is named by
  its tournament's id, its commentary's and its own. A tournament there is
  not, or a commentary the tournament does not have, is refused as
  `EditComment.NoSuchCommentary`; a comment the commentary does not have, or
  has deleted, is the commentary's to refuse, as `Commentary.NoSuchComment`.

  What the comment is to say now is asked its own rules on the way in, and
  kept as it was typed, HTML and all (`CommentText.feature`); a request that
  breaks one is refused with `Request.Invalid` and the first rule it breaks.

  An archived tournament can only be restored (`restore.feature`), so a
  comment on one cannot be edited either, and is refused with
  `Tournament.Archived`, as adding one is (`AddComment.feature`).

  A forgotten account edits nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"
    And "writer@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"

  Rule: A sound edit is kept

    Scenario: The comment says what it was edited to
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is three hoops up"

    Scenario: The comment no longer says what it did
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then the commentary "Day one" of "Spring Open" does not have the comment "Sam is two hoops up"

    Scenario: The edit is kept as it was typed, HTML and all
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is <i>three</i> hoops up"
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is <i>three</i> hoops up"

    Scenario: Editing the comment is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then the last thing the commentary "Day one" of "Spring Open" recorded was caused by the account for "writer@example.com"

  Rule: Only the commentary's writer can edit its comments

    Scenario: A reader who did not start the commentary is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A manager of the tournament who did not start the commentary is refused
      When the reader signed in to the account for "organiser@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then it is refused with "Commentary.NotTheWriter"

  Rule: What the comment is to say must break none of its own rules

    Scenario: An edit that is nothing but spaces is refused for being missing
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "   "
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentText.Missing"

    Scenario: An edit that breaks a rule changes nothing
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to ""
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

  Rule: A comment on an archived tournament cannot be edited

    Scenario: Editing a comment on an archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then it is refused with "Tournament.Archived"

  Rule: Only a comment there is can be edited

    Scenario: Editing a comment the commentary does not have is refused
      When the reader signed in to the account for "writer@example.com" edits a comment in "Day one" of "Spring Open" there is not to "Sam is three hoops up"
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Editing a deleted comment is refused
      Given "writer@example.com" has deleted the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      When the reader signed in to the account for "writer@example.com" edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Editing a comment in a commentary the tournament does not have is refused
      When the reader signed in to the account for "writer@example.com" edits a comment in a commentary of "Spring Open" there is not to "Sam is three hoops up"
      Then it is refused with "EditComment.NoSuchCommentary"

    Scenario: Editing a comment in a commentary of a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" edits a comment in a commentary of a tournament there is not to "Sam is three hoops up"
      Then it is refused with "EditComment.NoSuchCommentary"

  Rule: A forgotten account edits nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account edits the comment "Sam is two hoops up" in "Day one" of "Spring Open" to "Sam is three hoops up"
      Then it is refused with "Account.Forgotten"
