Feature: Telling the reader's browser how to treat what it is sent

  A browser does what it is allowed to do with a page unless the page says
  otherwise: it will guess a file's kind from its contents, let another site
  put this one in a frame, and run a script from anywhere the page names. Each
  of those is a way for someone else to use the reader's session, and each is
  closed by a header the site sends with every answer.

  They are sent from one place, and to every answer, an error and a file as
  much as a page, so that a route added later cannot be the one that forgot.

  The policy for what a page may load is as narrow as the site allows. It still
  lets the pages' own inline scripts and styles run, since the pages are
  written with them; moving those out so that the policy can refuse them is a
  change of its own. What it refuses already is everything from another place
  except the few the site uses: Google's reCAPTCHA, to tell people from
  programs, and PayPal and Google's sign-in, which a form is sent on to.

  These scenarios run against a server built for the headers alone, and say
  nothing about what a page holds, which is each page's own.

  Rule: A browser is told to keep to the site over secure connections

    Scenario: A page asks to be reached only over a secure connection
      When a reader asks for a page
      Then it asks to be reached only over a secure connection
      And it asks for that for a year

    Scenario: A page does not ask the same of the sites beneath this one
      When a reader asks for a page
      Then it does not ask for that of the sites beneath this one

  Rule: A browser is told not to guess what a file is

    Scenario: A page asks for its kind to be believed
      When a reader asks for a page
      Then it asks that its kind is not guessed

  Rule: A browser is told not to let another site frame the site

    Scenario: A page asks not to be framed by older browsers
      When a reader asks for a page
      Then it asks not to be framed

    Scenario: A page asks not to be framed by current browsers
      When a reader asks for a page
      Then its policy allows no site to frame it

  Rule: A browser is told what a page may load

    Scenario: A page may load from the site and nowhere else by default
      When a reader asks for a page
      Then its policy allows loading from the site
      And its policy allows nothing else by default

    Scenario: A page may not carry a plug-in
      When a reader asks for a page
      Then its policy allows no plug-ins

    Scenario: A page may not change where its addresses are taken from
      When a reader asks for a page
      Then its policy allows no other base address

    Scenario Outline: A page may run a script from <place>
      When a reader asks for a page
      Then its policy allows scripts from "<place>"

      Examples:
        | place                   |
        | https://www.google.com  |
        | https://www.gstatic.com |

    Scenario Outline: A page may be sent to <place> by a form
      When a reader asks for a page
      Then its policy allows forms to be sent to "<place>"

      Examples:
        | place                       |
        | https://www.paypal.com      |
        | https://accounts.google.com |

    Scenario: A page may not send a form to any other place
      When a reader asks for a page
      Then its policy allows forms to be sent to nowhere else

    Scenario: A page may carry the frame reCAPTCHA is shown in
      When a reader asks for a page
      Then its policy allows frames from "https://www.google.com"

    Scenario: A page may ask reCAPTCHA for its answer
      When a reader asks for a page
      Then its policy allows requests to "https://www.google.com"

  Rule: Every answer says so

    Scenario: An answer that is an error carries them
      When a reader asks for a page that is not there
      Then it asks to be reached only over a secure connection
      And it asks that its kind is not guessed
      And it asks not to be framed
      And it has a policy

    Scenario: An answer that is not a page carries them
      When a reader asks for a file that is not a page
      Then it asks to be reached only over a secure connection
      And it asks that its kind is not guessed
      And it asks not to be framed
      And it has a policy
