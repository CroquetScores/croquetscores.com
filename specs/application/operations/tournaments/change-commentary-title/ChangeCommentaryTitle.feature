@postgres
Feature: Changing a commentary's title

  The writer of a commentary, the account that started it, can change its
  title, and nobody else can: anybody else, a manager of the tournament among
  them, is refused with `Commentary.NotTheWriter` (`changeTitle.feature`).
  The commentary is named by its tournament's id and its own; a tournament
  there is not is refused as `ChangeCommentaryTitle.NoSuchTournament`, and a
  commentary the tournament does not have, one of another tournament's
  among them, as `ChangeCommentaryTitle.NoSuchCommentary`.

  The title is asked its own rules on the way in, and kept as it was typed
  (`CommentaryTitle.feature`); a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. That no other commentary on
  the tournament has the title, however capitalised, is the commentary's to
  refuse, told the others' titles by the read model of a tournament's
  commentaries (`CommentariesByTournament.feature`), and that the tournament
  is not archived is the tournament's (`writeCommentary.feature`). The
  commentary keeps its slug.

  A forgotten account changes nothing, and is refused with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"
    And "writer@example.com" has started the commentary "Day one" on "Spring Open"

  Rule: A sound title is kept

    Scenario: The commentary has the title it was changed to
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then the tournament "Spring Open" has the commentary "Day one, morning"

    Scenario: The commentary keeps its slug
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then the commentary "Day one, morning" of "Spring Open" is found at "day-one"

    Scenario: The title is kept as it was typed, HTML and all
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day <b>two</b>"
      Then the tournament "Spring Open" has the commentary "Day <b>two</b>"

    Scenario: Changing the title is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then the last thing the commentary "Day one, morning" of "Spring Open" recorded was caused by the account for "writer@example.com"

  Rule: Only the commentary's writer can change its title

    Scenario: A reader who did not start the commentary is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Commentary.NotTheWriter"

    Scenario: A manager of the tournament who did not start the commentary is refused
      When the reader signed in to the account for "organiser@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Commentary.NotTheWriter"

  Rule: The title must break none of its own rules

    Scenario: A missing title is refused for it
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to ""
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentaryTitle.Missing"

    Scenario: A title that breaks a rule changes nothing
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to ""
      Then the tournament "Spring Open" has the commentary "Day one"

  Rule: A title another commentary has is the commentary's to refuse, and an archived tournament the tournament's

    Scenario: A title another commentary has is refused as the commentary refuses it
      Given "writer@example.com" has started the commentary "Day two" on "Spring Open"
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "DAY TWO"
      Then it is refused with "Commentary.TitleTaken"

    Scenario: Changing a title on an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Tournament.Archived"

  Rule: Only a commentary there is can have its title changed

    Scenario: Changing the title of a commentary the tournament does not have is refused
      When the reader signed in to the account for "writer@example.com" changes the title of a commentary of "Spring Open" there is not to "Day two"
      Then it is refused with "ChangeCommentaryTitle.NoSuchCommentary"

    Scenario: Changing the title of another tournament's commentary is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "writer@example.com" has started the commentary "Day two" on "Autumn Open"
      When the reader signed in to the account for "writer@example.com" changes the title of "Day two" of "Autumn Open" as a commentary of "Spring Open" to "Day three"
      Then it is refused with "ChangeCommentaryTitle.NoSuchCommentary"

    Scenario: Changing the title of a commentary of a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" changes the title of a commentary of a tournament there is not to "Day two"
      Then it is refused with "ChangeCommentaryTitle.NoSuchTournament"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Account.Forgotten"
