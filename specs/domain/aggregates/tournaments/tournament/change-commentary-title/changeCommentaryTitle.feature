Feature: Changing a commentary's title

  A commentary's writer can change its title: a day misnamed, a word
  misspelt, a commentary that turned out to be about more than its title
  said. The commentary is named by its id, and given the title it is to have
  now, which is asked what any commentary title is asked
  (`CommentaryTitle.feature`).

  Only the commentary's writer can change its title, as only they can write
  in it (`addComment.feature`). The tournament knows who its writer is, since
  it records who started each commentary (`startCommentary.feature`), so it
  asks that itself. Anybody else who asks is refused, a manager of the
  tournament among them.

  No two commentaries on a tournament have the same title, however it is
  capitalised, so a title another commentary has is refused, as it is when a
  commentary is started. A commentary keeps its slug when its title is
  changed, as a team keeps its slug when its short name is (`updateTeam.feature`),
  so that every link to it still finds it.

  An archived tournament can only be restored (`restore.feature`), so
  changing a commentary's title on one is refused. A title changed to what it
  is already records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"
    And the commentary "Day one" was started on it

  Rule: Changing a commentary's title is recorded, and the commentary has the title it was changed to

    Scenario: Changing a commentary's title records it
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then it has recorded 1 event
      And the first thing it recorded is a commentary's title being changed

    Scenario: A commentary has the title it was changed to
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then the tournament has the commentary "Day one, morning"

    Scenario: A commentary no longer has the title it had
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then the tournament has no commentary "Day one"

    Scenario: A tournament rebuilt after a commentary's title was changed has the commentary as changed
      Given the title of the commentary "Day one" was changed to "Day one, morning"
      When the tournament is rebuilt from the stream
      Then the tournament has the commentary "Day one, morning"

  Rule: A commentary keeps its slug when its title is changed

    Scenario: A commentary's slug is kept
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then the tournament's commentary "Day one, morning" has the slug "day-one"

  Rule: Only the commentary's writer can change its title

    Scenario: Another account changing a commentary's title is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then it is refused with "Tournament.NotTheCommentaryWriter"

    Scenario: A manager who did not start the commentary is refused
      Given the account "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" was made a manager of it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then it is refused with "Tournament.NotTheCommentaryWriter"

  Rule: What a commentary title must be is refused as it is for a title

    Scenario: A title that could not be a commentary's is refused as a commentary title is
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to ""
      Then it is refused for breaking "CommentaryTitle.Missing"

    Scenario: A title changed is kept as it was typed, HTML and all
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day <b>two</b>"
      Then the tournament has the commentary "Day <b>two</b>"

  Rule: No two commentaries on a tournament have the same title

    Scenario: A title another commentary has is refused
      Given the commentary "Day two" was started on it
      And the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "DAY TWO"
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: A commentary's own title, capitalised otherwise, is not taken from it
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day One"
      Then the tournament has the commentary "Day One"

  Rule: Only a commentary the tournament has can have its title changed

    Scenario: Changing the title of a commentary the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the title of the commentary known by "commentary/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is changed to "Day two"
      Then it is refused with "Tournament.NoSuchCommentary"

  Rule: A commentary's title cannot be changed on an archived tournament

    Scenario: Changing a commentary's title on an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one, morning"
      Then it is refused with "Tournament.Archived"

  Rule: A title changed to what it is already records nothing

    Scenario: A change that changes nothing records nothing
      Given the tournament is rebuilt from the stream
      When the title of the commentary "Day one" is changed to "Day one"
      Then it has recorded 0 events
