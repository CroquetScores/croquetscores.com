@postgres
Feature: Starting a commentary on a tournament

  Any reader signed in to an account can start a commentary on a tournament,
  and the account they are signed in to is who started it. Commentary is for
  anybody with something to say about the play, so they need not manage the
  tournament, score it, or be known to it at all (`startCommentary.feature`).
  The tournament is named by its id; one there is not is refused as
  `StartCommentary.NoSuchTournament`. The commentary is given a new id, and
  the answer is that id. The tournament records the commentary, and the
  commentary's own record is started beside it with the same id, naming the
  account as its writer, the only account that may write in it
  (`start.feature`). Both are kept, or neither is.

  The commentary's title is asked its own rules on the way in, its HTML
  taken out first (`CommentaryTitle.feature`), and a request
  that breaks one is refused with `Request.Invalid` and the first rule it
  breaks. What the tournament asks of a commentary — a title no other has,
  however capitalised, a slug unlike every other's, and a tournament that is
  not archived — is the tournament's to refuse.

  A commentary whose writer's account has been forgotten is shown to nobody
  (`PublicCommentariesOfTournament.feature`), but it is still the
  tournament's, and keeps its title and its slug. So its title is still
  refused to a new commentary, and its slug is still taken. A new commentary
  given that slug would be found by every link kept to the forgotten one,
  and a reader following one would read somebody else's words under an
  address they had been given for another's. The tournament is not told
  that an account is forgotten, and need not be.

  A forgotten account starts nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"

  Rule: A sound commentary is started and kept

    Scenario: The commentary is one of the tournament's commentaries
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the tournament has the commentary "Day one"

    Scenario: The answer is the commentary's id
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then it is answered with the id of the tournament's commentary "Day one"

    Scenario: The commentary is given its slug by the tournament
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the tournament's commentary "Day one" has the slug "day-one"

    Scenario: The commentary is kept with the HTML taken out of its title
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day <b>one</b>" on "Spring Open"
      Then the tournament has the commentary "Day one"

    Scenario: The commentary was started by whoever asked
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the tournament's commentary "Day one" was started by the account for "writer@example.com"

    Scenario: The commentary's writer is whoever asked
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the writer of the commentary "Day one" of "Spring Open" is the account for "writer@example.com"

    Scenario: Starting the commentary is recorded as done by whoever asked
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "writer@example.com"

  Rule: Any reader signed in can start a commentary

    Scenario: A manager of the tournament can start a commentary
      When the reader signed in to the account for "organiser@example.com" starts the commentary "Day one" on "Spring Open"
      Then the tournament has the commentary "Day one"

    Scenario: A reader the tournament does not know can start a commentary
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then the tournament has the commentary "Day one"

  Rule: The title must break none of its own rules

    Scenario: A missing title is refused for it
      When the reader signed in to the account for "writer@example.com" starts the commentary "" on "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentaryTitle.Missing"

    Scenario: A title longer than 100 characters is refused for it
      When the reader signed in to the account for "writer@example.com" starts a commentary with a title of 101 characters on "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "CommentaryTitle.TooLong"

    Scenario: A commentary that breaks a rule is not started
      When the reader signed in to the account for "writer@example.com" starts the commentary "" on "Spring Open"
      Then the tournament has no commentaries

  Rule: What the tournament asks of its commentaries is the tournament's to refuse

    Scenario: A title another commentary has is refused as the tournament refuses it
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the reader signed in to the account for "organiser@example.com" starts the commentary "DAY ONE" on "Spring Open"
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: Starting a commentary on an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: A forgotten writer's commentary keeps its title and its slug

    Scenario: A title a forgotten writer's commentary has is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "someone@example.com" has started the commentary "Day one" on "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on "Spring Open"
      Then it is refused with "Tournament.CommentaryTitleTaken"

    Scenario: A slug a forgotten writer's commentary has is followed by "-01"
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "someone@example.com" has started the commentary "Böck Cup" on "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the reader signed in to the account for "writer@example.com" starts the commentary "Bock Cup" on "Spring Open"
      Then the tournament's commentary "Bock Cup" has the slug "bock-cup-01"

  Rule: Only a tournament there is can have a commentary started

    Scenario: Starting a commentary on a tournament there is not is refused
      When the reader signed in to the account for "writer@example.com" starts the commentary "Day one" on a tournament there is not
      Then it is refused with "StartCommentary.NoSuchTournament"

  Rule: A forgotten account starts nothing

    Scenario: A forgotten account is refused
      Given the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the reader signed in to that account starts the commentary "Day one" on "Spring Open"
      Then it is refused with "Account.Forgotten"
