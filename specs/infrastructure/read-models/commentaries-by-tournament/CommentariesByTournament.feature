@postgres
Feature: Finding a tournament's commentaries without reading them

  A commentary is kept in a stream of its own (`start.feature`), its start
  and its comments alike, so nothing that lists a tournament's commentaries
  can do it without replaying every commentary's stream. A read model keeps
  what is needed instead: a table of commentaries by tournament, kept by a
  projection, holding each commentary's id, its tournament, its title, its
  slug, its writer, when it was started and when it last changed. It holds
  no comment. It is asked for:

  - a tournament's commentaries, for its commentaries page, the most
    recently started first, each with its title, slug and writer;
  - when each last changed, for every page of the tournament to mark its
    Commentary section by (`commentaries.feature`);
  - which commentary is found at a slug, for a commentary's page;
  - which titles and slugs the tournament's commentaries have taken, for
    starting one or changing its title (`start.feature`).

  A commentary last changed when it was started, or when a comment was last
  added to it or edited in it, since what was there before is no longer all
  there is to read. A comment taken away changes nothing a reader has not
  already read, and is not counted, and nor is a title changed.

  A commentary whose writer's account has been forgotten is not listed
  anywhere a reader looks, so it is not found among a tournament's
  commentaries and is never news. Its title and slug stay taken, so that a
  link kept to it never leads to somebody else's words
  (`StartCommentary.feature`). The read model hears of the forgetting from
  the account's own stream, which a rebuild may take before the
  commentary's.

  A tournament with no commentaries is answered with none, and another
  tournament's are not among them. The projection is safe to run twice, as
  rebuilding the read model does.

  A rebuild takes the streams in no order but each stream's own, since the
  store keeps no order between them. A title can pass from one commentary to
  another, given up by the first and taken by the second, and no two hold it
  at once; so a rebuild sets each commentary as its whole stream leaves it,
  rather than as each event comes, which could give the title to the second
  while the first still held it.

  Background:
    Given the commentaries by tournament read model
    And the moment "2026-09-26T10:00:00Z"

  Rule: A tournament's commentaries are found, the most recently started first

    Scenario: A commentary started is found
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" is found

    Scenario: The commentaries are found the most recently started first
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-27T10:00:00Z"
      And the commentary "Day two" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then the first commentary found is "Day two"
      And the second commentary found is "Day one"

    Scenario: A tournament with no commentaries has none found
      When the commentaries of "Spring Open" are looked for
      Then no commentaries are found

    Scenario: Another tournament's commentaries are not found
      Given the commentary "Day one" is started on the tournament "Autumn Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentaries of "Spring Open" are looked for
      Then no commentaries are found

  Rule: A commentary is found with its slug, its writer and its title as it is now

    Background:
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary is found with its slug
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found is at "day-one"

    Scenario: A commentary is found with its writer
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found is written by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary whose title was changed is found with the title it was changed to
      Given the title of "Day one" is changed to "Day one, morning"
      When the commentaries of "Spring Open" are looked for
      Then the first commentary found is "Day one, morning"

    Scenario: A commentary whose title was changed keeps its slug
      Given the title of "Day one" is changed to "Day one, morning"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found is at "day-one"

  Rule: Each is found with when it last changed: started, or a comment added or edited

    Background:
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary never written in last changed when it was started
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T10:00:00Z"

    Scenario: A comment added changes when the commentary last changed
      Given the moment "2026-09-26T11:00:00Z"
      And the comment "Sam is two hoops up" is added to "Day one"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T11:00:00Z"

    Scenario: A comment edited changes when the commentary last changed
      Given the moment "2026-09-26T11:00:00Z"
      And the comment "Sam is two hoops up" is added to "Day one"
      And the moment "2026-09-26T12:00:00Z"
      And the comment "Sam is two hoops up" in "Day one" is edited to "Sam is three hoops up"
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T12:00:00Z"

    Scenario: A comment taken away does not change when the commentary last changed
      Given the moment "2026-09-26T11:00:00Z"
      And the comment "Sam is two hoops up" is added to "Day one"
      And the moment "2026-09-26T12:00:00Z"
      And the comment "Sam is two hoops up" in "Day one" is deleted
      When the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found last changed at "2026-09-26T11:00:00Z"

    Scenario: A title changed does not change when the commentary last changed
      Given the moment "2026-09-26T12:00:00Z"
      And the title of "Day one" is changed to "Day one, morning"
      When the commentaries of "Spring Open" are looked for
      Then the first commentary found last changed at "2026-09-26T10:00:00Z"

  Rule: The commentary at a slug is found

    Scenario: The commentary at a slug is found
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentary of "Spring Open" at "day-one" is looked for
      Then the commentary "Day one" is found there

    Scenario: No commentary is found at a slug no commentary has
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentary of "Spring Open" at "day-two" is looked for
      Then no commentary is found there

    Scenario: Another tournament's commentary is not found at its slug
      Given the commentary "Day one" is started on the tournament "Autumn Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the commentary of "Spring Open" at "day-one" is looked for
      Then no commentary is found there

  Rule: The titles and slugs a tournament's commentaries have taken are found

    Scenario: A commentary's title is taken
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the titles and slugs taken by the commentaries of "Spring Open" are looked for
      Then the title "Day one" is among those taken

    Scenario: A commentary's slug is taken
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the titles and slugs taken by the commentaries of "Spring Open" are looked for
      Then the slug "day-one" is among those taken

    Scenario: A title changed is taken as it is now
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the title of "Day one" is changed to "Day one, morning"
      When the titles and slugs taken by the commentaries of "Spring Open" are looked for
      Then the title "Day one, morning" is among those taken

    Scenario: A forgotten writer's commentary's title and slug stay taken
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the account "account/123e4567-e89b-42d3-a456-426614174000" is forgotten
      When the titles and slugs taken by the commentaries of "Spring Open" are looked for
      Then the slug "day-one" is among those taken

    Scenario: Another tournament's commentaries' titles are not taken
      Given the commentary "Day one" is started on the tournament "Autumn Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When the titles and slugs taken by the commentaries of "Spring Open" are looked for
      Then nothing is taken

  Rule: A commentary whose writer has been forgotten is not found among the tournament's

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

    Scenario: A forgetting rebuilt before the commentary's start still counts
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the account "account/123e4567-e89b-42d3-a456-426614174000" is forgotten
      And the accounts' streams are to be rebuilt before the commentaries'
      When the read model is rebuilt from the events
      And the commentaries of "Spring Open" are looked for
      Then no commentaries are found

  Rule: A rebuild takes the streams in any order

    Scenario: A title given up by one commentary and taken by another is rebuilt whichever comes first
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the title of "Day one" is changed to "Day 1"
      And the commentary "Day one" is started again on the tournament "Spring Open", found at "day-one-01"
      And the commentaries' streams are to be rebuilt the latest started first
      When the read model is rebuilt from the events
      Then it is rebuilt without failing

    Scenario: A title given up by one commentary and taken by another is found where it went
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      And the title of "Day one" is changed to "Day 1"
      And the commentary "Day one" is started again on the tournament "Spring Open", found at "day-one-01"
      And the commentaries' streams are to be rebuilt the latest started first
      When the read model is rebuilt from the events
      And the commentaries of "Spring Open" are looked for
      Then the commentary "Day one" found is at "day-one-01"

  Rule: Projecting the same events again changes nothing

    Scenario: A commentary's start projected twice is one commentary
      Given the commentary "Day one" is started on the tournament "Spring Open" by "account/123e4567-e89b-42d3-a456-426614174000"
      When every stream's events are projected again
      And the commentaries of "Spring Open" are looked for
      Then 1 commentary is found
