@postgres
Feature: Moving a tournament's competition up or down

  A manager of the tournament can move one of its competitions up or down a
  place, and the account they are signed in to is who moved it. The
  tournament and the competition are each named by their id, and the way to
  move it is up or down. A tournament there is not is refused as
  `MoveCompetition.NoSuchTournament`, a way that is neither up nor down is
  refused with `Request.Invalid` and `MoveCompetition.NoSuchDirection`, and
  what the tournament refuses — a competition it does not have, one that is
  archived, or any in an archived tournament — is the tournament's to refuse
  (`moveCompetition.feature`). Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  Moving the first competition up or the last down records nothing, since
  there is nowhere for it to go.

  A forgotten account moves nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the block "Block B" to "Spring Open"

  Rule: A competition moved is kept in its new place

    Scenario: A competition moved up is kept first
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in "Spring Open" up
      Then the tournament's first competition is "Block B"

    Scenario: A competition moved down is kept second
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block A" in "Spring Open" down
      Then the tournament's second competition is "Block A"

    Scenario: Moving the competition is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in "Spring Open" up
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Moving the first competition up records nothing
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block A" in "Spring Open" up
      Then nothing more is recorded of the tournament

  Rule: The way to move it is up or down

    Scenario: A way that is neither is refused
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in "Spring Open" "sideways"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "MoveCompetition.NoSuchDirection"

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: Moving an archived competition is refused as the tournament refuses it
      Given "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in "Spring Open" up
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: Moving a competition the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" moves a competition "Spring Open" does not have up
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Moving a competition in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in "Spring Open" up
      Then it is refused with "Tournament.Archived"

  Rule: Only a competition in a tournament there is can be moved

    Scenario: Moving a competition in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" moves the competition "Block B" in a tournament there is not up
      Then it is refused with "MoveCompetition.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" moves the competition "Block B" in "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" moves the competition "Block B" in "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account moves nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account moves the competition "Block B" in "Spring Open" up
      Then it is refused with "Account.Forgotten"
