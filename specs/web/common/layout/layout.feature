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

  Rule: On a tournament's pages the tournament's subtitle is beneath its name in the header

    A tournament's subtitle is what its managers want every reader to know,
    whichever of its pages they are reading: where lunch is, when play
    starts, a change to the draw. So on every page of a tournament with a
    subtitle, it is shown beneath its name in the header, on a strip of the
    header's green. The strip is beneath the pinned bar rather than in it,
    and scrolls away with the page, so that a subtitle of several lines does
    not take a phone's screen from what the page itself says once reading has
    started.

    A subtitle is written in Markdown (`TournamentSubtitle.feature`) and drawn
    from it, so that a word made bold is bold and a link is a link. A web
    address written out is a link too, as it is in a comment
    (`commentary.feature`). A link in the subtitle is marked as one the site
    does not vouch for, as a comment's is, since the subtitle is written by
    whoever manages the tournament, not by the site. A line beginning with a
    number is the start of a numbered list, as Markdown has it: a comment's
    numbered turns are a commentary's own. A tournament with no subtitle has
    no strip.

    Background:
      Given a viewport 1200 pixels wide
      And a site served as "croquetscores.com"
      And the server's clock reads "2026-10-03T10:00:00Z"
      And "organiser@example.com" has an account, confirmed
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"

    @postgres
    Scenario Outline: Every page of a tournament with a subtitle shows it in the header
      Given the tournament "Spring Open" has the subtitle "Lunch is at noon"
      When the page at "<address>" is opened
      Then the header shows the subtitle "Lunch is at noon"

      Examples:
        | address                                                 |
        | /2026/ac/spring-open                                    |
        | /2026/ac/spring-open/players                            |
        | /2026/ac/spring-open/players/sam-someone                |
        | /2026/ac/spring-open/competitions/block-a               |
        | /2026/ac/spring-open/competitions/block-a/summary       |
        | /2026/ac/spring-open/competitions/block-a/order-of-play |
        | /2026/ac/spring-open/commentaries                       |

    @postgres
    Scenario: The subtitle is beneath the tournament named in the header
      Given the tournament "Spring Open" has the subtitle "Lunch is at noon"
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle in the header is beneath the tournament named there

    @postgres
    Scenario: The subtitle scrolls away with the page
      Given a viewport 1200 pixels wide and 400 pixels high
      And the tournament "Spring Open" has the subtitle "Lunch is at noon"
      And the page at "/2026/ac/spring-open" is open
      When the page is scrolled to its bottom
      Then the subtitle in the header is out of sight

    @postgres
    Scenario: A word made bold in the subtitle is drawn bold
      Given the tournament "Spring Open" has the subtitle "Lunch is at **noon**"
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle in the header draws "noon" bold

    @postgres
    Scenario: A link in the subtitle leads where it says
      Given the tournament "Spring Open" has the subtitle "See [the draw](https://example.com/draw)"
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle's link "the draw" leads to "https://example.com/draw"

    @postgres
    Scenario: A web address written out in the subtitle is a link
      Given the tournament "Spring Open" has the subtitle "Results at https://example.com/results"
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle's link "https://example.com/results" leads to "https://example.com/results"

    @postgres
    Scenario: A link in the subtitle is one the site does not vouch for
      Given the tournament "Spring Open" has the subtitle "See [the draw](https://example.com/draw)"
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle's link "the draw" is marked as not vouched for

    @postgres
    Scenario: A line beginning with a number in the subtitle begins a numbered list
      Given the tournament "Spring Open" has the subtitle:
        """
        1. Register
        2. Play
        """
      When the page at "/2026/ac/spring-open" is opened
      Then the subtitle in the header is a numbered list of 2 items

    @postgres
    Scenario: A tournament with no subtitle shows none in the header
      When the page at "/2026/ac/spring-open" is opened
      Then the header shows no subtitle
