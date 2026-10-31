@postgres
Feature: Adding several players to a tournament at once

  A manager of the tournament can add a list of players to it in one go, and
  the account they are signed in to is who added them. The list is the names
  of the fields, as they were written, and a row of values for each player.
  Every player is added as `AddPlayer` adds one (`AddPlayer.feature`), in the
  order the rows were written, and the answer is their ids in that order.

  The list is added whole or not at all. It is asked about before anything is
  kept, and every fault in it is reported, not only the first, since a list
  that had to be sent once for each fault would be a poor way to be told. A
  fault is refused with `Request.Invalid` and the rules broken, each reading
  `fields` for the names of the fields, `rows` for there being no players, or
  `rows.` and the place of the player in the list, counting from 0, for a
  player. A list whose fields are wrong is not asked about its players, since
  what a value is of depends on its field.

  Names the tournament refuses are refused the same way, one for each player
  who has a name another has, whether the tournament had them already or an
  earlier row of the list does. Only a manager of the tournament can ask, and
  the tournament need exist: these are `AddPlayer`'s and are not described
  again here.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every player of a sound list is added, in the order they were written

    Scenario: Each player is one of the tournament's players
      Given the fields "Name"
      And the row "Sam Someone"
      And the row "Alex Another"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament has the player "Sam Someone"
      And the tournament has the player "Alex Another"

    Scenario: The answer has an id for each player
      Given the fields "Name"
      And the row "Sam Someone"
      And the row "Alex Another"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the answer is 2 ids

    Scenario: The fields may be in any order and in any case
      Given the fields "representing, NAME"
      And the row "Canterbury Croquet Club, Sam Someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament's player "Sam Someone" represents "Canterbury Croquet Club"

    Scenario: Every value is trimmed
      Given the fields " Name , Flag "
      And the row "  Sam Someone  ,  nz  "
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament's player "Sam Someone" flies the flag "nz"

    Scenario: A player with nothing for a field has nothing for it
      Given the fields "Name, Flag"
      And the row "Sam Someone,"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament's player "Sam Someone" flies no flag

    Scenario: A player with no world ranking name is known by their name
      Given the fields "Name"
      And the row "Sam Someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament's player "Sam Someone" has the world ranking name "Sam Someone"

  Rule: A list whose fields are wrong is refused before its players are asked about

    Scenario Outline: A list whose fields are wrong is refused for it
      Given the fields "<fields>"
      And the row "Sam Someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And it reads the field "fields"

      Examples:
        | fields       | code                          |
        | Representing | AddPlayers.NameMissing        |
        | Name, Team   | AddPlayers.FieldNotAllowed    |
        | Name, name   | AddPlayers.FieldRepeated      |

    Scenario: A list with no fields is refused
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddPlayers.FieldsMissing"

    Scenario: A list with no players is refused
      Given the fields "Name"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddPlayers.PlayersMissing"

  Rule: Every player has a value for each field, even if it is nothing

    Scenario Outline: A player with too few or too many values is refused
      Given the fields "Name, Representing"
      And the row "<row>"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddPlayers.ValuesMismatched"
      And it reads the field "rows.0"

      Examples:
        | row                         |
        | Sam Someone                 |
        | Sam Someone, Canterbury, nz |

  Rule: Every player is held to what AddPlayer holds one to

    Scenario Outline: A value that breaks a rule is refused for it, on its player
      Given the fields "Name, Flag, Handicap"
      And the row "Alex Another,,"
      And the row "<name>,<flag>,<handicap>"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And it reads the field "rows.1"
      And no other rule is broken

      Examples:
        | name        | flag | handicap | code                               |
        | Sa          |      |          | PersonName.TooShort                |
        | Bye         |      |          | TournamentPlayer.NamedBye          |
        | Sam Someone | zz   |          | TournamentPlayer.NoSuchFlag        |
        | Sam Someone |      | four     | TournamentPlayer.HandicapMalformed |

    Scenario: Every player who breaks a rule is told of it
      Given the fields "Name"
      And the row "Sa"
      And the row "Alex Another"
      And the row "Bye"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the first rule broken is "PersonName.TooShort"
      And it reads the field "rows.0"
      And the next rule broken is "TournamentPlayer.NamedBye"
      And it reads the field "rows.2"

    Scenario: A player who breaks a rule leaves nobody added
      Given the fields "Name"
      And the row "Sam Someone"
      And the row "Sa"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament has no players

  Rule: A name the tournament refuses is refused for its player, and nobody is added

    Scenario: A name another player has is refused
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the fields "Name"
      And the row "SAM SOMEONE"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Tournament.PlayerNameTaken"
      And it reads the field "rows.0"

    Scenario: A name an earlier row has is refused
      Given the fields "Name"
      And the row "Sam Someone"
      And the row "sam someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the first rule broken is "Tournament.PlayerNameTaken"
      And it reads the field "rows.1"

    Scenario: Every name that is taken is told of
      Given the fields "Name"
      And the row "Sam Someone"
      And the row "sam someone"
      And the row "SAM SOMEONE"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the first rule broken is "Tournament.PlayerNameTaken"
      And it reads the field "rows.1"
      And the next rule broken is "Tournament.PlayerNameTaken"
      And it reads the field "rows.2"

    Scenario: A list with a name taken leaves nobody added
      Given the fields "Name"
      And the row "Alex Another"
      And the row "Sam Someone"
      And the row "Sam Someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then the tournament has no players

  Rule: The tournament's other refusals hold for every player alike

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the fields "Name"
      And the row "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the fields "Name"
      And the row "Sam Someone"
      When the reader signed in to the account for "organiser@example.com" adds the listed players to "Spring Open"
      Then it is refused with "Tournament.Archived"
