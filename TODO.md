# TODO.md

## Event shape after live

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

## Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

## Importing Changes

For all of the following write to import-corrections.md.
