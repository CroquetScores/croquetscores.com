@postgres
Feature: Entering a tournament's player in one of its competitions

  A manager of the tournament enters its players in its competitions, and the
  account they are signed in to is who entered them. The tournament, the
  competition and the tournament player are each named by their id, and the
  answer is the id the player is given in the competition
  (`enterPlayer.feature`).

  A competition keeps its own players, and knows nothing of who may enter them
  or of the tournament's players, so the application asks the tournament
  first. Only its managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager`. An archived tournament can only be restored,
  and is refused with `Tournament.Archived`. A competition the tournament does
  not have is refused with `Tournament.NoSuchCompetition`, and an archived one,
  which can only be restored, with `Tournament.CompetitionArchived`. A
  tournament player the tournament does not have is refused with
  `Tournament.NoSuchPlayer`, and an archived one, who is set aside, with
  `TournamentPlayer.Archived`. A tournament there is not is refused as
  `EnterPlayer.NoSuchTournament`. The tournament says what kind of
  competition it is, and what the competition refuses — a tournament player
  already in it, or anybody in a knockout that has a game — is the
  competition's to refuse.

  The tournament player's order is the tournament's too, so the application
  tells the competition what it is, and the player entered is given it, or
  the order just after it where a player in the competition already has it
  (`enterPlayer.feature`). The competition's players start in the order the
  tournament has them in, whatever order they are entered in.

  A bye is entered as a tournament player is, by the tournament player whose
  id's every digit is 0, and is answered with the id in the competition whose
  every digit is 0 (`enterPlayer.feature`). The tournament has no such player,
  and none is asked of it: the bye is nobody, so it has no order in the
  tournament either, and the competition puts it last. Whether the
  competition can have a bye is the competition's to say, since only a
  knockout has a draw.

  A forgotten account enters nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"

  Rule: A tournament player entered is kept as a player in the competition

    Scenario: The player entered is one of the competition's players
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"

    Scenario: The answer is the player's id in the competition
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is answered with the id of the player "Sam Someone" in "Block A" of "Spring Open"

    Scenario: A player entered is given their place in the tournament's order
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then the first player of "Block A" of "Spring Open" is "Sam Someone"

    Scenario: A player moved in the tournament is entered in the place they were moved to
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has moved the player "Alex Another" in "Spring Open" up
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Alex Another" in "Block A" of "Spring Open"
      Then the first player of "Block A" of "Spring Open" is "Alex Another"

    Scenario: A player whose order the competition already has is entered just after the player who has it
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has added the player "Kim Keeper" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Kim Keeper" in "Block A" of "Spring Open"
      And "organiser@example.com" has moved the player "Sam Someone" in "Block A" of "Spring Open" down
      When the reader signed in to the account for "organiser@example.com" enters the player "Pat Player" in "Block A" of "Spring Open"
      Then the third player of "Block A" of "Spring Open" is "Pat Player"

    Scenario: Entering the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A tournament player already in the competition is refused as the competition refuses it
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Competition.PlayerAlreadyEntered"

    Scenario: A player entered in a knockout with a game is refused as the competition refuses them
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Chris Third" in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.DrawFixed"

  Rule: A bye is entered in a knockout by the tournament player whose every digit is 0

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"

    Scenario: A bye entered is one of the knockout's players
      When the reader signed in to the account for "organiser@example.com" enters a bye in "Final Stage" of "Spring Open"
      Then the competition "Final Stage" of "Spring Open" has 1 bye

    Scenario: The answer is the id in the competition whose every digit is 0
      When the reader signed in to the account for "organiser@example.com" enters a bye in "Final Stage" of "Spring Open"
      Then it is answered with "competition-player/00000000-0000-0000-0000-000000000000"

    Scenario: A second bye is entered
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters a bye in "Final Stage" of "Spring Open"
      Then the competition "Final Stage" of "Spring Open" has 2 byes

    Scenario: A bye is entered after the players there are
      Given "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters a bye in "Final Stage" of "Spring Open"
      Then the second player of "Final Stage" of "Spring Open" is a bye

    Scenario: A bye entered in a block is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" enters a bye in "Block A" of "Spring Open"
      Then it is refused with "Competition.ByeOutsideKnockout"

    Scenario: A scorer entering a bye is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" enters a bye in "Final Stage" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament player there is, and one not archived, can be entered

    Scenario: A tournament player the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" enters a player "Spring Open" does not have in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: An archived tournament player is refused
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "TournamentPlayer.Archived"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a player entered

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of a tournament there is not
      Then it is refused with "EnterPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account enters nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
