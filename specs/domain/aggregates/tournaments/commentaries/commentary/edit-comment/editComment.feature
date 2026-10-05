Feature: Editing a comment in a commentary

  A commentary's writer can go back to any of its comments and change what
  it says: a score put down wrong, a name misspelt, a line written in haste.
  The comment is named by its id, and is given what it is to say now, which
  is asked what any comment is asked (`CommentText.feature`).

  Only the commentary's writer can edit its comments, as only they can add
  them (`addComment.feature`). Anybody else who asks is refused, a manager of
  the tournament among them: the comments are the writer's words under the
  writer's name, and anybody else changing them would put words in their
  mouth.

  An edited comment keeps its place and when it was written, so the
  commentary still reads in the order it was written, and it says that it
  has been edited and when it last was, so that a reader who saw it before is
  not left to wonder why it reads differently now.

  A deleted comment is gone from the commentary (`deleteComment.feature`),
  and is not one there is to edit. Editing a comment to say what it says
  already records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a commentary was started by "account/123e4567-e89b-42d3-a456-426614174000"
    And the comment "Sam is two hoops up" was added to it

  Rule: Editing a comment is recorded, and the comment says what it was edited to

    Scenario: Editing a comment records it
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then it has recorded 1 event
      And the first thing it recorded is a comment being edited

    Scenario: An edited comment says what it was edited to
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary has the comment "Sam is three hoops up"

    Scenario: An edited comment no longer says what it did
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary does not have the comment "Sam is two hoops up"

    Scenario: A commentary rebuilt after a comment was edited has the comment as edited
      Given the comment "Sam is two hoops up" was edited to "Sam is three hoops up"
      When the commentary is rebuilt from its stream
      Then the commentary has the comment "Sam is three hoops up"

  Rule: An edited comment keeps its place and when it was written

    Scenario: An edited comment keeps its place
      Given the comment "Alex has pegged out" was added to it
      And the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary's first comment is "Sam is three hoops up"
      And the commentary's second comment is "Alex has pegged out"

    Scenario: An edited comment keeps when it was written
      Given the commentary is rebuilt from its stream
      And the moment "2026-09-26T11:30:00Z"
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary's comment "Sam is three hoops up" was written at "2026-09-26T10:00:00Z"

  Rule: An edited comment says that it has been edited, and when it last was

    Scenario: An edited comment says it has been edited
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary's comment "Sam is three hoops up" has been edited

    Scenario: An edited comment says when it was edited
      Given the commentary is rebuilt from its stream
      And the moment "2026-09-26T11:30:00Z"
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary's comment "Sam is three hoops up" was last edited at "2026-09-26T11:30:00Z"

    Scenario: A comment edited twice says when it was last edited
      Given the moment "2026-09-26T11:30:00Z"
      And the comment "Sam is two hoops up" was edited to "Sam is three hoops up"
      And the commentary is rebuilt from its stream
      And the moment "2026-09-26T12:15:00Z"
      When the comment "Sam is three hoops up" is edited to "Sam is four hoops up"
      Then the commentary's comment "Sam is four hoops up" was last edited at "2026-09-26T12:15:00Z"

  Rule: Only the commentary's writer can edit its comments

    Scenario: Another account editing a comment is refused
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A comment another account tried to edit is unchanged
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then the commentary has the comment "Sam is two hoops up"

  Rule: What a comment must be is refused as it is for a comment

    Scenario: An edit that could not be a comment is refused as a comment is
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "   "
      Then it is refused for breaking "CommentText.Missing"

    Scenario: An edit has its HTML taken out
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is <i>three</i> hoops up"
      Then the commentary has the comment "Sam is three hoops up"

  Rule: Only a comment the commentary has can be edited

    Scenario: Editing a comment the commentary never had is refused
      Given the commentary is rebuilt from its stream
      When the comment known by "comment/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is edited to "Sam is three hoops up"
      Then it is refused with "Commentary.NoSuchComment"

    Scenario: Editing a deleted comment is refused
      Given the comment "Sam is two hoops up" was deleted
      And the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is three hoops up"
      Then it is refused with "Commentary.NoSuchComment"

  Rule: Editing a comment to say what it says already records nothing

    Scenario: An edit that changes nothing records nothing
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "Sam is two hoops up"
      Then it has recorded 0 events

    Scenario: An edit that is the same once its HTML is taken out records nothing
      Given the commentary is rebuilt from its stream
      When the comment "Sam is two hoops up" is edited to "<p>Sam is two hoops up</p>"
      Then it has recorded 0 events
