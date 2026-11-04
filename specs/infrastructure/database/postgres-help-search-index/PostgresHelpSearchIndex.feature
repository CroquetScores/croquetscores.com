@postgres
Feature: Keeping the help searchable in Postgres

  Everything the application wants of searching the help is specified with
  the searching, and this is held to those scenarios. What is here is what
  keeping the index in Postgres adds: how a page is weighed, how the index is
  made again, and what it does when nothing was built.

  A title says more about a page than a heading, and a heading more than a
  paragraph, so a word in a title ranks a page above the same word further
  down it. The words are searched by the rules of the page's own language, so
  a Swedish page is never matched by English endings.

  The index is made again whole, in one transaction, and not by changing the
  rows that differ. The help is a few hundred pages that change when the site
  is built, never while it is read, and a whole replacement cannot leave the
  index half of one build and half of another. A reader searching while it
  happens sees all of the old index or all of the new.

  Rule: A word in a title ranks a page above the same word in its text

    Scenario: A title beats a paragraph
      Given an index of the help
      And the english page "b" titled "Players" saying "Nothing here."
      And the english page "a" titled "Scores" saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then the first result is the page "b"
      And the second result is the page "a"

    Scenario: A heading beats a paragraph
      Given an index of the help
      And the english page "b" titled "Scores" with the heading "Adding a player" saying "Nothing here."
      And the english page "a" titled "Notes" saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then the first result is the page "b"

  Rule: A word is matched by the rules of the language of the page

    Scenario: An ending is not part of the word
      Given an index of the help
      And the english page "a" titled "Scores" saying "A player was withdrawn."
      When the index is made
      And "players" is searched for in english
      Then the first result is the page "a"

    Scenario: Only the language asked for is searched
      Given an index of the help
      And the english page "a" titled "Players" saying "Nothing here."
      And the german page "a" titled "Spieler" saying "Nothing here."
      When the index is made
      And "players" is searched for in english
      Then there is one result

    Scenario: A language Postgres has no rules for is matched as written
      Given an index of the help
      And the welsh page "a" titled "Chwaraewyr" saying "Nothing here."
      When the index is made
      And "chwaraewyr" is searched for in welsh
      Then the first result is the page "a"

  Rule: What comes back says where to read it

    Scenario: A result has its title
      Given an index of the help
      And the english page "tournament-managers/players" titled "Players" saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then the title of the first result is "Players"

    Scenario: A result has the page's name
      Given an index of the help
      And the english page "tournament-managers/players" titled "Players" saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then the page of the first result is "tournament-managers/players"

    Scenario: A result has a snippet showing the words matched
      Given an index of the help
      And the english page "a" titled "Scores" saying "Before a game, add a player to the competition."
      When the index is made
      And "player" is searched for in english
      Then the snippet of the first result says "player"

    Scenario: A page found by its title has the matching word marked in its snippet
      Given an index of the help
      And the english page "a" titled "Players" saying "Nothing here."
      When the index is made
      And "player" is searched for in english
      Then the snippet of the first result marks "Players"

    Scenario: A page found by a heading has the matching word marked in its snippet
      Given an index of the help
      And the english page "a" titled "Scores" with the heading "Adding a player" saying "Nothing here."
      When the index is made
      And "player" is searched for in english
      Then the snippet of the first result marks "player"

    Scenario: A result has a score
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then the score of the first result is more than 0

    Scenario: No more than ten results come back
      Given an index of the help
      And 12 english pages saying "Add a player."
      When the index is made
      And "player" is searched for in english
      Then there are 10 results

  Rule: The index is made again whole

    Scenario: A page no longer in the help is no longer found
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the index is made
      And the english page "a" is no longer in the help
      When the index is made
      And "player" is searched for in english
      Then there are no results

    Scenario: A build that fails to be read leaves the old index
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the index is made
      And a help that cannot be read
      When the index is made
      Then the index is made with the error "HelpSearchIndex.Unreadable"
      And "player" is searched for in english
      And the first result is the page "a"

    Scenario: Making it again when nothing changed changes nothing
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the index is made
      When the index is made
      Then the index was not made again

    Scenario: Making it again when the pages kept have been lost
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the index is made
      And the pages kept are lost
      When the index is made
      Then the index was made again

    Scenario: Making it again when some of the pages kept have been lost
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the english page "b" titled "Scores" saying "Add a score."
      And the index is made
      And the page kept as "a" is lost
      When the index is made
      And "player" is searched for in english
      Then the first result is the page "a"

    Scenario: Making it again when a page changed is noticed
      Given an index of the help
      And the english page "a" titled "Players" saying "Add a player."
      And the index is made
      And the english page "a" titled "Players" saying "Add a competitor."
      When the index is made
      Then the index was made again

  Rule: A help that was never built is searched without failing

    Scenario: Nothing was built
      Given an index of the help
      And a help with no pages
      When the index is made
      And "player" is searched for in english
      Then there are no results
