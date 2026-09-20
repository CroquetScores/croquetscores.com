Feature: Reading the links the site signs

  Everything the application wants of the links it emails is specified with
  whatever sends them: `ConfirmEmailAddress.feature` emails one, follows it,
  and holds it to what it carries. What is here is what signing a link rather
  than keeping a table of them adds, and all of it is about reading one back.
  A link is text a reader hands over, and reading it is the whole of what
  stands between what they hand over and what the site then believes.

  A link is made as the site's own address, the page that kind of link is
  followed at, and a `link` parameter carrying what was signed and the
  signature over it with a dot between them. It is read back from whatever
  the reader followed, which may be that whole address, the query on its own,
  or the parameter's value by itself, because a link reaches the site through
  mail clients and forwarders that are free to rewrite everything around it
  and sometimes to add to it.

  What must not happen is that one link has more than one spelling that
  works. Nothing counts links by the text of them today; the moment anything
  does — a link that works once, a limit on how often one is followed — each
  spelling would be counted as a link of its own, and a limit counted that
  way is no limit at all. So what is handed over is refused unless it is
  exactly what was made: the parameter found by its name, two parts, and a
  signature written as the 43 characters of base64url that an HMAC-SHA256 is.

  Background:
    Given the site's links
    And an account
    And the moment "2026-09-20T10:00:00Z"

  Rule: A link reads back what it was made with

    Scenario: A link reads back what it is for
      Given a link to confirm an email address
      When the link is read
      Then it is for confirming an email address

    Scenario: A link reads back the account it was made for
      Given a link to confirm an email address
      When the link is read
      Then it names that account

    Scenario: A link reads back when it stops working
      Given a link to confirm an email address
      When the link is read
      Then it works until that moment

    Scenario: A link made for something else reads back as that
      Given a link to set a new password
      When the link is read
      Then it is for setting a new password

  Rule: The link is the parameter of that name, and not the letters anywhere in the address

    A link is found by asking the query for the parameter called `link`,
    rather than by looking for the letters `link=` somewhere in what was
    handed over. A parameter whose name merely ends in them — `deeplink`,
    which mail apps and the wrappers that count clicks are fond of adding —
    would otherwise be read as the link, and a link this site made and nobody
    touched would be refused as one that no longer works.

    Given twice, neither is read: there is no saying which was meant, and
    picking one is picking which of two things a reader might have followed
    to believe.

    Scenario: A whole address reads back
      Given a link to confirm an email address
      When the link is read
      Then it is for confirming an email address

    Scenario: The query on its own reads back
      Given a link to confirm an email address
      And only the query of it is kept
      When the link is read
      Then it is for confirming an email address

    Scenario: What the parameter carried, on its own, reads back
      Given a link to confirm an email address
      And only what the parameter carried is kept
      When the link is read
      Then it is for confirming an email address

    Scenario: A link with a parameter whose name ends in "link" before it reads back
      Given a link to confirm an email address
      And a "deeplink" parameter is put in front of it
      When the link is read
      Then it is for confirming an email address

    Scenario: An address of ours with no link parameter does not read
      Given a link to confirm an email address
      And the link parameter is taken out of it
      When the link is read
      Then it does not read

    Scenario: A link whose parameter is given twice does not read
      Given a link to confirm an email address
      And the link parameter is given a second time
      When the link is read
      Then it does not read

  Rule: A link has one spelling that works, and no other

    Anything the site does not insist on is a second spelling of the same
    link. What was carried is two parts, so a third is refused rather than
    ignored; and a signature is 43 characters of base64url, so one with
    anything else on the end is refused rather than decoded, since decoding
    quietly drops whatever is outside the alphabet and would hand back the
    same 32 bytes as the signature that was made.

    Scenario: A link with something more after its signature does not read
      Given a link to confirm an email address
      And ".and-more" is put on the end of it
      When the link is read
      Then it does not read

    Scenario: A link with characters no signature has on the end does not read
      Given a link to confirm an email address
      And "!!!" is put on the end of it
      When the link is read
      Then it does not read
