# TODO.md

## Event shape after live

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

## Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

## Importing Changes

### Tournament

#### Tournament Players

When importing team players do not import byes; however you need to keep their ids in memory so when you import the competition players you know where to add the fixed code for byes.

#### Team competitions in Standard Tournaments

If a standard tournament has a team competition read the team competition, if it has zero games then do not import the competition, otherwise write error with tournament document id and competition document id.

#### Team Tournaments

Before importing a team tournament read all of its TeamMatches. Get the minimum start date and maximum finish date. Use those dates for the start and finish date of the tournament. 

eg. TeamMatches/10312 

"Start": "2017-03-26T00:00:00.0000000",
"Finish": "2017-04-26T00:00:00.0000000"

Use those dates for tournaments/30125

#### Team Tournaments

If the expected matches for a team match is 1 then calculate the actual expected matches using best of and games.
