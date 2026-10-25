/admin/administrators/countries

from src\import-ravendb\world-ranking-events\ac-world-ranking-countries.csv and src\import-ravendb\world-ranking-events\gc-world-ranking-events.csv create a unique list of country names.

from the database list tournaments whose country is not in the unique list.

the list is to be ordered by country and display a link to the old site:

https://croquetscores.com/{year}/{sport}/{tournament slug}