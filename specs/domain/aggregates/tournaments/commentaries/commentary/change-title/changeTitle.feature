Feature: Changing a commentary's title

  A commentary's writer can change its title: a day misnamed, a word
  misspelt, a commentary that turned out to be about more than its title
  said. It is given the title it is to have now, which is asked what any
  commentary title is asked (`CommentaryTitle.feature`).

  Only the commentary's writer can change its title, as only they can write
  in it (`addComment.feature`). The commentary knows who its writer is, since
  it records who started it (`start.feature`), so it asks that itself.
  Anybody else who asks is refused, a manager of the tournament among them.

  No two commentaries on a tournament have the same title, however it is
  capitalised, so a title another commentary has is refused, as it is when a
  commentary is started; the commentary is told the other commentaries'
  titles by whatever changes it. A commentary keeps its slug when its title
  is changed, as a team keeps its slug when its short name is
  (`updateTeam.feature`), so that every link to it still finds it. A title
  changed to what it is already records nothing, because nothing happened.

  Whether the tournament is archived is the tournament's to say
  (`writeCommentary.feature`), and whatever changes a title has asked it
  first.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where the commentary "Day one" was started

  Rule: Changing a commentary's title is recorded, and the commentary has the title it was changed to

    Scenario: Changing a commentary's title records it
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day one, morning"
      Then it has recorded 1 event
      And the first thing it recorded is a commentary's title being changed

    Scenario: A commentary has the title it was changed to
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day one, morning"
      Then the commentary is called "Day one, morning"

    Scenario: A commentary rebuilt after its title was changed has the title it was changed to
      Given the commentary's title was changed to "Day one, morning"
      When the commentary is rebuilt from its stream
      Then the commentary is called "Day one, morning"

  Rule: A commentary keeps its slug when its title is changed

    Scenario: A commentary's slug is kept
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day one, morning"
      Then the commentary is found at "day-one"

  Rule: Only the commentary's writer can change its title

    Scenario: Another account changing a commentary's title is refused
      Given the commentary is rebuilt from its stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the commentary's title is changed to "Day one, morning"
      Then it is refused with "Commentary.NotTheWriter"

  Rule: What a commentary title must be is refused as it is for a title

    Scenario: A title that could not be a commentary's is refused as a commentary title is
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to ""
      Then it is refused for breaking "CommentaryTitle.Missing"

    Scenario: A title changed is kept as it was typed, HTML and all
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day <b>two</b>"
      Then the commentary is called "Day <b>two</b>"

  Rule: No two commentaries on a tournament have the same title

    Scenario: A title another commentary has is refused
      Given the tournament's other commentaries are called "Day two"
      And the commentary is rebuilt from its stream
      When the commentary's title is changed to "DAY TWO"
      Then it is refused with "Commentary.TitleTaken"

    Scenario: A commentary's own title, capitalised otherwise, is not taken from it
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day One"
      Then the commentary is called "Day One"

  Rule: A title changed to what it is already records nothing

    Scenario: A change that changes nothing records nothing
      Given the commentary is rebuilt from its stream
      When the commentary's title is changed to "Day one"
      Then it has recorded 0 events
