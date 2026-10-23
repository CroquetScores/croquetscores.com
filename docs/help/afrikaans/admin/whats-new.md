# Wat is nuut vir toernooibestuurders

## Vrygestel 2026-10-23

Dit is die belangrikste veranderinge sedert die vorige uitgawe. Elkeen skakel na die pull request wat dit gemaak het.

- **Voorgifte, gelykopuitslae en die wêreldranglyste word by elke kompetisie bepaal.** Dit was vroeër 'n toernooi se saak, so een toernooi kon nie 'n voorgifteblok langs 'n gelyke een hê nie, of 'n toets wat gelykop mag eindig langs 'n uitskakeling wat dit nie mag nie. Elke kompetisie, en elke toets, vra nou vir al drie wanneer dit bygevoeg of gewysig word, en die toernooivorm doen dit nie meer nie. Laasgenoemde word net gevra waar die sport wêreldranglyste het, en 'n kompetisie wat nie tel nie, word uit die ranglyslêer gelaat. Sien [Kompetisies](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **Die admin se lys toernooie kan volgens land, streek en sport ingeperk word.** Die keuses is in die adres, sodat 'n gefiltreerde lys geskakel kan word, en net wat jou lys bevat, word aangebied. 'n Streek word aangebied sodra 'n land gekies is. Toernooie voor November 2026 het nie 'n streek nie, so as jy een kies, word hulle versteek, en die openbare lyste sê dit. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Wêreldranglysbeamptes is nou een rol vir elke sport.** 'n Association Croquet-beampte sien Association Croquet-toernooie en sorg daarvoor, en 'n Golf Croquet-beampte vir Golf Croquet s'n. 'n Toernooi wat jy bestuur of tel, is steeds in jou lys, watter sport dit ook al is. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **Die Ranglyste-oortjie verduidelik die lêer in een paragraaf, watter sport ook al,** met die aflaaiskakel daaronder. Sien [Ranglyste](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **'n Toernooi se naam mag nie net kleinletters of net hoofletters wees nie,** en die boodskap sê dit nou as 'n reël. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Verwyder is 'n asblik** op die Bestuurders- en Telers-oortjies, by die kompetisie se spelers en op die administrateur se Rekeninge-bladsy, soos Argiveer en Skrap reeds was. Dit heet steeds Verwyder as jy daarop wys, en 'n skermleser lees dit steeds as Verwyder. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Elke taal het nuwe woorde.** Die webwerf se bewoording in al sestien ander tale is van voor af geskryf, en die hulp is daarmee in lyn gebring. Die hulp vir lesers en vir rekeninge, en die gebruiksvoorwaardes, is nou ook in elke taal. Nog niemand wat die taal as moedertaal praat, het dit gelees nie, so sê vir ons wat swak lees. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Agter die skerms.** Die invoer van die ou webwerwe gee sommige tydsones en een toernooi 'n ander land ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), en laai 'n storting met 'n skrip in die bediener en maak die leesmodelle daarmee ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Die webwerf word met 'n skrip ontplooi, vanaf 'n rekenaar of vanaf GitHub, en nie meer by elke samevoeging nie ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Vrygestel 2026-10-19

Dit is die belangrikste veranderinge vir mense wat toernooie bestuur. Die [hulp vir toernooibestuurders](../tournament-managers/index.md) het al die besonderhede.

- **Spelers word een keer in die toernooi ingevoer.** Op die ou webwerf is spelers binne elke kompetisie bygevoeg. Nou is die toernooi se **Spelers**-oortjie waar jy hulle byvoeg, regstel, rangskik en argiveer, en 'n speler wat daar reggestel word, word in elke kompetisie waarin hy is en op elke openbare bladsy reggestel. Sien [Spelers](../tournament-managers/standard-tournament/players.md).

- **Spelers word uit 'n lys in 'n kompetisie geplaas.** Kies op 'n kompetisie se bladsy 'n speler van die toernooi uit die aftreklys en druk **Voeg speler by**. Die aftreklys bied net spelers aan wat nog nie in die kompetisie is nie. In 'n uitskakeling bied dit ook **Bye** aan vir die plekke wat oorbly. Sien [Spelers in 'n kompetisie inskryf](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Een knoppie voeg 'n kompetisie by.** In plaas van die aparte nuwe blok-, nuwe Switsers- en nuwe uitskakelingknoppies, druk **Voeg kompetisie by**. Die dialoog vra vir die naam en die soort (blok, uitskakeling of Switsers), en dan wat daardie soort nodig het: waarvan elke wedstryd die beste is, en vir 'n uitskakeling die plekke in sy trekking. Dit bly oop sodat jy verskeie gelyk kan byvoeg. 'n Kompetisie se soort kan nie daarna verander word nie: argiveer dit en voeg dit weer by. Sien [Kompetisies](../tournament-managers/standard-tournament/competitions.md).

- **Bestuurdersnotas: gebruik dit eerder as 'n kommentaar om spelers te vertel wat hulle moet weet.** Die formaat, 'n verandering in die speelvolgorde, die etenstyd. 'n Nota word op die toernooi se **Notas**-oortjie geskryf, met 'n titel en 'n beskrywing in Markdown, en jy kan dit vooraf bekyk voordat jy dit byvoeg. Spelers vind notas op die toernooi se openbare Notas-bladsy. 'n Nota wat hulle nog nie gelees het nie, word met 'n asterisk gemerk, en so ook die afdeling Notas op elke bladsy van die toernooi, totdat hulle dit oopmaak. 'n Nota wat jy wysig, word weer gemerk vir almal wat dit gelees het. Sien [Notas](../tournament-managers/standard-tournament/notes.md).

- **Die ou webwerf se toernooi-Notas is nou die Onderskrif.** Wat jy daar geskryf het, word as die toernooi se onderskrif bewaar en word steeds onder die toernooi se naam op elke openbare bladsy gewys. Dit word in Markdown geskryf en kan tot 2000 karakters wees. Dit is vir wat lesers moet weet op watter bladsy hulle ook al is. Gebruik 'n nota vir nuus wat verander namate die toernooi vorder.
