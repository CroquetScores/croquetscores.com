@postgres
Feature: A site over a database the specs made can be controlled by a token

  The black-box specs in `specs/web` start the site as a process of its own and
  know it only by its address, so a page is the only way they have of changing
  it, and there is no page for moving the site's own clock. Some scenarios have
  to say what time it is, so a site started for them can be told.

  A way of changing a running site that is not a reader's is a way into it, so
  it is guarded twice, and each guard is enough on its own. A site has it only
  if it was given a token, and it refuses to start with a token unless its
  database is one the specs made, which no real database is named like. And
  every call carries the token, or is answered as a page that is not there
  would be, so that nobody without it learns the routes exist.

  Rule: Only a site given a token has the control

    Scenario: A site given no token has no control
      Given a site given no token
      When the clock is asked for with the token "open sesame"
      Then the site answers that there is no such page

    Scenario: A site given a token has the control
      Given a site given the token "open sesame"
      When the clock is asked for with the token "open sesame"
      Then the site answers that it is fine

  Rule: A call must carry the token

    Scenario: A call with no token is answered as a page that is not there
      Given a site given the token "open sesame"
      When the clock is asked for with no token
      Then the site answers that there is no such page

    Scenario: A call with the wrong token is answered as a page that is not there
      Given a site given the token "open sesame"
      When the clock is asked for with the token "close sesame"
      Then the site answers that there is no such page

  Rule: A site refuses a token unless its database is one the specs made

    Scenario: A token over a database the specs did not make stops the site starting
      Given a token "open sesame"
      And a database called "croquet_scores"
      When the site is started over that database
      Then the site refuses to start
      And the refusal names the token

  Rule: The site can be made to forget what it kept

    A site is started once for many scenarios, since starting one takes longer
    than most scenarios do, so each scenario begins by having the site forget
    what the last one left. What the site keeps of the help is not what a
    scenario leaves, and is a copy of files, so it stays.

    Scenario: What the site kept is forgotten
      Given a site given the token "open sesame"
      And the site has kept a failed sign in
      When the site is told to forget what it kept
      Then the site has kept no failed sign in

    Scenario: The help the site made searchable is kept
      Given a site given the token "open sesame"
      And the site has made the help searchable
      When the site is told to forget what it kept
      Then the help is still searchable

    Scenario: The clock is put back by forgetting
      Given a site given the token "open sesame"
      And the clock is set to "2031-03-04T05:06:07Z"
      When the site is told to forget what it kept
      And the clock is asked for with the token "open sesame"
      Then the clock reads a time within 5 seconds of now

  Rule: A site with the control offers the test locale

    The test locale is English with every phrase marked, so that a word on a
    page that came from somewhere other than a catalogue can be found. It is
    made for the specs and is offered to nobody else.

    Scenario: A site given a token offers the test locale
      Given a site given the token "open sesame"
      When the home page is asked for in "en-XA"
      Then the page is in the test locale

    Scenario: A site given no token does not offer it
      Given a site given no token
      When the home page is asked for in "en-XA"
      Then the page is not in the test locale

  Rule: A site with the control can be given accounts and readers

    A scenario that wants a signed-in reader should not have to register,
    open an email and follow its link on every run, so the site makes the
    account the way it makes one, and hands back a session to hold.

    Scenario: A reader with a session is signed in
      Given a site given the token "open sesame"
      And an account for "someone@example.com" made through the control
      When a session for "someone@example.com" is asked for
      And the profile page is asked for with that session
      Then the site answers that it is fine

    Scenario: A reader with no session is not signed in
      Given a site given the token "open sesame"
      And an account for "someone@example.com" made through the control
      When the profile page is asked for with no session
      Then the site sends the reader elsewhere

    Scenario: A session for an address with no account is refused
      Given a site given the token "open sesame"
      When a session for "nobody@example.com" is asked for
      Then the site answers that there is no such page

    Scenario: An account that is not confirmed cannot be signed in to
      Given a site given the token "open sesame"
      And an unconfirmed account for "someone@example.com" made through the control
      When a session for "someone@example.com" is asked for
      And the profile page is asked for with that session
      Then the site sends the reader elsewhere

    Scenario: An account can be made whatever the clock has been set to
      Given a site given the token "open sesame"
      And the clock is set to "2020-01-01T00:00:00Z"
      When an account for "someone@example.com" is made through the control
      Then the site answers that it was made

    Scenario: A site given no token has no accounts control
      Given a site given no token
      When a session for "someone@example.com" is asked for
      Then the site answers that there is no such page

  Rule: A site with the control can be given tournaments

    A scenario about a page of tournaments should not have to sign in and fill
    in the form that makes one every time, so the site makes the tournament the
    way it makes one from its own form, for an account that is there, and says
    where the tournament is found. What the tournament is said in the words the
    form uses, and the site makes the rest of what a tournament needs.

    Scenario: A tournament is made for an account and found at its address
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      When "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      Then the site answers that it was made
      And the tournament is found at the address it gave

    Scenario: A tournament for an address with no account is refused
      Given a site given the token "open sesame"
      When "nobody@example.com" is made the manager of a tournament called "Spring Open" through the control
      Then the site answers that the request was wrong

    Scenario: A tournament that was made can be archived
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      When the tournament is archived through the control
      Then the site answers that it is fine

    Scenario: A site given no token has no tournaments control
      Given a site given no token
      When "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      Then the site answers that there is no such page

  Rule: A site with the control can be given competitions, players and games

    A scenario about a block's page, or about what a tournament lists of its
    games, should not have to fill in a dialog for each of them. The site adds
    them as its own dialogs do, as an account that manages the tournament, and
    hands back the id each is given, which the scenario holds to name it by.

    Scenario: A block is added to a tournament, and players are entered and play
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      When the block "Block A" is added to the tournament through the control
      And the players "Ann" and "Bea" are added and entered in the block through the control
      And Ann is made to have beaten Bea 26 to 20 in the block through the control
      Then the site answers that it was made

    Scenario: A score and a player can be withdrawn
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And the block "Block A" is added to the tournament through the control
      And the players "Ann" and "Bea" are added and entered in the block through the control
      And Ann is made to have beaten Bea 26 to 20 in the block through the control
      When the score is withdrawn through the control
      And Bea is withdrawn from the block through the control
      Then the site answers that it is fine

    Scenario: A block can be given rules, and players moved, and a score and the block archived
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And the block "Block A" with draws allowed is added to the tournament through the control
      And the players "Ann" and "Bea" are added and entered in the block through the control
      And Ann is made to have beaten Bea 26 to 20 in the block through the control
      When Bea is moved up in the block through the control
      And the score is archived through the control
      And the block is archived through the control
      Then the site answers that it is fine

    Scenario: Teams are added with players, and play a test, and one can be archived
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Tests" played by teams through the control
      When the teams "England" and "Australia" are added through the control
      And a player is added to the team "England" through the control
      And a test between the two teams is added and given 2 expected matches through the control
      And the team "England" is given the short name "ENG" through the control
      And the teams "New Zealand" and "Fiji" are added through the control
      And the team "Fiji" is archived through the control
      Then the site answers that it is fine

    Scenario: A player of the tournament can be archived
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And the players "Ann" and "Bea" are added through the control
      When "Ann" is archived through the control
      Then the site answers that it is fine

    Scenario: A knockout and a Swiss can be added, and a bye entered
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      When a knockout of 4 places is added through the control
      And a bye is entered in the knockout through the control
      And a Swiss is added through the control
      Then the site answers that it was made

    Scenario: A game added at a moment is said to have been added then
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And the block "Block A" is added to the tournament through the control
      And the players "Ann" and "Bea" are added and entered in the block through the control
      And Ann is made to have beaten Bea 26 to 20 in the block at "2026-10-03T10:00:00Z" through the control
      And the clock is set to "2026-10-03T10:12:00Z"
      When the tournament's page is asked for
      Then the tournament's page says "12 min"

    Scenario: A player's world ranking name can be changed
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And the players "Ann" and "Bea" are added through the control
      When the world ranking name of "Ann" is changed to "Ann Smith" through the control
      Then the site answers that it is fine

    Scenario: A manager's note can be added, edited and deleted
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And a note called "Lunch" saying "At noon" is added through the control
      When the note is edited to be called "Lunch" saying "At one" through the control
      And the note is deleted through the control
      Then the site answers that it is fine

    Scenario: A game between players who are not in the block is refused
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      When the block "Block A" is added to the tournament through the control
      And a game between two players who are not in the block is added through the control
      Then the site answers that the request was wrong

    Scenario: A site given no token has no competitions control
      Given a site given no token
      When the block "Block A" is added to the tournament through the control
      Then the site answers that there is no such page

  Rule: A site with the control can be given commentaries and comments

    Scenario: A commentary is started, and commented on, and a comment is edited and deleted
      Given a site given the token "open sesame"
      And an account for "manager@example.com" made through the control
      And "manager@example.com" is made the manager of a tournament called "Spring Open" through the control
      And a commentary called "Day one" is started through the control
      And the comment "Good start" is added to it through the control
      When the comment is edited to say "Great start" through the control
      And the comment is deleted through the control
      Then the site answers that it is fine

  Rule: A site with the control can be told an account has been forgotten

    Scenario: A forgotten account has no session to give
      Given a site given the token "open sesame"
      And an account for "someone@example.com" made through the control
      And the account for "someone@example.com" is forgotten through the control
      When a session for "someone@example.com" is asked for
      Then the site answers that there is no such page

  Rule: A site with the control can be asked whether an account is there

    Scenario: An account that was made is there
      Given a site given the token "open sesame"
      And an account for "someone@example.com" made through the control
      When the accounts for "someone@example.com" are counted
      Then one account is counted

    Scenario: An address with no account has none
      Given a site given the token "open sesame"
      When the accounts for "nobody@example.com" are counted
      Then no account is counted

    Scenario: An address that breaks the rules for one has none
      Given a site given the token "open sesame"
      When the accounts for "not an address" are counted
      Then no account is counted

  Rule: A site with the control can be asked what an account is called

    Scenario: An account is called what it was made called
      Given a site given the token "open sesame"
      And an account for "someone@example.com" called "Sam Someone" made through the control
      When the name of the account for "someone@example.com" is asked for
      Then the name told is "Sam Someone"

  Rule: A site with the control can be asked what email it has queued

    A site under test sends nothing, so a scenario that follows the link in an
    email reads it from what the site has queued for the address.

    Scenario: The email queued for an address is told with its kind and its link
      Given a site given the token "open sesame"
      And an unconfirmed account for "someone@example.com" made through the control
      When the emails queued for "someone@example.com" are asked for
      Then one email of the kind "Email.ConfirmAddress" with a link is told

    Scenario: No email is told for an address nobody wrote to
      Given a site given the token "open sesame"
      When the emails queued for "nobody@example.com" are asked for
      Then no email is told

    Scenario: A site given no token tells no emails
      Given a site given no token
      When the emails queued for "someone@example.com" are asked for
      Then the site answers that there is no such page

  Rule: A site with the control can be told how reCAPTCHA judges

    The site never asks Google. Where it has the control it judges a reader as a
    scenario says, and says which tokens it was asked to judge.

    Scenario: reCAPTCHA judges a person until it is told otherwise
      Given a site given the token "open sesame"
      When the tokens reCAPTCHA has judged are asked for
      Then no token is told

    Scenario: reCAPTCHA can be told how to judge
      Given a site given the token "open sesame"
      When reCAPTCHA is told to judge "not a person"
      Then the site answers that it is fine

    Scenario: reCAPTCHA is not told to judge anything but a person or not a person
      Given a site given the token "open sesame"
      When reCAPTCHA is told to judge "a robot"
      Then the site answers that the request was wrong

    Scenario: A site given no token has no reCAPTCHA control
      Given a site given no token
      When reCAPTCHA is told to judge "not a person"
      Then the site answers that there is no such page

  Rule: The clock can be set, and goes on from there

    Scenario: A time set is the time the site tells
      Given a site given the token "open sesame"
      And the clock is set to "2031-03-04T05:06:07Z"
      When the clock is asked for with the token "open sesame"
      Then the clock reads a time within 5 seconds of "2031-03-04T05:06:07Z"

    Scenario: A time that is not one is refused
      Given a site given the token "open sesame"
      When the clock is set to "yesterday"
      Then the site answers that the request was wrong

    Scenario: The clock is put back to the machine's
      Given a site given the token "open sesame"
      And the clock is set to "2031-03-04T05:06:07Z"
      When the clock is put back
      And the clock is asked for with the token "open sesame"
      Then the clock reads a time within 5 seconds of now
