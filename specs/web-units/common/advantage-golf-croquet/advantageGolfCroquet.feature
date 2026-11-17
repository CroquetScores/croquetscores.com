Feature: Advantage Golf Croquet is offered on a try website before it is offered on the site

  A competition can be played as Advantage Golf Croquet (`advantage.feature`),
  which is a major change to how a competition is scored and ranked. So it is
  first offered where anything entered may be removed at any time, on the try
  website, and is released to croquetscores.com when whoever runs the site
  says so, without a new version of the site being deployed. That is a setting on whatever
  serves the site, like whether search engines are welcome
  (`searchEngines.feature`), and it belongs on the same deployment checklist.

  Offered means a manager is given the choice of it when they add or change a
  competition, and a request that says a competition is Advantage is answered
  when it is. Where it is not offered the choice is not there, and a request
  that says it is refused, rather than quietly dropped, since the manager who
  sent it meant something the site is not doing. What is offered is for the
  site to say, and what a competition does with it is the competition's
  (`advantage.feature`).

  It is a rule of golf croquet, so Gateball Scores never offers it, whatever
  the setting says. Development offers it, since it is where the site is
  worked on, and so does a try website, whatever the setting says.

  The setting is true or false, and blank is false. It is the answer that
  cannot be left behind by mistake: a deployment that forgets it is merely
  missing a choice, which is noticed, where the other way round a major
  change is offered to everybody before it was meant to be, which is noticed
  by nobody. A value
  that is neither stops the site starting, as every other setting not
  understood does, rather than quietly meaning one of them.

  These scenarios run against the config loader and the one answer, and say
  nothing of what a page or a request does with it, which is each one's own.

  Rule: Told nothing, only a try website and development offer it

    Scenario Outline: A website is told nothing about Advantage Golf Croquet
      Given the site is told nothing about Advantage Golf Croquet
      When Advantage Golf Croquet is asked of "<website>"
      Then it is <answer>

      Examples:
        | website                | answer      |
        | try.croquetscores.com  | offered     |
        | localhost:3000         | offered     |
        | croquetscores.com      | not offered |
        | gateballscores.com     | not offered |
        | try.gateballscores.com | not offered |

    Scenario: Advantage Golf Croquet said not to be offered is not offered on croquetscores.com
      Given the site is told Advantage Golf Croquet is not offered
      When Advantage Golf Croquet is asked of "croquetscores.com"
      Then it is not offered

  Rule: Told it is offered, croquetscores.com offers it too

    Scenario Outline: A website is told Advantage Golf Croquet is offered
      Given the site is told Advantage Golf Croquet is offered
      When Advantage Golf Croquet is asked of "<website>"
      Then it is <answer>

      Examples:
        | website                | answer      |
        | croquetscores.com      | offered     |
        | try.croquetscores.com  | offered     |
        | localhost:3000         | offered     |
        | gateballscores.com     | not offered |
        | try.gateballscores.com | not offered |

  Rule: A setting that is neither true nor false stops the site starting

    Scenario Outline: A setting that is not understood
      Given the site is told Advantage Golf Croquet is "<setting>"
      Then the site cannot start for "ADVANTAGE_GOLF_CROQUET"

      Examples:
        | setting |
        | yes     |
        | 1       |
        | on      |
