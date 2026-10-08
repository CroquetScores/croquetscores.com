# TODO.md

## Event shape after live

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

## Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

## Importing Changes

### Tournament

#### Tournament Players

When importing tournament players do not import byes; however you need to keep their ids in memory so when you import the competition players you know where to add the fixed code for byes.

#### Empty Competitions

If Tournament.Competitions is empty do not import the tournament.