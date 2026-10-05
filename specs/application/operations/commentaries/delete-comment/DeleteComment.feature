@postgres
Feature: Deleting a comment from a commentary

  The writer of a commentary can delete any of its comments, and nobody else
  can: anybody else, a manager of the tournament among them, is refused with
  `Commentary.NotTheWriter` (`deleteComment.feature`). The comment is named
  by its tournament's id, its commentary's and its own. A tournament there is
  not, or a commentary the tournament does not have, is refused as
  `DeleteComment.NoSuchCommentary`; a comment the commentary does not have,
  or has deleted already, is the commentary's to refuse, as
  `Commentary.NoSuchComment`.

  An archived tournament can only be restored (`restore.feature`), so a
  comment on one cannot be deleted either, and is refused with
  `Tournament.Archived`, as adding and editing one are (`AddComment.feature`,
  `EditComment.feature`).

  A forgotten account deletes nothing, and is refused with
  `Account.Forgotten`.

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

  Rule: A comment deleted is gone

    Scenario: The comment is no longer one of the commentary's comments
      When the reader signed in to the account for "writer@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" does not have the comment "Sam is two hoops up"

    Scenario: Deleting the comment is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then the last thing the commentary "Day one" of "Spring Open" recorded was caused by the account for "writer@example.com"

  Rule: Only the commentary's writer can delete its comments

    Scenario: A reader who did not start the commentary is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A manager of the tournament who did not start the commentary is refused
      When the reader signed in to the account for "organiser@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A comment somebody other than the writer tried to delete is still there
      When the reader signed in to the account for "organiser@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then the commentary "Day one" of "Spring Open" has the comment "Sam is two hoops up"

  Rule: A comment on an archived tournament cannot be deleted

    Scenario: Deleting a comment on an archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a comment there is can be deleted

    Scenario: Deleting a comment the commentary does not have is refused
      When the reader signed in to the account for "writer@example.com" deletes a comment in "Day one" of "Spring Open" there is not
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Deleting a comment already deleted is refused
      Given "writer@example.com" has deleted the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      When the reader signed in to the account for "writer@example.com" deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Deleting a comment in a commentary the tournament does not have is refused
      When the reader signed in to the account for "writer@example.com" deletes a comment in a commentary of "Spring Open" there is not
      Then it is refused with "DeleteComment.NoSuchCommentary"

    Scenario: Deleting a comment in a commentary of a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" deletes a comment in a commentary of a tournament there is not
      Then it is refused with "DeleteComment.NoSuchCommentary"

  Rule: A forgotten account deletes nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account deletes the comment "Sam is two hoops up" in "Day one" of "Spring Open"
      Then it is refused with "Account.Forgotten"
