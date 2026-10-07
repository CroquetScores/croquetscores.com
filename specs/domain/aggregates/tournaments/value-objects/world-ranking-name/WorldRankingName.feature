Feature: The name a player is known by in the world rankings

  A player's results are sent to the world rankings, which know each player
  by a name of their own: the name the rankings already have for them, which
  is not always the name a tournament knows them by, as "Bob Jackson" may be
  "Robert Jackson" there. So a player may have a world ranking name as well as
  their name (`TournamentPlayer.feature`, `TeamPlayer.feature`). Only croquet's
  world rankings are kept, so it is asked for only in a tournament of
  association or golf croquet (`player.feature`), and is optional.

  It is a person's name, asked what a person's name is asked
  (`PersonName.feature`): between 3 and 254 characters, counted as a reader
  counts them, with the whitespace at either end taken off. It is refused
  with codes of its own, `WorldRankingName.TooShort` and
  `WorldRankingName.TooLong`, so that a form can say which of its fields was
  refused when a player's name and their world ranking name are typed in the
  same one.

  One left blank, or nothing but whitespace, is no world ranking name, and
  the player has none.

  Rule: A world ranking name is between 3 and 254 characters

    Scenario Outline: A world ranking name of an allowed length is accepted
      When a world ranking name of <length> characters is made
      Then it is not refused

      Examples:
        | length |
        | 3      |
        | 254    |

    Scenario: A world ranking name shorter than 3 characters is refused
      When a world ranking name of 2 characters is made
      Then it is refused for breaking "WorldRankingName.TooShort"

    Scenario: A world ranking name longer than 254 characters is refused
      When a world ranking name of 255 characters is made
      Then it is refused for breaking "WorldRankingName.TooLong"

    Scenario: The spaces around a world ranking name do not count toward its length
      When the world ranking name "  Bob  " is made
      Then it is not refused

  Rule: Whitespace at either end is not part of the world ranking name

    Scenario: A world ranking name with spaces around it is kept without them
      When the world ranking name "  Robert Jackson  " is made
      Then the world ranking name is written "Robert Jackson"

  Rule: A world ranking name left blank is none

    Scenario: An empty world ranking name is none
      When the world ranking name "" is made
      Then there is no world ranking name

    Scenario: A world ranking name of nothing but whitespace is none
      When the world ranking name "   " is made
      Then there is no world ranking name
