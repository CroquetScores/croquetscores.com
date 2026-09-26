Feature: Changing what a tournament's knockout is

  A knockout's name, and the shape of its draw, can each be corrected.
  Updating a knockout says both again. What is asked of a draw's shape is the
  draw's to say (`KnockoutDraw.feature`), and everything else asked of an
  update is asked of a knockout as it is of a block, and is specified with
  updating a block (`updateBlock.feature`). This says it again only enough to
  show that it holds for a knockout too.

  A knockout's draw can be changed after games have been played in it, since
  a draw is often found to be wrong only once it is under way. What cannot be
  changed is where a player who has games is: their games were played from
  that place, and would otherwise be against somebody the draw no longer
  puts them against. Where each player is in the draw is not the
  tournament's to know, so whatever asks for the draw to be changed says
  whether the change moves a player who has games, as it says whether a
  player being archived has played any (`archivePlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Updating a knockout is recorded, and is what the knockout is

    Scenario: Updating a knockout records it
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a knockout being updated

    Scenario: An updated knockout has its new name
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then the tournament has the competition "Main Draw"

    Scenario: An updated knockout has the places it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it with a draw of 4 places
      And the tournament is rebuilt from the stream
      And the update gives the knockout a draw of 8 places
      And its first round is to be the best of 1
      And its second round is to be the best of 1
      And its third round is to be the best of 3
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Event" has a draw of 8 places

    Scenario: An updated knockout has each round as it was updated
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it with a draw of 4 places
      And the tournament is rebuilt from the stream
      And the update gives the knockout a draw of 4 places
      And its first round is to be the best of 3
      And its second round is to be the best of 5
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Event" has its first round the best of 3
      And the tournament's competition "Main Event" has its second round the best of 5

    Scenario: A renamed knockout keeps its slug
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Draw" has the slug "main-event"

  Rule: A knockout's draw can be changed with games, but not where a player with games is

    Scenario: A knockout with games can have its draw changed
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it with a draw of 4 places
      And the tournament is rebuilt from the stream
      And the knockout "Main Event" has games
      And the update gives the knockout a draw of 8 places
      And its first round is to be the best of 1
      And its second round is to be the best of 1
      And its third round is to be the best of 3
      And the update moves no player who has games
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Event" has a draw of 8 places

    Scenario: A change to the draw that moves a player with games is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it with a draw of 8 places
      And the tournament is rebuilt from the stream
      And the knockout "Main Event" has games
      And the update gives the knockout a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 3
      And the update moves a player who has games
      When the knockout "Main Event" is updated
      Then it is refused with "Tournament.KnockoutPlayerHasGames"

    Scenario: A change to the draw that moves a player with games changes nothing
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it with a draw of 8 places
      And the tournament is rebuilt from the stream
      And the knockout "Main Event" has games
      And the update gives the knockout a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 3
      And the update moves a player who has games
      When the knockout "Main Event" is updated
      Then the tournament's competition "Main Event" has a draw of 8 places

  Rule: A knockout is updated as every competition is

    Scenario: Updating a block as a knockout is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the knockout "Block A" is updated
      Then it is refused with "Tournament.NotAKnockout"

    Scenario: A name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block A"
      When the knockout "Main Event" is updated
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Updating a knockout to what it already is records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Event"
      When the knockout "Main Event" is updated
      Then it has recorded 0 events

    Scenario: Updating an archived knockout is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the competition "Main Event" was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: Updating a knockout in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the knockout "Main Event" is updated
      Then it is refused with "Tournament.Archived"
