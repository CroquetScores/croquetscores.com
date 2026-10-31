# Landskamper

Fliken **Landskamper** på en turnerings sida är där landskamperna mellan dess lag läggs till, ändras, ordnas och läggs undan. En landskamp är en av turneringens tävlingar: en kamp mellan två lag, kallad med deras kortnamn, som "AUS v NZ", spelad som ett antal matcher mellan en spelare från varje lag. Varje landskamp har en egen sida, där dess resultat skrivs in.

![Fliken Landskamper, med tre landskamper i en grupp](images/tests-tab.png)

Varje landskamp anger sitt namn, de dagar den spelas, hur många matcher den förväntas ha och vad var och en spelas bäst av, som "6 matcher, bäst av 3", och sin grupp där den är med i en.

## Två lag först

En landskamp spelas mellan två lag i bruk, så medan turneringen har färre än två säger fliken det där Lägg till landskamp skulle stå, och leder till fliken Lag.

![Fliken Landskamper innan det finns två lag](images/tests-tab-two-teams-needed.png)

## Lägga till en landskamp

Tryck på **Lägg till landskamp**, ovanför listan. En dialogruta öppnas över sidan, i den ordning en landskamp sägs högt.

![Dialogrutan Lägg till landskamp, ifylld](images/add-test-dialog.png)

**Lag A** och **Lag B** väljs var för sig bland turneringens lag i bruk, med namn, i turneringens ordning. Inget är valt från början, så att en landskamp aldrig läggs till mellan lag du inte valde. Lag B erbjuder varje lag utom det som valts som Lag A, eftersom ett lag inte spelar landskamp mot sig självt. Lag A är det första laget: dess spelare står till vänster på landskampens sida och på den offentliga sidan. En landskamp har inget eget namn att skriva; den kallas med sina lags kortnamn.

**Börjar** och **Slutar** är de dagar landskampen spelas, och börjar på turneringens första dag. En landskamp spelas inom sin turnering, så dagar före turneringen startar eller efter att den slutar godtas inte.

**Förväntade matcher** är hur många matcher landskampen ska ha, bestämt av evenemanget innan det börjar, så att den som läser dess resultat kan se hur långt den har kommit. Det är ett helt tal från 1 och uppåt. Det är också en gräns: när så många matcher har startat som landskampen förväntas ha godtas inte ett parti som skulle starta ännu en, medan de matcher som redan startat spelas färdigt. En landskamp som ska ha fler ändras till att förvänta dem.

**Bäst av** är vad varje match spelas bäst av. Det får vara jämnt, eftersom en match kan delas.

**Spelas med handikapp**, **Tillåter oavgjorda resultat** och **Räknas med i världsrankingen** frågas efter som för vilken tävling som helst. Det sista frågas bara där det kan räknas: en landskamp i association croquet eller golfcroquet som varken spelas med handikapp eller tillåter oavgjorda resultat. Det är förbockat från början.

**Grupp** är den grupp landskampen ingår i, där evenemanget spelas i grupper, som "Block A". Den är frivillig: lämnas den tom ingår landskampen i ingen. Landskamperna i en grupp har en egen sida på den offentliga webbplatsen, som visar hur gruppens lag står. **Eire Cup** och **Interstate Shield** har inga grupper, så dialogrutan frågar inte efter någon där.

Tryck på **Lägg till**. Landskampen läggs till, dialogrutan säger vilken med dess namn, och lagen töms för nästa, med dagarna, de förväntade matcherna, bäst av och gruppen kvar som de var: landskamper läggs till en rond i taget, mellan lag som möts samma dag, så rondens nästa landskamp är bara dess två lag. Tryck på **Avbryt** när alla är inlagda.

![Dialogrutan efter att en landskamp har lagts till](images/add-test-dialog-added.png)

## Ändra en landskamp

**Redigera** öppnar samma dialogruta på landskampen, med rubriken Redigera landskamp, ifylld som landskampen är. Tryck på **Spara** för att spara ändringen.

![Dialogrutan Redigera landskamp](images/edit-test-dialog.png)

En landskamp med partier i bruk behåller sina lag: dialogrutan visar dem men de kan inte ändras. Det övriga kan ändras, inom ramen för det som har spelats: färre förväntade matcher än de matcher som redan startat godtas inte, och inte heller ett bäst av som är lägre än det största antal partier två spelare har spelat.

## Ordning

Landskamperna listas i turneringens ordning, som är den ordning de visas i på de offentliga sidorna och i det mörkgröna fältet. **Upp** och **Ner** flyttar en landskamp ett steg.

## Gå till en landskamp

En landskamps namn, eller **Visa**, öppnar dess sida, där dess resultat skrivs in. Det mörkgröna fältet leder också dit, från turneringens sida eller från vilken annan landskamps sida som helst.

## Arkivera en landskamp

**Arkivera** lägger undan en landskamp, och ångras med **Återställ**, så ingetdera frågar först. En arkiverad landskamp listas under **Arkiverade landskamper**, överstruken, erbjuder bara Återställ och finns inte på de offentliga sidorna.

En landskamp med partier i bruk har spelats, och kan inte arkiveras förrän dess partier är det. En landskamp vars partier alla är arkiverade kan arkiveras, eftersom ett arkiverat parti inte räknas. En landskamp vars lag har arkiverats sedan dess återställs inte förrän laget är det, och fliken säger det.

Nästa: [Resultat](scores.md).
