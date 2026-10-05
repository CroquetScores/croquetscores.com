Feature: Adding a comment to a commentary

  A commentary is its writer's account of the play (`start.feature`), and
  its writer adds to it a comment at a time. A comment is added with an id of
  its own, given by whatever adds it, and what it says
  (`CommentText.feature`). The moment it was asked for is when it was
  written, which is what a reader is shown beside it.

  Only the commentary's writer can add a comment to it. Anybody else who
  asks is refused, a manager of the tournament as much as somebody the
  tournament has never heard of: a commentary is one writer's words under one
  writer's name, and a reader with something to say starts a commentary of
  their own.

  The commentary keeps its comments in the order they were written, the
  first written first, so that it reads from the start as the play did.

  No two comments in a commentary have the same id, since the id is how an
  edit or a deletion says which comment it means.

  A commentary does not know whether its tournament is archived. What may be
  written on an archived tournament is asked of the tournament where the
  comment is asked for (`AddComment.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a commentary was started by "account/123e4567-e89b-42d3-a456-426614174000"

  Rule: Adding a comment is recorded, and the comment is the commentary's

    Scenario: Adding a comment records it
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is added
      Then it has recorded 1 event
      And the first thing it recorded is a comment being added

    Scenario: A comment added is one of the commentary's comments
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is added
      Then the commentary has the comment "Sam is two hoops up"

    Scenario: A comment added is known by the id it was added with
      Given the commentary is rebuilt from its stream
      And the comment id "comment/123e4567-e89b-42d3-a456-426614174000"
      When the comment "Sam is two hoops up" is added
      Then the commentary's comment "Sam is two hoops up" is known by "comment/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A comment added was written at the moment it was asked for
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is added
      Then the commentary's comment "Sam is two hoops up" was written at "2026-09-26T10:00:00Z"

    Scenario: A comment added has not been edited
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is added
      Then the commentary's comment "Sam is two hoops up" has not been edited

    Scenario: A commentary rebuilt after a comment was added has the comment
      Given the comment "Sam is two hoops up" was added to it
      When the commentary is rebuilt from its stream
      Then the commentary has the comment "Sam is two hoops up"

  Rule: Only the commentary's writer can add a comment

    Scenario: Another account adding a comment is refused
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is added
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A comment another account tried to add is not added
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is added
      Then the commentary has no comments

  Rule: Comments are kept in the order they were written

    Scenario: The first comment written is the first comment
      Given the comment "Sam is two hoops up" was added to it
      And the comment "Alex has pegged out" was added to it
      When the commentary is rebuilt from its stream
      Then the commentary's first comment is "Sam is two hoops up"
      And the commentary's second comment is "Alex has pegged out"

  Rule: What a comment must be is refused as it is for a comment

    Scenario: A comment that could not be one is refused as a comment is
      Given the commentary is rebuilt from its stream
      When the comment "<p></p>" is added
      Then it is refused for breaking "CommentText.Missing"

    Scenario: A comment added has its HTML taken out
      Given the commentary is rebuilt from its stream
      When the comment "Sam is <b>two hoops</b> up" is added
      Then the commentary has the comment "Sam is two hoops up"

  Rule: No two comments in a commentary have the same id

    Scenario: A comment with an id another comment has is refused
      Given the comment "Sam is two hoops up" was added to it as "comment/123e4567-e89b-42d3-a456-426614174000"
      And the commentary is rebuilt from its stream
      And the comment id "comment/123e4567-e89b-42d3-a456-426614174000"
      When the comment "Alex has pegged out" is added
      Then it is refused with "Commentary.CommentAlreadyAdded"

    Scenario: A comment with an id a deleted comment had is refused
      Given the comment "Sam is two hoops up" was added to it as "comment/123e4567-e89b-42d3-a456-426614174000"
      And the comment "Sam is two hoops up" was deleted
      And the commentary is rebuilt from its stream
      And the comment id "comment/123e4567-e89b-42d3-a456-426614174000"
      When the comment "Alex has pegged out" is added
      Then it is refused with "Commentary.CommentAlreadyAdded"
