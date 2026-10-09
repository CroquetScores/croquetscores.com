# TODO.md

## Event shape after live

- SETUP.md §7.2 says a stored event's shape only ever gains optional fields, with no exception while no site keeps events. Until one does, event shapes can still change, and the rule as written has already led a review to flag such a change as breaking stored data. Add that the rule starts applying once the site holds real data.

## Sending email

- **Infrastructure.** A mail provider for sending real email, and its settings. `FileEmailSender` stands in until then.

## Importing Changes

### Knockouts

#### Wrong seeding

Knockouts not drawn in the order their players are listed, about 170 errors in around 75 knockouts. For example, knockouts/10113 lists its four players as Hazdra, Doskocil, Placha, Drsticka. So the site draws Hazdra against Doskocil. But the games were Hazdra v Drsticka and Doskocil v Placha, a seeded 1 v 4 and 2 v 3. Both semi-finals are refused. Worse, the final between Hazdra and Doskocil is accepted as if it were a first-round match, so this knockout is wrong on the site, not merely incomplete. The fix: where the listed order doesn't match the first-round games, work out the draw from those games. The import already does this when byes are missin
