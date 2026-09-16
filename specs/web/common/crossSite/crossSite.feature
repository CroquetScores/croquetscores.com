Feature: Refusing changes asked for by another site

  A page on another site can make a reader's browser post a form here, and the
  browser sends along everything it holds for this site when it does. So a
  request that would change something is refused when it came from somewhere
  else.

  Browsers say where a request came from in Sec-Fetch-Site, and one too old to
  say so there still says so in Origin. A request carrying neither did not come
  from a browser, so nobody's browser is being made to act for somebody else.

  Rule: Reading is never refused

    Scenario Outline: A request that changes nothing is let through from anywhere
      Given a <method> request to "croquetscores.com"
      And the browser says it came from "cross-site"
      Then it is let through

      Examples:
        | method  |
        | GET     |
        | HEAD    |
        | OPTIONS |

  Rule: A browser saying where a change came from is believed

    Scenario Outline: A change is let through only from this site or from the reader directly
      Given a <method> request to "croquetscores.com"
      And the browser says it came from "<from>"
      Then it is <verdict>

      Examples:
        | method | from        | verdict     |
        | POST   | same-origin | let through |
        | POST   | none        | let through |
        | POST   | same-site   | refused     |
        | POST   | cross-site  | refused     |
        | PUT    | cross-site  | refused     |
        | PATCH  | cross-site  | refused     |
        | DELETE | cross-site  | refused     |

  Rule: A browser too old to say so is judged by its origin

    Scenario Outline: The origin decides when Sec-Fetch-Site is missing
      Given a POST request to "croquetscores.com"
      And the browser does not say where it came from
      And its origin is "<origin>"
      Then it is <verdict>

      Examples:
        | origin                         | verdict     |
        | https://croquetscores.com      | let through |
        | https://elsewhere.example      | refused     |
        | https://croquetscores.com.evil | refused     |
        | null                           | refused     |
        | not a url                      | refused     |

  Rule: A request that is not from a browser is not a forgery

    Scenario: A change with neither header is let through
      Given a POST request to "croquetscores.com"
      And the browser does not say where it came from
      And it has no origin
      Then it is let through
