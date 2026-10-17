Feature: The site's emails are written in their reader's language

  The email queue knows what an email is and when it goes, and holds no words
  (`PostgresEmailQueue.feature`). The words are written here, when an email is
  sent: given the email's kind, the language it is to be written in and
  whatever fills it in, this hands back a subject and a body.

  An email's words are the site's words, and are kept where every other word a
  reader is shown is kept: in the catalogue for the reader's language, keyed by
  the email's kind. An email is two entries there: its subject, which is text,
  and its body, which is the whole of its markup, paragraphs and links and all.
  So the email is read where it is written, in the order its reader reads it,
  and putting it into another language is translating one piece of writing
  rather than assembling one out of phrases. So a language is added to the site's emails by adding its
  catalogue, as it is added to the site's pages, and a word is written once
  whether a page says it or an email does. That is why this is in the web layer
  rather than beside the queue. The application declares what it asks of an
  email writer, and this answers it; the queue names only the application's
  declaration, and `server.ts` hands it this one.

  An email is written in the language it was queued in, or in the site's first
  language where the site does not offer that one. A word the language has not
  got is written in the site's first language, as a page's is.

  An email's markup asks for four things the site knows about itself, and the
  writer fills all four in wherever the markup says: `{buttonBackgroundColour}`
  and `{buttonTextColour}`, which a button is painted with, `{emailFromName}`,
  the name the site's emails are sent from, which each email is signed off
  with, and `{siteName}`, what the site the email is for is called, which its
  pages call it too, in an email's subject and wherever its words name the
  site. The colours are
  the site's darker green and the white on it, written out rather than named,
  because mail programs read neither a custom property nor `light-dark()`; the
  writer holds them, and `STYLE.md` says what they are on a page. The name
  emails are sent from is configured, as the address they are sent from is.

  Whatever fills an email in — a link, the name of a service, a moment — is
  put where the email's markup says, and written as text rather than as
  markup, so that nothing given to an email can change what the email is. The
  markup around it is the catalogue's own and stays markup; only what is filled
  into it is escaped, which is the whole of the difference between the two. A
  link to follow is offered twice: as a button, and as the address itself, for
  a reader whose mail shows no buttons. A link to one of the site's own pages,
  such as the sign in page, is written in the markup as `{site}` and the path,
  and `{site}` is filled in with the address of the website the email is for.

  The address comes from the website the email is for, and never from a
  request. An email is written when the queue sends it, outside any request,
  so there is no request to ask; and a request's host is whatever its sender
  wrote, so an email whose links took their address from one could be made, by
  asking for a way back in with another host, to carry a genuine link to set a
  new password to a site of the asker's choosing. So an email is queued with
  the website its request was for, one of the few the site answers for
  (`Website.feature`), and the address is made from that: `https://` and its
  host, or `http://` for development (`Website.feature`).

  The same goes for what the email calls the site. One server answers for
  Croquet Scores and for Gateball Scores, and an email asked for on
  gateballscores.com is signed, worded and linked as Gateball Scores. The name
  is the website's site's, not a setting: croquetscores.com, its try website
  and development are Croquet Scores, and gateballscores.com and its try
  website are Gateball Scores.

  An email of a kind this does not know is refused with
  `EmailWriter.UnknownKind`, rather than written with nothing in it. So is one
  whose subject or body a catalogue has not got, with
  `EmailWriter.MissingWords`, and one
  that carries a link and was given none, with `EmailWriter.MissingFill`: an
  email with a dead button, or one saying "copy this address into your browser"
  and then nothing, is a mistake in the site rather than anything a reader did,
  and going out would be worse than not going. Each is refused by its own code,
  so that whoever reads the log is told which of them it was. The queue tries a
  refused email again, and gives it up in the end, which is time enough to put
  right what was wrong.

  These scenarios write with the site's catalogues and the test locale, for
  the website croquetscores.com unless one says otherwise.

  Background:
    Given an email writer

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
        | Email.SetPassword            |
        | Email.RegisterInstead        |
        | Email.ConfirmForgetting      |
        | Email.RegistrationsSuspended |
        | Email.PasswordChanged        |
        | Email.ConfirmNewEmailAddress |
        | Email.AlreadyHasAnAccount    |
        | Email.EmailAddressChanged    |

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
      And the button says "Confirm my email address"

    Scenario: The link to follow is written out as an address to copy
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its body shows the address "https://croquetscores.com/account/confirm-email-address?link=abc123" as text

    Scenario: A link to one of the site's own pages is made with the site's address
      When the email "Email.AlreadyRegistered" is written in "en"
      Then its body has a button to "https://croquetscores.com/account/sign-in"

  Rule: An email's body is one piece of markup

    An email's body is kept whole, as one entry under its kind, rather than as
    a list of phrases the writer puts in order. Whoever writes or translates an
    email then sees what its reader will see, and an email is changed in one
    place, in the catalogue, instead of in a catalogue and a list of blocks
    that has to agree with it.

    Scenario: An email's body is the markup kept for its kind
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its body holds the markup for "Email.ConfirmAddress.body"

    Scenario: The markup a catalogue holds stays markup
      When the email "Email.ConfirmAddress" is written in "en"
      Then its body has a paragraph

    Scenario: An email is signed off in its own words
      When the email "Email.ConfirmAddress" is written in "en"
      Then its sign off says "Croquet Scores"

  Rule: An email is painted and signed with what the site knows about itself

    Scenario: A button is painted with the site's darker green
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its button is on "#066b00"

    Scenario: A button's words are painted to be read on that green
      When the email "Email.ConfirmAddress" is written in "en" with the link "https://croquetscores.com/account/confirm-email-address?link=abc123"
      Then its button's words are "#ffffff"

    Scenario: An email is signed off with the name it is sent from
      Given an email writer sending as "Croquet Scores Under Another Name"
      When the email "Email.ConfirmAddress" is written in "en"
      Then its sign off says "Croquet Scores Under Another Name"

    Scenario Outline: An email's subject calls the site by the website it is for
      When the email "Email.ConfirmAddress" is written in "en" for the website "<host>"
      Then its subject contains "<site>"

      Examples:
        | host                   | site            |
        | croquetscores.com      | Croquet Scores  |
        | try.croquetscores.com  | Croquet Scores  |
        | gateballscores.com     | Gateball Scores |
        | try.gateballscores.com | Gateball Scores |
        | localhost:3000         | Croquet Scores  |

    Scenario: An email's words call the site by the website it is for
      When the email "Email.ConfirmAddress" is written in "en" for the website "gateballscores.com"
      Then its words contain "Gateball Scores"

  Rule: A link is made with the address of the website the email is for

    Scenario Outline: A link to one of the site's own pages begins with the website's address
      When the email "Email.AlreadyRegistered" is written in "en" for the website "<host>"
      Then its body has a button to "<address>/account/sign-in"

      Examples:
        | host                   | address                    |
        | croquetscores.com      | https://croquetscores.com  |
        | beta.croquetscores.com | https://beta.croquetscores.com |
        | try.croquetscores.com  | https://try.croquetscores.com |
        | gateballscores.com     | https://gateballscores.com |
        | localhost:3000         | http://localhost:3000      |

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

    Scenario: An email whose body a catalogue has not got is refused
      Given an email writer whose catalogues have no words for "Email.ConfirmAddress.body"
      When the email "Email.ConfirmAddress" is written in "en"
      Then it is refused with "EmailWriter.MissingWords"

    Scenario: An email whose subject a catalogue has not got is refused
      Given an email writer whose catalogues have no words for "Email.ConfirmAddress.subject"
      When the email "Email.ConfirmAddress" is written in "en"
      Then it is refused with "EmailWriter.MissingWords"

    Scenario: An email that carries a link and was given none is refused
      When the email "Email.ConfirmAddress" is written in "en" with nothing filling it in
      Then it is refused with "EmailWriter.MissingFill"

    Scenario: An email that carries no link is written without one
      When the email "Email.RegistrationsSuspended" is written in "en" with nothing filling it in
      Then it is not refused
