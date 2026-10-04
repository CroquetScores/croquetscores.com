@browser
Feature: What every page is set in

  Every page the site serves is set in the same shell: the site's own bars
  around whatever the page itself says. What the bars say in the reader's
  language is `language.feature`'s; this is what the shell puts round a page
  according to the website it is served as (`Website.feature`).

  Rule: A try website says on every page that it is a safe place to learn

    A try website is where a reader learns the system, and what they put in
    it may be cleared away at any time so that the next reader starts fresh.
    A reader who has come to one by a link, or who has forgotten which of the
    two they opened, has to be able to see which they are in before they
    spend an afternoon entering a real tournament where it will not be kept.
    So every page of a try website says so, in a banner the shell puts above
    the page rather than in any page's own words, since a page the reader
    arrives at directly is as much in need of it as the home page.

    The banner says one thing, so its words are one phrase of the catalogue
    and are in the reader's language like everything else in the bars.

    Nowhere else shows it. The real websites are where tournaments are kept,
    and development is Croquet Scores as readers have it, so that a page
    worked on there looks as it will where it is served.

    @postgres
    Scenario Outline: A try website says so on its home page
      Given a viewport 1200 pixels wide
      And a site served as "<host>"
      When the home page is opened
      Then the page carries the try website's banner

      Examples:
        | host                   |
        | try.croquetscores.com  |
        | try.gateballscores.com |

    Scenario: A try website says so on a page reached directly
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      When the sign in page is opened
      Then the page carries the try website's banner

    Scenario: A try website says so on a page saying something went wrong
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      When a page that is not there is opened
      Then the page carries the try website's banner

    @postgres
    Scenario Outline: Any other website does not
      Given a viewport 1200 pixels wide
      And a site served as "<host>"
      When the home page is opened
      Then the page carries no try website's banner

      Examples:
        | host               |
        | croquetscores.com  |
        | gateballscores.com |
        | localhost:3000     |

    @postgres
    Scenario: The banner is in the reader's language
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      And a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the try website's banner is in the test locale

  Rule: On a tournament's pages the header names the tournament beneath the site's name

    A reader following a tournament moves between its pages, its games, its
    players, a player, a block's views, and the page's own heading is often
    not the tournament's name but a player's or a block's. So on every page of
    a tournament the header names the tournament beneath the site's name, set
    as the site's name is, so that the two read as one title, and leads to the
    tournament's page as the site's name leads to the home page. It is in the
    pinned bar, so it stays in sight while the page scrolls.

    Nowhere else names a tournament there: a page of no one tournament, such
    as the home page or a year's, has the site's name alone.

    Background:
      Given a viewport 1200 pixels wide
      And a site served as "croquetscores.com"
      And the server's clock reads "2026-10-03T10:00:00Z"
      And "organiser@example.com" has an account, confirmed
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"

    @postgres
    Scenario Outline: Every page of a tournament names it in the header
      When the page at "<address>" is opened
      Then the header names the tournament "Spring Open"

      Examples:
        | address                                                 |
        | /2026/ac/spring-open                                    |
        | /2026/ac/spring-open/players                            |
        | /2026/ac/spring-open/players/sam-someone                |
        | /2026/ac/spring-open/competitions/block-a               |
        | /2026/ac/spring-open/competitions/block-a/summary       |
        | /2026/ac/spring-open/competitions/block-a/order-of-play |

    @postgres
    Scenario: The tournament is beneath the site's name
      When the page at "/2026/ac/spring-open" is opened
      Then the tournament named in the header is beneath the site's name

    @postgres
    Scenario: The tournament is set as the site's name is
      When the page at "/2026/ac/spring-open" is opened
      Then the tournament named in the header is set as the site's name is

    @postgres
    Scenario: The tournament named in the header leads to its page
      Given the page at "/2026/ac/spring-open/players" is open
      When the tournament named in the header is pressed
      Then the address is "/2026/ac/spring-open"

    @postgres
    Scenario: The home page names no tournament in the header
      When the home page is opened
      Then the header names no tournament

    @postgres
    Scenario: A year's page names no tournament in the header
      When the page at "/2026" is opened
      Then the header names no tournament
