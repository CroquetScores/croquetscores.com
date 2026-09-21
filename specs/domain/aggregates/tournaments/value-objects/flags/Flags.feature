Feature: The flags there are

  A tournament flies a flag, and the flags it can fly are the images of them
  kept under assets/images: famfamfam's, one for each country, and the Isle
  of Man's and Jersey's beside them. The paths of those images are written
  down once, in the code, and the flags there are are made from that list.

  Each image is one flag. Its name is the image's file name less its
  extension, and its relative path is where the image is under
  assets/images, so "famfamfam/flags/au.png" is the flag "au". A file that
  is not a PNG is not an image of a flag, and is passed over.

  The list is written down rather than read from the folder, because the
  domain reads no files, and a list in the code is there without anything
  having to read it first. What a list written down can do is fall out of
  step with the images, so the last rule holds the two to each other: every
  image under assets/images is a flag there is, and every flag there is has
  its image there. An image added without its flag, or a flag left behind
  when its image is taken away, is found before a page tries to show it.

  An image that cannot be a flag is refused rather than passed over. A flag
  that silently went missing would be found only by the tournament that
  could not fly it. For the same reason two images with the same name are
  refused: a flag is known by its name, and there is no saying which of the
  two a tournament meant.

  A flag is found by its name as a flag is known by it, so "AU" finds
  Australia's. A name that no flag has finds nothing, and so does one that
  could never be a flag: it is not a flag there is, and that is the whole of
  the answer.

  Rule: Each image is one flag

    Scenario: An image is the flag named for its file
      Given the file "famfamfam/flags/au.png"
      When the flags are made
      Then there is a flag "au"

    Scenario: A flag's relative path is where its image is under assets/images
      Given the file "famfamfam/flags/au.png"
      When the flags are made
      And the flag "au" is found
      Then its relative path is "famfamfam/flags/au.png"

    Scenario: An image kept apart from the rest is a flag as well
      Given the file "sam-murray/je.png"
      When the flags are made
      And the flag "je" is found
      Then its relative path is "sam-murray/je.png"

    Scenario: A file that is not a PNG is not a flag
      Given the file "famfamfam/flags/readme.txt"
      When the flags are made
      Then there is no flag "readme"

  Rule: An image that cannot be a flag is refused

    Scenario: An image whose name is not letters alone is refused
      Given the file "famfamfam/flags/a-u.png"
      When the flags are made
      Then it is refused for breaking "Flag.NotLetters"

    Scenario: Two images with the same name are refused
      Given the file "famfamfam/flags/je.png"
      And the file "sam-murray/je.png"
      When the flags are made
      Then it is refused for breaking "Flags.SameNameTwice"

  Rule: A flag is found by its name

    Scenario: A flag is found by a name in capitals
      Given the file "famfamfam/flags/au.png"
      When the flags are made
      Then there is a flag "AU"

    Scenario: A name no flag has finds nothing
      Given the file "famfamfam/flags/au.png"
      When the flags are made
      Then there is no flag "nz"

    Scenario: A name that could never be a flag finds nothing
      Given the file "famfamfam/flags/au.png"
      When the flags are made
      Then there is no flag "../au"

  Rule: The flags are in order of their names

    Scenario: The flags come in order of their names, whatever order their images came in
      Given the file "famfamfam/flags/nz.png"
      And the file "sam-murray/je.png"
      And the file "famfamfam/flags/au.png"
      When the flags are made
      Then the first flag is "au"
      And the second flag is "je"
      And the third flag is "nz"
      And there are no more flags

  Rule: The flags there are are the images under assets/images

    Scenario: Every image under assets/images is a flag there is
      Given the flags there are
      Then every image under assets/images is one of them

    Scenario: Every flag there is has its image under assets/images
      Given the flags there are
      Then every one of them has its image under assets/images

    Scenario Outline: A flag there is is found with its image
      Given the flags there are
      When the flag "<name>" is found
      Then its relative path is "<path>"

      Examples:
        | name    | path                        |
        | au      | famfamfam/flags/au.png      |
        | england | famfamfam/flags/england.png |
        | im      | sam-murray/im.png           |
        | je      | sam-murray/je.png           |
