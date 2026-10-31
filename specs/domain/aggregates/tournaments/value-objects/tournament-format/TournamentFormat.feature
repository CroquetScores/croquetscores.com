Feature: The format a tournament is played in

  A tournament is played in a format, and there are five: Standard, Teams,
  Eire Cup, Interstate Shield and GC World Team Championship.

  Standard is the one format not played by teams. Teams is the general
  format for an event between teams, and the other three are particular team
  events, each kept as a format of its own rather than as Teams under another
  name, so that each can be run the way that event is run.

  A format is known by its name. A name that is not one of the five is
  refused rather than taken as the nearest one: a tournament in a format there
  is not would be run by rules nobody has written. A format is picked from a
  list rather than typed, so its name is taken exactly as it is written, and
  "standard" is not Standard.

  A format also has a code: its name in lower case, with a hyphen between
  the words, so Eire Cup is "eire-cup". The name is what a reader sees, and
  the code is what anything that is not a reader goes by, such as an address
  or a record of the tournament.

  Which formats a site offers is not the format's to say. That is the set of
  formats, and is specified with it.

  Rule: There are five formats

    Scenario Outline: A format there is is accepted
      When the format "<name>" is made
      Then it is not refused

      Examples:
        | name                       |
        | Standard                   |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

    Scenario Outline: A name that is no format is refused
      When the format "<name>" is made
      Then it is refused for breaking "TournamentFormat.Unknown"

      Examples:
        | name     |
        | Doubles  |
        | standard |
        | Eire     |

    Scenario: No name at all is refused
      When the format "" is made
      Then it is refused for breaking "TournamentFormat.Missing"

  Rule: A format is known by its name

    Scenario: A format's name is kept as it was given
      Given the format "Interstate Shield"
      Then the format's name is "Interstate Shield"

    Scenario: Formats with the same name are the same format
      Given the format "Eire Cup"
      When it is compared with the format "Eire Cup"
      Then they are the same format

    Scenario: Formats with different names are different formats
      Given the format "Standard"
      When it is compared with the format "Teams"
      Then they are different formats

  Rule: A format's code is its name in lower case, hyphenated

    Scenario Outline: A format has the code worked out from its name
      Given the format "<name>"
      Then the format's code is "<code>"

      Examples:
        | name                       | code                       |
        | Standard                   | standard                   |
        | Teams                      | teams                      |
        | Eire Cup                   | eire-cup                   |
        | Interstate Shield          | interstate-shield          |
        | GC World Team Championship | gc-world-team-championship |

  Rule: Standard is the one format not played by teams

    Scenario: Standard is not played by teams
      Given the format "Standard"
      Then it is not played by teams

    Scenario Outline: Every other format is played by teams
      Given the format "<name>"
      Then it is played by teams

      Examples:
        | name                       |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

  Rule: The Eire Cup and the Interstate Shield have no groups

    Their regulations have none, so a test in either is in no group
    (`addTest.feature`). The other formats are played in groups as often as not.

    Scenario Outline: <name> has no groups
      Given the format "<name>"
      Then it has no groups

      Examples:
        | name              |
        | Eire Cup          |
        | Interstate Shield |

    Scenario Outline: <name> has groups
      Given the format "<name>"
      Then it has groups

      Examples:
        | name                       |
        | Standard                   |
        | Teams                      |
        | GC World Team Championship |
