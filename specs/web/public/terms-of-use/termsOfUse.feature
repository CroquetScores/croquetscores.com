Feature: A reader can see the terms the site is used on

  There are two sets of terms, because there are two kinds of reader. Most
  readers only read: they follow a tournament, look up a player, read a
  commentary. Their terms are at `/terms-of-use`, and are short, since reading
  asks little of anybody. Some readers also write: tournament managers enter
  tournaments, scorers enter scores, commentators write commentaries. Their
  terms are at `/admin/terms-of-use`, beneath the admin where most of that
  writing is done, and say what is expected of what they write, who is
  responsible for it, and how something written is reported and taken down.

  The terms for those who write were the commentaries page's Disclaimer,
  Guidelines and Reporting Commentary, which were the old site's words for
  commentators alone. They are written again for everybody who writes, with
  those words as the reference rather than copied, and the commentaries page
  no longer says them (`commentaries.feature`). Agreeing to them is asked
  for where writing begins: when an account is registered
  (`register.feature`) and when a commentary is started
  (`startCommentary.feature`).

  The page for readers links to the page for those who write, so that a
  reader who becomes a manager, a scorer or a commentator finds the terms
  that are now theirs.

  Each is a page of the help's library, as the privacy statement is
  (`privacy.feature`), and for the same reason: it is prose of some length,
  better read whole than assembled from words. Each is written in English,
  and shown in English to a reader of any other language until it is written
  in theirs (`help.feature`). Terms are the one page where a translation that
  says something slightly different is worse than none.

  `/admin/terms-of-use` is open to a reader who is not signed in, unlike the
  rest of the admin. The register page asks a reader to agree to it before
  they have an account to sign in with, and a link that sent them to sign in
  instead would ask them to agree to something they cannot read.

  Every page links to the terms for readers from the footer, beside the
  privacy statement.

  Scenarios here read pages and nothing more, so none need a browser or a
  database. A page is read as a reader who is not signed in reads it.

  Rule: The terms for readers are a page of their own

    Scenario: The terms for readers are at their own address
      When the terms of use are opened
      Then the page is the terms of use

    Scenario: The terms for readers are not also in the help
      When the help page "terms-of-use" is looked at
      Then the page is not found

    Scenario: The terms for readers are shown in English to a reader of another language
      Given a browser that asks for Welsh
      And the help has no Welsh terms of use
      When the terms of use are opened
      Then the terms are in English

  Rule: The terms for readers lead to the terms for those who write

    Scenario: The terms for readers link to the terms for those who write
      When the terms of use are opened
      Then the terms link to the terms of use for those who write

  Rule: The terms for those who write are a page of their own, open to anybody

    Scenario: The terms for those who write are at their own address
      When the terms of use for those who write are opened
      Then the page is the terms of use for those who write

    Scenario: A reader not signed in is not sent to sign in first
      When the terms of use for those who write are opened
      Then the page opens

    Scenario: The terms for those who write are not also in the help
      When the help page "admin/terms-of-use" is looked at
      Then the page is not found

    Scenario: The terms for those who write are shown in English to a reader of another language
      Given a browser that asks for Welsh
      And the help has no Welsh terms of use for those who write
      When the terms of use for those who write are opened
      Then the terms are in English

  Rule: The terms for those who write say how something written is reported

    Scenario: The terms for those who write say how to report what was written
      When the terms of use for those who write are opened
      Then the terms have the heading "Reporting what was written"

  Rule: Every page links to the terms for readers

    Scenario Outline: The footer links to the terms of use
      When the page at "<address>" is looked at
      Then the footer links to the terms of use

      Examples:
        | address       |
        | /help         |
        | /privacy      |
        | /terms-of-use |
