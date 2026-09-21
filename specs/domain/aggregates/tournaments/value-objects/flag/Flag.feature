Feature: The flag a tournament flies

  A tournament can fly a flag: the country it is played in, or the one it is
  played for, shown beside its name. A flag is known by a name, and the name
  is the name of its image — a country's two-letter code, such as "au" or
  "nz", or a word for a place that has no code of its own, such as "england"
  or "scotland".

  A flag's name is only ever lower-case letters, a to z. Every flag there is
  has a name of letters alone, so the rule turns nobody away, and a name that
  could hold anything else could never be one.

  A flag also has the relative path of its image: where the image is, from
  the folder of images, such as "famfamfam/flags/au.png". It is given rather
  than worked out from the name, because the images are not all in one place
  — the Isle of Man's and Jersey's are kept apart from the rest — and it is
  kept as it was given. A page joins it onto the folder of images to show the
  flag, so a path that begins at the root, or that climbs out through "..",
  is refused: it would name something that is not an image of a flag. A
  backslash is taken for a slash in this, as a browser takes it.

  Which flags there are is not the flag's to say. That is the set of flags,
  and is specified with it; a flag says only what its name and its path must
  be, so that a flag that could never be one is refused wherever it is made.
  A flag is the same flag as another when their names are the same; its path
  says where it is kept, not which flag it is.

  A name given in capitals, or with whitespace at either end, is the name
  somebody meant written a little differently, and is taken as that name
  rather than refused: "AU" is Australia's flag, and so is " au ".

  Rule: A flag's name is lower-case letters

    Scenario Outline: A name of letters is accepted
      When the flag "<name>" is made
      Then it is not refused

      Examples:
        | name    |
        | au      |
        | england |

    Scenario Outline: A name that is not letters alone is refused
      When the flag "<name>" is made
      Then it is refused for breaking "Flag.NotLetters"

      Examples:
        | name      |
        | a1        |
        | a-u       |
        | a u       |
        | ../au     |
        | au.png    |
        | ä         |

    Scenario: No name at all is refused
      When the flag "" is made
      Then it is refused for breaking "Flag.Missing"

  Rule: A name in capitals is the same name in lower case

    Scenario: A name given in capitals is accepted
      When the flag "AU" is made
      Then it is not refused

    Scenario: A name given in capitals is kept in lower case
      Given the flag "AU"
      Then the flag is written "au"

    Scenario: Flags whose names differ only in case are the same flag
      Given the flag "AU"
      When it is compared with the flag "au"
      Then they are the same flag

    Scenario: Flags with different names are different flags
      Given the flag "au"
      When it is compared with the flag "nz"
      Then they are different flags

  Rule: Whitespace at either end is taken off first

    Scenario: A name with spaces around it is kept without them
      Given the flag "  au  "
      Then the flag is written "au"

    Scenario: A name that is nothing but whitespace is missing
      When the flag "   " is made
      Then it is refused for breaking "Flag.Missing"

  Rule: A flag has the relative path of its image

    Scenario Outline: A path within the folder of images is accepted
      When a flag is made with the relative path "<path>"
      Then it is not refused

      Examples:
        | path                   |
        | famfamfam/flags/au.png |
        | sam-murray/je.png      |

    Scenario: The relative path is kept as it was given
      Given a flag with the relative path "famfamfam/flags/au.png"
      Then its relative path is "famfamfam/flags/au.png"

    Scenario Outline: A path that leaves the folder of images is refused
      When a flag is made with the relative path "<path>"
      Then it is refused for breaking "Flag.PathOutsideImages"

      Examples:
        | path                       |
        | /famfamfam/flags/au.png    |
        | ../au.png                  |
        | famfamfam/../../au.png     |
        | \\famfamfam\\flags\\au.png |
        | ..\\au.png                 |

    Scenario: No relative path at all is refused
      When a flag is made with the relative path ""
      Then it is refused for breaking "Flag.PathMissing"

    Scenario: Flags with the same name and different paths are the same flag
      Given the flag "au"
      And its image is at "famfamfam/flags/au.png"
      And another flag "au"
      And the other flag's image is at "elsewhere/au.png"
      When they are compared
      Then they are the same flag
