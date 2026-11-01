# Tävlingar

Fliken **Tävlingar** på en turnerings sida är där dess tävlingar läggs till, ordnas och läggs undan. En tävling är ett block, en utslagning eller en schweizer. Var och en har en egen sida, där dess spelare sätts in och dess resultat skrivs in.

![Fliken Tävlingar, med tävlingar av varje slag och en arkiverad](images/competitions-tab.png)

## Lägga till en tävling {#adding-a-competition}

Tryck på **Lägg till tävling**, ovanför listan. En dialogruta öppnas över sidan och frågar efter tävlingens namn, dess slag och den form slaget har.

**Namn** är det spelarna letar efter på turneringens sida för att hitta sina partier. Det är mellan 1 och 254 tecken, och en ensam bokstav räcker, eftersom ett block ofta kallas med en. Två tävlingar i en turnering kan inte ha samma namn.

**Slag** är ett block, en utslagning eller en schweizer. Dialogrutan börjar på block, vilket de flesta tävlingar är.

### Ett block

Ett block frågar vad varje match spelas **Bäst av**, och i hur många **Ronder** det spelas.

**Bäst av** börjar på 1. Bäst av 3 vinns av den som vinner två partier. Det får vara ett jämnt tal, eftersom en spelare i ett block rangordnas efter de partier spelaren vinner, och en match på två partier som delas ett vardera är ett resultat som vilket annat.

**Ronder** är hur många gånger varje par av spelare i blocket möts, med en match i varje rond. Det börjar på 1, och 1 är nästan alltid vad ett block vill ha: varje spelare möter varje annan en gång. Höj det bara för ett block där de möts igen, som en dubbel serie, där 2 låter varje par spela två matcher.

![Dialogrutan Lägg till tävling för ett block](images/add-competition-block.png)

### En schweizer

En schweizer frågar bara vad varje match spelas **Bäst av**, vilket börjar på 1, precis som för ett block. Bäst av 3 vinns av den som vinner två partier. Det får vara ett jämnt tal, eftersom en spelare i en schweizer rangordnas efter de partier spelaren vinner, och en match på två partier som delas ett vardera är ett resultat som vilket annat.

![Dialogrutan Lägg till tävling för en schweizer](images/add-competition-swiss.png)

### En utslagning

En utslagning frågar hur många **Platser** dess lottning har, och vad varje rond spelas bäst av. Platserna erbjuds som 2, 4, 8, 16, 32, 64 och 128, eftersom inget annat antal kan halveras rond för rond ned till en final, och dialogrutan börjar på 8. Platser som blir över när spelarna har satts in fylls med byes, som läggs till där spelarna läggs till.

En lottning har så många ronder som det tar att halvera dess platser ned till en, så en lottning med 8 platser har tre ronder. Dialogrutan frågar vad var och en spelas bäst av, samlat under **Bäst av per rond**, i den ordning de spelas. De tre sista är namngivna som man talar om en lottnings ronder, **Kvartsfinaler**, **Semifinaler** och **Final**, och de före dem efter nummer, Rond 1 först. Att välja fler platser lägger till ronder i början av lottningen, och att välja färre tar bort dem från början, så det som skrevs för finalen är fortfarande finalens. Varje rond spelas bäst av ett udda antal partier, eftersom en match i en utslagning måste ha en vinnare.

![Dialogrutan Lägg till tävling för en utslagning med 4 platser](images/add-competition-knockout.png)

### Hur den spelas och räknas

Varje slag frågar efter samma tre saker under sin form.

**Spelas med handikapp.** Bocka för det här för en tävling som spelas med handikapp.

**Tillåter oavgjorda resultat.** Bocka för det här där ett parti kan sluta utan att någon av spelarna vinner. De flesta tävlingar tillåter det inte. Där det är förbockat sparas ett resultat med lika poäng och utan markering som oavgjort; där det inte är det måste ett parti med lika poäng säga vem som vann genom en markering efter vinnarens resultat, till exempel "6w". En matchs vinnare i en utslagning står alltid fast, så ett oavgjort parti avgör ingen.

**Räknas med i världsrankingen.** Frågas bara där det kan räknas: en tävling i association croquet eller golfcroquet som varken spelas med handikapp eller tillåter oavgjorda resultat. Det är förbockat från början, så bocka av det för en tävling som inte ska räknas.

### Lägga till flera på en gång

Tryck på **Lägg till**. Tävlingen läggs till, dialogrutan säger det, och namnet töms för nästa, med sorten och dess form kvar som de var: tävlingar som läggs till tillsammans är för det mesta lika, så "Block B" efter "Block A" är bara dess namn. Tryck på **Avbryt** för att stänga dialogrutan när alla är inlagda.

## Ändra en tävling {#changing-a-competition}

**Redigera** öppnar samma dialogruta på tävlingen, med rubriken Redigera tävling, med dess namn, dess form och hur den spelas och räknas som de är. Dess slag frågas inte efter, eftersom ett block inte görs till en utslagning genom att ändras: en tävling av fel slag arkiveras och läggs till igen. Tryck på **Spara** för att spara ändringen och stänga dialogrutan.

En utslagning som har ett parti har spelare placerade i sin lottning, och en ändring av dess platser skulle flytta dem, så den godtas inte när ett parti har skrivits in. Vad varje rond spelas bäst av kan fortfarande ändras.

## Ordning

Tävlingarna listas i turneringens ordning, som är den ordning de visas i på de offentliga sidorna och i det mörkgröna fältet. **Upp** och **Ner** flyttar en tävling ett steg.

## Gå till en tävling

En tävlings namn, eller **Visa**, öppnar dess sida, där dess spelare sätts in och dess resultat skrivs in. Det mörkgröna fältet under sidhuvudet leder också dit, från vilken sida som helst i turneringen.

## Arkivera en tävling

**Arkivera** lägger undan en tävling, vare sig den har partier eller inte; de behålls med den och kommer tillbaka när den återställs. En arkiverad tävling listas under **Arkiverade tävlingar**, överstruken, erbjuder bara **Återställ** och finns inte på de offentliga sidorna. Att arkivera frågar inte först, eftersom att återställa ångrar det.

Nästa: [Sätta in spelare i en tävling](entering-players-in-a-competition.md).
