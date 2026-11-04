@postgres
Feature: Asking the help a question

  Readers and administrators who cannot find what they want in the help can
  type what they would ask a colleague and be shown the pages most likely to
  answer it, best first, with the words that matched.

  It is a search and not a conversation: the same question gets the same
  answer from the same help, and nothing is sent outside the site to answer it.

  It is asked of the site, by the help page, and is for the site's own pages
  and not for anybody else's software, as the rest of what is beneath
  /api/site is.

  The panel to ask it in is at the top of the help, which is where readers
  and administrators both come, so neither is made to look elsewhere. It
  needs a browser that runs scripts to show the results as they are typed,
  and without one the question is sent as a form and the results are the page.

  Rule: A question is answered with the pages most likely to answer it

    Scenario: A question using the help's own word
      Given a site with help pages
      And the english page "tournament-managers/standard-tournament/players" titled "Players" saying "Add a player."
      And an english reader
      And the reader's question "How do I add a player?"
      When the question is asked
      Then the first result is "Players"

    Scenario: A question using a word the help does not
      Given a site with help pages
      And the english page "tournament-managers/publishing" titled "Publishing" saying "Publish the results."
      And an english reader
      And the reader's question "How do I make my tournament visible?"
      When the question is asked
      Then the first result is "Publishing"

    Scenario: A result leads to its page
      Given a site with help pages
      And the english page "tournament-managers/players" titled "Players" saying "Add a player."
      And an english reader
      And the reader's question "player"
      When the question is asked
      Then the first result leads to the page "tournament-managers/players"

    Scenario: A question with no answer has no results
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      And an english reader
      And the reader's question "zeppelin"
      When the question is asked
      Then there are no results

  Rule: A question is answered in the language the reader is reading in

    Scenario: A reader of Swedish is answered from the Swedish help
      Given a site with help pages
      And the swedish page "a" titled "Spelare" saying "Lägg till en spelare."
      And the english page "a" titled "Players" saying "Add a player."
      And a swedish reader
      And the reader's question "spelare"
      When the question is asked
      Then the first result is "Spelare"

    Scenario: A reader is answered in English where their language has nothing to say
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      And a welsh reader
      And the reader's question "player"
      When the question is asked
      Then the first result is "Players"

  Rule: Readers and administrators are answered alike

    The help is public, so a question needs no account, and an administrator
    is answered by the same help as everybody else. The answer does not look
    at who is asking, so a reader signed in is the case that says so; the
    administrator is no different from any reader signed in.

    Scenario: Nobody is signed in
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      And an english reader who is not signed in
      And the reader's question "player"
      When the question is asked
      Then the first result is "Players"

    @browser
    Scenario: A reader is signed in, as an administrator is to run a tournament
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      And an english reader who is signed in
      And the reader's question "player"
      When the question is asked
      Then the first result is "Players"

  Rule: A question that cannot be answered says why

    Scenario: No question
      Given a site with help pages
      And an english reader
      And the reader's question ""
      When the question is asked
      Then the question is refused with "HelpSearch.QuestionMissing"

    Scenario: A question of only spaces
      Given a site with help pages
      And an english reader
      And the reader's question "   "
      When the question is asked
      Then the question is refused with "HelpSearch.QuestionMissing"

    Scenario: A question too long to be one
      Given a site with help pages
      And an english reader
      And a question of 201 characters
      When the question is asked
      Then the question is refused with "HelpSearch.QuestionTooLong"

    Scenario: A request that is not a question at all
      Given a site with help pages
      And an english reader
      And a request that says nothing of a question
      When the request is sent
      Then the request is refused with "HelpSearch.QuestionMissing"

  Rule: One address cannot ask without limit

    Scenario: Asking more often than the site allows
      Given a site with help pages
      And an english reader
      And the reader's question "player"
      When the question is asked more often than is allowed
      Then the next question is told to wait

    Scenario: Asking by the form more often than the site allows
      Given a site with help pages
      And an english reader
      And the reader's question "player"
      When the question is asked by the form more often than is allowed
      Then the next question is told to wait

    Scenario: Opening the help without a question is not counted
      Given a site with help pages
      And an english reader
      When the help is opened more often than the questions are allowed
      Then the next opening is not told to wait

  Rule: The panel is at the top of the help

    @browser
    Scenario: The panel is there
      Given a site with help pages
      When the first page of the help is read
      Then the page has a panel called "Ask Croquet Scores"

    @browser
    Scenario: The panel is above the page
      Given a site with help pages
      When the first page of the help is read
      Then the panel comes before the page's first heading

    @browser
    Scenario: Results are shown as they are asked for
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      When the first page of the help is read
      And "player" is typed in the panel
      Then the panel shows the result "Players"

    @browser
    Scenario: The panel is in the language of the site
      Given a site with help pages
      And a swedish reader
      When the first page of the help is read
      Then the panel is called by the Swedish words

    Scenario: Without scripts the question is sent as a form
      Given a site with help pages
      And the english page "a" titled "Players" saying "Add a player."
      And an english reader
      When "player" is asked of the help as a form
      Then the page shows the result "Players"
