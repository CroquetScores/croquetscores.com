Feature: Starting a commentary on a tournament

  A commentary is one writer's account of a tournament as it is played: a
  title, and comments under it. A commentary is started with an id of its
  own, given by whatever starts it, and a title (`CommentaryTitle.feature`).
  Its comments are kept by the commentary itself, apart from the tournament
  (`start.feature`), and the tournament holds what it needs to list its
  commentaries and to find each one: its id, its title, its slug, and who
  started it, who is its writer.

  Starting a commentary is not a change to the tournament in the sense that
  only its managers may make one (`onlyManagers.feature`). Commentary is for
  anybody with an account to write, so any account can start one, whether or
  not the tournament has heard of it. Once started, only its writer writes in
  it (`addComment.feature`).

  No two commentaries on a tournament have the same id, since the id is how
  its comments say which commentary they are in. No two have the same title,
  since a reader choosing one from the list could not tell them apart; a
  title is the same however it is capitalised.

  A commentary is found within its tournament by a slug made from its title,
  as "2026/ac/spring-open/commentaries/day-one". Two titles that are not the
  same can still make the same slug, as "Böck" and "Bock" do, and a slug
  another commentary has is followed by "-01", then "-02", up to "-99", as a
  competition's is (`addBlock.feature`). Should all of them be taken, the slug
  is followed by the commentary id's own characters. A commentary's slug is
  its own among commentaries, and is not a competition's or a team's to take.
  The page where a commentary is started is found at "commentaries/create"
  (`startCommentary.feature` on the web), so "create" is taken as if a
  commentary had it, and a commentary called "Create" is found at
  "create-01" rather than where nobody could reach it.

  An archived tournament can only be restored (`restore.feature`), so
  starting a commentary on one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Starting a commentary is recorded, and the commentary is the tournament's

    Scenario: Starting a commentary records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then it has recorded 1 event
      And the first thing it recorded is a commentary being started

    Scenario: A commentary started is one of the tournament's commentaries
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then the tournament has the commentary "Day one"

    Scenario: A commentary started is known by the id it was started with
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      When the commentary "Day one" is started
      Then the tournament's commentary "Day one" is known by "commentary/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary started was started by whoever asked
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary "Day one" is started
      Then the tournament's commentary "Day one" was started by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A tournament rebuilt after a commentary was started has the commentary
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Day one" was started on it
      When the tournament is rebuilt from the stream
      Then the tournament has the commentary "Day one"

  Rule: Any account can start a commentary

    Scenario: An account the tournament does not know can start a commentary
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary "Day one" is started
      Then the tournament has the commentary "Day one"

    Scenario: A scorer of the tournament can start a commentary
      Given a stream where a tournament was created as "Spring Open"
      And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When the commentary "Day one" is started
      Then the tournament has the commentary "Day one"

  Rule: What a commentary title must be is refused as it is for a title

    Scenario: A title that could not be a commentary's is refused as a commentary title is
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "" is started
      Then it is refused for breaking "CommentaryTitle.Missing"

  Rule: No two commentaries on a tournament have the same id

    Scenario: A commentary with an id another commentary has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Day one" was started on it as "commentary/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      When the commentary "Day two" is started
      Then it is refused with "Tournament.CommentaryAlreadyStarted"

  Rule: No two commentaries on a tournament have the same title

    Scenario: A commentary with a title another commentary has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Day one" was started on it
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: A title is the same title once its HTML is taken out
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Day one" was started on it
      And the tournament is rebuilt from the stream
      When the commentary "Day <i>one</i>" is started
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: A title is the same title however it is capitalised
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Day one" was started on it
      And the tournament is rebuilt from the stream
      When the commentary "DAY ONE" is started
      Then it is refused with "Tournament.CommentaryTitleTaken"

  Rule: A commentary is found by a slug of its title that no other commentary on the tournament has

    Scenario: A commentary's slug is made from its title
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then the tournament's commentary "Day one" has the slug "day-one"

    Scenario: A commentary's slug is made from its title with the HTML taken out
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "Day <b>one</b>" is started
      Then the tournament's commentary "Day one" has the slug "day-one"

    Scenario: A slug another commentary has is followed by "-01"
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Böck Cup" was started on it
      And the tournament is rebuilt from the stream
      When the commentary "Bock Cup" is started
      Then the tournament's commentary "Bock Cup" has the slug "bock-cup-01"

    Scenario: The next slug nobody has is the new commentary's
      Given a stream where a tournament was created as "Spring Open"
      And the commentary "Böck Cup" was started on it
      And the commentary "Bock Cup" was started on it
      And the tournament is rebuilt from the stream
      When the commentary "Bóck Cup" is started
      Then the tournament's commentary "Bóck Cup" has the slug "bock-cup-02"

    Scenario: With every numbered slug taken the slug is followed by the commentary's id
      Given a stream where a tournament was created as "Spring Open"
      And a commentary was started on it with every slug from "bock-cup" to "bock-cup-99"
      And the tournament is rebuilt from the stream
      And the commentary id "commentary/123e4567-e89b-42d3-a456-426614174000"
      When the commentary "Bock Cup" is started
      Then the tournament's commentary "Bock Cup" has the slug "bock-cup-123e4567-e89b-42d3-a456-426614174000"

    Scenario: The slug "create" is taken by the page that starts a commentary
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the commentary "Create" is started
      Then the tournament's commentary "Create" has the slug "create-01"

    Scenario: A commentary's slug is not a competition's to take
      Given a stream where a tournament was created as "Spring Open"
      And the block "Day one" was added to it
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then the tournament's commentary "Day one" has the slug "day-one"

  Rule: A commentary cannot be started on an archived tournament

    Scenario: Starting a commentary on an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the commentary "Day one" is started
      Then it is refused with "Tournament.Archived"
