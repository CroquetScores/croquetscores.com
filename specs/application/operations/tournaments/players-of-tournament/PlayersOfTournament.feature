@postgres
Feature: The players of a tournament, as a manager lists them

  A manager lists a tournament's players to find one, correct them, archive
  them and restore them, so the application answers with every player the
  tournament has, archived ones among them. Each is answered with their id,
  their name, what they represent and the flag they fly, if either, whether
  they are archived, and whether they have played any games.

  They are answered in order of their names, as a reader looks for a name in
  a list: a name's capitals and accents do not change where it comes, so
  "de Villiers" comes among the Ds and "Émile" among the Es.

  Whether a player has played is not the tournament's to know
  (`archivePlayer.feature`). The application asks its games, as archiving a
  player does (`ArchivePlayer.feature`), so that a list offering to archive a
  player offers it only where archiving would be done. Nothing records games
  yet, so they say that nobody has played any; a scenario about a player who
  has stands in games that say so.

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

  Rule: Every player is answered, in order of their names

    Scenario: A tournament with no players is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then no players are answered

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered

    Scenario: The players are in order of their names, whatever order they were added in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Alex Another"

    Scenario: A name in lower case comes where it would in capitals
      Given "organiser@example.com" has added the player "Edith Evans" to "Spring Open"
      And "organiser@example.com" has added the player "de Villiers" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "de Villiers"

    Scenario: A name with an accent comes where it would without one
      Given "organiser@example.com" has added the player "Frank Fisher" to "Spring Open"
      And "organiser@example.com" has added the player "Émile Dubois" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Émile Dubois"

    Scenario: A renamed player comes where their new name does
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" of "Spring Open" to "Aaron Someone"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the first player answered is "Aaron Someone"

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

    Scenario: An archived player is listed as archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as archived

    Scenario: A player not archived is listed as not archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as not archived

  Rule: The application's games say whether each player has played

    Scenario: A player the games say has played is listed as having played
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And games that say the player "Sam Someone" in "Spring Open" has played
      When the reader signed in to the account for "organiser@example.com" lists the players of "Spring Open"
      Then the player "Sam Someone" is answered as having played

    Scenario: A player the games say nothing of is listed as not having played
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
