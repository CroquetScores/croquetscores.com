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

  Rule: The footer says which version of the website the page came from

    A reader who reports a problem can say which build they were looking at,
    and an operator who has just deployed can see on any page that the new
    build is the one being served (`buildVersion.feature` says what the number
    is). It is a number in the footer's own line, small, after the copyright.

    It is not in any language: a number is the same in every one of them, and
    a word beside it would have to be put into all of them for the sake of a
    line nobody reads except to say it back. Every page has it, the admin's
    among them, since the footer is the shell's and not any page's.

    Where the site has no version, as in development, the footer says nothing
    of one. It does not say "unknown", which would be one more thing on every
    page for the sake of saying that nothing is known.

    Scenario: The footer carries the version
      Given a viewport 1200 pixels wide
      And a site running version 276
      When the sign in page is opened
      Then the footer carries the version "v276"

    Scenario: The admin's footer carries it too
      Given a viewport 1200 pixels wide
      And a site running version 276
      And a reader signed in as "someone@example.com"
      When the admin is opened
      Then the footer carries the version "v276"

    Scenario: A page saying something went wrong carries it
      Given a viewport 1200 pixels wide
      And a site running version 276
      When a page that is not there is opened
      Then the footer carries the version "v276"

    Scenario: The version is the same in every language
      Given a viewport 1200 pixels wide
      And a site running version 276
      And a browser that asks for "en-XA"
      When the sign in page is opened
      Then the footer carries the version "v276"

    Scenario: A site with no version says nothing of one
      Given a viewport 1200 pixels wide
      And a site running no version
      When the sign in page is opened
      Then the footer carries no version

  Rule: The footer offers a link to report a bug

    A reader who finds something wrong has somewhere to say so on every page:
    a link in the footer, called Report a bug, which opens a new email to the
    administrator's email address, the one the site is set up with. Nothing is
    sent from the site, as with the link that writes to a tournament's
    managers.

    The email has a subject already, so that whoever reads it knows which site
    and which build it is about: the site's name, the version of the website
    where it is known, and the word Bug, as "Croquet Scores 276 Bug". Where
    the site has no version, as in development, the subject has no number in
    it. The link's words are the reader's language's; the subject is the
    administrator's to read, and is the same in every one of them.

    Every page has it, the admin's among them, since the footer is the shell's
    and not any page's.

    Scenario: The footer offers the link
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      When the sign in page is opened
      Then the footer offers the link "Report a bug"

    Scenario: The link writes to the administrator
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      When the sign in page is opened
      Then the bug report is addressed to "admin@example.com"

    Scenario: The email's subject names the site and the version
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a site running version 276
      When the sign in page is opened
      Then the bug report has the subject "Croquet Scores 276 Bug"

    Scenario: A site with no version has no number in the subject
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a site running no version
      When the sign in page is opened
      Then the bug report has the subject "Croquet Scores Bug"

    Scenario: The subject names the site as it is called
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a site running version 276
      And a site served as "gateballscores.com"
      When the sign in page is opened
      Then the bug report has the subject "Gateball Scores 276 Bug"

    Scenario: The admin's footer offers it too
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a reader signed in as "someone@example.com"
      When the admin is opened
      Then the bug report is addressed to "admin@example.com"

    Scenario: A page saying something went wrong offers it
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      When a page that is not there is opened
      Then the footer offers the link "Report a bug"

    Scenario: The link is in the reader's language
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a browser that asks for "en-XA"
      When the sign in page is opened
      Then the bug report link is in the test locale

    Scenario: The subject is the same in every language
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      And a site running version 276
      And a browser that asks for "en-XA"
      When the sign in page is opened
      Then the bug report has the subject "Croquet Scores 276 Bug"

  Rule: The footer's links are on a row of their own, at the right

    The footer's first row is for the donation, the plea and the copyright,
    which are read. Privacy, Terms of use and Report a bug are for finding, not
    for reading, so they are on a row of their own beneath it, side by side in
    that order and at the right, where the theme and language choices beneath
    them end. The row of links comes before the choices, which are settings
    rather than links and stay last.

    Where there is not room for all three side by side, as on a phone, they
    wrap, but are still beneath the first row and at the right.

    Scenario: The links are beneath the donation and the copyright
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer's links are beneath the donation and the copyright

    Scenario: The links are side by side
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer's links are side by side

    Scenario: The links are in order
      Given a viewport 1200 pixels wide
      And a site whose administrator is "admin@example.com"
      When the sign in page is opened
      Then the first footer link is "Privacy"
      And the second footer link is "Terms of use"
      And the third footer link is "Report a bug"

    Scenario: The links are at the right
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the footer's links end where the theme choice ends

    Scenario: The theme choice is beneath the links
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the theme choice is beneath the footer's links

    Scenario: The links are beneath the donation and the copyright on a phone
      Given a viewport 375 pixels wide
      When the sign in page is opened
      Then the footer's links are beneath the donation and the copyright

    Scenario: The links are at the right on a phone
      Given a viewport 375 pixels wide
      When the sign in page is opened
      Then the footer's links end where the theme choice ends

    Scenario: The admin's footer has them on a row of their own too
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the admin is opened
      Then the footer's links are beneath the donation and the copyright

    Scenario: The admin's footer has them at the right too
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the admin is opened
      Then the footer's links end where the theme choice ends
