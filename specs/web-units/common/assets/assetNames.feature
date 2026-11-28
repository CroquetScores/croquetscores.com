Feature: A file is named for what is in it, and read again only when it may have changed

  What `readAssets` in `assets.ts` does, which `assets.feature` does not
  describe: that one is about how often the files are asked for, and this is
  about what they are called.

  Every file the site serves carries a short code made from its contents in its
  name, so that a name that has not changed cannot have changed its file, and a
  reader's browser can keep it for a year (`assets.feature`). A file that
  changes is given a new name, and a reader is given the new file the next time
  they ask for a page.

  Finding the code means reading every file, and the site does it each time it
  is built. That is once, in life, and is not noticed. A spec run builds the
  site again for each scenario that needs one of its own, and the reading was
  about a third of what a build took. So a file is read again only when what
  the machine says of it, its size and the time it was last changed, is not
  what it said the last time. A file that has been changed without either
  moving is not seen to have changed. A deploy puts files down at times far
  apart from those of the files it replaces, so it is not a case the site meets,
  and it is said here so that nobody is surprised by it.

  Background:
    Given a folder of the site's files
    And the file "site.css" says "body { color: red }"

  Rule: A file's name carries a code made from its contents

    Scenario: A file is named with a code in it
      When the files are read
      Then the name of "site.css" has a code in it
      And the name of "site.css" ends in ".css"

    Scenario: Two files with different contents are given different codes
      Given the file "other.css" says "body { color: blue }"
      When the files are read
      Then "site.css" and "other.css" have different codes

    Scenario: Two files with the same contents are given the same code
      Given the file "other.css" says "body { color: red }"
      When the files are read
      Then "site.css" and "other.css" have the same code

    Scenario: A file is given the same name each time the files are read
      When the files are read
      And the files are read again
      Then "site.css" has the same name as it had

  Rule: A file that has changed is given a new name

    Scenario: A file whose contents have changed is named differently
      Given the files have been read
      When the file "site.css" is changed to say "body { color: blue }"
      And the files are read again
      Then "site.css" has a different name from the one it had

    Scenario: A file changed to something of the same length is named differently
      Given the files have been read
      When the file "site.css" is changed to say "body { color: tan }"
      And the files are read again
      Then "site.css" has a different name from the one it had

    Scenario: A file that has been added is given a name
      Given the files have been read
      When the file "new.css" is added saying "body { color: green }"
      And the files are read again
      Then the name of "new.css" has a code in it

  Rule: A file that looks as it did is not read again

    Scenario: A file changed without its size or time moving keeps its name
      Given the files have been read
      When the file "site.css" is changed to say "body { color: tan }" without its size or time moving
      And the files are read again
      Then "site.css" has the same name as it had
