@postgres
Feature: Changing a commentary's title

  The writer of a commentary, the account that started it, can change its
  title, and nobody else can: anybody else, a manager of the tournament among
  them, is refused with `Tournament.NotTheCommentaryWriter`
  (`changeCommentaryTitle.feature`). The commentary is named by its
  tournament's id and its own; a tournament there is not is refused as
  `ChangeCommentaryTitle.NoSuchTournament`, and a commentary the tournament
  does not have is the tournament's to refuse, as
  `Tournament.NoSuchCommentary`.

  The title is asked its own rules on the way in, and kept as it was typed
  (`CommentaryTitle.feature`); a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks of
  a title — that no other commentary has it, however capitalised — and of a
  tournament — that it is not archived — is the tournament's to refuse. The
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
      Then the tournament has the commentary "Day one, morning"

    Scenario: The commentary keeps its slug
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then the tournament's commentary "Day one, morning" has the slug "day-one"

    Scenario: The title is kept as it was typed, HTML and all
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day <b>two</b>"
      Then the tournament has the commentary "Day <b>two</b>"

    Scenario: Changing the title is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then the last thing the tournament recorded was caused by the account for "writer@example.com"

  Rule: Only the commentary's writer can change its title

    Scenario: A reader who did not start the commentary is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Tournament.NotTheCommentaryWriter"

    Scenario: A manager of the tournament who did not start the commentary is refused
      When the reader signed in to the account for "organiser@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Tournament.NotTheCommentaryWriter"

  Rule: The title must break none of its own rules

    Scenario: A missing title is refused for it
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to ""
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentaryTitle.Missing"

    Scenario: A title that breaks a rule changes nothing
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to ""
      Then the tournament has the commentary "Day one"

  Rule: What the tournament asks of its commentaries is the tournament's to refuse

    Scenario: A title another commentary has is refused as the tournament refuses it
      Given "writer@example.com" has started the commentary "Day two" on "Spring Open"
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "DAY TWO"
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: Changing a title on an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Tournament.Archived"

  Rule: Only a commentary there is can have its title changed

    Scenario: Changing the title of a commentary the tournament does not have is refused
      When the reader signed in to the account for "writer@example.com" changes the title of a commentary of "Spring Open" there is not to "Day two"
      Then it is refused with "Tournament.NoSuchCommentary"

    Scenario: Changing the title of a commentary of a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" changes the title of a commentary of a tournament there is not to "Day two"
      Then it is refused with "ChangeCommentaryTitle.NoSuchTournament"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account changes the title of "Day one" of "Spring Open" to "Day one, morning"
      Then it is refused with "Account.Forgotten"
