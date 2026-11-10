@postgres
Feature: A page says what it is, in its title and in what a link to it shows

  A tournament found by a search, or shared in a message, is shown by its
  title and a line beneath: what a search engine prints, and what a message
  shows beside the link. A page with only a name for a title and no line
  beneath leaves the reader to guess what is behind it, and a link that shows
  nothing but an address is one few will follow. So every page says what it
  is: a title, a description, and the same said again for the places that read
  Open Graph, the markup messages and social sites use to make a preview of a
  link.

  A title says what the page is and which site it is on, "Spring Open — Croquet
  Scores", with the site's name last so that the part that tells pages apart is
  the part a narrow tab or a search result shows first. The home page is the
  site and says only that. The site's name is the site's own, Croquet Scores or
  Gateball Scores, and not a word of the page's.

  A description is a sentence in the language the page is in, made from what
  the page is of, and no longer than a search result shows whole: a hundred and
  sixty characters, shortened at a word with an ellipsis where it would be
  longer. A tournament's says its name, its sport, where it is played and when,
  and leaves out whichever of those it does not have rather than saying
  "unknown". A year's and a sport's in a year say what a reader will find
  there. The home page says what the site is. Every other page says the same as
  the home page, having nothing to say of itself that its title does not.

  The preview is the title, the description, the page's address as it names it
  (`canonicalLink.feature`), the site's name, and the language the page is in.
  It carries no picture: the site has none of a tournament, and one that was
  the same on every page would not tell a shared link from the next.

  These scenarios run against a server with tournaments kept, and say nothing
  of what else is on a page, which is each page's own.

  Rule: A page's title says what it is and which site it is on

    Scenario: A tournament's title names it and the site
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its title is "Spring Open — Croquet Scores"

    Scenario: A tournament's title on the other site names that site
      Given a tournament "Beach Open" of Gateball in 2026 on gateballscores.com
      When the page "/2026/gb/beach-open" is asked for at "gateballscores.com"
      Then its title is "Beach Open — Gateball Scores"

    Scenario: A year's title names the year and the site
      When the page "/2026" is asked for at "croquetscores.com"
      Then its title is "2026 — Croquet Scores"

    Scenario: A sport's title in a year names the sport, the year and the site
      When the page "/2026/ac" is asked for at "croquetscores.com"
      Then its title is "Association Croquet 2026 — Croquet Scores"

    Scenario: The home page's title is the site's name
      When the page "/" is asked for at "croquetscores.com"
      Then its title is "Croquet Scores"

    Scenario: A title ends with the site's name in any language
      When the page "/2026" is asked for at "croquetscores.com" in the language "cs"
      Then its title ends with " — Croquet Scores"

  Rule: A tournament's description says its name, its sport, where it is played and when

    Scenario: A tournament's description names it
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its description names "Spring Open"

    Scenario: A tournament's description names its sport
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its description names "Association Croquet"

    Scenario: A tournament's description names where it is played
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is played in New Zealand
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its description names "New Zealand"

    Scenario: A tournament's description says when it is played
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is played from 12 March 2026 to 14 March 2026
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its description names "12-14 Mar 2026"

    Scenario: A tournament with no country says nothing of where
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its description does not name "unknown"

    Scenario: A tournament's description is in the reader's language
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is played in New Zealand
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com" in the language "cs"
      Then its description names the country as it is said in "cs"

  Rule: A year's, a sport's and the home page's descriptions say what a reader will find

    Scenario: A year's description names the year
      When the page "/2026" is asked for at "croquetscores.com"
      Then its description names "2026"

    Scenario: A sport's description in a year names the sport
      When the page "/2026/ac" is asked for at "croquetscores.com"
      Then its description names "Association Croquet"

    Scenario: A sport's description in a year names the year
      When the page "/2026/ac" is asked for at "croquetscores.com"
      Then its description names "2026"

    Scenario: The home page's description names the site
      When the page "/" is asked for at "croquetscores.com"
      Then its description names "Croquet Scores"

    Scenario: Any other page says what the home page says
      Given the home page is asked for at "croquetscores.com"
      When the page "/terms-of-use" is asked for at "croquetscores.com"
      Then its description is the home page's

  Rule: A description is no longer than a search result shows

    Scenario: A long description is shortened
      Given a tournament with a name of 95 characters in 2026 on croquetscores.com
      And the tournament is played in South Georgia and the South Sandwich Islands
      When the page of the tournament is asked for at "croquetscores.com"
      Then its description is no longer than 160 characters

    Scenario: A shortened description ends with an ellipsis
      Given a tournament with a name of 95 characters in 2026 on croquetscores.com
      And the tournament is played in South Georgia and the South Sandwich Islands
      When the page of the tournament is asked for at "croquetscores.com"
      Then its description ends with an ellipsis

    Scenario: A shortened description is cut between words
      Given a tournament with a name of 95 characters in 2026 on croquetscores.com
      And the tournament is played in South Georgia and the South Sandwich Islands
      When the page of the tournament is asked for at "croquetscores.com"
      Then its description is cut between two words

  Rule: What is put into a description is not read as markup

    Scenario: A name with markup in it is said as it is written
      Given a tournament "Spring <b>Open</b> & Co" of Association Croquet in 2026 on croquetscores.com
      When the page of the tournament is asked for at "croquetscores.com"
      Then its description names "Spring <b>Open</b> & Co"

    Scenario: A name with markup in it does not break out of the description
      Given a tournament "Spring <b>Open</b> & Co" of Association Croquet in 2026 on croquetscores.com
      When the page of the tournament is asked for at "croquetscores.com"
      Then the page has no element made from the name

  Rule: A link to a page is previewed with what the page says

    Scenario: The preview has the page's title
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its preview title is "Spring Open — Croquet Scores"

    Scenario: The preview has the page's description
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open" is asked for at "croquetscores.com"
      Then its preview description is its description

    Scenario: The preview has the page's address
      When the page "/2026?tournaments=name" is asked for at "croquetscores.com"
      Then its preview address is "https://croquetscores.com/2026"

    Scenario: The preview is of a website
      When the page "/" is asked for at "croquetscores.com"
      Then its preview type is "website"

    Scenario: The preview names the site
      When the page "/" is asked for at "croquetscores.com"
      Then its preview site is "Croquet Scores"

    Scenario Outline: The preview has the language the page is in
      When the page "/" is asked for at "croquetscores.com" in the language "<language>"
      Then its preview language is "<locale>"

      Examples:
        | language | locale |
        | en       | en_US  |
        | cs       | cs_CZ  |

    Scenario: The preview has no picture
      When the page "/" is asked for at "croquetscores.com"
      Then it has no preview picture

    Scenario: The preview is a summary
      When the page "/" is asked for at "croquetscores.com"
      Then its card is a summary

  Rule: An answer that is not a page to be found says nothing of itself

    Scenario Outline: Some answers have no description or preview
      When the page "<path>" is asked for at "croquetscores.com"
      Then it has no description
      And it has no preview

      Examples:
        | path                 |
        | /2026/ac/no-such-one |
        | /api/site/session    |
