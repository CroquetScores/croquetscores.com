Feature: Which rules of a language the help is searched by

  The help is searched in the language it is written in, by that language's
  own rules for what a word is and what is only its ending, so that a reader
  asking about "players" finds the page that says "player".

  Postgres knows the rules of some languages and not of others. Where it has
  none, the words are matched as they are written: a reader still finds the
  page, but must type the word as the page spells it. That is a poorer search
  and not a missing one, and it is better than leaving a language out.

  Every language there are help pages for has a way of being searched, so a
  language added to the help cannot be left unsearchable by forgetting it.

  Rule: A language Postgres knows is searched by its own rules

    Scenario Outline: A language with rules of its own
      Given the help language "<language>"
      When the way to search it is chosen
      Then the help is searched by the rules of "<rules>"

      Examples:
        | language  | rules      |
        | english   | english    |
        | german    | german     |
        | spanish   | spanish    |
        | swedish   | swedish    |
        | norwegian | norwegian  |
        | portuguese | portuguese |
        | greek     | greek      |
        | egyptian  | arabic     |

  Rule: A language Postgres does not know is searched by its words as written

    Scenario Outline: A language with no rules of its own
      Given the help language "<language>"
      When the way to search it is chosen
      Then the help is searched by words as they are written

      Examples:
        | language  |
        | afrikaans |
        | czech     |
        | latvian   |
        | welsh     |

  Rule: No language there are help pages for is left without a way to be searched

    Scenario: Every folder of the help has one
      Given the folders of the help
      When the way to search each is chosen
      Then every folder has a way to be searched
