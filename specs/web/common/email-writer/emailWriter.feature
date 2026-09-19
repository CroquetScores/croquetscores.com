Feature: The site's emails are written in their reader's language

  The email queue knows what an email is and when it goes, and holds no words
  (`PostgresEmailQueue.feature`). The words are written here, when an email is
  sent: given the email's kind, the language it is to be written in and
  whatever fills it in, this hands back a subject and a body.

  An email's words are the site's words, and are kept where every other word a
  reader is shown is kept: in the catalogue for the reader's language, keyed by
  the email's kind. So a language is added to the site's emails by adding its
  catalogue, as it is added to the site's pages, and a word is written once
  whether a page says it or an email does. That is why this is in the web layer
  rather than beside the queue. The application declares what it asks of an
  email writer, and this answers it; the queue names only the application's
  declaration, and `server.ts` hands it this one.

  An email is written in the language it was queued in, or in the site's first
  language where the site does not offer that one. A word the language has not
  got is written in the site's first language, as a page's is.

  Whatever fills an email in — a link, the name of a service, a moment — is
  put where the email's words say, and written as text rather than as markup,
  so that nothing given to an email can change what the email is. A link to
  follow is offered twice: as a button in the email's words, and as the
  address itself, for a reader whose mail shows no buttons. A link to one of
  the site's own pages, such as the sign in page, is made with the site's
  address, which the writer is given.

  The site's address comes from how the site is configured, and never from a
  request. An email is written when the queue sends it, outside any request,
  so there is no request to ask; and one captured when the email was queued
  would be worse, because a request's host is whatever its sender wrote. An
  email whose links took their address from that could be made, by asking for
  a way back in with another host, to carry a genuine link to set a new
  password to a site of the asker's choosing. So the address is made from
  `CANONICAL_HOST`, the host the site is configured to answer to, which
  anything deployed sets, and is `https://` and that host. A host of
  `localhost` or `127.0.0.1`, with or without a port, is only ever
  development, served over plain HTTP, and is `http://` instead; the
  configuration itself suggests `localhost:3000` as a value, and an `https://`
  link to it would reach nothing. In development `CANONICAL_HOST` is usually
  blank, and the address is `http://localhost` and the port the site is
  configured to serve on, `PORT`, so that a link in an email written to a file
  opens the site being worked on, wherever it serves. The browser scenarios,
  which serve on whatever port is free and follow links in the emails they
  queue, give the writer their own address instead.

  An email of a kind this does not know is refused with
  `EmailWriter.UnknownKind`, rather than written with nothing in it. So is one
  whose words a catalogue has not got, with `EmailWriter.MissingWords`, and one
  that carries a link and was given none, with `EmailWriter.MissingFill`: an
  email with a dead button, or one saying "copy this address into your browser"
  and then nothing, is a mistake in the site rather than anything a reader did,
  and going out would be worse than not going. Each is refused by its own code,
  so that whoever reads the log is told which of them it was. The queue tries a
  refused email again, and gives it up in the end, which is time enough to put
  right what was wrong.

  These scenarios write with the site's catalogues and the test locale, and
  give the writer the site's address "https://croquetscores.com".

  Background:
    Given an email writer for "https://croquetscores.com"

  Rule: An email is written in the language it was queued in

    Scenario Outline: Every word of each email is in the test locale
      When the email "<kind>" is written in "en-XA"
      Then every word of its subject is in the test locale
      And every word of its body is in the test locale

      Examples:
        | kind                         |
        | Email.ConfirmAddress         |
        | Email.ConfirmAddressAgain    |
        | Email.AlreadyRegistered      |
        | Email.SetNewPassword         |
        | Email.RegisterInstead        |
        | Email.ConfirmForgetting      |
        | Email.RegistrationsSuspended |

    Scenario: An email in a language the site does not offer is written in English
      When the email "Email.ConfirmAddress" is written in "xx"
      Then its subject is the words for "Email.ConfirmAddress.subject" in English

    Scenario: The subject is the email's subject in its language
      When the email "Email.ConfirmAddress" is written in "en"
      Then its subject is the words for "Email.ConfirmAddress.subject" in English

  Rule: A link is offered as a button and as the address itself

    Scenario: The link to follow is a button in the email's words
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its body has a button to "https://croquetscores.com/account/confirm-email-address?link=abc123"
      And the button says the words for "Email.ConfirmAddress.action"

    Scenario: The link to follow is written out as an address to copy
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its body shows the address "https://croquetscores.com/account/confirm-email-address?link=abc123" as text

    Scenario: A link to one of the site's own pages is made with the site's address
      When the email "Email.AlreadyRegistered" is written in "en"
      Then its body has a button to "https://croquetscores.com/account/sign-in"

  Rule: The site's address comes from its configuration

    Scenario: The site's address is the host it is configured to answer to
      When the site's address is made for the host "croquetscores.com"
      Then the site's address is "https://croquetscores.com"

    Scenario: The site's address keeps a port it is configured with
      When the site's address is made for the host "croquetscores.com:8443"
      Then the site's address is "https://croquetscores.com:8443"

    Scenario Outline: A host that is only ever development is on plain HTTP
      When the site's address is made for the host "<host>"
      Then the site's address is "<address>"

      Examples:
        | host           | address               |
        | localhost      | http://localhost      |
        | localhost:3000 | http://localhost:3000 |
        | 127.0.0.1:3100 | http://127.0.0.1:3100 |

    Scenario Outline: With no host configured, the site's address is the port it serves on
      When the site's address is made for no host and the port <port>
      Then the site's address is "<address>"

      Examples:
        | port | address               |
        | 3000 | http://localhost:3000 |
        | 3100 | http://localhost:3100 |

  Rule: What fills an email in is written as text

    Scenario: The name of a service is put where the words say
      When the email "Email.RegistrationsSuspended" is written in "en" with the service "Have I Been Pwned"
      Then its subject contains "Have I Been Pwned"

    Scenario: What fills an email in cannot become markup
      When the email "Email.RegistrationsSuspended" is written in "en" with the service "<script>alert(1)</script>"
      Then its body contains no element named "script"

  Rule: An email that cannot be written as it should be is refused

    Scenario: An email of an unknown kind is refused
      When the email "Email.NoSuchKind" is written in "en"
      Then it is refused with "EmailWriter.UnknownKind"

    Scenario: An email whose words a catalogue has not got is refused
      Given an email writer whose catalogues have no words for "Email.ConfirmAddress.intro"
      When the email "Email.ConfirmAddress" is written in "en"
      Then it is refused with "EmailWriter.MissingWords"

    Scenario: An email that carries a link and was given none is refused
      When the email "Email.ConfirmAddress" is written in "en" with nothing filling it in
      Then it is refused with "EmailWriter.MissingFill"

    Scenario: An email that carries no link is written without one
      When the email "Email.RegistrationsSuspended" is written in "en" with nothing filling it in
      Then it is not refused
