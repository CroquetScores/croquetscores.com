# Wat is er nieuw voor toernooileiders

## Uitgebracht op 2026-10-23

Dit zijn de belangrijkste veranderingen sinds de vorige release. Elke verandering verwijst naar de pull request waarmee ze is gemaakt.

- **Handicaps, gelijkspel en de wereldranglijsten stel je in per competitie.** Ze waren vroeger aan het toernooi, dus één toernooi kon geen poule met handicap naast een zonder hebben, of een test die gelijk mag eindigen naast een knock-out die dat niet mag. Elke competitie, en elke test, vraagt nu bij het toevoegen of wijzigen om alle drie, en het toernooiformulier doet dat niet meer. De laatste wordt alleen gevraagd bij een sport met wereldranglijsten, en een competitie die niet meetelt, blijft buiten het ranglijstbestand. Zie [Competities](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **De lijst met toernooien in het beheer kun je beperken op land, regio en sport.** De keuzes staan in het adres, dus je kunt naar een gefilterde lijst linken, en er worden alleen keuzes aangeboden die in jouw lijst voorkomen. Een regio wordt aangeboden zodra je een land hebt gekozen. Toernooien van vóór november 2026 hebben geen regio, dus als je er een kiest, verdwijnen ze, en de openbare lijsten zeggen dat erbij. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Wereldranglijstbeheerders zijn nu één rol per sport.** Een beheerder voor associatiecroquet ziet en beheert toernooien in Associatiecroquet, en een beheerder voor golfcroquet die in Golfcroquet. Een toernooi dat je leidt of waarvan je de score bijhoudt, staat nog steeds in je lijst, welke sport het ook is. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **Het tabblad Ranglijsten legt het bestand in één alinea uit, welke sport het ook is,** met de downloadlink eronder. Zie [Ranglijsten](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **De naam van een toernooi mag niet geheel uit kleine letters of geheel uit hoofdletters bestaan,** en de melding zegt dat nu als regel. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Verwijderen is een prullenbak** op de tabbladen Toernooileiders en Scorebijhouders, bij de spelers van de competitie en op de pagina Accounts van de beheerder, zoals Archiveren en Wissen dat al waren. Hij heet nog steeds Verwijderen als je erop wijst, en een schermlezer leest hem nog steeds voor als Verwijderen. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Elke taal heeft nieuwe woorden.** De teksten van de site in alle zestien andere talen zijn opnieuw geschreven, en de help is daarmee in lijn gebracht. De help voor lezers en voor accounts, en de gebruiksvoorwaarden, zijn nu ook in elke taal beschikbaar. Geen ervan is al door een moedertaalspreker gelezen, dus laat ons weten wat er slecht leest. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Achter de schermen.** De import van de oude sites geeft sommige tijdzones en één toernooi een ander land ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), en laadt een dump in de server en maakt de leesmodellen met een script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). De site wordt met een script uitgerold, vanaf een computer of vanuit GitHub, en niet meer bij elke merge ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Uitgebracht op 2026-10-19

Dit zijn de belangrijkste veranderingen voor mensen die toernooien organiseren. De [help voor toernooileiders](../tournament-managers/index.md) heeft alle details.

- **Spelers voer je één keer in, in het toernooi.** Op de oude site werden spelers in elke competitie toegevoegd. Nu is het tabblad **Spelers** van het toernooi de plek waar je ze toevoegt, corrigeert, ordent en archiveert, en een speler die daar is gecorrigeerd, is gecorrigeerd in elke competitie waarin hij speelt en op elke openbare pagina. Zie [Spelers](../tournament-managers/standard-tournament/players.md).

- **Spelers komen uit een lijst in een competitie.** Kies op de pagina van een competitie een speler van het toernooi uit de keuzelijst en druk op **Speler toevoegen**. De keuzelijst biedt alleen spelers aan die nog niet in de competitie zitten. In een knock-out biedt hij ook **Bye** aan voor de overgebleven plaatsen. Zie [Spelers inschrijven in een competitie](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Eén knop voegt een competitie toe.** In plaats van de aparte knoppen voor een nieuwe poule, een nieuwe Zwitserse en een nieuwe knock-out druk je op **Competitie toevoegen**. Het dialoogvenster vraagt om de naam en het soort (een poule, een knock-out of een Zwitserse), en daarna wat dat soort nodig heeft: waarvan elke wedstrijd de beste is, en bij een knock-out de plaatsen in de loting. Het blijft open zodat je er meerdere tegelijk kunt toevoegen. Het soort van een competitie kun je achteraf niet wijzigen: archiveer de competitie en voeg haar opnieuw toe. Zie [Competities](../tournament-managers/standard-tournament/competitions.md).

- **Notities van de toernooileiders: gebruik ze in plaats van een commentaar om spelers te vertellen wat ze moeten weten.** Het formaat, een wijziging in de speelvolgorde, het tijdstip van de lunch. Een notitie schrijf je op het tabblad **Notities** van het toernooi, met een titel en een beschrijving in Markdown, en je kunt hem bekijken voordat je hem toevoegt. Spelers vinden notities op de openbare pagina Notities van het toernooi. Een notitie die ze nog niet hebben gelezen is met een asterisk gemarkeerd, en het onderdeel Notities op elke pagina van het toernooi ook, totdat ze hem openen. Een notitie die je wijzigt, wordt opnieuw gemarkeerd voor iedereen die hem had gelezen. Zie [Notities](../tournament-managers/standard-tournament/notes.md).

- **De toernooinotities van de oude site zijn nu de Ondertitel.** Wat je daar had geschreven, blijft bewaard als de ondertitel van het toernooi en staat nog steeds onder de naam van het toernooi op elke openbare pagina. Hij is in Markdown geschreven en mag maximaal 2000 tekens lang zijn. Hij is bedoeld voor wat lezers moeten weten op welke pagina ze ook zijn. Gebruik een notitie voor nieuws dat verandert naarmate het toernooi vordert.
