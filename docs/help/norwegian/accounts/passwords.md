# Passord

## Hva nettstedet krever av et passord

Overalt der du velger et passord, når du bekrefter e-postadressen din, lager et nytt passord eller endrer ett, krever nettstedet at det:

- er **minst 12 tegn** langt;
- skrives likt to ganger, andre gang som **Bekreft passord**;
- ikke er ett som har **dukket opp i en datalekkasje** et annet sted.

Mellomrom i begynnelsen og på slutten fjernes, slik de gjør når du logger inn, så et tilfeldig mellomrom stenger deg ikke ute. Mellomrom i midten beholdes, noe som passer for en passfrase med flere ord.

## Å velge et godt passord

Nettstedet krever lengde og ingenting annet, ikke store bokstaver, sifre eller symboler. Det følger dagens råd, som er at et langt passord, aldri brukt noe annet sted, er sterkere og lettere å huske enn et kort som er gjort vanskelig å lese. Rådet nettstedet følger er fra det amerikanske National Institute of Standards and Technology, som du kan lese i [NISTs retningslinjer for digital identitet, om passord](https://pages.nist.gov/800-63-4/sp800-63b.html).

Kort sagt:

- **Gjør det langt.** Flere urelaterte ord gir en passfrase som er lett å huske og vanskelig å gjette.
- **Bruk det her og ingen andre steder.** Et passord brukt på to nettsteder er bare så trygt som det svakeste av dem, og passord stjålet fra ett prøves på andre.
- **Ha det i en passordbehandler** hvis du kan, som kan lage et langt passord for hvert nettsted og huske dem alle.
- **Ikke bytt det etter en tidsplan.** Bytt det når du tror at noen andre kan kjenne det, og ellers ikke.

## Hvordan nettstedet sjekker for et lekket passord

Lister over passord stjålet fra andre nettsteder er publisert, og folk som prøver å komme inn i kontoer prøver dem først. Så når du velger et passord, spør nettstedet en ekstern tjeneste om det står på en slik liste. Tjenesten drives av en tredjepart, og nettstedet bruker den bare til dette.

Passordet ditt forlater ikke nettstedet. Nettstedet lager et enveis fingeravtrykk av det, som ikke kan gjøres om til passordet igjen, og sender tjenesten bare de fem første tegnene av det fingeravtrykket. Tjenesten svarer med resten av fingeravtrykket til hvert lekket passord som begynner likt, som er flere hundre av dem, og nettstedet leter etter sitt eget blant dem. Så tjenesten får vite at passordet ditt er ett av flere hundre, og aldri hvilket. [Hvordan dette fungerer, forklart av Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), sier mer.

Et passord som står på listen avvises med en melding som sier det, og du velger et annet. Hvis tjenesten ikke kan nås, kan passordet ditt ikke sjekkes akkurat nå, så det godtas eller endres ikke. Prøv igjen om noen minutter. En lenke du fikk tilsendt fungerer fortsatt til den går ut.

## Å endre passordet ditt

Velg **Endre passord** i menyen **Konto**. Siden ber om ditt **Nåværende passord**, et **Nytt passord**, og det samme igjen som **Bekreft passord**. Det nåværende spørres det om fordi det å være innlogget ikke er nok: en telefon som er låst opp ville ellers la den som tok den opp stenge deg ute.

Når det er endret, forblir du innlogget i denne nettleseren og alle andre logges ut. Nettstedet sender e-post til adressen din om at passordet ble endret, slik at du får vite det hvis det ikke var deg. Et feil nåværende passord teller mot de samme grensene som innlogging har.

Hvis du ikke husker det nåværende passordet, peker siden til **Glemt passord?**.

Neste: [Ta vare på kontoen din](looking-after-your-account.md).
