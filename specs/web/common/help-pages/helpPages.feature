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

    Scenario: A tag written in the markdown is shown as written
      Given help page "A <script>alert(1)</script> in the text"
      When the help page is converted
      Then the page has no script

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
