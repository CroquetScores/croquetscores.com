Feature: Deleting a comment from a commentary

  A commentary's writer can delete any of its comments: one posted twice, one
  posted in the wrong commentary, one they would rather not have said. The
  comment is named by its id.

  Only the commentary's writer can delete its comments, as only they can add
  and edit them (`addComment.feature`, `editComment.feature`). Anybody else
  who asks is refused, a manager of the tournament among them.

  A deleted comment is gone from the commentary: it is not one of its
  comments, and is not shown, edited or deleted again. Unlike an archived
  game, it cannot be restored, since nothing depends on it and a writer who
  wants it back can write it again. Its deletion is recorded, as everything
  that happens is, and its id stays taken, so that nothing later is ever
  mistaken for it. The comments either side of it keep their places.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a commentary was started by "account/123e4567-e89b-42d3-a456-426614174000"
    And the comment "Sam is two hoops up" was added to it

  Rule: Deleting a comment is recorded, and the comment is gone

    Scenario: Deleting a comment records it
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is deleted
      Then it has recorded 1 event
      And the first thing it recorded is a comment being deleted

    Scenario: A deleted comment is not one of the commentary's comments
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is deleted
      Then the commentary does not have the comment "Sam is two hoops up"

    Scenario: A commentary rebuilt after a comment was deleted does not have it
      Given the comment "Sam is two hoops up" was deleted
      When the commentary is rebuilt from its stream
      Then the commentary has no comments

    Scenario: The comments either side of a deleted one keep their places
      Given the comment "Alex has pegged out" was added to it
      And the comment "Chris is on the peg" was added to it
      And the commentary is rebuilt from its stream
      When the comment "Alex has pegged out" is deleted
      Then the commentary's first comment is "Sam is two hoops up"
      And the commentary's second comment is "Chris is on the peg"

  Rule: Only the commentary's writer can delete its comments

    Scenario: Another account deleting a comment is refused
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is deleted
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A comment another account tried to delete is still there
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is deleted
      Then the commentary has the comment "Sam is two hoops up"

  Rule: Only a comment the commentary has can be deleted

    Scenario: Deleting a comment the commentary never had is refused
      Given the commentary is rebuilt from its stream
      When the comment known by "comment/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is deleted
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Deleting a comment already deleted is refused
      Given the comment "Sam is two hoops up" was deleted
      And the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is deleted
      Then it is refused with "Commentary.NoSuchComment"
