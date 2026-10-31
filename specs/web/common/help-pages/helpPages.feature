Feature: Help written in markdown becomes pages of the site

  The help is written as markdown in docs/help, one folder for each language,
  and is read on the site as pages. Each page names the others by the file
  they are written in, and shows its pictures by where they sit among the
  files, because that is how it reads where it is written. On the site neither
  means anything, so each is turned into where the page or the picture is
  found.

  The pictures are kept once, among the English pages, and the other languages
  point at them there. They are found at one place whatever language the page
  is in.

  Rule: A page is turned into the words and headings it was written with

    Scenario: A heading stays a heading
      Given help page "# Players"
      When the help page is converted
      Then the page has the heading "Players"

    Scenario: The title of a page is its first heading
      Given help page "# Players" followed by "## Adding a player"
      When the help page is converted
      Then the title of the page is "Players"

    Scenario: A page that begins with a lesser heading is called by it
      Given help page "## Adding a player"
      When the help page is converted
      Then the title of the page is "Adding a player"

    Scenario: A tag written in the markdown is shown as written
      Given help page "A <script>alert(1)</script> in the text"
      When the help page is converted
      Then the page has no script

  Rule: A heading can be given a bookmark, so that an address leads straight to it

    The bookmark is written at the end of the heading, in braces, and is the
    same in every language, since the heading's own words are translated and a
    link to it must not depend on them. The braces are not shown.

    Scenario: A heading written with a bookmark has it
      Given help page "## Adding many {#adding-many}"
      When the help page is converted
      Then the heading "Adding many" has the bookmark "adding-many"

    Scenario: The bookmark is not shown in the heading
      Given help page "## Adding many {#adding-many}"
      When the help page is converted
      Then the page has the heading "Adding many"

    Scenario: A heading written with no bookmark has none
      Given help page "## Adding many"
      When the help page is converted
      Then the heading "Adding many" has no bookmark

    Scenario: Words in braces that are not a bookmark are shown as written
      Given help page "## Adding many {not a bookmark}"
      When the help page is converted
      Then the page has the heading "Adding many {not a bookmark}"

  Rule: A link to another page is turned into where that page is found

    Scenario: A link to a page beside it
      Given help page "[Players](players.md)" at "tournament-managers/standard-tournament/index.md"
      When the help page is converted
      Then the page links to "/help/tournament-managers/standard-tournament/players"

    Scenario: A link to the index of a folder
      Given help page "[Managers](../index.md)" at "tournament-managers/standard-tournament/index.md"
      When the help page is converted
      Then the page links to "/help/tournament-managers"

    Scenario: A link to the first page of the help
      Given help page "[Help](../../index.md)" at "tournament-managers/standard-tournament/index.md"
      When the help page is converted
      Then the page links to "/help"

    Scenario: A link to another part of the site is left alone
      Given help page "[here](/account/register)" at "tournament-managers/standard-tournament/index.md"
      When the help page is converted
      Then the page links to "/account/register"

  Rule: A picture is turned into where the one copy of it is found

    Scenario: A picture beside an English page
      Given help page "![Scores](images/scores.png)" at "tournament-managers/standard-tournament/scores.md"
      When the help page is converted
      Then the page shows the picture "/help/images/tournament-managers/standard-tournament/scores.png"

    Scenario: A picture reached from a page in another language
      Given help page "![Scores](../../../english/tournament-managers/standard-tournament/images/scores.png)" at "tournament-managers/standard-tournament/scores.md"
      When the help page is converted
      Then the page shows the picture "/help/images/tournament-managers/standard-tournament/scores.png"
