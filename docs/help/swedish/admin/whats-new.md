# Nytt för arrangörer

## Släppt 2026-11-25

### Turneringen

- **Det frågas innan en turnering med ett namn som liknar ett test sparas.** Skapar du en turnering med hela ordet ”test”, ”testing”, ”trial”, ”fake” eller ”dummy” i namnet öppnas först en dialog som säger att turneringen sparas och listas för alla, och som länkar till provwebbplatsen, där ett test hör hemma. **Spara turneringen** skapar den, och **Avbryt** låter formuläret stå som du skrev det. Det frågas inte på en provwebbplats, och inte heller när en turnering ändras.

### Tävlingar

- **En walkover skriven som resultat frågar om motståndaren ska dras tillbaka.** Trycker du på **Lägg till parti** för ett resultat med ”w/o” i öppnas en dialog som nämner förloraren: **Dra tillbaka motståndaren**, **Lägg till resultat** eller **Avbryt**. Att dra tillbaka motståndaren lägger inte till något parti och tömmer resultatdialogen för nästa. En spelare som dragits tillbaka spelar inte mer, och de partier som hen inte har spelat avgörs utan hen, vilket räknas bättre än ett parti som aldrig spelades. Det frågas bara för ett nytt resultat, och inte i en testtävling eller en Advantage-tävling.

### Appar

- **API:et är nu `v1`.** En apps adresser finns på `/api/v1` där de fanns på `/api/v0`. En app som fortfarande anropar `/api/v0` skickas till den nya adressen med en omdirigering och fungerar därför vidare, men den bör ändras, eftersom omdirigeringen kan tas bort.

## Släppt 2026-11-24

### Tävlingar

- **Ett blocks sammanställning säger också nettopartier.** Där ett blocks matcher är bäst av fler än ett parti säger sammanställningen vinster, förluster, nettopartier och nettobågar, eftersom nettopartier avgör ett oavgjort läge före bågar. Sammanställningen säger inte längre hur dess spelare rankas.

- **En tävlings bricka i sektionsfältet är lika bred som dess namn.** Ett kort namn har inte längre en bricka lika bred som ett långt.

### Appar

- **En nyckel kan nu ändra saker.** En nyckel som gjorts för att läsa och skriva får i en turnering göra det kontot den gjordes för får göra: en arrangörs nyckel allt, och en resultatförares nyckel det som görs med resultat och inget annat. Skapa en under **API-nycklar** i ditt konto, begränsa den till en turnering om du vill, och återkalla den när som helst. Sidan **API:ets POST-slutpunkter** i hjälpen säger vad en app får skicka. De är ännu inte färdigställda, och några kommer att tas bort. Håll en nyckel lika hemlig som ett lösenord.

## Släppt 2026-11-22

### Turneringen

- **Nya Zeelands croquetregioner kan väljas.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury och de övriga regioner som Nya Zeelands nationella turneringar delas in i finns med som en turnerings region, bredvid provinserna.

- **E-postmeddelandet om en nationell eller internationell status som har tagits bort säger det.** När administratören tar bort statusen från en turnering säger e-postmeddelandet till dess arrangörer nu att den har tagits bort, och ber dig säga varför du inte håller med om du inte gör det. Det ger Australian Open som exempel på en nationell tävling och WCF Association Croquet Singles som en internationell.

### Spelare

- **Ett namn i världsrankingen som världsrankingen inte känner till följer ett rättat namn.** Att rätta ett namn lät **Spelarens namn i världsrankingen** vara som det var, så en spelare som lagts till som "aaa" och rättats till "Tim Murphy" var fortfarande känd i rankingen som "aaa". Där rankingen inte känner till det namn spelaren öppnades med blir det nu det rättade namnet medan du skriver det, tills du själv skriver i världsrankingnamnet. Ett som rankingen känner till, vilket visas av bocken bredvid, behålls.

- **Ett handicap visas som det tal det är.** Listan över spelare visar "4" för ett handicap du skrev som "4.0" och "4" för "+4". Ett handicap med decimal, till exempel "-1.5", visas som det är. Du kan fortfarande skriva det med tecken eller punkt.

### Appar

- **En app kan läsa dina turneringar från webbplatsens API.** Webbplatsen har ett öppet API (se **Hjälp för apputvecklare**), som bara läser tills vidare. Du kan skapa en nyckel under **API-nycklar** i ditt konto för att ge en app en egen kvot: den kan skapas för att bara läsa, eller för att läsa och skriva, den kan begränsas till en turnering, och du kan återkalla den när som helst. Håll en nyckel lika hemlig som ett lösenord.

### Vad allmänheten ser

- **De kommande turneringarna på startsidan tar med en turnering som började de senaste två dagarna.** En turnering visas från sextio dagar innan den börjar till dagen den slutar, men en som började för mer än två dagar sedan lämnas utanför. Så de dagar den spelas går den att hitta innan någon har fört in ett parti i den, och efter de första två dagarna finns den bland de senaste resultaten när ett parti har lagts till.

- **En utslagning säger vad varje rundas matcher är bäst av.** Ovanför varje runda i en utslagnings schema, och under varje rundas namn i dess sammanställning, står det nu "Bäst av 3", eller vad du har valt för den rundan, så att ingen behöver räkna resultatrutorna för att få veta det. Se [Vad allmänheten ser](../tournament-managers/standard-tournament/what-the-public-sees.md).

## Släppt 2026-11-15

### Turneringen

- **De två rutorna för en nationell och en internationell tävling står i en ruta under "Valfritt".** På sidan som skapar eller ändrar en turnering var **Nationell tävling** och **Internationell tävling** det enda som frågades efter under underrubriken, och några tog dem för ett val som måste göras. En turnering behöver inte vara någon av dem, och rutan säger det nu. Ordet har lagts till på varje språk webbplatsen finns på, och översättningarna som inte är engelska behöver en modersmålstalares blick.

- **En turnering som bara gjordes som ett test kan administratören arkivera, och du får veta det.** Den som lär sig webbplatsen gör ibland en turnering på den riktiga webbplatsen som alltid bara var ett test. Administratören kan nu arkivera den och skicka e-post till dess arrangörer, med en provwebbplats nämnd att öva på. Inget raderas, så en arkiverad turnering kan återställas. Arrangörer som har glömt sina konton och resultatförare får ingen e-post.

### Spelare

- **Ett dubbelpar kan skrivas med snedstreck, plus eller det engelska ordet "and", inte bara med &.** "Sam Someone / Alex Another" är samma par som "Sam Someone & Alex Another". Ordet "and" räknas bara när det står ensamt, så ett namn som "Sam Anderson" tas inte för ett par. Där ett par spelar i en schweizer eller ett block sägs det "T. Murphy & A. Sharpe" i ett schweizerresultat och "TM&AS" överst i en blocktabell.

## Släppt 2026-11-11

### Turneringen

- **Namnet på en turnering föreslår de namn webbplatsen redan har.** En turnering ingår ofta i en serie som spelas varje år under nästan samma namn. När du skriver i **Namn** på sidan som skapar eller ändrar en turnering föreslås därför namnen på webbplatsens turneringar. Ett namn föreslås när det har varje ord du har skrivit, i valfri ordning och med valfria stora och små bokstäver, så "CNSW Bronze" hittar "CNSW AC Bronze Medal". Välj ett med ett klick, eller med piltangenterna och Enter, och ändra det som du vill. Escape stänger förslagen. Ett namn föreslås en gång, hur många turneringar som än har det, och en turnering du ändrar får inte sitt eget namn föreslaget.

### Tävlingar

- **En tävling öppnas på fliken Resultat när ett parti har lagts in.** När du kommer tillbaka till en tävling för att lägga in fler resultat behöver du inte längre trycka på **Resultat** varje gång. En tävling utan något parti i bruk, också en vars enda parti har arkiverats, öppnas fortfarande på **Spelare**. En resultatförare ser bara **Resultat**, som förut.

- **När du arkiverar en tävling eller en landskamp får den ett nummer efter namnet, så att namnet kan användas igen.** En tävling som skapats med fel slag måste arkiveras och läggas till på nytt, och den nya kan nu få samma namn som den gamla. Arkiverar du "Block A" byter den namn till "Block A (1)", med det första numret som ingen annan tävlings namn slutar på. Adressen är oförändrad, och en tävling som återställs behåller det nya namnet. En arkiverad landskamp numreras på samma sätt och lämnas som den var när ett lags korta namn ändras. Se [Tävlingar](../tournament-managers/standard-tournament/competitions.md).

## Släppt 2026-11-10

Det här är de viktigaste ändringarna för den som arrangerar turneringar. [Hjälpen för arrangörer](../tournament-managers/index.md) har alla detaljer.

### Spelare

- **Spelarna läggs in en gång, i turneringen.** På den gamla webbplatsen lades spelarna till inne i varje tävling. Nu är turneringens flik **Spelare** platsen där du lägger till, rättar, ordnar och arkiverar dem. En spelare som rättas där blir rättad i alla tävlingar som spelaren är med i och på alla publika sidor. Se [Spelare](../tournament-managers/standard-tournament/players.md).

- **Många spelare kan läggas till samtidigt.** På fliken **Spelare** trycker du på **Lägg till flera spelare**, bredvid **Lägg till spelare**, och klistrar in en lista med en rad för varje spelare. Alla spelare på listan läggs till. Listans första rad namnger fälten.

- **Ett par i dubbel kan skapas av två spelare som redan är inlagda.** På fliken **Spelare** trycker du på **Lägg till par**, väljer den första och den andra spelaren och trycker på **Lägg till par** igen. Paret får namnet "Sam Someone & Alex Another", eller "Peter & Rosie Landrebe" när båda har samma efternamn. Dialogen förblir öppen så att nästa par kan skapas. Se [Spelare](../tournament-managers/standard-tournament/players.md#adding-a-pair).

- **En spelare kan ha ett handicap**, till exempel 4, +4 eller -1.5. Det visas efter spelarens namn, tillsammans med vad spelaren representerar om det finns något, som i Tim Murphy (4, Australia).

- **Vad en spelare representerar föreslås.** När du skriver det föreslås de klubbar och länder som spelare har lagts till som representanter för, i vilken turnering och vilken sport som helst. Skriv två bokstäver för att börja.

### Tävlingar

- **En knapp lägger till en tävling.** I stället för de separata knapparna för nytt block, ny schweizer och ny utslagning trycker du på **Lägg till tävling**. Dialogen frågar efter namnet och slaget (block, utslagning eller schweizer) och sedan vad det slaget behöver: vad varje match är bäst av, och för en utslagning platserna i dess lottning. Den förblir öppen så att du kan lägga till flera på en gång. En tävlings slag kan inte ändras efteråt: arkivera den och lägg till den på nytt. Se [Tävlingar](../tournament-managers/standard-tournament/competitions.md).

- **En utslagning kan ta emot förlorarna från en annan utslagnings rond.** I en utslagnings dialog trycker du på **Lägg till förlorarutslagning**, ger den ett namn och väljer den rond vars förlorare spelar vidare i den. Dess spelare placeras där allteftersom varje match avgörs, så du behöver inte skriva in dem för hand.

- **Ett block kan få veta hur spelare med lika många vunna matcher skiljs åt.** I ett blocks dialog väljer du dess **Särskiljning**: nettopartier, sedan nettobågar, sedan vem som slog vem; vem som slog vem enbart; eller annat, vilket betyder ingen känd metod, så att spelarna förblir lika och delar en placering. Ett nytt block börjar med nettopartier, sedan nettobågar, sedan vem som slog vem.

- **En tävling kan ange det högsta antal bågar som partierna spelas till.** I en tävlings dialog tar **Högsta antal bågar** ett heltal på minst 1. Lämna fältet tomt för att inte ha något maximum, så gäller det vanliga för tävlingens sport: 26, eller 13 i golfcroquet.

### Spelare i en tävling

- **Spelare läggs in i en tävling från en lista.** På en tävlings sida väljer du en av turneringens spelare i rullgardinsmenyn och trycker på **Lägg till spelare**. Rullgardinsmenyn erbjuder bara spelare som inte redan är med i tävlingen. I en utslagning erbjuder den också **Bye** för de platser som blir över. Se [Lägga in spelare i en tävling](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Flera spelare kan läggas till i en tävling samtidigt.** På en tävlings flik **Spelare** trycker du på **Lägg till flera**, bredvid **Lägg till spelare**, kryssar för de spelare du vill ha, eller rutan ovanför listan för alla, och trycker på **Lägg till markerade**. De läggs in i turneringens ordning. Om några inte kan läggas till visar en andra dialog vilka och varför, och frågar om resten ska läggas till. Se [Lägga in spelare i en tävling](../tournament-managers/standard-tournament/entering-players-in-a-competition.md#adding-several).

### Turneringen

- **En ny turnering börjar i den månad det är nu.** Dess start är den första i denna månad och dess slut är samma dag, och slutet följer starten tills du väljer ett eget.

- **Välj land, delstat eller provins och sport från listor.** En turnering behöver ett land och en sport. Om du väljer ett annat land töms delstaten eller provinsen. En spelares eller ett lags flagga väljs från en lista, med de mest använda länderna först.

- **Raden med avsnitt följer med tävlingarna.** När du har lagt till, ändrat, flyttat, arkiverat eller återställt en tävling eller en landskamp visar raden på turneringens sida vad turneringen nu har, utan att du öppnar sidan igen.

- **Hjälpikonen finns på fler admin-sidor.** Det runda frågetecknet finns på sidorna som skapar och ändrar en turnering, på raden med flikar för en turnering och för en tävling, och bredvid listan över turneringar. Var och en leder till hjälpen för det du tittar på, i en ny flik så att sidan finns kvar.

### Anteckningar

- **Arrangörsanteckningar: använd dem i stället för en kommentar för att berätta för spelarna vad de behöver veta.** Formatet, en ändring i spelordningen, tiden för lunch. En anteckning skrivs på turneringens flik **Anteckningar**, med en rubrik och en beskrivning i Markdown, och du kan förhandsgranska den innan du lägger till den. Spelarna hittar anteckningarna på turneringens publika sida Anteckningar. En anteckning de inte har läst är markerad med en asterisk, och det är avsnittet Anteckningar på varje sida i turneringen också, tills de öppnar det. En anteckning som du redigerar markeras på nytt för alla som hade läst den. Se [Anteckningar](../tournament-managers/standard-tournament/notes.md).

- **Den gamla webbplatsens turneringsanteckningar är nu Underrubriken.** Det du skrev där bevaras som turneringens underrubrik och visas fortfarande under turneringens namn på varje publik sida. Den skrivs i Markdown och kan vara upp till 2000 tecken. Den är till för det som läsarna bör veta oavsett vilken sida de är på. Använd en anteckning för nyheter som ändras medan turneringen pågår.

### Vad allmänheten ser

- **Ett block visar var varje spelare placerar sig**, i en sista kolumn med rubriken #, med en rad under som säger hur spelare med lika många vunna matcher skiljdes åt.

- **Interstate Shield rankas efter nettomatcher.** Lagen rankas efter landskamper: de matcher de vann minus de matcher de förlorade.
