Feature: The sport a tournament is played in

  A tournament is played in a sport, and there are five: Association
  Croquet, Golf Croquet, American 6 Wicket, Ricochet and Gateball. A sport is
  known by its code and shown by its name, and each code is the short form a
  player already knows it by: "ac" for Association Croquet, "gc" for Golf
  Croquet, "a6w" for American 6 Wicket, "rc" for Ricochet and "gb" for
  Gateball.

  The codes are given rather than worked out from the names, because the
  short forms players use are not a rule applied to the names: American 6
  Wicket is "a6w", and Ricochet is "rc" rather than "r".

  A code that is not one of the five is refused rather than taken as the
  nearest: a tournament in a sport there is not would be scored by rules
  nobody has written. A code is read from an address or a record of a
  tournament rather than typed by a reader, so it is taken exactly as it is
  written, and "AC" is not Association Croquet.

  Two sports are the same sport when their codes are.

  Which sports a site offers is not the sport's to say. That is the set of
  sports, and is specified with it.

  Rule: There are five sports

    Scenario Outline: A sport there is is accepted
      When the sport "<code>" is made
      Then it is not refused

      Examples:
        | code |
        | ac   |
        | gc   |
        | a6w  |
        | rc   |
        | gb   |

    Scenario Outline: A code that is no sport's is refused
      When the sport "<code>" is made
      Then it is refused for breaking "Sport.Unknown"

      Examples:
        | code |
        | xx   |
        | AC   |
        | r    |

    Scenario: No code at all is refused
      When the sport "" is made
      Then it is refused for breaking "Sport.Missing"

  Rule: A sport is shown by its name

    Scenario Outline: A sport has the name its code stands for
      Given the sport "<code>"
      Then the sport's name is "<name>"

      Examples:
        | code | name                |
        | ac   | Association Croquet |
        | gc   | Golf Croquet        |
        | a6w  | American 6 Wicket   |
        | rc   | Ricochet            |
        | gb   | Gateball            |

  Rule: Two sports are the same when their codes are

    Scenario: Sports with the same code are the same sport
      Given the sport "gc"
      When it is compared with the sport "gc"
      Then they are the same sport

    Scenario: Sports with different codes are different sports
      Given the sport "ac"
      When it is compared with the sport "gc"
      Then they are different sports

  Rule: Association and golf croquet have world rankings

    Of the sports there are, only association croquet and golf croquet keep
    a list of players across the world, so only a player of one of them has a
    name the world rankings know them by to ask for
    (`WorldRankingName.feature`). Wherever a feature says a sport has world
    rankings, as the world ranking officers' lists do, it means this: that its
    players are known to them by name. Whether a tournament counts towards
    them is the next rule's.

    Scenario Outline: A sport has world rankings, or not
      When the sport "<code>" is made
      Then the sport <has> world rankings

      Examples:
        | code | has           |
        | ac   | has           |
        | gc   | has           |
        | a6w  | does not have |
        | rc   | does not have |
        | gb   | does not have |

  Rule: Association croquet, golf croquet and American 6 Wicket count towards the world rankings

    American 6 Wicket is ranked across the world as golf croquet is, and the
    old site sent its results to the rankings as golf croquet's were
    (`rankings.feature`), but its players are known to them by their own
    names, so it keeps no list of players to match them against and its
    players are never asked for a world ranking name. A tournament counts
    towards the world rankings only in a sport that does (`create.feature`).

    Scenario Outline: A sport's tournaments count towards the world rankings, or not
      When the sport "<code>" is made
      Then the sport <counts> towards the world rankings

      Examples:
        | code | counts         |
        | ac   | counts         |
        | gc   | counts         |
        | a6w  | counts         |
        | rc   | does not count |
        | gb   | does not count |
