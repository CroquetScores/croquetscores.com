@browser
Feature: Refusing a request addressed to a website nobody set up

  One server answers for croquetscores.com, try.croquetscores.com,
  gateballscores.com and try.gateballscores.com, and which of them a request is
  for is read from the host it was addressed to (`Website.feature`). Everything
  the site shows follows from that: the tournaments, the sports on offer, the
  banner a try website carries, the name the site is called, and the address in
  every link it writes.

  A request addressed to anything else cannot be given any of those, and
  guessing would be worse than saying so. Answered as Croquet Scores, a domain
  somebody pointed at the server by mistake, or an address typed in by a
  scanner, would be served a site that never said it was one. So the request is
  answered 421 Misdirected Request, the status for a server that does not
  answer for what it was addressed to, with a page that says so plainly.

  The refusal comes before anything else the site does, so that nothing is
  read, counted or written for a request that is not for any website.

  The host is the one the reader typed. Behind the proxy the site is told to
  trust (`trustedProxy.feature`) that is the host the proxy forwards, and these
  scenarios ask as something in front of the site does.

  Rule: A request for a website there is is served

    Scenario Outline: A page is served to a host the site answers for
      Given a site
      When the sign in page is asked for as "<host>"
      Then the site answers "200"

      Examples:
        | host                   |
        | croquetscores.com      |
        | try.croquetscores.com  |
        | gateballscores.com     |
        | try.gateballscores.com |
        | localhost:3000         |
        | 127.0.0.1:41873        |

  Rule: A request for anywhere else is answered 421

    Scenario Outline: A page is refused to a host the site does not answer for
      Given a site
      When the sign in page is asked for as "<host>"
      Then the site answers "421"

      Examples:
        | host                  |
        | example.com           |
        | www.croquetscores.com |
        | 203.0.113.5           |

    Scenario: The refusal is a page, not a blank
      Given a site
      When the sign in page is asked for as "example.com"
      Then the answer is a page

    Scenario: The refusal is JSON where the API was asked
      Given a site
      When the API is asked for as "example.com"
      Then the site answers "421"
      And the answer carries the code "Request.Misdirected"

    Scenario: A change is refused before it is judged
      Given a site
      When a form is posted as "example.com"
      Then the site answers "421"

  Rule: The health check answers whoever asks

    A load balancer or an uptime probe calls the instance by its address or an
    internal name, which is no website's, and an instance that answers it 421
    is taken for one that is down. The health check says the process is well
    and reads no website, so it is answered whatever it was addressed to.

    Scenario: The health check is answered to a host that is no website's
      Given a site
      When the health check is asked for as "203.0.113.5"
      Then the site answers "200"

  Rule: The same server answers each website as itself

    Scenario: A try website carries the banner
      Given a site
      When the home page is asked for as "try.croquetscores.com"
      Then the page carries the try website's banner

    Scenario: Its sister does not
      Given a site
      When the home page is asked for as "croquetscores.com"
      Then the page carries no try website's banner

    Scenario: Gateball Scores is named as Gateball Scores
      Given a site
      When the home page is asked for as "gateballscores.com"
      Then the header names the site "Gateball Scores"

  Rule: A forwarded host is believed from the proxy the site was told to trust, and nowhere else

    Scenario: A host forwarded from a proxy the site was not told to trust is ignored
      Given a site told that no proxy forwards requests to it
      When the home page is asked for as "try.croquetscores.com"
      Then the page carries no try website's banner
