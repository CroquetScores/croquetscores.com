# Nytt för arrangörer

## Släppt 2026-10-23

Det här är de viktigaste ändringarna sedan förra utgåvan. Var och en länkar till den pull request som gjorde den.

- **Handikapp, oavgjorda resultat och världsrankingen bestäms för varje tävling.** De bestämdes förut av turneringen, så en turnering kunde inte ha ett block med handikapp bredvid ett utan, eller en landskamp som får sluta oavgjord bredvid en utslagning som inte får det. Nu frågar varje tävling, och varje landskamp, efter alla tre när den läggs till eller redigeras, och turneringsformuläret gör det inte längre. Den sista frågas bara där sporten har en världsranking, och en tävling som inte räknas lämnas utanför rankingfilen. Se [Tävlingar](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **Adminlistan över turneringar kan begränsas efter land, region och sport.** Valen ligger i adressen, så en filtrerad lista går att länka till, och bara det som din lista innehåller erbjuds. En region erbjuds när ett land är valt. Turneringar före november 2026 har ingen region, så att välja en döljer dem, och de publika listorna säger det. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Rankingansvariga är nu en roll för varje sport.** En rankingansvarig för association croquet ser och sköter turneringar i association croquet, och en rankingansvarig för golfcroquet turneringar i golfcroquet. En turnering som du arrangerar eller för resultat i finns kvar i din lista oavsett sport. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **Fliken Rankingar förklarar filen i ett stycke, oavsett sport,** med nedladdningslänken under. Se [Rankingar](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **En turnerings namn får inte vara helt i gemener eller helt i versaler,** och meddelandet säger det nu som en regel. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Ta bort är en papperskorg** på flikarna för arrangörer och resultatförare, på tävlingens spelare och på administratörens kontosida, som Arkivera och Radera redan var. Den heter fortfarande Ta bort när du pekar på den, och en skärmläsare läser fortfarande upp den som Ta bort. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Alla språk har nya ord.** Webbplatsens ord på alla de andra sexton språken är skrivna på nytt, och hjälpen är justerad efter dem. Hjälpen för läsare och för konton, och användarvillkoren, finns nu också på alla språk. Ingen har ännu lästs av en modersmålstalare, så berätta för oss vad som låter dåligt. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Bakom kulisserna.** Importen av de gamla webbplatserna ger vissa tidszoner och en turnering ett annat land ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), och läser in en dump på servern och skapar läsmodellerna med ett skript ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Webbplatsen driftsätts med ett skript, från en dator eller från GitHub, och inte längre vid varje sammanslagning ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Släppt 2026-10-19

Det här är de viktigaste ändringarna för den som arrangerar turneringar. [Hjälpen för arrangörer](../tournament-managers/index.md) har alla detaljer.

- **Spelare läggs in en gång, i turneringen.** På den gamla webbplatsen lades spelare till inne i varje tävling. Nu är turneringens flik **Spelare** stället där du lägger till, rättar, ordnar och arkiverar dem, och en spelare som rättas där är rättad i varje tävling han eller hon är med i och på varje publik sida. Se [Spelare](../tournament-managers/standard-tournament/players.md).

- **Spelare läggs in i en tävling från en lista.** På en tävlings sida väljer du en av turneringens spelare i rullgardinslistan och trycker på **Lägg till spelare**. Rullgardinslistan erbjuder bara spelare som inte redan är med i tävlingen. I en utslagning erbjuder den också **Bye** för de platser som blir över. Se [Anmäla spelare till en tävling](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **En knapp lägger till en tävling.** I stället för de separata knapparna för nytt block, ny schweizer och ny utslagning trycker du på **Lägg till tävling**. Dialogrutan frågar efter namnet och slaget (ett block, en utslagning eller en schweizer) och sedan vad det slaget behöver: vad varje match är bäst av och, för en utslagning, platserna i dess lottning. Den stannar öppen så att du kan lägga till flera på en gång. En tävlings slag kan inte ändras efteråt: arkivera den och lägg till den igen. Se [Tävlingar](../tournament-managers/standard-tournament/competitions.md).

- **Arrangörsanteckningar: använd dem i stället för kommentarer för att berätta för spelarna vad de behöver veta.** Formatet, en ändring i speltablån, tiden för lunchen. En anteckning skrivs på turneringens flik **Anteckningar**, med en rubrik och en beskrivning i Markdown, och du kan förhandsgranska den innan du lägger till den. Spelarna hittar anteckningar på turneringens publika sida Anteckningar. En anteckning de inte har läst är markerad med en asterisk, och det är avdelningen Anteckningar på varje sida i turneringen också, tills de öppnar den. En anteckning som du redigerar markeras på nytt för alla som hade läst den. Se [Anteckningar](../tournament-managers/standard-tournament/notes.md).

- **Den gamla webbplatsens turneringsanteckningar är nu Underrubriken.** Det du skrev där finns kvar som turneringens underrubrik och visas fortfarande under turneringens namn på varje publik sida. Den skrivs i Markdown och kan vara upp till 2000 tecken. Den är till för det som läsarna bör veta oavsett vilken sida de är på. Använd en anteckning för nyheter som ändras medan turneringen pågår.
