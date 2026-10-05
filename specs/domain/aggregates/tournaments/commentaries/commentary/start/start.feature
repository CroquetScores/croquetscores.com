Feature: Starting a commentary's own record

  A commentary is started on a tournament (`startCommentary.feature`), and
  the tournament holds what it needs to list it: its id, its title and its
  slug. The comments are kept by the commentary itself, apart from the
  tournament, as a competition's games are, since a busy commentary would
  otherwise make the tournament longer to read every time it is changed.

  A commentary is one writer's account of the play, under their name, so the
  account that starts it is its writer and the only account that may write
  in it: add a comment, edit one or delete one (`addComment.feature`,
  `editComment.feature`, `deleteComment.feature`). The commentary keeps who
  that is from the start, so that it can say who may write in it without
  asking the tournament.

  The commentary's id is given it by whatever starts it, the same id the
  tournament knows it by, and names its stream. Starting it is its first
  event. A new commentary has no comments.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Starting a commentary is recorded, and its writer is whoever started it

    Scenario: Starting a commentary records it
      When a commentary is started
      Then it has recorded 1 event
      And the first thing it recorded is a commentary being started

    Scenario: A commentary is known by the id it was started with
      Given the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      When a commentary is started
      Then the commentary is known by "commentary/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary's writer is whoever started it
      Given it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When a commentary is started
      Then the commentary's writer is "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A new commentary has no comments
      When a commentary is started
      Then the commentary has no comments

    Scenario: A commentary rebuilt from its stream has its writer
      Given a stream where a commentary was started by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary is rebuilt from its stream
      Then the commentary's writer is "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
