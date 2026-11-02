Feature: Adding a knockout that takes the losers of another knockout's round

  Many knockouts are run in three parts: the main knockout, a second for the
  players who lost in its first round, and a third for those who lost in its
  second. A losers knockout is added to a tournament naming the knockout it
  takes losers from and the round, the first round being the first. It has a
  place for each match of that round, so it is the size the round needs
  without anybody working it out, and each of its rounds is the best of 1,
  which updating it can change.

  The final has no losers to send on, since whoever loses it has come second
  in the knockout, so the last round cannot be named.

  Players are not set in a losers knockout by hand: they are put there as the
  matches of the round are decided (`enterLoser.feature` of the
  competition's). A knockout added in the usual way is not a losers knockout.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"
    And the knockout "Main Event" was added to it with a draw of 8 places
    And the tournament is rebuilt from the stream

  Rule: A losers knockout has a place for each match of the round it takes losers from

    Scenario: Adding a losers knockout records it
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then it has recorded 1 event
      And the first thing it recorded is a knockout being added

    Scenario: The losers of the first round of eight take four places
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" has a draw of 4 places

    Scenario: The losers of the second round of eight take two places
      When the losers knockout "Plate" is added for the losers of the second round of "Main Event"
      Then the tournament's competition "Plate" has a draw of 2 places

    Scenario: Every round of a losers knockout is the best of 1
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" has its first round the best of 1
      And the tournament's competition "Plate" has its second round the best of 1

    Scenario: A losers knockout added is a knockout
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" is a knockout

    Scenario: A losers knockout takes the losers of the round it was added for
      When the losers knockout "Plate" is added for the losers of the first round of "Main Event"
      Then the tournament's competition "Plate" takes the losers of the first round of "Main Event"

    Scenario: A losers knockout is still one once the tournament is rebuilt
      Given the losers knockout "Plate" was added for the losers of the first round of "Main Event"
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Plate" takes the losers of the first round of "Main Event"

    Scenario: A knockout added in the usual way takes the losers of nothing
      Then the tournament's competition "Main Event" takes the losers of nothing

  Rule: Only a round that has losers to send on can be named

    Scenario: The final has no losers to send on
      When the losers knockout "Plate" is added for the losers of the third round of "Main Event"
      Then it is refused with "Tournament.NoSuchRound"

    Scenario: A round the knockout does not have is refused
      When the losers knockout "Plate" is added for the losers of the fourth round of "Main Event"
      Then it is refused with "Tournament.NoSuchRound"

    Scenario: A competition that is not a knockout has no round to take losers from
      Given the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the losers knockout "Plate" is added for the losers of the first round of "Block A"
      Then it is refused with "Tournament.NotAKnockout"

    Scenario: A competition the tournament does not have is refused
      When the losers knockout "Plate" is added for the losers of the first round of "Nowhere"
      Then it is refused with "Tournament.NoSuchCompetition"

  Rule: A losers knockout is added as every competition is

    Scenario: A losers knockout with a name another competition has is refused
      When the losers knockout "Main Event" is added for the losers of the first round of "Main Event"
      Then it is refused with "Tournament.CompetitionNameTaken"

  Rule: A losers knockout keeps the size the round gives it

    Scenario: Updating a losers knockout to another number of places is refused
      Given the losers knockout "Plate" was added for the losers of the first round of "Main Event"
      And the tournament is rebuilt from the stream
      And the update gives the knockout a draw of 2 places
      When the knockout "Plate" is updated
      Then it is refused with "Tournament.LosersKnockoutPlacesFixed"

    Scenario: Updating a losers knockout's name keeps whose losers it takes
      Given the losers knockout "Plate" was added for the losers of the first round of "Main Event"
      And the tournament is rebuilt from the stream
      And the update calls the competition "Shield"
      When the knockout "Plate" is updated
      Then the tournament's competition "Shield" takes the losers of the first round of "Main Event"

  Rule: A knockout whose losers another takes keeps the size that gives them their places

    Scenario: Updating the knockout to another number of places is refused
      Given the losers knockout "Plate" was added for the losers of the first round of "Main Event"
      And the tournament is rebuilt from the stream
      And the update gives the knockout a draw of 4 places
      When the knockout "Main Event" is updated
      Then it is refused with "Tournament.KnockoutHasLosersKnockouts"

    Scenario: Updating the knockout's name is not refused
      Given the losers knockout "Plate" was added for the losers of the first round of "Main Event"
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then the tournament has the competition "Main Draw"
