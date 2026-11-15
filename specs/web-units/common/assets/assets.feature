Feature: The site's own files are given as often as a page needs them, and no oftener

  Every page is drawn with a handful of files, the stylesheet, the scripts and
  the pictures, and each is read from disk when it is asked for. A reader gets
  those once and keeps them for a year, so one who keeps asking is not a
  reader but a program, and a program asking in thousands costs the site a read
  of a file for each.

  So one address may ask for the files only so many times a minute, a number a
  reader at a club behind one address, with a page opened by each of a dozen
  people at once, does not come near. An address that asks more is told to wait
  and is let through again when the minute is out. The count is by the address
  the request came from as the site is told to read it, which is
  `trustedProxy.feature`'s, so that behind a load balancer it is the reader's
  and not the balancer's.

  The limit is on the files and on nothing else, and a name that has no file is
  counted as a file is: asking for names at random is the way to find out which
  there are.

  The answer that tells a reader to wait is not one for anyone to keep: a
  stylesheet's address answers with the file for a year, and the wait must not
  be taken for that answer by a cache between the site and its readers.

  These scenarios run against a server built for the files alone, with a limit
  of three a minute so that it is reached in a few requests.

  Background:
    Given the site's files are limited to 3 requests a minute from one address

  Rule: A reader is given the files up to the limit

    Scenario: A reader asking as often as the limit allows is given the file
      When a reader asks for a file 3 times
      Then the last answer is the file

    Scenario: A reader asking once more is told to wait
      When a reader asks for a file 4 times
      Then the last answer is to wait

    Scenario: The answer says how long to wait
      When a reader asks for a file 4 times
      Then the answer says how long to wait

    Scenario: The answer to wait is not kept
      When a reader asks for a file 4 times
      Then the answer is not to be kept by a cache

  Rule: Each address is counted by itself

    Scenario: Another address is not held back by one that has been
      Given a reader has asked for a file 4 times
      When another reader asks for a file
      Then the last answer is the file

  Rule: What is counted is the files

    Scenario: A name with no file is counted
      When a reader asks for a file that is not there 4 times
      Then the last answer is to wait

    Scenario: A page is not counted
      Given a page beside the files
      When a reader asks for the page 4 times
      Then the last answer is the page

    Scenario: A page is still given to a reader who has been told to wait for files
      Given a page beside the files
      And a reader has asked for a file 4 times
      When the same reader asks for the page
      Then the last answer is the page

  Rule: Behind a proxy it is the reader that is counted

    A load balancer's connections all come from it, so counting by the
    connection would hold every reader to one reader's share. The address in
    what the proxy forwarded is believed from the proxy the site was told of and
    from no one else, since anything can write it.

    Scenario: A reader behind the proxy who asks too often is told to wait
      Given the site is told its proxy is at "10.0.0.1"
      When a reader at "192.0.2.1" asks for a file 4 times through the proxy
      Then the last answer is to wait

    Scenario: Another reader behind the same proxy is not held back
      Given the site is told its proxy is at "10.0.0.1"
      And a reader at "192.0.2.1" has asked for a file 4 times through the proxy
      When a reader at "192.0.2.2" asks for a file through the proxy
      Then the last answer is the file

    Scenario: An address written by something that is not the proxy is not believed
      Given the site is told its proxy is at "10.0.0.1"
      When something that is not the proxy asks for a file 4 times, naming another address each time
      Then the last answer is to wait
