# Koncové body API pro GET

Tyto adresy čtou a nic nemění; ty, které něco mění, jsou v [koncových bodech pro POST](post-endpoints.md). Každá adresa zde je pod `/api/v0` na webu a každá odpověď je JSON. Co platí pro všechny, jako klíče, limity, chyby a levné dotazování, je v [nápovědě pro vývojáře aplikací](index.md). Do kterékoli odpovědi mohou přibýt pole bez nové verze (viz [pole mohou přibýt](index.md#fields-may-be-added)), takže ignorujte, co neznáte.

Turnaj nebo soutěž se v adrese pojmenuje částí svého id za lomítkem: u `tournament/4f2a…` je v adrese `4f2a…`. Každá odpověď říká v `href`, kde najdete to, o čem vypráví, a v `uri`, kde to ukazuje web, jako cestu začínající lomítkem.

## Turnaje jednoho roku {#tournaments}

`GET /api/v0/tournaments?year=2026`

Přijímá:

- `year`, povinný, celé číslo jako `2026`.
- `sport`, kód sportu (viz [sporty](#sports)), aby se vypsal jen tento sport. Bez něj je rok všech sportů jediný požadavek.
- `changedSince`, okamžik zapsaný jako `2026-03-01T10:00:00Z`, aby se vypsalo jen to, co se od té doby změnilo.
- `page` a `pageSize`, kde stránka má nejvýše 100 položek.

Odpovídá polem `tournaments`, u každého turnaje:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (nebo `null`), `sport`
- `uri` a `href`
- `national` a `international`, zda je organizátor zaškrtl
- `changedAt`, kdy se naposledy uložilo cokoli o turnaji nebo o některé jeho soutěži
- `etag`, vytvořený z toho, co turnaj říká, abyste poznali, které turnaje změněného seznamu se změnily

a dále `total`, `page`, `pageSize` a `next`, což je adresa další stránky, nebo `null` u poslední. Id zůstává stejné, ať se turnaj přejmenuje nebo přesune jakkoli. Seznam se dotazuje znovu s `ETag`, který poslal, a odpovídá se `304`, pokud se nic nezměnilo.

## Jeden turnaj {#tournament}

`GET /api/v0/tournaments/{id}`

Říká to, co seznam, a navíc:

- `competitions`: u každé `id`, `name`, `kind` (`block`, `swiss`, `knockout` nebo `test`), `uri`, `href`, `changedAt` a `etag`.
- `players`, u turnaje hraného jednotlivci: u každého `id`, `name`, `worldRankingName`, `handicap` jako číslo (nebo `null`), `representing` (nebo `null`) a `etag`.
- `teams`, u turnaje hraného družstvy, který nemá vlastní hráče: u každého `id`, `name`, `shortName` a jeho `players`, u každého `id`, `name` a `worldRankingName`.

Klíč vytvořený pro jeden turnaj čte tento turnaj a žádný jiný, a pro jakýkoli jiný je odmítnut s `ApiKey.LimitedToAnotherTournament`. Odpověď je `304`, pokud je `ETag` nebo `Last-Modified`, které se poslaly, stále aktuální.

## Sporty {#sports}

`sport`, který turnaj uvádí a pro který lze seznam žádat, je jeden z těchto kódů:

| Kód   | Sport               |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

Sport může v budoucnu přibýt, stejně jako pole (viz [pole mohou přibýt](index.md#fields-may-be-added)), takže by aplikace měla zvládnout kód, který nezná.

## Jedna soutěž {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Říká `name`, `kind`, `href`, `uri` a `changedAt` soutěže a kde API vypráví o jejích hrách (`games`) a u bloku a švýcarského systému, které jako jediné je mají, o jejím pořadí (`standings`).

## Pořadí bloku nebo švýcarského systému {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Říká soutěž a `standings`: u každého hráče `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (nebo `null`) a `shared`, zda se pozice dělí. Blok přidává `lost`, `gamesWon` a `netGames`, které švýcarský systém neříká.

## Hry soutěže {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Říká soutěž a její hry. Každá hra má `id`, `winner` a `loser`, `drawn`, `withdrawn` (odehraná, ale nic se nepočítá), `round` (u pavouka, kde první je 1, jinde `null`) a `changedAt`. Každá strana říká `playerId` hráče, jeho `name` a jeho `score` tak, jak byl zapsán, například `26tp`. Kde hra skončila remízou, o tom, která strana se jmenuje vítěz, rozhoduje jen pořadí, v jakém byly zapsány.

Test, zápas dvou družstev, říká `matches` a ne `games`: každý zápas s dvěma `players`, po jednom z každého družstva, a `games` mezi nimi.

## Co smí klíč {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Vyžaduje klíč a říká, co tento klíč smí v turnaji: `part`, což je role jeho účtu (`manager`, `scorer` nebo `neither`), `mayRead` a `mayWrite`. Aplikace tak může říct, proč by byl zápis odmítnut, dříve než nějaký pošle. Odpověď je určena klíči, který se ptal, a proto se nikdy neukládá (`Cache-Control: no-store`).

## Turnaje, které změnily rok {#changed-year}

`GET /api/v0/tournaments/changed-year`

Vypisuje turnaje, které se dostaly do jiného roku, než v jakém byly, aby aplikace mohla přesunout, co uchovává. Přijímá `changedSince`, `page` a `pageSize`. Každý má `tournamentId`, `previousYear` a `newYear`.

## Archivované turnaje {#archived}

`GET /api/v0/tournaments/archived`

Vypisuje turnaje, které byly archivovány, aby je aplikace mohla přestat zobrazovat. Přijímá `archivedSince`, zapsané jako `2026-03-01T10:00:00Z`, `page` a `pageSize`. Každý má `tournamentId` a `archivedAt`.
