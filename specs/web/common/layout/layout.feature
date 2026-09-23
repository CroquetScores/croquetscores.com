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

    Scenario: The banner is in the reader's language
      Given a viewport 1200 pixels wide
      And a site served as "try.croquetscores.com"
      And a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the try website's banner is in the test locale
