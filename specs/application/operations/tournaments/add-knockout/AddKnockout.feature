@postgres
Feature: Adding a knockout to a tournament

  A knockout is added as a block is (`AddBlock.feature`), by a manager of the
  tournament, to a tournament named by its id, and given a new id that is the
  answer. A tournament there is not is refused as
  `AddKnockout.NoSuchTournament`. What a knockout is added with besides its
  name is the shape of its draw: how many places it has, and what each round
  is the best of. The draw's rules are asked on the way in
  (`KnockoutDraw.feature`), and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. Only the tournament's
  managers can: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager` (`onlyManagers.feature`).

  Losers knockouts, which take the losers of the knockout's rounds
  (`AddLosersKnockout.feature`), can be added with it. They are added in the
  same change to the tournament, so that either the knockout and all of them
  are kept, or none is: one the tournament refuses leaves nothing added.

  This says again only enough of what adding a block says to show that it
  holds for a knockout.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A sound knockout is added and kept

    Scenario: The knockout is one of the tournament's competitions
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Main Event" is a knockout

    Scenario: The knockout has the draw it was added with
      Given the knockout is to have a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 3
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Main Event" has a draw of 4 places
      And the tournament's competition "Main Event" has its second round the best of 3

    Scenario: The answer is the knockout's id
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is answered with the id of the tournament's competition "Main Event"

  Rule: Losers knockouts added with the knockout are kept with it

    Background:
      Given the knockout is to have a draw of 8 places

    Scenario: A losers knockout is one of the tournament's competitions
      Given the knockout is to have its first round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Plate" is a knockout

    Scenario: A losers knockout takes the losers of the round it was added for
      Given the knockout is to have its second round's losers played on in "Shield"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Shield" was added for the losers of the second round of "Main Event"

    Scenario: A losers knockout has a place for each match of the round
      Given the knockout is to have its first round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Plate" has a draw of 4 places

    Scenario: Several losers knockouts are all kept
      Given the knockout is to have its first round's losers played on in "Plate"
      And the knockout is to have its second round's losers played on in "Shield"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Plate" is a knockout
      And the tournament's competition "Shield" is a knockout

    Scenario: The answer is still the knockout's id
      Given the knockout is to have its first round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is answered with the id of the tournament's competition "Main Event"

  Rule: A losers knockout the tournament refuses leaves nothing added

    Background:
      Given the knockout is to have a draw of 8 places

    Scenario: A round with no losers to send on is refused
      Given the knockout is to have its third round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Tournament.NoSuchRound"

    Scenario: The knockout is not added for it
      Given the knockout is to have its third round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament "Spring Open" has no competition "Main Event"

    Scenario: A losers knockout named as the knockout is is refused
      Given the knockout is to have its first round's losers played on in "Main Event"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A losers knockout added before is not kept either
      Given the knockout is to have its first round's losers played on in "Plate"
      And the knockout is to have its third round's losers played on in "Shield"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament "Spring Open" has no competition "Plate"

    Scenario: A losers knockout with no name is refused on the way in
      Given the knockout is to have its first round's losers played on in ""
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Request.Invalid"

  Rule: A losers knockout is played and counted as the knockout is

    Scenario: A losers knockout added with a knockout played under handicap is too
      Given the knockout is to have a draw of 8 places
      And the competition is to be played under handicap
      And the knockout is to have its first round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Plate" is played under handicap

    Scenario: A losers knockout added with a knockout allowing drawn results is too
      Given the knockout is to have a draw of 8 places
      And the competition is to allow drawn results
      And the knockout is to have its first round's losers played on in "Plate"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then the tournament's competition "Plate" allows drawn results

  Rule: The draw must break none of its own rules

    Scenario Outline: A draw that breaks a rule is refused for it
      Given the knockout is to have a draw of <places> places
      And its first round is to be the best of <first>
      And its second round is to be the best of <second>
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | places | first | second | code                             |
        | 3      | 1     | 1      | KnockoutDraw.PlacesDoNotHalve    |
        | 4      | 1     | 2      | KnockoutDraw.EvenBestOf          |
        | 8      | 1     | 1      | KnockoutDraw.WrongNumberOfRounds |

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: A name another competition has is refused as the tournament refuses it
      Given "organiser@example.com" has added the block "Main Event" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a knockout to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the knockout "Main Event" to a tournament there is not
      Then it is refused with "AddKnockout.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the knockout "Main Event" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"
