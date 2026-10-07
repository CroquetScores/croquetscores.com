@postgres
Feature: The players of a tournament, as a manager lists them

  A manager lists a tournament's players to find one, correct them, archive
  them and restore them, so the application answers with every player the
  tournament has, archived ones among them. Each is answered with their id,
  their name, their world ranking name, what they represent and the flag they fly, if either, whether
  they are archived, and whether they have played any games in use.

  They are answered in the tournament's order, lowest first
  (`addPlayer.feature`), since that is the order a manager puts them in by
  moving them (`movePlayer.feature`), and the order they are entered in its
  competitions in. An archived player is put last when archived
  (`archivePlayer.feature`), so the archived come after those in use.

  Each player is also answered with the names of the competitions they are
  in, in the tournament's order, archived competitions among them and whether
  they have withdrawn or not, since archiving the player removes them from
  every one (`ArchivePlayer.feature`) and the manager is told which before
  they do (`players-tab.feature`). A competition is kept by the competition,
  not the tournament, so the application asks each of the tournament's
  competitions.

  Whether a player has played is not the tournament's to know
  (`archivePlayer.feature`). The application asks its games, as archiving a
  player does (`ArchivePlayer.feature`), so that a list offering to archive a
  player offers it only where archiving would be done. The games are those its
  competitions keep (`Games.feature`), and an archived game counts for
  nothing.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing its players: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `PlayersOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`,
  as it is when it asks to change the tournament.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every player is answered, in the tournament's order

    Scenario: A tournament with no players is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then no players are answered

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered

    Scenario: The players are in the order they were added, whatever their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Sam Someone"

    Scenario: A player moved is answered in the place they were moved to
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has moved the player "Alex Another" in "Spring Open" up
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Alex Another"

    Scenario: An archived player comes after those in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Alex Another"

    Scenario: A renamed player keeps their place
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has renamed the player "Alex Another" of "Spring Open" to "Aaron Another"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Sam Someone"

  Rule: Each player is answered with what they are

    Scenario: A player is listed with what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered representing "Canterbury Croquet Club"

    Scenario: A player is listed with the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered flying the flag "nz"

    Scenario: A player is listed with their world ranking name
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered known in the world rankings as "Samuel Someone"

    Scenario: An archived player is listed as archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as archived

    Scenario: A player not archived is listed as not archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as not archived

  Rule: Each player is answered with the competitions they are in

    Scenario: A player in no competition is answered with none
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered in no competitions

    Scenario: A player is answered with a competition they are in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered in the competition "Block A"

    Scenario: A player is not answered with a competition they are not in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is not answered in the competition "Block B"

    Scenario: The competitions are in the tournament's order
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first competition the player "Sam Someone" is answered in is "Block B"

    Scenario: A player is answered with an archived competition they are in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered in the competition "Block A"

    Scenario: A player is answered with a competition they withdrew from
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered in the competition "Block A"

    Scenario: A player removed from a competition is not answered with it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has removed the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered in no competitions

  Rule: Each player is answered with whether they have played

    Scenario: A player who has played is listed as having played
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as having played

    Scenario: A player whose only game is archived is listed as not having played
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as not having played

    Scenario: A player who has not played is listed as not having played
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as not having played

  Rule: Only a manager of a tournament there is can list them

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the players of a tournament there is not
      Then it is refused with "PlayersOfTournament.NoSuchTournament"

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" lists the players of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the players of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the players of "Spring Open"
      Then it is refused with "Account.Forgotten"
