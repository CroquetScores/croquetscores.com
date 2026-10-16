Feature: Refusing changes asked for by another site

  A page on another site can make a reader's browser post a form here, and the
  browser sends along everything it holds for this site when it does. So a
  request that would change something is refused when it came from somewhere
  else.

  Browsers say where a request came from in Sec-Fetch-Site, and one too old to
  say so there still says so in Origin. A request carrying neither is taken to
  be no browser at all — an app, a script, another server — with no cookies of a
  reader's to be spent. A browser old enough to send neither is not caught, and
  that is a risk knowingly carried rather than a claim that none exists.

  Rule: Reading is never refused

    Scenario Outline: A request that changes nothing is let through from anywhere
      Given a <method> request addressed to "croquetscores.com"
      And the browser says it came from "cross-site"
      Then it is let through

      Examples:
        | method  |
        | GET     |
        | HEAD    |
        | OPTIONS |

  Rule: A browser saying where a change came from is believed

    Scenario Outline: A change is let through only from this site or from the reader directly
      Given a <method> request addressed to "croquetscores.com"
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
      Given a POST request addressed to "croquetscores.com"
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

  Rule: An origin is this site's only when it is the website the request was addressed to

    The site answers for four domains, so there is no one host to judge an
    origin against. The website a request was addressed to is the one its
    origin has to be, and a sister website is somebody else's page like any
    other: a form on try.croquetscores.com cannot change anything on
    croquetscores.com, though the two are one server and one database.

    The host is the one the site reads for the request (`Website.feature`),
    which behind a proxy it was told to trust is the host the reader typed, and
    not the proxy's own. A request addressed to no website at all is refused
    before it is judged (`unknownHost.feature`).

    Scenario Outline: An origin of the website addressed is let through
      Given a POST request addressed to "<host>"
      And the browser does not say where it came from
      And its origin is "<origin>"
      Then it is let through

      Examples:
        | host                   | origin                        |
        | croquetscores.com      | https://croquetscores.com     |
        | try.croquetscores.com  | https://try.croquetscores.com |
        | gateballscores.com     | https://gateballscores.com    |
        | localhost:5173         | http://localhost:5173         |

    Scenario Outline: An origin of another website is refused
      Given a POST request addressed to "<host>"
      And the browser does not say where it came from
      And its origin is "<origin>"
      Then it is refused

      Examples:
        | host                  | origin                        |
        | croquetscores.com     | https://try.croquetscores.com |
        | croquetscores.com     | https://gateballscores.com    |
        | try.croquetscores.com | https://croquetscores.com     |

    Scenario: With nothing to compare against, a change carrying an origin is refused
      Given a POST request addressed to "croquetscores.com"
      And it is not addressed to anywhere
      And the browser does not say where it came from
      And its origin is "https://croquetscores.com"
      Then it is refused

  Rule: A request that is not from a browser is not a forgery

    Scenario: A change with neither header is let through
      Given a POST request addressed to "croquetscores.com"
      And the browser does not say where it came from
      And it has no origin
      Then it is let through
