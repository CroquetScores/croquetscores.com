# Nytt

## Släppt 2026-11-25

- **På en telefon har sidan mer utrymme.** Den vita panelen som håller en sida går från ena kanten av skärmen till den andra, och texten och fälten ovanför och under den står 10 pixlar från kanten där de stod 41. Ett formulär på den gröna sidan behåller sin marginal. Bredare skärmar är som förut.

- **Ett namn i en utslagsturnerings sammanfattning bryts aldrig mitt i ett ord.** Det bryts bara vid sina mellanslag. Där ett ord är bredare än utrymmet bredvid resultaten rullar sammanfattningen i sidled inom sidan i stället för att trycka ut sidan.

## Släppt 2026-11-24

- **Ett blocks sammanställning säger också nettopartier.** Där ett blocks matcher är bäst av fler än ett parti säger sammanställningen vinster, förluster, nettopartier och nettobågar, eftersom nettopartier avgör ett oavgjort läge före bågar. Ett block med enstaka partier säger vinster, förluster och nettobågar som förut. Sammanställningen säger inte längre hur dess spelare rankas.

- **En tävlings bricka i sektionsfältet är lika bred som dess namn.** Ett kort namn som "Block A" hade en bricka lika bred som ett långt, så fältet fick slut på plats tidigare än nödvändigt.

- **På en telefon tar datumen på startsidan mindre plats.** Datumkolumnen är lika bred som en helgs datum, som "19-21 Nov", och namnen får resten. Datum som går från en månad till nästa bryts före bindestrecket, så att den andra raden börjar med det. Under **Dina senaste turneringar** säger en turnering från i år inget år, och en från ett annat år säger det under sina datum.

### För apputvecklare

- **En app kan ändra saker, med en nyckel som gjorts för att skriva.** Det webbplatsens egna sidor ändrar ändras av samma adresser under `/api/v0`: att skapa en turnering, dess tävlingar, spelare, lag och partier, och vem som får arrangera den och föra resultat. En nyckel får göra det kontot den gjordes för får göra, och en resultatförares nyckel får göra det som görs med resultat och inget annat. Sidan **API:ets POST-slutpunkter** i hjälpen säger vad varje adress tar och svarar. De är ännu inte färdigställda, och några kommer att tas bort.

- **En app kan fråga vad en turnering kan vara.** Sporterna, formaten och länderna med sina regioner finns på `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` och `/api/v0/countries`, på det språk appen ber om, så att det den skapar en turnering med är det webbplatsen erbjuder.

- **En app kan läsa spelarna i världsrankingen och deras partier.** De Association Croquet-spelare som världsrankingarna känner till finns på `/api/v0/ac/world-ranking-players`, och varje spelares partier, i den ordning de lades till, finns på den adress spelaren anger. Namnen uppdateras från rankingarna när listan efterfrågas från början, högst en gång i timmen.

- **API:ets slutpunkter är två sidor i hjälpen, en för GET-slutpunkterna och en för POST-slutpunkterna,** på alla språk.

### Rankingansvariga

- **En spelare i Association Croquet-rankingarna förs under det nummer rankingarna ger dem.** En spelare som rankingarna byter namn på är samma spelare, en som faller bort från listan arkiveras och glöms inte, och en som listas igen är inte längre arkiverad. En lista som ger ett namn åt två spelare, eller ett nummer åt två namn, nekas i sin helhet och inget ändras, och administratören får besked via e-post.

## Släppt 2026-11-22

- **Startsidan minns de turneringar du tittade på nyligen.** När du öppnar en turnering hamnar den först under **Dina senaste turneringar**, mellan filtret och de senaste resultaten, upp till fem stycken, så att du kan gå tillbaka till de du följer utan att leta i listorna. Den sparas på din egen enhet, i en kaka som bara innehåller turneringarnas adresser, och listan visas inte alls förrän du har öppnat en turnering. Hjälpen säger vad kakan är.

- **De kommande turneringarna tar med de som började de senaste två dagarna.** En turnering som har börjat men inte slutat visas till och med dagen den slutar, så länge den började för högst två dagar sedan, så att den går att hitta de dagar den spelas innan någon har fört in ett parti i den. De som började för längre sedan finns bland de senaste resultaten när ett parti har lagts till.

- **En utslagning säger vad varje rundas matcher är bäst av.** Ovanför varje runda i en utslagnings schema, och under varje rundas namn i dess sammanställning, står "Bäst av 3", eller vad turneringsarrangören har valt för den rundan.

- **Ett resultat får plats i sin ruta i en utslagnings sammanställning, och ett namn hålls ihop i ett blocks sammanställning.** På en smal skärm rann ett Advantage-resultat skrivet som "83% (5/6)" ut ur sin ruta över namnen, och ett namn i ett blocks sammanställning kunde brytas efter förnamnet. Ett par hålls ihop på var sida om et-tecknet.

- **Du kan lägga webbplatsen på telefonens hemskärm.** En knapp i sidfoten erbjuder det när din webbläsare kan, och **Lägga till webbplatsen på din hemskärm** i hjälpen säger hur, för en iPhone och för en Android-telefon. Croquet Scores och Gateball Scores har var sin ikon, så att du kan skilja dem åt.

- **Nya Zeelands croquetregioner finns med.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury och de övriga regioner som Nya Zeelands nationella turneringar delas in i kan väljas som en turnerings region.

### För apputvecklare

- **Det finns ett öppet API.** En app kan läsa ett års turneringar, en turnering med dess tävlingar och spelare, en tävlings partier och ställning, de turneringar som har bytt år och de turneringar som har arkiverats, som JSON, på `/api/v0`. Det är `v0` så länge det utvecklas. Alla får läsa, och en app som skickar en nyckel som gjorts under **API-nycklar** i ditt konto har en egen kvot, 60 förfrågningar i minuten och 10 000 om dagen till att börja med. En app utan nyckel delar en kvot efter sin adress, 10 i minuten och 500 om dagen.

- **En nyckel låter en app agera för dig utan ditt lösenord.** Skapa en nyckel i ditt konto, säg vad den är till för och återkalla den när du inte längre vill att den används. En nyckel kan skapas för att bara läsa eller för att läsa och skriva, och kan begränsas till en turnering. API:et läser bara tills vidare. Bara en hash av nyckeln sparas, så nyckeln visas en gång, när du skapar den.

- **Fält kan läggas till i ett svar utan en ny version.** En app måste strunta i ett fält den inte känner till. En ändring som skulle bryta en app görs som en ny version vid sidan av den gamla, så att en app skriven mot `v1` fortsätter fungera när `v2` kommer. **Hjälp för apputvecklare** och **API:ets slutpunkter** i hjälpen säger vad varje adress tar och svarar, på alla språk.

- **En handicap i API:et är ett tal.** Det är `4.5` och inte `"4.5"`, och `null` där en spelare inte har någon.

### Rankingansvariga

- **Ett andra kalkylblad med golfcroquetpartier har dagen då varje parti fördes in.** Lägg `rankings2` till adressen, där `rankings` står, så anger kolumn I dagen då varje parti fördes in, som ett Excel-datum, i den tid som gäller på platsen där turneringen spelas. Fliken Rankingar erbjuder det som **Ladda ner partier för världsranking med partidatum**. Det första kalkylbladet är som det var, eftersom de ansvarigas program läser det efter position.

## Släppt 2026-11-15

- **Ett dubbelpar är en spelare i sökningen, oavsett vilken av de två spelarna som nämns först.** "Sam Someone & Alex Another" och "Alex Another & Sam Someone" var två poster på spelarsidan, och det var "Peter & Rosie Landrebe" och "Rosie & Peter Landrebe" också. Nu är de en, på en adress, uppförda med det namn som den senaste turneringen skrev.

- **Ett dubbelpar kan skrivas med snedstreck, plus eller det engelska ordet "and", inte bara med &.** "Sam Someone / Alex Another", "Sam Someone + Alex Another" och "Sam Someone and Alex Another" läses alla som ett par. Ordet "and" räknas bara när det står ensamt, så ett namn som "Sam Anderson" tas inte för ett par.

- **Ett par sägs kort i schweizerresultat och blocktabeller.** Ett schweizerresultat gav den första spelarens förnamnsinitial och den andra spelarens efternamn. Nu säger det varje spelare, som "T. Murphy & A. Sharpe", och ett efternamn som båda delar sägs en gång, som "R. & P. Landrebe". Kolumnerna i en blocktabell har som rubrik varje spelares initialer sammanbundna med &, till exempel "TM&AS", eller "RL&PL" för ett gemensamt efternamn.

- **Guatemala står bland de länder där ingen har spelat på sistone.** Det stod förut bland de länder där turneringar har spelats sedan 2025.

- **Webbplatsen räknar hur många läsare som kommer och vilka sidor de läser.** Den använder Cloudflares webbanalys, på varje sida som läsare ser. Sidorna där arrangörer arbetar räknas inte. Den använder inga kakor och identifierar inte användaren på något annat sätt än med IP-adressen.

- **Turneringarna publiceras som filer som vem som helst kan använda.** Varje offentlig turnering, i både krocket och gateball, skrivs som en egen fil, med sina spelare och tävlingar, eller sina lag och tester där den spelas av lag, med tillbakadragna partier med och sagda som tillbakadragna. De ligger i ett Git-arkiv, `CroquetScores/data.croquetscores.com`, som uppdateras varje timme, så att du kan rangordna resultaten eller bygga något av dem, och en rättelse syns som en ändring med datum. Inget konto, ingen e-postadress, anteckning eller kommentar finns i en fil, och inte heller något som är arkiverat eller kommer från en provwebbplats.

### Vid nödfall

- **Det finns en sida för den som måste ta över webbplatsen.** Om den som driver webbplatsen inte kan, för att hen är sjuk eller borta länge, kan vem som helst som är inloggad öppna **In case of emergency** i admin, säga vem hen är och varför hen tar över, och trycka på **Send**. Efter en bekräftelse skickas det hen sa som e-post till de personer som har lösenordet till anteckningen med allt webbplatsen behöver, och svar går till avsändaren. Ett konto kan fråga en gång per 48 timmar och får veta när det kan fråga igen. Sidan inleds med en varning om att inte använda den om inte administratören har fått e-post och inte har svarat inom 48 timmar, och om att inte testa den. När meddelandet är skickat säger sidan det och frågar inget mer.

## Släppt 2026-11-11

- **Menyn i mobilen stängs när du trycker utanför den.** Menyn bakom knappen högst upp på en smal skärm stängs när du trycker någon annanstans på sidan, och likaså när du trycker på knappen igen eller följer en länk.

- **Kontomenyn stängs när du trycker utanför den.** Personen längst ut i sidhuvudet, som öppnar registrering, inloggning och det övriga, stängs när du trycker någon annanstans på sidan, och likaså när du trycker på den igen.

- **Nyp och dra isär för att ändra textstorleken.** På en pekskärm nyper du ihop två fingrar för att göra texten mindre och drar isär dem för att göra den större, till en storlek mellan hälften och det dubbla av den vanliga. Till skillnad från webbläsarens egen zoom är sidan fortfarande lika bred som skärmen, så du behöver aldrig rulla i sidled för att läsa en rad. Storleken sparas, så den är densamma på varje sida och vid varje besök. Ett finger rullar fortfarande som förut.

- **Menyn i mobilen går att rulla.** På en låg skärm är menyn aldrig högre än skärmen och rullas inuti den, så att du når varje val. Sidan bakom ligger kvar där den var tills menyn stängs.

- **Pedro Echeguren har förbättrat spanskan.** Pedro gick igenom webbplatsens spanska ord och rättade dem. Tack, Pedro.

## Släppt 2026-11-10

Croquet Scores har skrivits om helt och hållet. Jag hoppas att du gillar den nya versionen.

### Hitta saker

- **Sök.** Varje sida har en sökruta högst upp. Skriv ett namn och tryck på Sök för att hitta turneringar, tävlingar och spelare.

- **Begränsa turneringarna efter land, delstat eller provins och sport.** På startsidan väljer du ett land för att bara se de turneringar som spelas där. När du har valt ett land kan du välja en delstat eller provins i det, och du kan också välja en sport. Din telefon eller dator minns vad du valde och utgår från det nästa gång. **Om du väljer en delstat eller provins hittas bara nya turneringar.** Äldre turneringar fick ingen delstat eller provins, så de faller bort när du väljer en.

- **Begränsa turneringarna efter dagar.** Ange en första och en sista dag, tillsammans, så listas bara de turneringar som börjar mellan dem. Båda dagarna ingår.

- **Ett års sida visar sina månader.** Varje månad visas stängd och säger hur många turneringar som börjar i den. Tryck på en månad för att öppna dess turneringar, och öppna så många du vill. **+ Visa alla** öppnar varje månad.

- **Långa listor är uppdelade i sidor.** En lista med turneringar visar hundra åt gången, så en bred sökning laddar inte längre alla rader på en gång.

- **Hjälpen hittar ett svar utifrån vad du menar.** Ställ en fråga i sökrutan på hjälpens första sida, så hittar den artikeln även när artikeln använder andra ord som betyder samma sak. Första sidan erbjuder också populära frågor och ämnena som kort.

### Följa en turnering

- **Anteckningar från ansvariga.** En turnerings ansvariga kan nu skriva anteckningar som berättar för spelarna vad de behöver veta medan turneringen pågår: formatet, en ändrad spelordning, tiden för lunch. De finns i turneringens nya avsnitt Anteckningar, med den nyaste först och hur länge sedan var och en skrevs.

- **En asterisk (\*) markerar det du inte har läst.** En anteckning har en tills du öppnar den, och får en igen om den ändras efter att du har läst den. Så länge någon anteckning är oläst har avsnittet Anteckningar också en, på varje sida i turneringen, så att du ser att det finns nyheter utan att behöva gå och titta. Kommentarer markeras på samma sätt. Din webbläsare minns vad du har läst, så du behöver inte logga in. En annan telefon eller dator börjar utan något läst.

- **Kommentarerna är lättare att följa.** På den gamla webbplatsen kastade varje ny kommentar ner sidan till botten, så den som bläddrade bakåt bland tidigare kommentarer tappade bort var hen var. Nu flyttas sidan bara ner till en ny kommentar om du redan är längst ner och läser den senaste. Om du har bläddrat tillbaka för att läsa tidigare kommentarer lämnar den dig där du är.

- **Ett block visar var varje spelare placerar sig.** Sista kolumnen anger varje spelares placering: 1, eller =2 när spelare inte kan skiljas åt och delar andraplatsen. När spelare står lika på antalet vunna matcher berättar en rad under hur de skildes åt.

- **Spelordningen kan sorteras.** Tryck på Match för att sortera matcherna efter vinnarens namn, eller på Datum för att sortera efter när var och en lades till. Tryck igen för att vända på ordningen. Webbplatsen minns hur du sorterade, för varje tävling och för listorna med turneringar också, och en länk under en lista, Tillbaka till den vanliga ordningen, glömmer det.

- **Handikapp visas.** När en spelare har handikapp står det efter namnet, tillsammans med vad spelaren representerar, som i Tim Murphy (4, Australien).

- **En tävling säger till hur många bågar dess partier spelas** när det inte är det vanliga för dess sport, som "Spelas till 14 bågar".

### Webbplatsen

- **Ditt språk.** Webbplatsen finns nu på tolv språk: afrikaans, arabiska (Egypten), tjeckiska, engelska, tyska, grekiska, lettiska, norska, portugisiska, spanska, svenska och walesiska. Du får det första språk som din webbläsare ber om och som webbplatsen har, eller engelska om den inte har något. Om du vill byta använder du listan i sidfoten längst ner på varje sida och trycker på knappen bredvid den. Om du vill att ett språk ska läggas till kan du skicka e-post till <croquetscores@gmail.com>.

- **Ljust eller mörkt.** Också i sidfoten: välj Ljust, Mörkt eller System. System följer din telefon eller dator. Webbplatsen minns ditt val på varje sida och vid varje besök.

- **Vilken version du använder.** Sidfoten visar nu vilken version av webbplatsen du tittar på, till exempel v234. Om du rapporterar ett problem, säg gärna vilken version det var.

- **Dina uppgifter.** Sidan /data-deletion-policy berättar hur du kan få det webbplatsen sparar om dig raderat, vad som raderas och vad som sparas.

### Öppen källkod

Koden har nu öppen källkod, under GNU Affero General Public License version 3 (AGPL-3.0). Vem som helst får läsa den, använda den och ändra den, och den som kör en ändrad version som webbplats måste dela sina ändringar under samma licens.
