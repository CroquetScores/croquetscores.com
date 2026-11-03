# Rangeringer

Der en konkurranse teller med i verdensrangeringene, sendes resultatene til rangeringene som en fil, som nettstedet skriver for deg av det du har skrevet inn. Fanen **Rangeringer** er der du har den.

## Fanen

Åpne turneringens side og velg **Rangeringer**, den siste av fanene. Den sier at verdensrangeringene bruker turneringens resultater gjennom filen, slik at lederne ikke trenger å gjøre noe. Filen er en tekstfil for Association croquet og et regneark for Golfcroquet og Amerikansk 6-buers croquet. Under ordene står **Last ned partier til verdensrangering**, som lagrer filen. Den er der før et eneste resultat er skrevet inn, og gir en fil uten noe i før det er det.

Fanen er bare på siden til en turnering som teller med i verdensrangeringene, det vil si en med en konkurranse som teller. Den tilbys til lederne og til de verdensrangeringsansvarlige for idretten, og ikke til en poengfører som ingen av delene er. Selve filen ligger på turneringens egen adresse etterfulgt av `/rankings`, som `/2026/ac/spring-open/rankings`, som er adressen nettstedet alltid har gitt den, og alle som har adressen kan åpne den.

## Hva som står i filen

Hvert resultat som er skrevet inn og ikke arkivert, står i den, i den rekkefølgen det ble skrevet inn, også et resultat som er trukket, og resultatene til en spiller som har trukket seg. Et arkivert resultat står ikke i den. En kamp vunnet ved en bye eller walkover ble ikke spilt, så den har ingen linje.

En spiller oppgis ved verdensrangeringsnavnet sitt, som er navnet deres der de ikke har fått et annet.

**Association croquet** har en blokk for hver konkurranse som har et resultat: arrangementet, datoene, vinneren, om det var kamper eller enkeltpartier, og en nummerert linje for hvert resultat, som «1 Sam Someone beat Alex Another +9». Et resultat er vinnerens buer minus taperens, med et pluss der vinneren fikk flere, og peelene etter. En utslagningskamp er én linje, med hvert partis poengsum etter tur. Linjen **Winner** i hver blokk blir stående tom, siden en test vinnes av et lag og ikke av en spiller.

**Golfcroquet og Amerikansk 6-buers croquet** har et regneark: turneringens navn, dagene dens og hvor mange partier den har, så en nummerert linje for hvert parti, med vinnerens etternavn og fornavn, «beat», taperens, og de to poengsummene. Hvert parti i en utslagningskamp er en egen linje. Under den siste blir linjen **Tournament winner:** stående tom, for den som bruker filen å fylle ut.

## Når det ikke er noen fil

En turnering der ingen av konkurransene teller med i verdensrangeringene, har ingen fil. Å åpne rangeringsadressen dens viser en side som sier det og hvorfor: idretten har ingen verdensrangeringer, eller ingen av konkurransene teller, fordi hver spilles med handicap, tillater uavgjort, eller ble avkrysset for ikke å telle. Det settes når hver konkurranse legges til, og endres med **Rediger**. Bare konkurransene som teller, står i filen.

Neste: [Å endre, arkivere og gjenopprette en turnering](changing-and-archiving.md).
