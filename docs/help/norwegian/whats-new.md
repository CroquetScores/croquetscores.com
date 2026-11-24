# Hva som er nytt

## Utgitt 2026-11-25

- **På en telefon har siden mer plass.** Det hvite panelet som holder en side går fra den ene kanten av skjermen til den andre, og teksten og linjene over og under det står 10 piksler fra kanten der de sto 41. Et skjema på den grønne siden beholder marginen sin. Bredere skjermer er som de var.

- **Et navn i sammendraget til en utslagsturnering brytes aldri midt i et ord.** Det brytes bare ved mellomrommene. Der et ord er bredere enn plassen ved siden av resultatene, ruller sammendraget sideveis innenfor siden i stedet for å skyve siden ut.

## Utgitt 2026-11-24

- **Oversikten for en blokk sier også nettopartier.** Der kampene i en blokk er det beste av mer enn ett parti, sier oversikten seiere, tap, nettopartier og nettobuer, siden nettopartier avgjør en uavgjort stilling før buer. En blokk med enkeltpartier sier seiere, tap og nettobuer som før. Oversikten sier ikke lenger hvordan spillerne rangeres.

- **Flisen til en konkurranse i seksjonslinjen er like bred som navnet.** Et kort navn som "Block A" hadde en flis like bred som et langt, så linjen gikk tom for plass før det var nødvendig.

- **På en telefon tar datoene på startsiden mindre plass.** Datokolonnen er så bred som datoene til en helg, som "19-21 Nov", og navnene får resten. Datoer som går fra én måned til neste, brytes før bindestreken, så den andre linjen begynner med den. Under **Dine nylige turneringer** sier en turnering fra i år ikke noe år, og en fra et annet år sier det under datoene sine.

### For apputviklere

- **En app kan endre ting, med en nøkkel som er laget for å skrive.** Det nettstedets egne sider endrer, endres av de samme adressene under `/api/v0`: å lage en turnering, konkurransene, spillerne, lagene og partiene dens, og hvem som kan lede den og føre resultater. En nøkkel kan gjøre det kontoen den ble laget for kan gjøre, og en poengførers nøkkel kan gjøre det som gjøres med resultater og ingenting annet. Hjelpesiden **API-ets POST-endepunkter** sier hva hver adresse tar og svarer. De settes fortsatt, og noen vil bli tatt bort.

- **En app kan spørre hva en turnering kan være.** Idrettene, formatene og landene med regionene sine er på `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` og `/api/v0/countries`, på språket appen ber om, så det den lager en turnering med, er det nettstedet tilbyr.

- **En app kan lese spillerne på verdensrankingen og partiene deres.** Association Croquet-spillerne verdensrankingene kjenner, er på `/api/v0/ac/world-ranking-players`, og hver spillers partier, i den rekkefølgen de ble lagt til, er på adressen spilleren oppgir. Navnene oppdateres fra rankingene når listen spørres om fra begynnelsen, høyst én gang i timen.

- **API-ets endepunkter er to sider i hjelpen, én for GET-endepunktene og én for POST-endepunktene,** på alle språk.

### Verdensrangeringsansvarlige

- **En spiller i Association Croquet-rankingene føres etter nummeret rankingene gir dem.** En spiller rankingene gir nytt navn, er samme spiller, en som faller av listen, arkiveres og glemmes ikke, og en som listes igjen, er ikke lenger arkivert. En liste som gir ett navn til to spillere eller ett nummer til to navn, avvises i sin helhet og ingenting endres, og administratoren får beskjed på e-post.

## Utgitt 2026-11-22

- **Startsiden husker turneringene du har sett på i det siste.** Når du åpner en turnering, havner den først under **Dine nylige turneringer**, mellom filteret og de siste resultatene, opptil fem av dem, slik at du kan gå tilbake til de du følger uten å lete i listene. De lagres på din egen enhet, i en informasjonskapsel som bare inneholder turneringenes adresser, og listen vises ikke i det hele tatt før du har åpnet en turnering. Hjelpen sier hva informasjonskapselen er.

- **De kommende turneringene tar med de som startet de siste to dagene.** En turnering som har startet og ikke er ferdig, vises til og med dagen den slutter, så lenge den startet for høyst to dager siden, slik at den kan finnes de dagene den spilles før noen har ført inn et parti i den. De som startet for lengre siden, står blant de siste resultatene når et parti er lagt til.

- **En utslagning sier hva hver runde sine kamper er best av.** Over hver runde i en utslagnings oppsett, og under hver runde sitt navn i oppsummeringen, står det «Best av 3», eller det turneringsarrangøren har valgt for runden.

- **Et resultat er innenfor ruten sin i en utslagnings oppsummering, og et navn holdes samlet i en blokks oppsummering.** På en smal skjerm rant et Advantage-resultat skrevet som «83% (5/6)» ut av ruten sin over navnene, og et navn i en blokks oppsummering kunne brytes etter fornavnet. Et par holdes samlet på hver side av og-tegnet.

- **Du kan legge nettstedet på telefonens hjem-skjerm.** En knapp i bunnteksten tilbyr det når nettleseren din kan, og **Legge nettstedet til på hjem-skjermen** i hjelpen sier hvordan, for en iPhone og for en Android-telefon. Croquet Scores og Gateball Scores har hvert sitt ikon, slik at du kan skille dem fra hverandre.

- **Newzealandske krokketregioner er med.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury og de andre regionene New Zealands nasjonale turneringer deles inn i, kan velges som en turnerings region.

### For apputviklere

- **Det finnes et åpent API.** En app kan lese et års turneringer, en turnering med konkurranser og spillere, en konkurranses partier og stilling, turneringene som har skiftet år og turneringene som er arkivert, som JSON, på `/api/v0`. Det er `v0` så lenge det er under utvikling. Alle kan lese, og en app som sender en nøkkel laget under **API-nøkler** i kontoen din, har en egen kvote, til å begynne med 60 forespørsler i minuttet og 10 000 i døgnet. En app uten nøkkel deler en kvote etter adressen sin, 10 i minuttet og 500 i døgnet.

- **En nøkkel lar en app handle for deg uten passordet ditt.** Lag en nøkkel i kontoen din, si hva den er til, og trekk den tilbake når du ikke vil at den skal brukes lenger. En nøkkel kan lages for bare å lese eller for å lese og skrive, og kan begrenses til én turnering. API-et leser bare foreløpig. Bare en hash av nøkkelen lagres, så nøkkelen vises én gang, når du lager den.

- **Felt kan legges til i et svar uten en ny versjon.** En app må overse et felt den ikke kjenner. En endring som ville ødelagt en app, gjøres som en ny versjon ved siden av den gamle, slik at en app skrevet mot `v1` fortsetter å virke når `v2` kommer. **Hjelp for apputviklere** og **API-ets endepunkter** i hjelpen sier hva hver adresse tar og svarer, på alle språk.

- **En handicap i API-et er et tall.** Den er `4.5` og ikke `"4.5"`, og `null` der en spiller ikke har noen.

### Verdensrangeringsansvarlige

- **Et andre regneark med Golf Croquet-partier har dagen hvert parti ble ført inn.** Legg `rankings2` til adressen, der `rankings` står, så oppgir kolonne I dagen hvert parti ble ført inn, som en Excel-dato, i tiden på stedet der turneringen spilles. Fanen Rangeringer tilbyr det som **Last ned partier til verdensrangering med partidato**. Det første regnearket er som det var, siden de ansvarliges program leser det etter posisjon.

## Utgitt 2026-11-15

- **Et dobbeltpar er én spiller i søket, uansett hvem av de to spillerne som er nevnt først.** «Sam Someone & Alex Another» og «Alex Another & Sam Someone» var to oppføringer på spillersiden, og det samme var «Peter & Rosie Landrebe» og «Rosie & Peter Landrebe». Nå er de én, på én adresse, oppført med navnet den siste turneringen skrev.

- **Et dobbeltpar kan skrives med skråstrek, pluss eller det engelske ordet «and», ikke bare med &.** «Sam Someone / Alex Another», «Sam Someone + Alex Another» og «Sam Someone and Alex Another» leses alle som et par. Ordet «and» teller bare når det står alene, så et navn som «Sam Anderson» regnes ikke som et par.

- **Et par sies kort i resultater fra sveitsisk og i blokktabeller.** Et sveitsisk resultat ga forbokstaven i fornavnet til den første spilleren og etternavnet til den andre. Nå sier det hver spiller, som «T. Murphy & A. Sharpe», og et etternavn som begge deler, sies én gang, som «R. & P. Landrebe». Kolonnene i en blokktabell har som overskrift initialene til hver spiller bundet sammen med &, for eksempel «TM&AS», eller «RL&PL» for et felles etternavn.

- **Guatemala står sammen med landene der ingen har spilt i det siste.** Det sto før sammen med landene der det er spilt turneringer siden 2025.

- **Nettstedet teller hvor mange lesere som kommer og hvilke sider de leser.** Det bruker Cloudflares nettanalyse, på hver side leserne ser. Sidene arrangørene jobber på, telles ikke. Det bruker ingen informasjonskapsler og identifiserer ikke brukeren på annen måte enn med IP-adressen.

- **Turneringene publiseres som filer som hvem som helst kan bruke.** Hver offentlig turnering, i både krokket og gateball, skrives som en egen fil, med spillerne og konkurransene sine, eller lagene og testene sine der den spilles av lag, med trukne partier tatt med og sagt å være trukket. De ligger i et Git-arkiv, `CroquetScores/data.croquetscores.com`, som oppdateres hver time, slik at du kan rangere resultatene eller bygge noe av dem, og en rettelse vises som en endring med dato. Ingen konto, e-postadresse, notat eller kommentar står i en fil, og heller ikke noe som er arkivert eller kommer fra et prøvenettsted.

### I en nødssituasjon

- **Det finnes en side for den som må ta over nettstedet.** Hvis den som driver nettstedet ikke kan, fordi vedkommende er syk eller borte lenge, kan hvem som helst som er logget inn åpne **In case of emergency** i admin, si hvem de er og hvorfor de tar over, og trykke **Send**. Etter en bekreftelse sendes det de sa som e-post til menneskene som har passordet til notatet med alt nettstedet trenger, og svar går til avsenderen. En konto kan spørre én gang per 48 timer, og får vite når den kan spørre igjen. Siden åpner med en advarsel om ikke å bruke den med mindre administratoren har fått e-post og ikke har svart innen 48 timer, og om ikke å teste den. Når meldingen er sendt, sier siden det og spør ikke om mer.

## Utgitt 2026-11-11

- **Menyen på en mobil lukkes når du trykker utenfor den.** Menyen bak «Meny»-knappen øverst på en smal skjerm lukkes når du trykker et annet sted på siden, i tillegg til når du trykker på knappen igjen eller følger en lenke.

- **Kontomenyen lukkes når du trykker utenfor den.** Kontomenyen, personen ytterst i toppen av siden, åpner for å registrere deg, logge inn og mer. Den lukkes når du trykker et annet sted på siden, i tillegg til når du trykker på den igjen.

- **Klyp og dra fra hverandre for å endre størrelsen på teksten.** På en berøringsskjerm klyper du sammen to fingre for å gjøre teksten mindre, og drar dem fra hverandre for å gjøre den større, til en størrelse mellom halvparten og det dobbelte av vanlig størrelse. I motsetning til nettleserens egen zoom er siden fortsatt like bred som skjermen, så du må aldri rulle sidelengs for å lese en linje. Størrelsen huskes, så den er den samme på hver side og ved hvert besøk. Én finger ruller som før.

- **Menyen på en mobil kan rulles.** På en lav skjerm er menyen aldri høyere enn skjermen og kan rulles, slik at du kommer til alle valgene. Siden bak blir stående der den var til menyen lukkes.

- **Pedro Echeguren har forbedret spansken.** Pedro gikk gjennom nettstedets spanske ord og rettet dem. Takk, Pedro.

## Utgitt 2026-11-10

Croquet Scores er skrevet helt om. Jeg håper du liker den nye versjonen.

### Å finne ting

- **Søk.** Hver side har en søkeboks øverst. Skriv et navn og trykk Søk for å finne turneringer, konkurranser og spillere.

- **Begrens turneringene etter land, stat eller provins og idrett.** På hjemmesiden velger du et land for å se bare turneringene som spilles i det. Når du har valgt et land, kan du velge en stat eller provins i det, og du kan velge en idrett også. Telefonen eller datamaskinen din husker hva du valgte, og starter med det neste gang. **Å velge en stat eller provins finner bare nye turneringer.** Eldre fikk ikke stat eller provins, så å velge en utelater dem.

- **Begrens turneringene etter dager.** Oppgi en første og en siste dag, begge to, så vises bare turneringene som starter mellom dem. Begge dagene er med.

- **Et års side viser månedene sine.** Hver måned står lukket, og sier hvor mange turneringer som starter i den. Trykk på en måned for å åpne turneringene i den, og åpne så mange du vil. **+ Vis alle** åpner alle månedene.

- **Lange lister står på sider.** En liste over turneringer viser hundre om gangen, så et bredt søk laster ikke lenger alle radene på én gang.

- **Hjelpen finner svar etter hva du mener.** Still et spørsmål i søkeboksen på hjelpens første side, så finner den artikkelen selv om artikkelen bruker andre ord som betyr det samme. Den første siden viser også populære spørsmål og emnene som kort.

### Å følge en turnering

- **Notater fra lederne.** En turnerings ledere kan nå skrive notater for å fortelle spillerne det de trenger å vite mens den spilles: formatet, en endring i spilleorden, tidspunktet for lunsj. De står i turneringens nye avsnitt Notater, med det nyeste først og hvor lenge siden hvert ble skrevet.

- **En stjerne (\*) merker det du ikke har lest.** Et notat har en til du åpner det, og igjen hvis det endres etter at du leste det. Mens et notat er uleset, har avsnittet Notater en også, på hver side i turneringen, så du kan se at det er nyheter uten å gå og se. Kommentarer merkes på samme måte. Nettleseren din husker hva du har lest, så du trenger ikke logge inn. En annen telefon eller datamaskin begynner uten noe lest.

- **Kommentarer er lettere å følge.** På det gamle nettstedet kastet hvert nytt innlegg siden helt ned til bunnen, så alle som så tilbake gjennom tidligere innlegg mistet plassen sin. Nå flytter siden seg bare ned til et nytt innlegg hvis du allerede er nederst og leser det siste. Hvis du har rullet tilbake for å lese tidligere innlegg, lar den deg være der du er.

- **En blokk viser hvor hver spiller står.** Den siste kolonnen gir hver spillers plassering: 1, eller =2 der spillere ikke kan skilles og deler andreplassen. Der spillere står likt på kampene de har vunnet, sier en linje under hvordan de ble skilt.

- **Spilleorden kan sorteres.** Trykk på Parti for å sortere partiene etter vinnerens navn, eller på Dato for å sortere etter når hvert ble lagt til. Trykk igjen for å snu dem. Nettstedet husker hvordan du sorterte, for hver konkurranse og for turneringslistene også, og en lenke under en liste, Tilbake til vanlig rekkefølge, glemmer det.

- **Handicap vises.** Der en spiller har handicap, står det etter navnet, sammen med det spilleren representerer, som i Tim Murphy (4, Australia).

- **En konkurranse sier hvor mange buer partiene spilles til** der det ikke er det vanlige for idretten, som «Spilt til 14 buer».

### Nettstedet

- **Språket ditt.** Nettstedet er nå på tolv språk: afrikaans, arabisk (Egypt), tsjekkisk, engelsk, tysk, gresk, latvisk, norsk bokmål, portugisisk, spansk, svensk og walisisk. Du får det første språket nettleseren din ber om som nettstedet har, eller engelsk hvis det ikke har noe. For å velge et annet, bruk listen i bunnteksten nederst på hvilken som helst side og trykk på knappen ved siden av. Hvis du vil ha et språk lagt til, send e-post til <croquetscores@gmail.com>.

- **Lyst eller mørkt.** Også i bunnteksten: velg Lyst, Mørkt eller System. System følger telefonen eller datamaskinen din. Nettstedet husker valget ditt på hver side og hvert besøk.

- **Hvilken versjon du er på.** Bunnteksten viser nå versjonen av nettstedet du ser på, som v234. Hvis du melder fra om et problem, si gjerne hvilken versjon det var.

- **Dine data.** Siden /data-deletion-policy sier hvordan du kan få slettet det nettstedet har lagret om deg, hva som slettes og hva som beholdes.

### Åpen kildekode

Koden er nå åpen kildekode, under GNU Affero General Public License versjon 3 (AGPL-3.0). Hvem som helst kan lese den, bruke den og endre den, og alle som kjører en endret versjon som et nettsted må dele endringene sine under samme lisens.
