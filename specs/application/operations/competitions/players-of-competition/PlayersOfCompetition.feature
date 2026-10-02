@postgres
Feature: The players of a competition, as its tournament's managers and scorers list them

  A manager lists a competition's players to put them in order, withdraw them
  and remove them, and a scorer to choose who won and who lost a game, so both
  are answered. The application answers with every player in the competition,
  the withdrawn among them, in the competition's order, lowest first
  (`enterPlayer.feature`). Each is answered with their id in the competition,
  and with what the tournament says of the person they are: their name, what
  they represent and the flag they fly, where they have either, so that those
  are said once, by the tournament, and not again in every competition. Each
  is also said to have withdrawn or not, and to have a game in use or not,
  since a player who has one cannot be removed (`removePlayer.feature`) and
  a list offering to remove one offers it only where removing would be done.
  An archived game is not in use, so it does not count. Each is answered with
  what they carry forward into the competition, count by count
  (`CompetitionPlayer.feature`), since that is the competition's and not the
  tournament's, and a count they carry nothing forward in is answered as
  nothing rather than as 0, so that the dialog changing it shows it as it was
  left (`carry-forward.feature`). In a knockout, each is
  answered with who they are drawn to play now, so that a scorer who chooses 
  the winner need not choose the loser (`score-modal-dialog.feature`).

  Archiving a tournament player removes them from every competition they are
  in (`ArchivePlayer.feature`), so a tournament player archived after they
  were entered is not answered, and restoring them does not bring them back.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers and scorers can ask: anybody else is
  refused with `Tournament.NotAManagerOrScorer`, as the competition's page
  refuses them. A competition the tournament does not have is refused with
  `Tournament.NoSuchCompetition`, and a tournament there is not as
  `PlayersOfCompetition.NoSuchTournament`. A forgotten account lists nothing,
  and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: Every player is answered, in the competition's order

    Scenario: A competition with no players is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then no players of the competition are answered

    Scenario: A player entered is answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered

    Scenario: The players are answered in the competition's order
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has moved the player "Alex Another" in "Block A" of "Spring Open" up
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the first player of the competition answered is "Alex Another"

    Scenario: A withdrawn player is answered as withdrawn
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as withdrawn

    Scenario: A player playing is answered as not withdrawn
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as not withdrawn

    Scenario: A tournament player archived after they were entered is not answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then no players of the competition are answered

    Scenario: A tournament player restored after being archived is not answered
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then no players of the competition are answered

  Rule: Each player is answered with whether they have a game in use

    Scenario: A player who has played is answered as having a game in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Alex Another" is answered as having a game in use

    Scenario: A player whose only game is archived is answered as having none in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as having no game in use

    Scenario: A player who has not played is answered as having no game in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as having no game in use

  Rule: Each player is answered with what they carry forward

    Background:
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"

    Scenario Outline: A player is answered with each count they carry forward
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of <count> of <number>
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered carrying forward <count> of <number>

      Examples:
        | count         | number |
        | match wins    | 3      |
        | match losses  | 1      |
        | game wins     | 7      |
        | game losses   | 4      |
        | hoops for     | 112    |
        | hoops against | 86     |

    Scenario: A count of 0 is answered as 0
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 0
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered carrying forward match wins of 0

    Scenario: A player carrying nothing forward is answered carrying nothing
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered carrying nothing forward

    Scenario: A carry forward is the competition's, not every competition's
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 3
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block B" of "Spring Open"
      Then the competition's player "Sam Someone" is answered carrying nothing forward

  Rule: In a knockout, each player is answered with who they are drawn to play now

    Who a player of a knockout is drawn against is worked out from its draw
    and the games that count (`KnockoutPlay.feature`). The knockout's draw is
    four places, each round the best of 1, so Sam Someone meets Alex Another
    in the first round and Chris Third is drawn against a bye.

    Background:
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"

    Scenario: A player of a knockout is answered with who they are drawn against
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as drawn against "Alex Another"

    Scenario: A player of a knockout who has won their match is answered with who they meet next
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as drawn against "Chris Third"

    Scenario: A player of a knockout drawn against a bye is answered as drawn against nobody
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the competition's player "Chris Third" is answered as drawn against nobody

    Scenario: A player of a block is answered as drawn against nobody
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as drawn against nobody

  Rule: A bye in a knockout is answered as a bye

    A bye is nobody (`enterPlayer.feature`), so the tournament says nothing of
    it: it is answered with the id whose every digit is 0, as a bye, with no
    name, and in its place in the competition's order.

    Background:
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"

    Scenario: A bye is answered as a bye
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the second player of the competition answered is a bye

    Scenario: A bye is answered with the id whose every digit is 0
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the second player of the competition answered has the id "competition-player/00000000-0000-0000-0000-000000000000"

    Scenario: Every bye is answered
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then 2 byes of the competition are answered

    Scenario: A player is answered as not a bye
      When the reader signed in to the account for "organiser@example.com" lists the players of "Final Stage" of "Spring Open"
      Then the competition's player "Sam Someone" is answered as not a bye

  Rule: Each player is answered with what the tournament says of them

    Scenario: A player is answered with what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered representing "Canterbury Croquet Club"

    Scenario: A player is answered with the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered flying the flag "nz"

    Scenario: A player renamed in the tournament is answered by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" of "Spring Open" to "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Samantha Someone" is answered

  Rule: Only a manager or a scorer of a tournament there is can list them

    Scenario: A scorer of the tournament is answered
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the players of "Block A" of "Spring Open"
      Then the competition's player "Sam Someone" is answered

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" lists the players of "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of "Block A" of a tournament there is not
      Then it is refused with "PlayersOfCompetition.NoSuchTournament"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the players of "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
