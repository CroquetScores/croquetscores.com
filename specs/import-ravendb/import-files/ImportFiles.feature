Feature: What the import said, in a file for each code

  The import says what it did to what the old sites kept in a folder of Markdown
  files, docs/import-from-ravendb, for whoever reads them to look at a
  tournament and see that nothing that mattered was lost, or what is left to put
  right. There is a file for each code of the corrections and of what was
  accepted, named for the code, as ImportBlocks.GamesReordered.md, and one for
  the errors the import kept, import-errors.md (`ImportDatabase.feature`).

  The import deletes every file in the folder before it begins, whatever the
  file is and whoever wrote it, so that the folder says only what the last
  import said, and a code that the last import said and this one does not has no
  file left behind. Each is written as it is said rather than once the import is
  finished, so that one that stops partway through still says what it said
  before it stopped.

  Every file begins with its heading, which is its code, and when the import
  began, by the clock of the machine it ran on, as
  "# ImportBlocks.GamesReordered", a blank line, and "Import began 25/10/2026,
  4:36:12 am." The file of errors is headed "Import errors", since its errors
  are of many codes.

  Each correction or acceptance is under a heading of its code, its document and
  what of it, with the document's whole address on the new site, which the
  import is told of, and on the old site it was on, written out rather than as
  links, each on a line of its own, and then what was done and why, said for a
  person. Each error is under a heading of the code it was refused with and its
  document, with the same addresses where it is known where it is, and then what
  went wrong said for a person where there is a saying, and its first line
  otherwise.

  Once the import is finished each file ends by saying how many it says: a file
  of a code, "Total: 3", and the file of errors, how many of each code and how
  many in all, so that one import can be held against the last by the numbers
  alone.

  The import's last file is import-summary.md, which says how many there were of
  everything in one place: a table of every code the import said anything under,
  corrections and errors alike, and the errors in all, as "import-errors". The
  table is laid out in columns of the same width in every row, the codes to the
  left and the numbers to the right with thousands separated by commas, so that
  they can be read down. It has no header row, being read as it is written.

  It is the one file the import does not delete when it begins. Each import adds
  its own summary to the end of it, under a heading of when that import began, so
  that the file is a history of the imports and one can be held against the last
  by the numbers alone. The first import to write it heads it "Import Summary".

  Background:
    Given a folder for the import's files, for the new site at "http://localhost:3000"

  Rule: Beginning deletes every file the last import left, but the summary

    Scenario: A file the last import left is gone once the files are begun
      Given the import's folder has the file "ImportBlocks.GamesReordered.md" saying "left over"
      When the files are begun
      Then the import's folder does not have the file "ImportBlocks.GamesReordered.md"

    Scenario: A file of any kind is deleted
      Given the import's folder has the file "notes.txt" saying "left over"
      When the files are begun
      Then the import's folder does not have the file "notes.txt"

    Scenario: A folder that is not there is made
      Given the import's folder is not there
      When the files are begun
      Then the import's folder is there

    Scenario: The summary the last import added to is kept
      Given the import's folder has the file "import-summary.md" saying "left over"
      When the files are begun
      Then the import's folder has the file "import-summary.md"

    Scenario: The summary the last import added to is kept as it was
      Given the import's folder has the file "import-summary.md" saying "left over"
      When the files are begun
      Then the file "import-summary.md" says "left over"

  Rule: Every file begins with its heading and when the import began

    Scenario: A file of a code begins with the code as its heading
      Given the files are begun at "2026-10-25T04:36:12Z"
      When a correction of the code "ImportBlocks.GamesReordered" is said
      Then line 1 of the file "ImportBlocks.GamesReordered.md" is "# ImportBlocks.GamesReordered"

    Scenario: A blank line follows the heading
      Given the files are begun at "2026-10-25T04:36:12Z"
      When a correction of the code "ImportBlocks.GamesReordered" is said
      Then line 2 of the file "ImportBlocks.GamesReordered.md" is empty

    Scenario: The next line says when the import began
      Given the files are begun at "2026-10-25T04:36:12Z"
      When a correction of the code "ImportBlocks.GamesReordered" is said
      Then line 3 of the file "ImportBlocks.GamesReordered.md" says the import began at "2026-10-25T04:36:12Z"

    Scenario: The file of errors begins with its heading
      When the files are begun at "2026-10-25T04:36:12Z"
      Then line 1 of the file "import-errors.md" is "# Import errors"

    Scenario: The file of errors says when the import began
      When the files are begun at "2026-10-25T04:36:12Z"
      Then line 3 of the file "import-errors.md" says the import began at "2026-10-25T04:36:12Z"

  Rule: What is corrected or accepted is said in the file of its code

    Scenario: A correction makes the file of its code
      Given the files are begun
      When a correction of the code "ImportBlocks.GamesReordered" is said
      Then the import's folder has the file "ImportBlocks.GamesReordered.md"

    Scenario: Nothing is said of a code that nothing was said under
      Given the files are begun
      When a correction of the code "ImportBlocks.GamesReordered" is said
      Then the import's folder does not have the file "ImportCompetition.GameNoted.md"

    Scenario: What is accepted is said in the file of its code too
      Given the files are begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the import's folder has the file "Competition.NotDrawnToMeet.md"

    Scenario: Two codes make two files
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When a correction of the code "ImportCompetition.GameNoted" is said
      Then the import's folder has the file "ImportCompetition.GameNoted.md"

    Scenario: A code is said under a heading of the code, the document and what of it
      Given the files are begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the file "Competition.NotDrawnToMeet.md" says "## Competition.NotDrawnToMeet: croquetscores.com/knockouts/10088 game 4"

    Scenario: What is said gives where it is on the new site
      Given the files are begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the file "Competition.NotDrawnToMeet.md" says the new site address "http://localhost:3000/2014/ac/spring-open"

    Scenario: What is said gives where it was on the old site
      Given the files are begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the file "Competition.NotDrawnToMeet.md" says the old site address "https://croquetscores.com/2014/ac/spring-open"

    Scenario: What is said of a tournament not brought over has no address on the new site
      Given the files are begun
      When a document that was not brought over is said as "RefuseLeftOvers.TournamentMissing"
      Then the file "RefuseLeftOvers.TournamentMissing.md" says "New site: not brought over"

    Scenario: What is said gives what was done and why
      Given the files are begun
      When game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the file "Competition.NotDrawnToMeet.md" says "Said by the scenario."

    Scenario: Two said under one code are in one file
      Given the files are begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      When game 5 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      Then the file "Competition.NotDrawnToMeet.md" says 2 things

    Scenario: What is said under one code is not in the file of another
      Given the files are begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      When a correction of the code "ImportCompetition.GameNoted" is said
      Then the file "Competition.NotDrawnToMeet.md" says 1 thing

    Scenario: A code with a character a file name cannot have is written to a file without it
      Given the files are begun
      When a correction of the code "Odd/Code" is said
      Then the import's folder has the file "Odd_Code.md"

    Scenario: A code written to a file without a character still heads it as it is
      Given the files are begun
      When a correction of the code "Odd/Code" is said
      Then line 1 of the file "Odd_Code.md" is "# Odd/Code"

  Rule: Each file of a code ends by saying how many it says

    Scenario: A file of one says one
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "ImportBlocks.GamesReordered.md" ends with the line "Total: 1"

    Scenario: A file of three says three
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "ImportBlocks.GamesReordered.md" ends with the line "Total: 3"

    Scenario: Each file counts its own
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportCompetition.GameNoted" is said
      When the files are ended
      Then the file "ImportCompetition.GameNoted.md" ends with the line "Total: 1"

  Rule: The errors kept are said in import-errors.md, under the code each was refused with

    The code is the first of the message that is written as a name, a dot and a
    name, followed by a colon, in the first line of the message: "Game.WinnerNotAhead"
    in "game 12: Game.WinnerNotAhead: Error: ...". An error that has none is said
    under "NoCode". It is the message that has it and not a field of its own
    because that is how the import keeps a refusal's code (\`ImportRefused.ts\`).

    Scenario: An error kept is said under the code it was refused with and its document
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: Error: refused"
      Then the file "import-errors.md" says "## Game.WinnerNotAhead: croquetscores.com/blocks/30"

    Scenario: A code after what the error was of is found
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "game 12: Game.WinnerNotAhead: Error: refused"
      Then the file "import-errors.md" says "## Game.WinnerNotAhead: croquetscores.com/blocks/30"

    Scenario: A code in a later line of the message is not taken
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Error: refused\n    at ImportBlocks.importDocument: here"
      Then the file "import-errors.md" says "## NoCode: croquetscores.com/blocks/30"

    Scenario: An error with no code is said under NoCode
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "TypeError: nothing there"
      Then the file "import-errors.md" says "## NoCode: croquetscores.com/blocks/30"

    Scenario: An error says where its document is on each site
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: Error: refused" at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      Then the file "import-errors.md" says the new site address "http://localhost:3000/2014/ac/spring-open/competitions/a-block"

    Scenario: An error says where its document was on the old site
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: Error: refused" at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      Then the file "import-errors.md" says the old site address "https://croquetscores.com/2014/ac/spring-open/competition/block-a"

    Scenario: An error says what went wrong said for a person where there is a saying
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: Error: refused", said for a person as "Game Tim 26 beat Trev 0"
      Then the file "import-errors.md" says "Game Tim 26 beat Trev 0"

    Scenario: An error with no saying says the first line of its message
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: refused\n    at here"
      Then the file "import-errors.md" says "Game.WinnerNotAhead: refused"

    Scenario: An error with no saying does not say the lines after its first
      Given the files are begun
      When the files are told of an error for "croquetscores.com/blocks/30" saying "Game.WinnerNotAhead: refused\n    at here"
      Then the file "import-errors.md" does not say "at here"

  Rule: Once the import is finished the errors are in order of their code, with how many of each

    Scenario: Errors found under codes in another order are in order of their code
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/1" saying "Competition.NotDrawnToMeet: Error: refused"
      When the files are ended
      Then the file "import-errors.md" says "## Competition.NotDrawnToMeet" before "## Game.WinnerNotAhead"

    Scenario: Errors of one code stay in the order they were found
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/1" saying "Game.WinnerNotAhead: Error: refused"
      When the files are ended
      Then the file "import-errors.md" says "croquetscores.com/blocks/2" before "croquetscores.com/blocks/1"

    Scenario: The file says how many errors there were of a code
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/1" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/3" saying "Competition.NotDrawnToMeet: Error: refused"
      When the files are ended
      Then the file "import-errors.md" has the line "Game.WinnerNotAhead: 2"

    Scenario: The file says how many there were of each code
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/3" saying "Competition.NotDrawnToMeet: Error: refused"
      When the files are ended
      Then the file "import-errors.md" has the line "Competition.NotDrawnToMeet: 1"

    Scenario: The file ends with how many errors there were in all
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/3" saying "Competition.NotDrawnToMeet: Error: refused"
      When the files are ended
      Then the file "import-errors.md" ends with the line "Total: 2"

    Scenario: An import that kept no errors still has the file, and says none
      Given the files are begun
      When the files are ended
      Then the file "import-errors.md" ends with the line "Total: 0"

  Rule: The import ends with import-summary.md, which says how many there were of everything

    The summary is made from what was said, and written once the import is
    finished. It is headed "Import Summary", says when the import began, and
    has a row for the errors in all, "import-errors", and one for every code
    anything was said under, in order of the code. A code that both a
    correction and an error were said under has one row, of both added
    together. After the table come the results of each file.

    Scenario: The summary begins with its heading
      Given the files are begun at "2026-10-25T04:36:12Z"
      When the files are ended
      Then line 1 of the file "import-summary.md" is "# Import Summary"

    Scenario: A blank line follows the heading
      Given the files are begun at "2026-10-25T04:36:12Z"
      When the files are ended
      Then line 2 of the file "import-summary.md" is empty

    Scenario: The summary says when the import began under a heading
      Given the files are begun at "2026-10-25T04:36:12Z"
      When the files are ended
      Then line 3 of the file "import-summary.md" says under a heading that the import began at "2026-10-25T04:36:12Z"

    Scenario: The table follows the line saying when
      Given the files are begun
      When the files are ended
      Then line 4 of the file "import-summary.md" is empty

    Scenario: An import that said nothing has no errors
      Given the files are begun
      When the files are ended
      Then line 5 of the file "import-summary.md" is "| import-errors | 0 |"

    Scenario: The errors in all are the first row
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/3" saying "Game.WinnerNotAhead: Error: refused"
      When the files are ended
      Then line 5 of the file "import-summary.md" is "| import-errors       | 2 |"

    Scenario: Every code of the errors has a row of how many there were
      Given the files are begun
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/3" saying "Game.WinnerNotAhead: Error: refused"
      And the files are told of an error for "croquetscores.com/blocks/4" saying "Competition.NotDrawnToMeet: Error: refused"
      When the files are ended
      Then the file "import-summary.md" has the line "| Game.WinnerNotAhead        | 2 |"

    Scenario: Every code of the corrections has a row of how many there were
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportBlocks.GamesReordered | 2 |"

    Scenario: What is accepted has a row too
      Given the files are begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      When the files are ended
      Then the file "import-summary.md" has the line "| Competition.NotDrawnToMeet | 1 |"

    Scenario: The codes are in order after the errors in all
      Given the files are begun
      And a correction of the code "ImportCompetition.GameNoted" is said
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "import-summary.md" says "| ImportBlocks.GamesReordered |" before "| ImportCompetition.GameNoted |"

    Scenario: A code that was both corrected and an error has one row of both
      Given the files are begun
      And a correction of the code "ImportCompetition.GameNoted" is said
      And the files are told of an error for "croquetscores.com/blocks/2" saying "ImportCompetition.GameNoted: Error: refused"
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportCompetition.GameNoted | 2 |"

    Scenario: A code is said in the table once
      Given the files are begun
      And a correction of the code "ImportCompetition.GameNoted" is said
      And the files are told of an error for "croquetscores.com/blocks/2" saying "ImportCompetition.GameNoted: Error: refused"
      When the files are ended
      Then the file "import-summary.md" has 1 row of the code "ImportCompetition.GameNoted"

    Scenario: The codes are padded to the longest, so that the numbers are in a column
      Given the files are begun
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And a correction of the code "ImportCompetition.GameNoted" is said
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      When the files are ended
      Then the file "import-summary.md" has the line "| Game.WinnerNotAhead         | 1 |"

    Scenario: Every row is as wide as the others
      Given the files are begun
      And 12 corrections of the code "ImportBlocks.GamesReordered" are said
      And a correction of the code "ImportCompetition.GameNoted" is said
      And the files are told of an error for "croquetscores.com/blocks/2" saying "Game.WinnerNotAhead: Error: refused"
      When the files are ended
      Then every row of the table in the file "import-summary.md" is as wide as the others

    Scenario: The numbers are to the right, so that they end in the same column
      Given the files are begun
      And 12 corrections of the code "ImportBlocks.GamesReordered" are said
      And a correction of the code "ImportCompetition.GameNoted" is said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportCompetition.GameNoted |  1 |"

    Scenario: A number of a thousand or more has its thousands separated by a comma
      Given the files are begun
      And 1000 corrections of the code "ImportBlocks.GamesReordered" are said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportBlocks.GamesReordered | 1,000 |"

    Scenario: A row of fewer digits is padded to the width of the largest number
      Given the files are begun
      And 1000 corrections of the code "ImportBlocks.GamesReordered" are said
      And a correction of the code "ImportCompetition.GameNoted" is said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportCompetition.GameNoted |     1 |"

    Scenario: The summary is written even though no code was said
      Given the files are begun
      When the files are ended
      Then the import's folder has the file "import-summary.md"

    Scenario: The summary does not give the results of a file
      Given the files are begun
      And game 4 of "croquetscores.com/knockouts/10088" of "2014/ac/spring-open" on "croquetscores.com" is said as "Competition.NotDrawnToMeet"
      When the files are ended
      Then the file "import-summary.md" does not say "## Competition.NotDrawnToMeet: croquetscores.com/knockouts/10088 game 4"

  Rule: Each import adds its summary to the end of the one before's

    Scenario: The first import heads the summary
      Given the files are begun at "2026-10-25T04:36:12Z"
      When the files are ended
      Then the file "import-summary.md" has the line "# Import Summary" once

    Scenario: The second import does not head the summary again
      Given the files are begun at "2026-10-25T04:36:12Z"
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      When the files are ended
      Then the file "import-summary.md" has the line "# Import Summary" once

    Scenario: The summary says when the first import began
      Given the files are begun at "2026-10-25T04:36:12Z"
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      When the files are ended
      Then the file "import-summary.md" has a heading saying the import began at "2026-10-25T04:36:12Z"

    Scenario: The summary says when the second import began
      Given the files are begun at "2026-10-25T04:36:12Z"
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      When the files are ended
      Then the file "import-summary.md" has a heading saying the import began at "2026-10-26T09:01:30Z"

    Scenario: The second import's summary is after the first's
      Given the files are begun at "2026-10-25T04:36:12Z"
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      When the files are ended
      Then the file "import-summary.md" says the import began at "2026-10-25T04:36:12Z" before it says the import began at "2026-10-26T09:01:30Z"

    Scenario: The first import's totals are kept
      Given the files are begun at "2026-10-25T04:36:12Z"
      And 2 corrections of the code "ImportBlocks.GamesReordered" are said
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportBlocks.GamesReordered | 2 |"

    Scenario: The second import's totals are added
      Given the files are begun at "2026-10-25T04:36:12Z"
      And 2 corrections of the code "ImportBlocks.GamesReordered" are said
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      And a correction of the code "ImportBlocks.GamesReordered" is said
      When the files are ended
      Then the file "import-summary.md" has the line "| ImportBlocks.GamesReordered | 1 |"

    Scenario: A blank line separates the second import's summary from the first's
      Given the files are begun at "2026-10-25T04:36:12Z"
      And the files are ended
      And the files are begun at "2026-10-26T09:01:30Z"
      When the files are ended
      Then the file "import-summary.md" has a blank line before the heading saying the import began at "2026-10-26T09:01:30Z"

    Scenario: A codes file of the first import is not kept
      Given the files are begun at "2026-10-25T04:36:12Z"
      And a correction of the code "ImportBlocks.GamesReordered" is said
      And the files are ended
      When the files are begun at "2026-10-26T09:01:30Z"
      Then the import's folder does not have the file "ImportBlocks.GamesReordered.md"
