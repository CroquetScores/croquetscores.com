Feature: Running an importer over a collection of the old sites' documents

  An importer says which RavenDB collection it reads and what it does with one
  document from it. Running it reads the collection a page of 100 documents
  at a time and hands each document to the importer in turn.

  A page at a time, because RavenDB holds on to everything a session has
  loaded and refuses a session more than 30 requests, and the collections are
  larger than either allows.

  A document the importer refuses does not stop the import. What went wrong
  is kept, against the website and the document it went wrong with, and the
  next document is handed over. An import is run again and again while it is
  being written, and one that stopped at the first bad document would be run
  once for every bad document there is.

  What is shown on screen as it goes — how many documents have been read, how
  many refused, and how long it took — is for whoever is watching, and is not
  specified here.

  Background:
    Given an importer of the collection "Users"

  Rule: Every document in the collection is handed to the importer

    Scenario: A collection smaller than a page is handed over whole
      Given "croquetscores.com" has 3 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then the importer was handed 3 documents

    Scenario: A collection larger than a page is handed over whole
      Given "croquetscores.com" has 250 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then the importer was handed 250 documents

    Scenario: A collection of exactly one page is handed over whole
      Given "croquetscores.com" has 100 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then the importer was handed 100 documents

    Scenario: The collection is read a page at a time
      Given "croquetscores.com" has 250 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then no page read was larger than 100 documents

    Scenario: Documents are handed over in the order they are read
      Given "croquetscores.com" has 250 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then the importer was handed "users/1" first
      And the importer was handed "users/250" last

    Scenario: Each document is handed over with the website it came from
      Given "gateballscores.com" has 1 document in "Users"
      When the importer is run over "gateballscores.com"
      Then the importer was handed "users/1" from "gateballscores.com"

    Scenario: How many documents were read is said
      Given "croquetscores.com" has 250 documents in "Users"
      When the importer is run over "croquetscores.com"
      Then the run says it read 250 documents

  Rule: A document the importer refuses is kept as an error, and the import goes on

    Scenario: A refused document is kept as an error
      Given "croquetscores.com" has 3 documents in "Users"
      And the importer refuses "users/2"
      When the importer is run over "croquetscores.com"
      Then an error is kept for "croquetscores.com/users/2"

    Scenario: The error kept says why the document was refused
      Given "croquetscores.com" has 3 documents in "Users"
      And the importer refuses "users/2"
      When the importer is run over "croquetscores.com"
      Then the error kept for "croquetscores.com/users/2" says "Refused users/2"

    Scenario: The documents after a refused one are handed over
      Given "croquetscores.com" has 3 documents in "Users"
      And the importer refuses "users/2"
      When the importer is run over "croquetscores.com"
      Then the importer was handed "users/3" last

    Scenario: A document not refused is kept as no error
      Given "croquetscores.com" has 3 documents in "Users"
      And the importer refuses "users/2"
      When the importer is run over "croquetscores.com"
      Then no error is kept for "croquetscores.com/users/1"

    Scenario: How many documents were refused is said
      Given "croquetscores.com" has 3 documents in "Users"
      And the importer refuses "users/2"
      When the importer is run over "croquetscores.com"
      Then the run says 1 document was refused
