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

## Čím může turnaj být {#choices}

Tři seznamy říkají, čím může turnaj být na dotazovaném webu: jeho sporty, jeho formáty a země, ve kterých se může konat. Je to to, co nabízí vlastní formulář webu pro nový turnaj, takže turnaj vytvořený s kódem z některého z nich [Vytvoření turnaje](post-endpoints.md#create-tournament) přijme. Klíč nepotřebují. Každý přijímá `language`, značku jazyka, například `de`, aby své volby pojmenoval v tomto jazyce; značka, kterou web nenabízí, se odmítne s `400` a její `code` říká, který seznam ji odmítl: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` nebo `Countries.LanguageUnknown`. Bez ní se sporty a země pojmenují anglicky a formáty v jazyce, který říká prohlížeč nebo cookie webu, takže uveďte `language` tam, kde se názvy zobrazují. Každá odpověď nese `ETag` a odpovídá se `304`, kde je beze změny.

### Sporty {#sports}

`GET /api/v0/tournaments/sports`

Odpovídá polem `sports`, u každého sportu `code` a `name`. `sport`, který turnaj uvádí a pro který lze seznam žádat, je jeden z těchto kódů. Croquet Scores nabízí `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) a `gb` (Gateball); Gateball Scores nabízí jen Gateball. Sport může v budoucnu přibýt, stejně jako pole (viz [pole mohou přibýt](index.md#fields-may-be-added)), takže by aplikace měla zvládnout kód, který nezná.

### Formáty {#formats}

`GET /api/v0/tournaments/formats`

Odpovídá polem `formats`, u každého formátu `code`, což je název, pod kterým se turnaj vytváří, `name`, `teams`, zda se hraje v týmech, a `drawsLevelTests`, zda turnaj v něm losuje rozhodující test, pokud neřekne, že ne.

### Země {#countries}

`GET /api/v0/countries`

Odpovídá polem `countries`, u každé země `code` (například `au`), `name` a `regions`, u každého regionu `code` a `name`. Jsou seřazeny podle svých názvů v dotazovaném jazyce. Region se pojmenuje tak, jak byl zaznamenán, většinou v jazyce vlastní země. Země, která není rozdělena, má jeden region, a tím je ona sama.

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

## Hráči světového žebříčku {#world-ranking-players}

`GET /api/v0/ac/world-ranking-players`

Vypíše hráče Association Croquet, které světové žebříčky znají. Přijímá `changedSince`, zapsaný jako `2026-03-01T10:00:00Z`, `page` a `pageSize`, kde stránka má nejvýše 100 položek. Odpovídá polem `worldRankingPlayers`, u každého hráče:

- `id` a `worldRankingId`, číslo, které hráči dávají žebříčky
- `name`, jak ho žebříčky jmenují
- `games`, kde API vypráví o hrách hráče (viz [hry hráče](#world-ranking-player-games))
- `archivedAt`, kdy byl hráč archivován, nebo `null`
- `changedAt` a `etag`, vytvořený z toho, co hráč říká

a `total`, `page`, `pageSize` a `next`, stejně jako u turnajů jednoho roku. Seznam se žádá znovu s `ETag`, který poslal, a odpovídá se `304`, kde se nic nezměnilo. Odmítnutý požadavek se odmítne s `code`, který začíná `WorldRankingPlayers.`, například `WorldRankingPlayers.PageNotWhole`, a s `field`.

## Hry hráče světového žebříčku {#world-ranking-player-games}

`GET /api/v0/ac/world-ranking-players/{id}/games`

`id` je část `id` hráče za lomítkem, jak ji uvádí `games` v seznamu výše. Vypíše hry Association Croquet, které hráč odehrál, ať v bloku, ve švýcarském systému, v pavouku nebo v testu, a ať hrál sám za sebe, nebo za tým. Přijímá `changedSince`, `page` a `pageSize` jako seznam hráčů a odpovídá polem `games`, v pořadí, v jakém byly přidány, u každé hry z pohledu hráče:

- `id`, `tournamentId` a `competitionId`
- `won`, zda hráč vyhrál, což je u remízy `false`, a `drawn`
- `score`, hráčovo, a `opponentScore`, obě tak, jak byla zapsána, například `26tp`
- `opponentName`, jak ho žebříčky jmenují, kde je soupeř hráčem světového žebříčku, a jinak tak, jak ho vede turnaj, a `opponentId`, `id` soupeře ve výše uvedeném seznamu, nebo `null`, kde jím není
- `archived` a `withdrawn`: hra archivované soutěže nebo turnaje, nebo archivovaná či odstoupená hra se vypíše a řekne to, aby aplikace, která si ji ponechala, ji mohla přestat počítat
- `addedAt`, nebo `null` u hry, která byla přidána dříve, než web zaznamenával kdy, a `changedAt`
- `etag`

a `total`, `page`, `pageSize` a `next`. Hráč, kterého web nezná, se odmítne s `404` a `WorldRankingPlayers.NotFound`, což není totéž jako hráč bez her, který má prázdný seznam.
