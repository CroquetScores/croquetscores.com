# Rangeringer

Der en konkurranse teller med i verdensrangeringene, sendes resultatene dens til rangeringene som en fil, som nettstedet skriver for deg ut fra det du har lagt inn. Fanen **Rangeringer** er der du har den.

## Fanen

Åpne turneringens side og velg **Rangeringer**, den siste av fanene. Den sier, med de samme ordene uansett idrett, at verdensrangeringene bruker turneringens resultater gjennom filen, slik at lederne ikke trenger å gjøre noe. Under det står **Last ned partier til verdensrangering**, en lenke til filen, som lagrer den. Filen er en tekstfil for Association croquet og et regneark for Golfcroquet og Amerikansk 6-buers croquet. Den er der før et eneste resultat er lagt inn, og gir en fil uten noe i seg til det er det. Verdensrangeringsansvarlige for idretten tilbys også fanen, for å ta partiene fra filen.

Fanen finnes bare på siden til en turnering i en idrett med verdensrangeringer, og bare for lederne: en poengfører tilbys den ikke. Selve filen ligger på turneringens egen adresse etterfulgt av `/rankings`, som `/2026/ac/spring-open/rankings`, som er adressen nettstedet alltid har gitt den, og alle som har adressen, kan åpne den.

## Hva som står i filen

Hvert resultat som er lagt inn og ikke arkivert, står i den, i den rekkefølgen det ble lagt inn, også et resultat som er trukket, og de til en spiller som har trukket seg. Et arkivert resultat står ikke i den. En kamp vunnet ved en bye eller walkover ble ikke spilt, så den har ingen linje.

En spiller oppgis med verdensrangeringsnavnet sitt, som er navnet deres der de ikke har fått et annet.

**Association croquet** har en blokk for hver konkurranse som har et resultat: arrangementet, datoene, vinneren, om det var kamper eller enkeltpartier, og en nummerert linje for hvert resultat, som «1 Sam Someone beat Alex Another +9». Et resultat er vinnerens buer minus taperens, med et pluss der vinneren scoret mer, og peelene etter det. En kamp i en utslagning er én linje, med hvert partis resultat etter tur. Nettstedet navngir vinneren så godt det kan: vinneren av en utslagnings siste kamp, spilleren en blokk plasserer først (se uavgjortreglene dens), og i en konkurranse med enkeltpartier den som har vunnet flest. Der spillere ikke kan skilles for førsteplassen, lar det linjen **Winner** stå tom, og verdensrangeringsansvarlige avgjør det. Ordene i filen, som «beat» og «Winner», er engelske uansett språk.

**Golfcroquet og Amerikansk 6-buers croquet** har et regneark: turneringens navn, dagene dens og hvor mange partier den har, så en nummerert linje for hvert parti, med vinnerens etternavn og fornavn, «beat», taperens, og de to resultatene. Hvert parti i en utslagnings kamp er en linje for seg. Under den siste er linjen **Tournament winner:** latt stå tom, for den som bruker filen å fylle ut.

## Når det ikke er noen fil

En turnering der ingen av konkurransene teller med i verdensrangeringene, har ingen fil. Å åpne rangeringsadressen dens viser en side som sier det og hvorfor: idretten har ingen verdensrangeringer, eller ingen av konkurransene teller med, fordi hver spilles med handicap, tillater uavgjort, eller ble avkrysset for ikke å telle. Det settes når hver konkurranse legges til, og endres med **Rediger**. Bare konkurransene som teller, står i filen.

Neste: [Å endre, arkivere og gjenopprette en turnering](changing-and-archiving.md).
