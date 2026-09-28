@postgres
Feature: The competitions of a tournament, as its managers and scorers list them

  A manager lists a tournament's competitions to put them in order, archive
  them and restore them, so a manager is answered with every competition the
  tournament has, archived ones among them, in the tournament's order, lowest
  first. Each is answered with its id, its name, its kind — a block, a
  knockout or a Swiss — its slug, which is where it is found under the
  tournament, and whether it is archived.

  A scorer lists them to find the one whose scores they are entering
  (`view.feature`). An archived competition is set aside, and there are no
  scores to enter in it, so a scorer is answered with the competitions in use
  alone, in the same order and with the same about each.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers and scorers can ask, since nobody else
  has anything to do with its competitions: anybody else is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `CompetitionsOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`,
  as it is when it asks to change the tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every competition is answered, in the tournament's order

    Scenario: A tournament with no competitions is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then no competitions are answered

    Scenario: The first competition is the lowest in the tournament's order
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the first competition answered is "Block B"

    Scenario: An archived competition is listed
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as archived

    Scenario: A competition not archived is listed as not archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not archived

    Scenario: A competition is listed with its slug
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered with the slug "block-a"

    Scenario Outline: A competition is listed with its kind
      Given "organiser@example.com" has added the <kind> "Final Stage" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the competitions of "Spring Open"
      Then the competition "Final Stage" is answered as a <kind>

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

  Rule: A scorer is answered the competitions in use alone

    Scenario: A scorer is answered a competition in use
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then the competition "Block A" is answered as not archived

    Scenario: A scorer is not answered an archived competition
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then no competitions are answered

    Scenario: A scorer is answered the competitions in the tournament's order
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the reader signed in to the account for "scorer@example.com" lists the competitions of "Spring Open"
      Then the first competition answered is "Block B"

  Rule: Only a manager or a scorer of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the competitions of a tournament there is not
      Then it is refused with "CompetitionsOfTournament.NoSuchTournament"

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" lists the competitions of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the competitions of "Spring Open"
      Then it is refused with "Account.Forgotten"
