@postgres
Feature: Changing what a competition's player carries forward

  A manager of the tournament gives a player in one of its competitions what
  they carry forward into it (`changeCarryForward.feature`), and the account
  they are signed in to is who did. The tournament, the competition and the
  player are each named by their id. The carry forward says all six counts
  again, each asked its own rules on the way in, and one that breaks a rule is
  refused with `Request.Invalid` and the first rule it breaks. Giving a player
  the carry forward they already have records nothing.

  Whether the competition has standings is the competition's to say, and it
  says so as the tournament tells it what kind of competition it is: a
  knockout is refused with `Competition.NoStandings`. A withdrawn player, and
  a player the competition does not have, are the competition's to refuse.

  It is asked of the tournament first, as withdrawing a player is
  (`WithdrawPlayer.feature`): only a manager can, anybody else, a scorer among
  them, being refused with `Tournament.NotAManager`; an archived tournament is
  refused with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `ChangeCarryForward.NoSuchTournament`; and a forgotten account with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"

  Rule: A sound carry forward is kept

    Scenario: The player carries forward what they were given
      Given the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward match wins of 3

    Scenario: A count left out is taken away
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      And the carry forward is to have game wins of 7
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries forward nothing in match wins

    Scenario: Changing the carry forward is recorded as done by whoever asked
      Given the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: Giving the carry forward the player already has records nothing
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: Each count must break none of its own rules

    Scenario Outline: A count that breaks a rule is refused for it
      Given the carry forward is to have <count> of <number>
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | count         | number | code                              |
        | match wins    | -1     | CarryForward.MatchWinsBelowZero   |
        | hoops against | 1.5    | CarryForward.HoopsAgainstNotWhole |

    Scenario: A carry forward that breaks a rule is not kept
      Given the carry forward is to have match wins of -1
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then the player "Sam Someone" in "Block A" of "Spring Open" carries nothing forward

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A player in a knockout is refused as the competition refuses them
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.NoStandings"

    Scenario: A withdrawn player is refused as the player refuses them
      Given "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused for breaking "CompetitionPlayer.Withdrawn"

    Scenario: A player the competition does not have is refused as the competition refuses them
      Given the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of a player "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, can have this done

    Scenario: A competition the tournament does not have is refused
      Given the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      Given the carry forward is to have match wins of 3
      When the reader signed in to the account for "organiser@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of a tournament there is not
      Then it is refused with "ChangeCarryForward.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "someone@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the carry forward is to have match wins of 3
      When the reader signed in to the account for "scorer@example.com" changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account does nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the carry forward is to have match wins of 3
      When the reader signed in to that account changes the carry forward of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
