# Rankingar

När en tävling räknas med i världsrankingen skickas dess resultat till rankingen som en fil, som webbplatsen skriver utifrån det du har skrivit in. Fliken **Rankingar** är där du får tag i den.

## Fliken

Öppna turneringens sida och välj **Rankingar**, den sista av dess flikar. Den säger vad filen är: en textfil för association croquet, ett kalkylblad för golfcroquet och amerikansk 6-bågars croquet. Den säger vad som återstår för dig att göra för hand, och att filen sedan ska skickas till världsrankingens funktionärer. Under det finns **Ladda ner partier för världsranking**, som sparar filen. Den finns där innan ett enda resultat har skrivits in, och ger då en fil utan något i.

Fliken finns bara på sidan för en turnering i en sport som har en världsranking, och bara för dess arrangörer: en resultatförare erbjuds den inte. Själva filen ligger på turneringens egen adress följd av `/rankings`, som `/2026/ac/spring-open/rankings`, vilket är den adress webbplatsen alltid har gett den, och vem som helst som har adressen kan öppna den.

## Vad som finns i filen

Varje resultat som har skrivits in och inte arkiverats finns med, i den ordning det skrevs in, även ett resultat som har dragits tillbaka och resultaten för en spelare som har dragit sig ur. Ett arkiverat resultat finns inte med. En match som vunnits genom bye eller walkover spelades inte, så den har ingen rad.

En spelare anges med sitt namn i världsrankingen, som är spelarens namn om inget annat har getts.

För **Association croquet** finns ett avsnitt för varje tävling som har ett resultat: dess evenemang, dess datum, dess vinnare, om det var matcher eller enstaka partier, och en numrerad rad för varje resultat, som "1 Sam Someone beat Alex Another +9". Ett resultat är vinnarens bågar minus förlorarens, med plus när vinnaren gjorde fler, och peelarna efter. En utslagsmatch är en rad, med varje partis resultat i tur och ordning. Webbplatsen kan bara gissa vem som vann en tävling, så kontrollera raden **Winner** i varje avsnitt (den står på engelska i filen) och rätta den innan du skickar filen vidare.

För **Golfcroquet och Amerikansk 6-bågars croquet** finns ett kalkylblad: turneringens namn, dess dagar och hur många partier den rymmer, sedan en numrerad rad för varje parti, med vinnarens efternamn och förnamn, "beat", förlorarens och de två resultaten. Varje parti i en utslagsmatch är en egen rad. Under den sista är raden **Tournament winner:** (också på engelska i filen) tom, för dig att fylla i.

## När det inte finns någon fil

En turnering där ingen tävling räknas med i världsrankingen har ingen fil. Öppnar du dess rankingadress visas en sida som säger det och varför: dess sport har ingen världsranking, eller ingen av dess tävlingar räknas, eftersom var och en spelas med handikapp, tillåter oavgjorda resultat eller bockades av så att den inte räknas. Det anges när varje tävling läggs till, och ändras med dess **Redigera**. Bara de tävlingar som räknas finns i filen.

Nästa: [Ändra, arkivera och återställa en turnering](changing-and-archiving.md).
