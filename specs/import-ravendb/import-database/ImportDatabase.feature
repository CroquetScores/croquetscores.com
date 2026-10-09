@postgres
Feature: The database an import empties and fills

  An import is run over and over while it is being written, and what the last
  run left would be imported a second time on top of itself. So an import
  begins by emptying the database it writes into, which is the site's
  (`loadImportConfig.feature`): every table in it is dropped, in whatever
  schema it is, and every migration is applied again. The migration runner
  never drops anything, and must not, so the dropping is kept apart from it,
  reached only by an import and by "npm run db:drop-tables".

  Tables of the import's own are made with the rest: one keeping what could
  not be imported, and one each keeping what the old sites' users,
  tournaments, tournament players and competitions became, so that whatever
  is imported after them can find them. A user may have become a forgotten
  account, which is kept too, and every tournament read is kept, whatever
  became of it, so that a document naming one never read can be found. None
  is a migration's, because the site has no use for them, and all go when
  importing is finished.

  Background:
    Given an import's database

  Rule: Emptying the database leaves nothing the last import made

    Scenario: An account kept before emptying is gone after it
      Given an account for "someone@example.com" is brought over from the old site
      When the import's database is emptied
      Then no account is reached at "someone@example.com"

    Scenario: An error kept before emptying is gone after it
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/users/2" saying "Refused"
      When the import's database is emptied
      Then no error is kept for "croquetscores.com/users/2"

    Scenario: A user kept before emptying is gone after it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the import's database is emptied
      Then "users/1" on "croquetscores.com" is not kept as any account

    Scenario: A tournament kept before emptying is gone after it
      Given the import's database is emptied
      And "tournaments/12" on "croquetscores.com" was kept as a tournament
      When the import's database is emptied
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament

    Scenario: A tournament read before emptying is gone after it
      Given the import's database is emptied
      And "tournaments/14" on "croquetscores.com" was kept as read
      When the import's database is emptied
      Then "tournaments/14" on "croquetscores.com" is not kept as read

    Scenario: A forgotten account kept before emptying is gone after it
      Given the import's database is emptied
      And "users/4" on "croquetscores.com" was kept as a forgotten account
      When the import's database is emptied
      Then "users/4" on "croquetscores.com" is not kept as any account

    Scenario: A tournament player kept before emptying is gone after it
      Given the import's database is emptied
      And player 7 of "tournaments/12" on "croquetscores.com" was kept as a tournament player
      When the import's database is emptied
      Then player 7 of "tournaments/12" on "croquetscores.com" is not kept as any player

    Scenario: A competition kept before emptying is gone after it
      Given the import's database is emptied
      And "blocks/30" on "croquetscores.com" was kept as a competition
      When the import's database is emptied
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: A table no migration made is gone after emptying
      Given a table "left_over" nobody migrated
      When the import's database is emptied
      Then there is no table "left_over"

    Scenario: A table in another schema is gone after emptying
      Given a schema "elsewhere"
      And a table "elsewhere.left_over" nobody migrated
      When the import's database is emptied
      Then there is no table "elsewhere.left_over"

  Rule: Emptying the database makes every table again

    Scenario: Every migration is applied again
      When the import's database is emptied
      Then every migration has been applied

  Rule: The users imported are found by their email address, whatever its case

    An address is compared here as the site compares it, since an address
    this took for a new one the site would take for one it already has, and
    the second account would be refused rather than kept as the first.

    Scenario: A user kept is found by the address they were kept with
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "someone@example.com" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept is found by their address in another case
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "Someone@Example.COM" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept is found by their address with space around it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for " someone@example.com " is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: A user kept with space around their address is found by it
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at " someone@example.com "
      When the account imported for "someone@example.com" is looked for
      Then the account kept for "users/1" on "croquetscores.com" is found

    Scenario: An address nobody was kept with finds no account
      Given the import's database is emptied
      And "users/1" on "croquetscores.com" is kept as an account at "someone@example.com"
      When the account imported for "nobody@example.com" is looked for
      Then no account imported is found

  Rule: The errors kept are counted, wherever they were kept from

    The import ends by saying how many errors it kept. A document refused
    while its tournament brings it over is kept by the tournament
    (`ImportWholeTournaments.feature`), not by whoever read the tournament, so
    adding up what each collection's reading was refused would leave it out.
    The count is asked of what was kept instead.

    Scenario: Every error kept is counted
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/users/2" saying "Refused"
      And an error is kept for "croquetscores.com/blocks/1" saying "Refused"
      When the errors kept are counted
      Then 2 errors are counted

    Scenario: No error kept counts none
      Given the import's database is emptied
      When the errors kept are counted
      Then 0 errors are counted

  Rule: An error accepted for a document is not kept

    Some of what the import refuses has been looked at, and accepted: it is
    the old site's, it is not wrong, and there is nothing to put right. A
    knockout in 2014 kept play-offs between players knocked out in its first
    round beside its draw (knockouts/10088), which the site's knockout has no
    place for. An error accepted is accepted for one document and one
    refusal's code, whichever of the document's games or players it names,
    and with why, in a table of its own made with the site's own tables, so
    that it is there again whenever the database is emptied. An error
    accepted is not kept, and so not counted, and an error of another code,
    or of another document, is kept as any is.

    Scenario: An error accepted for a document is not kept
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/knockouts/10088" saying "game 12: Competition.NotDrawnToMeet: CompetitionRefused: These players are not currently drawn to play each other in the knockout."
      Then no error is kept for "croquetscores.com/knockouts/10088"

    Scenario: An error accepted for a document is not counted
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/knockouts/10088" saying "game 12: Competition.NotDrawnToMeet: CompetitionRefused: These players are not currently drawn to play each other in the knockout."
      When the errors kept are counted
      Then 0 errors are counted

    Scenario: An error of another code for the document is kept
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/knockouts/10088" saying "game 3: Competition.MatchDecided: CompetitionRefused: Their match is decided."
      Then an error is kept for "croquetscores.com/knockouts/10088"

    Scenario: The same error for another document is kept
      Given the import's database is emptied
      And an error is kept for "croquetscores.com/knockouts/74" saying "game 12: Competition.NotDrawnToMeet: CompetitionRefused: These players are not currently drawn to play each other in the knockout."
      Then an error is kept for "croquetscores.com/knockouts/74"
