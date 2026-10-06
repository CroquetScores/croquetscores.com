Feature: Starting a commentary

  A commentary is one writer's account of a tournament as it is played: a
  title, and comments under it. It is kept by itself, under its own id,
  rather than as a part of its tournament: a tournament is read on every one
  of its pages, and none of them needs its commentaries' starts or comments
  but through the read model of a tournament's commentaries
  (`CommentariesByTournament.feature`), as a manager's notes are kept
  (`add.feature`). The commentary's id is given it by whatever starts it, and
  names its stream. Starting it is its first event, and says which
  tournament it is on, its title (`CommentaryTitle.feature`), its slug, and
  its writer.

  A commentary is one writer's account of the play, under their name, so the
  account that starts it is its writer and the only account that may write
  in it: change its title, add a comment, edit one or delete one
  (`changeTitle.feature`, `addComment.feature`, `editComment.feature`,
  `deleteComment.feature`). Who may start one is the tournament's to say
  (`writeCommentary.feature`): any account, but not on an archived
  tournament.

  No two commentaries on a tournament have the same title, since a reader
  choosing one from the list could not tell them apart; a title is the same
  however it is capitalised. A commentary is found within its tournament by
  a slug made from its title, as "2026/ac/spring-open/commentaries/day-one".
  Two titles that are not the same can still make the same slug, as "Böck"
  and "Bock" do, and a slug another commentary on the tournament has is
  followed by "-01", then "-02", up to "-99", as a competition's is
  (`addBlock.feature`), and should all of them be taken, by the commentary
  id's own characters. The page where a commentary is started is found at
  "commentaries/create" (`startCommentary.feature` on the web), so "create"
  is taken as if a commentary had it. The commentary is told which titles
  and which slugs the tournament's other commentaries have by whatever
  starts it, which has them from the read model of a tournament's
  commentaries.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Starting a commentary is recorded, and the commentary is as it was started

    Scenario: Starting a commentary records it
      When the commentary "Day one" is started
      Then it has recorded 1 event
      And the first thing it recorded is a commentary being started

    Scenario: A commentary is known by the id it was started with
      Given the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      When the commentary "Day one" is started
      Then the commentary is known by "commentary/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary is on the tournament it was started on
      Given the commentary is to be started on the tournament "tournament/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the commentary "Day one" is started
      Then the commentary is on the tournament "tournament/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"

    Scenario: A commentary has the title it was started with
      When the commentary "Day one" is started
      Then the commentary is called "Day one"

    Scenario: A commentary's writer is whoever started it
      Given it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary "Day one" is started
      Then the commentary's writer is "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A new commentary has no comments
      When the commentary "Day one" is started
      Then the commentary has no comments

    Scenario: A commentary rebuilt from its stream is as it was started
      Given a stream where a commentary was started by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary is rebuilt from its stream
      Then the commentary's writer is "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

  Rule: What a commentary title must be is refused as it is for a title

    Scenario: A title that could not be a commentary's is refused as a commentary title is
      When the commentary "" is started
      Then it is refused for breaking "CommentaryTitle.Missing"

  Rule: No two commentaries on a tournament have the same title

    Scenario: A title another commentary on the tournament has is refused
      Given the tournament's other commentaries are called "Day one"
      When the commentary "Day one" is started
      Then it is refused with "Commentary.TitleTaken"

    Scenario: A title is the same title however it is capitalised
      Given the tournament's other commentaries are called "Day one"
      When the commentary "DAY ONE" is started
      Then it is refused with "Commentary.TitleTaken"

  Rule: A commentary is found by a slug of its title that no other commentary on the tournament has

    Scenario: A commentary's slug is made from its title
      When the commentary "Day one" is started
      Then the commentary is found at "day-one"

    Scenario: A slug another commentary has is followed by "-01"
      Given the tournament's other commentaries are found at "bock-cup"
      When the commentary "Böck Cup" is started
      Then the commentary is found at "bock-cup-01"

    Scenario: The next slug nobody has is the new commentary's
      Given the tournament's other commentaries are found at "bock-cup" and "bock-cup-01"
      When the commentary "Böck Cup" is started
      Then the commentary is found at "bock-cup-02"

    Scenario: With every numbered slug taken the slug is followed by the commentary's id
      Given the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      And the tournament's other commentaries are found at every slug from "day-one" to "day-one-99"
      When the commentary "Day one" is started
      Then the commentary is found at "day-one-123e4567-e89b-42d3-a456-426614174000"

    Scenario: The slug "create" is taken by the page that starts a commentary
      When the commentary "Create" is started
      Then the commentary is found at "create-01"
