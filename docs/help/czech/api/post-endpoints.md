# Koncové body API pro POST

**POZNÁMKA: Toto je koncept. Několik koncových bodů bude podle mě odstraněno.**

Tyto adresy něco mění. Ty, které jen čtou, jsou v [koncových bodech pro GET](get-endpoints.md). Každá adresa zde je pod `/api/v0` na webu a to, co mění stránky samotného webu, mění tytéž adresy, takže aplikace nemá menší sadu než web. Co platí pro všechny, jako klíče, limity a chyby, je v [nápovědě pro vývojáře aplikací](index.md); kdo smí zapisovat, je [níže](#who-may-write).

Turnaj, soutěž a ostatní se v adrese pojmenují částí svého id za lomítkem: u `tournament/4f2a…` je v adrese `4f2a…`. Tělo požadavku pojmenovává jiné věci stejně, jako to dělá `player` níže, kromě případů, kdy se říká, že jde o celé id.

Tělo posílejte jako JSON s hlavičkou `Content-Type: application/json`. Pole, které chybí, je totéž jako pole prázdné a je tak i odmítnuto. Co se pošle a tato stránka to nezmiňuje, se ignoruje. Odpověď nese `Cache-Control: no-store`.

## Kdo smí zapisovat {#who-may-write}

Požadavek, který něco mění, posílá klíč vytvořený k zápisu (viz [klíče](index.md#keys)) nebo přihlášený člověk. Klíč smí to, co smí účet, pro který vznikl, a nic víc:

- Klíč vytvořený jen ke čtení je odmítnut s `ApiKey.ReadOnly`.
- Klíč vytvořený pro jeden turnaj smí měnit jen ten turnaj. Pro jiný je odmítnut s `ApiKey.LimitedToAnotherTournament` a nesmí vytvořit turnaj, který nepatří žádnému.
- Organizátoři turnaje smějí měnit všechno, co se ho týká.
- Zapisovatelé turnaje smějí dělat to, co se dělá se skóre, a nic jiného: přidat hru, opravit ji, posunout ji, archivovat ji, obnovit ji, neuznat ji a zrušit neuznání. Cokoli jiného v turnaji je jim odmítnuto s `Tournament.NotAManager`.
- Kdokoli jiný je odmítnut s `Tournament.NotAManager` nebo s `Tournament.NotAManagerOrScorer` tam, kde by zapisovatel prošel.

`GET /api/v0/tournaments/{id}/permissions` říká, jakou roli má klíč v turnaji (viz [co smí klíč](get-endpoints.md#permissions)), aby aplikace mohla říct, proč by byl zápis odmítnut, ještě než ho pošle.

## Jak vypadá odpověď {#answers}

Požadavek, který něco vytváří, se odpovídá `201` s `id` nové věci, což je celé její id tak, jak je říkají koncové body pro GET. Požadavek, který mění něco, co existuje, se odpovídá `204` a bez těla. Odmítnutý požadavek se odpovídá jako každá chyba (viz [chyby](index.md#errors)): jeho `code`, na který se aplikace spoléhá, a `field`, kterého se týkal, pokud nějaké bylo.

Poslat požadavek dvakrát není totéž jako jednou: hra přidaná dvakrát jsou dvě hry. Aplikace, které se neřeklo, zda požadavek prošel, si má před dalším odesláním přečíst, co změnil.

## Turnaje {#tournaments}

### Vytvoření turnaje {#create-tournament}

`POST /api/v0/tournaments`

Přijímá `name`, `starts` a `finishes` (zapsané jako `2026-10-03T00:00:00Z`), `format`, `sport` (kód, viz [sporty](get-endpoints.md#sports)), `country` (kód, například `au`) a podle potřeby `region`, `subtitle`, `levelTestsDrawn`, `national` a `international`, z nichž každé z posledních tří je `true` nebo `false`. Odpovídá `201` s `id` a `address`, což je místo, kde ho web ukazuje.

### Archivace, obnovení nebo odebrání významného statusu {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

`POST /api/v0/tournaments/{id}/remove-notable-status`

Nepřijímají tělo a odpovídají `204`. Odebrání významného statusu, který říká, že turnaj není ani národní, ani mezinárodní, je záležitostí administrátora.

### Smazání zkušebního turnaje {#delete-tournament}

`POST /api/v0/tournaments/{id}/delete`

Záležitost administrátora, který posoudil, že turnaj je zkušební. Přijímá `message`, což se řekne organizátorům turnaje, a `archive`, `true`, aby se turnaj také archivoval. Odpovídá `204`.

### Přidání poznámky organizátora {#notes}

`POST /api/v0/tournaments/{id}/notes`

Přijímá `title` a `description`. Odpovídá `201` s `id` poznámky. Popis smí mít až 750 000 znaků a požadavek smí být tak velký, jak je k tomu třeba.

## Lidé, kteří mají v turnaji roli {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Udělají z někoho zapisovatele nebo organizátora. Přijímají `emailAddress`, e-mailovou adresu jeho účtu, a odpovídají `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Zapisovatele nebo organizátora odeberou. Nepřijímají tělo a odpovídají `204`. `account` je část id účtu za `account/`.

## Soutěže {#competitions}

### Přidání soutěže {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Přijímá `kind`, jedno z `block`, `swiss`, `knockout` nebo `losers-knockout`, a `name`, a pak to, co má její druh:

- Blok přijímá `bestOf` a `rounds` (kolikrát hraje každý s každým) a může přijmout `tieBreak`.
- Švýcarský systém přijímá `bestOf`.
- Pavouk přijímá `places` a `rounds`, seznam s tím, na kolik her se hraje v každém kole, a může přijmout `losers`, seznam pavouků poražených, které se vytvoří spolu s ním, každý s `name` a `round`.
- Pavouk poražených přijímá `from`, soutěž, jejíž poražené bere, a `round`, z něhož je bere.

Blok, švýcarský systém a pavouk mohou také přijmout, jak se hrají a počítají: `handicap`, `drawsAllowed`, `worldRankings` a `advantage`, každé `true` nebo `false`, a `maximumHoops`, číslo, nebo `null` pro žádné maximum. Soutěž, která říká `advantage`, je odmítnuta s `Advantage.NotOffered`, dokud web Advantage Golf Croquet nenabízí. Odpovídá `201` s `id` soutěže.

### Přidání testu {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Test je zápas mezi dvěma týmy v týmovém turnaji. Přijímá `firstTeam` a `secondTeam`, každé id týmu za `team/`, `starts` a `finishes`, `expectedMatches`, `bestOf`, `group` a stejná pravidla jako soutěž. Odpovídá `201` s jeho `id`, což je id soutěže.

### Posunutí, archivace nebo obnovení soutěže {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Posunou ji v seznamu turnaje o místo nahoru nebo dolů, archivují ji nebo ji obnoví. Nepřijímají tělo a odpovídají `204`. Test se těmito také posouvá, archivuje a obnovuje.

## Hráči soutěže {#competition-players}

### Přihlášení hráče {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Přihlásí do soutěže jednoho z hráčů turnaje. Přijímá `player`, část id hráče turnaje za `tournament-player/`. Odpovídá `201` s `id`, což je id hráče v soutěži, ne v turnaji.

### Přihlášení více hráčů {#enter-players}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/many`

Přijímá `players`, seznam hráčů turnaje jako `player` výše, a `enterWhatCan`. Ve výchozím stavu se přihlásí všichni, nebo nikdo. Kde někteří přihlášeni být nemohou, odpověď řekne které a nepřihlásí nikoho, aby si organizátor mohl vybrat; pošlete `enterWhatCan` jako `true`, aby se přihlásili ostatní. Odpovídá `201` s `ids` v pořadí, v jakém byli hráči zadáni, a s `refused`.

### Posunutí, odstoupení, vrácení nebo odebrání hráče {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Posunou hráče o místo nahoru nebo dolů, nechají ho odstoupit, zruší jeho odstoupení nebo ho odeberou ze soutěže. `player` je část jeho id v soutěži za `competition-player/`. Nepřijímají tělo a odpovídají `204`.

Každý bye v soutěži má stejné id, takže bye se rozlišuje podle `order`, celého čísla připojeného k adrese jako `?order=2`. Cokoli jiného je odmítnuto s `Request.Invalid`.

## Hry soutěže {#games}

### Přidání hry {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Přijímá `winner` a `loser`, každého jako část id hráče soutěže za `competition-player/`, a skóre. Hráči testu nejsou jeho vlastní, takže u testu je každý celým id hráče z jednoho z jeho týmů, jako `team-player/…`.

Skóre je takové, jaké soutěž vede:

- `winnerScore` a `loserScore`, tak jak byly zadány, například `26` nebo `26tp`.
- U soutěže hrané jako Advantage Golf Croquet místo nich `winnerHoops`, `winnerTarget`, `loserHoops` a `loserTarget`: branky, které každá strana získala, a branky, do kterých se hrálo. `w` za jedním z nich, jako `"3w"`, říká, že ta strana vyhrála tam, kde jsou zlomky stejné.

Požadavek s druhem skóre, který soutěž nevede, je odmítnut s `Game.AdvantageScoreTyped` nebo `Game.HoopsAndTargetsNotAdvantage`. Odpovídá `201` s `id` hry.

### Oprava hry {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Přijímá skóre jako přidání hry a tam, kde se změnili, `winner` a `loser`. Hráč, který není poslán, je ten, který ve hře už je. `game` je část jejího id za `game/`. Odpovídá `204`.

### Posunutí, archivace, obnovení nebo neuznání hry {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Posunou skóre testu o místo nahoru nebo dolů, archivují hru nebo ji obnoví, neuznají ji (byla odehrána a nic se nepočítá) nebo zruší její neuznání. Nepřijímají tělo a odpovídají `204`. Tyto a dva výše smí zapisovatel.

## Hráči turnaje {#tournament-players}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Posunou jednoho z hráčů turnaje o místo nahoru nebo dolů, nebo ho archivují či obnoví. `player` je část jeho id za `tournament-player/`. Nepřijímají tělo a odpovídají `204`.

## Týmy turnaje {#teams}

### Přidání týmu {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Přijímá `name` a `shortName` a může přijmout `flag`. Odpovídá `201` s `id` týmu.

### Přidání hráče do týmu {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Přijímá `name` a může přijmout `worldRankingName`. Odpovídá `201` s `id` hráče.

### Posunutí, archivace nebo obnovení týmu {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Nepřijímají tělo a odpovídají `204`.

### Posunutí, archivace nebo obnovení hráče týmu {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

`player` je část jeho id za `team-player/`. Nepřijímají tělo a odpovídají `204`.
