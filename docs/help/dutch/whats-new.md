# Wat is er nieuw

## Uitgebracht op 2026-10-28

### Dingen vinden

- **Zoekresultaten zijn tabellen.** De toernooien en competities die een zoekopdracht vindt, staan nu op dezelfde manier als de lijsten op de homepagina: de dagen waarop ze gespeeld werden, de sport, de vlag van het land en de naam. Bij een competitie staan de dagen, de sport en de vlag van het toernooi, en het toernooi waar ze bij hoort. De datums en de namen kun je sorteren, elke tabel apart, en de sortering wordt in het adres van de pagina bewaard naast wat je hebt getypt. Sorteren herschikt alleen de honderd getoonde resultaten, de beste treffers voor je woorden, niet alle treffers.
- **De drukste landen staan bovenaan.** Overal waar je een land kiest, begint de lijst nu met Australië, Egypte, Engeland, Nieuw-Zeeland, Spanje en de Verenigde Staten, daarna de andere landen waar sinds 2025 toernooien zijn gespeeld, en dan alle overige, met een streep tussen de drie groepen.
- **Elk toernooi toont zijn sport.** Op een tablet of breder tonen de toernooilijsten op de homepagina en op de pagina van een jaar de sport van het toernooi als korte code, zoals GC of AC, na de datums, in een eigen kleur voor elke sport. Op een telefoon blijft de code weg om ruimte te laten voor namen.
- **Homepagina.** De komende toernooien op de homepagina staan nu op elke breedte onder de recente resultaten.
- **Vlaggen verdringen niets meer op een telefoon.** Op een telefoon blijft de kolom met vlaggen weg uit elke toernooilijst, zodat de namen meer ruimte hebben.
- **De landenlijst blijft open in Chrome op Linux.** Als je op de homepagina op het landveld drukte, ging de lijst open en meteen weer dicht. Nu blijft hij open en kun je scrollen.

### Een toernooi volgen

- **Handicaps.** De toernooileiders van een toernooi kunnen een speler nu een handicap geven, zoals 4, +4 of -1.5. Die staat achter de naam van de speler, met wat de speler vertegenwoordigt als dat er is, zoals in Tim Murphy (4, Australië).
- **Afpellen in het Zwitserse raster.** Een uitslag in het Zwitserse raster eindigt nu met het afpellen van de partij, zoals de tekstbestanden met de ranglijsten al deden. Een partij die met 26tp tegen 17 gewonnen is, staat als +9tp voor de winnaar en -9tp voor de verliezer. Een partij zonder afpellen staat zoals eerder.

### Toernooien overgenomen van de oude sites

- **Meer toernooien staan in het juiste land.** Veel toernooien kwamen in het verkeerde land binnen, omdat de oude sites alleen de tijdzone kenden. De site leest het land nu waar mogelijk uit de naam van een toernooi, zoals Irish, Welsh, Bayfield of CroqCan, en zet elke wedstrijd Engeland tegen Schotland in het land dat dat jaar gastheer was. Bedankt Chris Williams voor zijn hulp hierbij.
- **Toernooien die nog gespeeld moeten worden, worden overgenomen** ook als hun toernooileiders nog geen competitie hebben toegevoegd, zodat je kunt vinden wanneer en waar ze zijn.
- **Een handicap achter de naam van een speler** op de oude sites, zoals in Tim Murphy 1, wordt bij het opzoeken van de wereldranglijst niet meer voor een deel van de naam aangezien.

## Uitgebracht op 2026-10-27

Croquet Scores is helemaal opnieuw geschreven met AI, in TypeScript. Hieronder staat wat je zult merken.

### Dingen vinden

- **Zoeken.** Elke pagina heeft bovenaan een zoekvak. Typ een naam en druk op Zoeken om toernooien, competities en spelers te vinden. De resultaten staan in drie lijsten, en een lijst zonder resultaten wordt weggelaten. Zijn er van één soort meer dan honderd, dan staat dat op de pagina, en met een extra woord in je zoekopdracht wordt het resultaat smaller.
- **Toernooien beperken op land, regio en sport.** Kies op de homepagina een land om alleen de toernooien te zien die daar gespeeld worden. Heb je een land gekozen, dan kun je er een staat of provincie van kiezen, en ook een sport. Wat je gekozen hebt, staat in het adres van de pagina, dus je kunt het als bladwijzer opslaan of naar iemand sturen, en met de terugknop maak je het ongedaan. **Een staat of provincie kiezen vindt alleen nieuwe toernooien.** Oudere toernooien hebben geen staat of provincie gekregen, dus als je er een kiest, vallen ze weg.

### Een toernooi volgen

- **Notities van de organisatoren.** De toernooileiders van een toernooi kunnen nu notities schrijven om de spelers te vertellen wat ze moeten weten terwijl het toernooi loopt: het formaat, een wijziging in de speelvolgorde, het tijdstip van de lunch. Je vindt ze in het nieuwe onderdeel Notities van het toernooi, met de nieuwste bovenaan en hoe lang geleden elke notitie is geschreven.
- **Een asterisk (\*) markeert wat je nog niet hebt gelezen.** Een notitie heeft er een totdat je hem opent, en opnieuw als hij wordt gewijzigd nadat je hem las. Zolang een notitie ongelezen is, heeft ook het onderdeel Notities er een, op elke pagina van het toernooi, zodat je ziet dat er nieuws is zonder te gaan kijken. Commentaar wordt op dezelfde manier gemarkeerd. Je browser onthoudt wat je hebt gelezen, dus je hoeft niet in te loggen. Een andere telefoon of computer begint met niets gelezen.
- **Commentaar is makkelijker te volgen.** Op de oude site gooide elke nieuwe reactie de pagina helemaal naar beneden, waardoor wie eerdere reacties terugleest zijn plek kwijtraakte. Nu schuift de pagina alleen naar een nieuwe reactie als je al onderaan bent en de nieuwste leest. Ben je teruggescrold om eerdere reacties te lezen, dan blijf je waar je bent.

### De site

- **Jouw taal.** De site is nu beschikbaar in zeventien talen: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska en Cymraeg. Je krijgt de eerste taal te zien die je browser vraagt en die de site heeft, of Engels als er geen is. Wil je een andere taal, gebruik dan de lijst in de voettekst onderaan elke pagina en druk op de knop ernaast. Wil je dat er een taal bij komt, stuur dan een e-mail naar <croquetscores@gmail.com>.
- **Licht of donker.** Ook in de voettekst: kies Licht, Donker of Systeem. Systeem volgt je telefoon of computer. De site onthoudt je keuze op elke pagina en bij elk bezoek.
- **Welke versie je gebruikt.** De voettekst toont nu de versie van de site waar je naar kijkt, zoals v234. Als je een probleem meldt, vermeld dan alsjeblieft welke versie het was.

### Open source

De code is nu open source, onder de GNU Affero General Public License versie 3 (AGPL-3.0). Iedereen mag haar lezen, gebruiken en aanpassen, en iedereen die een aangepaste versie als website draait, moet de wijzigingen onder dezelfde licentie delen.
