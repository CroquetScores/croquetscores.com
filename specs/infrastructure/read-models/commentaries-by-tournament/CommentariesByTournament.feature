@postgres
Feature: Knowing when each of a tournament's commentaries last changed

  Every page of a tournament marks its Commentary section while the reader
  has a commentary there they have not read as it is now, and the
  commentaries page marks each such commentary (`commentaries.feature`).
  Whether there is one is told by when each commentary last changed, and a
  commentary's comments are kept in a stream of its own (`start.feature`),
  so no page can know it without replaying every commentary's comments. A
  read model keeps it instead: a table of commentaries by tournament, kept by
  a projection, holding each commentary's id, its tournament, its writer and
  when it last changed. It holds no comment.

  A commentary last changed when it was started, or when a comment was last
  added to it or edited in it, since what was there before is no longer all
  there is to read. A comment taken away changes nothing a reader has not
  already read, and is not counted.

  A commentary is started by its tournament (`startCommentary.feature`), and
  its comments are kept in its own stream, so the read model hears of it
  from both, in whichever order a rebuild takes the streams: a comment
  projected before the commentary's start still counts once the start is.

  A commentary whose writer's account has been forgotten is not listed
  anywhere a reader looks (`PublicCommentariesOfTournament.feature`), so it
  is not found here either, and is never news. The read model hears of the
  forgetting from the account's own stream, which may also come before the
  commentary's start in a rebuild.

  The read model is asked for a tournament's commentaries, and answers each
  by its id with when it last changed. A tournament with no commentaries is
  answered with none, and another tournament's are not among them.

  The projection is safe to run twice, as rebuilding the read model does.

  Background:
    Given the commentaries by tournament read model
    And the moment "2026-09-26T10:00:00Z"

  Rule: A tournament's commentaries are found, each with when it last changed

    Scenario: A commentary started is found
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" is found

    Scenario: A commentary never written in last changed when it was started
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T10:00:00Z"

    Scenario: A tournament with no commentaries has none found
      When the commentaries of "Spring Open" are looked for
      Then no commentaries are found

    Scenario: Another tournament's commentaries are not found
      Given the commentary "Day one" is started on the tournament "Autumn Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then no commentaries are found

  Rule: A comment added or edited changes when a commentary last changed, and one taken away does not

    Background:
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-26T11:00:00Z"
      And the comment "Sam is two hoops up" is added to "Day one"

    Scenario: A comment added changes when the commentary last changed
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T11:00:00Z"

    Scenario: A comment edited changes when the commentary last changed
      Given the moment "2026-09-26T12:00:00Z"
      And the comment "Sam is two hoops up" in "Day one" is edited to "Sam is three hoops up"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T12:00:00Z"

    Scenario: A comment taken away does not change when the commentary last changed
      Given the moment "2026-09-26T12:00:00Z"
      And the comment "Sam is two hoops up" in "Day one" is deleted
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T11:00:00Z"

  Rule: A commentary whose writer has been forgotten is not found

    Scenario: A forgotten writer's commentary is not found
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the account "account/123e4567-e89b-42d3-a456-426614174000" is forgotten
      When the commentaries of "Spring Open" are looked for
      Then no commentaries are found

    Scenario: Another writer's commentary is found beside a forgotten writer's
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the commentary "Day two" is started on the tournament "Spring Open" by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      And the account "account/123e4567-e89b-42d3-a456-426614174000" is forgotten
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day two" is found

  Rule: A rebuild finds every commentary as it is now, whichever stream comes first

    Scenario: A comment rebuilt before its commentary's start still counts
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-26T11:00:00Z"
      And the comment "Sam is two hoops up" is added to "Day one"
      And the commentaries' streams are to be rebuilt before the tournaments'
      When the read model is rebuilt from the events
      And the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T11:00:00Z"

    Scenario: A forgetting rebuilt before the commentary's start still counts
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the account "account/123e4567-e89b-42d3-a456-426614174000" is forgotten
      And the accounts' streams are to be rebuilt before the tournaments'
      When the read model is rebuilt from the events
      And the commentaries of "Spring Open" are looked for
      Then no commentaries are found

  Rule: Projecting the same events again changes nothing

    Scenario: A commentary's start projected twice is one commentary
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When every stream's events are projected again
      And the commentaries of "Spring Open" are looked for
      Then 1 commentary is found
