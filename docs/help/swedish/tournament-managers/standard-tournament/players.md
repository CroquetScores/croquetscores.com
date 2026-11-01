# Spelare

Fliken **Spelare** på en turnerings sida är där dess spelare läggs till, rättas, ordnas och läggs undan. Det är den flik sidan öppnas på, eftersom att lägga till spelarna är det första som görs med en turnering.

Spelarna läggs till här en gång, i turneringen. Vilka tävlingar var och en spelar i väljs efteråt, på varje tävlings egen sida, bland de spelare som har lagts till här. Se [Sätta in spelare i en tävling](entering-players-in-a-competition.md).

![Fliken Spelare, med tillagda spelare och en arkiverad](images/players-tab.png)

## Lägga till spelare {#add-a-player}

Tryck på **Lägg till spelare**, ovanför listan. En dialogruta öppnas över sidan.

![Dialogrutan Lägg till spelare, ifylld](images/add-player-dialog.png)

**Namn** krävs. Det är spelarens namn så som det visas på varje sida, mellan 3 och 254 tecken. Två spelare i en turnering kan inte ha samma namn, hur det än skrivs med stora och små bokstäver; där två spelare verkligen delar namn, skilj dem åt i själva namnet, som "Andrew Hobbs (2)".

**Representerar** är det spelaren spelar för, skrivet som en läsare skulle säga det: en klubb, en region eller ett land, till exempel "Canterbury Croquet Club". Det visas inom parentes efter namnet. Det kan lämnas tomt.

**Flagga** är den flagga som visas bredvid spelarens namn. Den kan lämnas som ingen, vilket de flesta spelare har. Vad en spelare representerar och vilken flagga spelaren för hålls isär, eftersom en spelare kan spela för en klubb i ett land och föra ett annat lands flagga.

**Spelarens namn i världsrankingen** är det namn världsrankingen känner spelaren under. Det frågas efter bara i en turnering i association croquet eller golfcroquet, de två sporter vars spelare världsrankingen för en förteckning över. Spelarna i amerikansk 6-bågars croquet är kända i rankingen under sina egna namn, så det frågas inte efter där, och varje spelares namn i världsrankingen är alltid spelarens namn. Medan du lägger till en spelare följer det namnet medan du skriver, eftersom de flesta spelare är kända i rankingen under sitt eget namn, och slutar följa när du skriver i det. Lämnas det tomt sparas det som spelarens namn.

Medan du skriver ett namn erbjuds de spelare världsrankingen känner till vars namn börjar så, så att du kan ta ett namn så som rankingen stavar det i stället för att skriva ut det. Bredvid världsrankingnamnet säger en bock att rankingen känner till namnet, och ett frågetecken att den inte gör det: namnet kan vara felstavat, eller så kan spelaren vara ny i rankingen. Det är bara ett råd. Ett namn rankingen inte känner till sparas lika gärna som ett den känner till.

Tryck på **Lägg till**. Spelaren läggs till, dialogrutan säger det, och fälten töms för nästa spelare, med markören tillbaka i namnet. Lägg till hela listan på det sättet, och tryck sedan på **Avbryt** för att stänga dialogrutan. Avbryt sparar ingenting som inte redan har lagts till.

![Dialogrutan efter att en spelare har lagts till](images/add-player-dialog-added.png)

En spelare heter aldrig "Bye". En utslagnings byes läggs till i själva utslagningen, där dess spelare sätts in, så ett namn vars första ord är det engelska "bye" godtas inte, och dialogrutan förklarar varför.

## Lägga till flera spelare {#adding-multiple-players}

För att lägga till en hel lista på en gång trycker du på **Lägg till flera spelare**, bredvid **Lägg till spelare**. En dialogruta öppnas över sidan med en enda ruta, som tar emot flera rader text. Du kan kopiera listan från ett kalkylblad och klistra in den i rutan.

**Första raden anger fälten**, åtskilda med kommatecken eller tabbar: **Name** och något av **Representing**, **Flag**, **Handicap** och **WorldRankingPlayerName**, i valfri ordning. Dessa namn skrivs på engelska, oavsett vilket språk webbplatsen visas på. **Name** måste vara ett av dem. **Varje rad efter den är en spelare**, med ett värde för varje fält i samma ordning, åtskilda på samma sätt. En spelare som saknar värde för ett fält lämnar det tomt, men behåller kommatecknet eller tabben. Till exempel, med kommatecken:

```
Name,Representing,Flag
Sam Someone,Canterbury Croquet Club,New Zealand
Alex Another,,England
```

- **Namn, Representerar och Spelarens namn i världsrankingen** följer samma regler som när du lägger till en enda spelare (se [Lägga till spelare](players.md#add-a-player)). Ett namn är mellan 3 och 254 tecken, finns inte redan i turneringen, hur det än skrivs med stora och små bokstäver, och är inte "Bye".
- **Flagga** är namnet på landet eller platsen, på ditt språk, så som listan i dialogrutan Lägg till spelare erbjuder det, till exempel Nya Zeeland.
- **Handicap** är ett tecken, upp till två siffror och en bråkdel på en siffra, till exempel 4, +4 eller -1.5.
- En spelare utan **WorldRankingPlayerName** är känd under sitt namn, som när spelaren läggs till en i taget.
- **Kommatecken eller tabbar.** Celler som kopieras från ett kalkylblad är åtskilda med tabbar, och en lista som skrivs för hand är oftast åtskild med kommatecken. Båda fungerar. Om första raden innehåller en tabb läses hela listan med tabbar, annars med kommatecken.
- Ett värde som innehåller avgränsaren skrivs inom citattecken, som ett kalkylblad skriver det: "Smith, John" i en lista åtskild med kommatecken. Ett citattecken inuti ett värde skrivs två gånger.
- Varje värde får blanksteg i ändarna borttagna, och en rad utan innehåll hoppas över.
- En lista innehåller högst 500 spelare. Lägg till resten i en ny lista.

Tryck på **Lägg till**. Hela listan kontrolleras innan något av den sparas, så en lista med något fel i lägger inte till någon. Vad som är fel sägs under rutan, på den rad det finns, där första raden räknas som rad 1. Varje fel listas, inte bara det första, och det du skrev finns kvar så att du kan rätta det. När listan är sparad stängs dialogrutan och fliken **Spelare** visar de nya spelarna, i den ordning du skrev dem. Till skillnad från **Lägg till spelare**, som förblir öppen för nästa spelare, finns det ingen nästa: listan var nästa.

**?** i dialogrutans namnlist leder hit.

## Rätta en spelare {#correcting-a-player}

Tryck på en spelares namn, eller på spelarens **Redigera**, för att öppna samma dialogruta på den spelaren, med rubriken Redigera spelare. Ändra det som är fel och tryck på **Spara**, som sparar ändringen och stänger dialogrutan. En spelare vars namn rättas behåller det världsrankingnamn spelaren hade, eftersom rankingen fortfarande känner spelaren under det. I amerikansk 6-bågars croquet är en spelares namn i världsrankingen alltid spelarens namn, så att rätta namnet rättar det också.

![Dialogrutan Redigera spelare](images/edit-player-dialog.png)

En spelare som rättas här rättas överallt: i varje tävling spelaren är med i, och på varje offentlig sida.

## Ordna spelarna

Spelarna listas i turneringens ordning, som är den ordning de erbjuds i när de sätts in i tävlingar, och den ordning en utslagning lottas i. **Upp** och **Ner**, pilarna i slutet av varje rad, flyttar en spelare ett steg. Den första spelaren erbjuds inte Upp och den sista erbjuds inte Ned.

## Arkivera en spelare {#archiving-a-player}

**Arkivera** lägger undan en spelare: en som lades till av misstag, eller som har dragit sig ur hela turneringen. En arkiverad spelare listas under **Arkiverade spelare**, överstruken, efter de spelare som är i bruk, och erbjuder bara **Återställ**. En arkiverad spelare är inte med i någon tävling och visas inte på någon offentlig sida.

En spelare som har spelat något parti kan inte arkiveras, eftersom partierna då skulle vara mot någon som inte längre finns där, så en sådan spelare erbjuds inte Arkivera. En spelare vars enda partier är arkiverade kan arkiveras.

Att arkivera en spelare som inte är med i någon tävling frågar inte först, eftersom att återställa spelaren sätter tillbaka allt. Att arkivera en spelare som är med i någon tävling frågar först, eftersom arkiveringen tar bort spelaren från varje tävling spelaren är med i, och återställningen inte sätter tillbaka spelaren i dem.

![Frågan som ställs innan en spelare som är med i tävlingar arkiveras](images/archive-player-asks.png)

Nästa: [Tävlingar](competitions.md).
