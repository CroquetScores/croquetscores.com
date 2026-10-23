# Wachtwoorden

## Wat de site van een wachtwoord vraagt

Overal waar je een wachtwoord kiest, dus bij het bevestigen van je e-mailadres, het instellen van een nieuw wachtwoord of het wijzigen van een wachtwoord, vraagt de site dat het:

- **minstens 12 tekens** lang is;
- twee keer hetzelfde wordt getypt, de tweede keer als **Wachtwoord bevestigen**;
- niet een wachtwoord is dat ergens anders **in een datalek is opgedoken**.

Spaties aan het begin en het eind worden weggelaten, net als bij het inloggen, zodat een losse spatie je niet buitensluit. Spaties in het midden blijven staan, wat past bij een wachtzin van meerdere woorden.

## Een goed wachtwoord kiezen

De site vraagt om lengte en om niets anders, dus geen hoofdletters, cijfers of symbolen. Dat volgt het huidige advies: een lang wachtwoord dat je nergens anders gebruikt, is sterker en makkelijker te onthouden dan een kort wachtwoord dat moeilijk leesbaar is gemaakt. Het advies dat de site volgt is dat van het Amerikaanse National Institute of Standards and Technology, dat je kunt lezen in [de richtlijnen voor digitale identiteit van NIST, over wachtwoorden](https://pages.nist.gov/800-63-4/sp800-63b.html).

Kort gezegd:

- **Maak het lang.** Meerdere niet bij elkaar horende woorden vormen een wachtzin die makkelijk te onthouden en moeilijk te raden is.
- **Gebruik het hier en nergens anders.** Een wachtwoord dat op twee sites wordt gebruikt, is maar zo veilig als de zwakste van de twee, en wachtwoorden die bij de ene site zijn gestolen, worden bij andere uitgeprobeerd.
- **Bewaar het in een wachtwoordmanager** als dat kan, want die kan voor elke site een lang wachtwoord maken en ze allemaal onthouden.
- **Wijzig het niet volgens een schema.** Wijzig het als je denkt dat iemand anders het kent, en anders niet.

## Hoe de site controleert op een gelekt wachtwoord

Er worden lijsten gepubliceerd met wachtwoorden die bij andere sites zijn gestolen, en wie in accounts probeert te komen, probeert die als eerste. Als je een wachtwoord kiest, vraagt de site daarom aan een externe dienst of het op zo'n lijst staat. De dienst wordt beheerd door een derde partij, en de site gebruikt hem alleen hiervoor.

Je wachtwoord verlaat de site niet. De site maakt er een eenrichtingsvingerafdruk van, die niet kan worden teruggezet in het wachtwoord, en stuurt de dienst alleen de eerste vijf tekens van die vingerafdruk. De dienst antwoordt met de rest van de vingerafdruk van elk gelekt wachtwoord dat op dezelfde manier begint, en dat zijn er enkele honderden, en de site zoekt daarin zijn eigen vingerafdruk. De dienst leert dus dat jouw wachtwoord een van enkele honderden is, en nooit welk. [Hoe dit werkt, uitgelegd door Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), vertelt meer.

Een wachtwoord dat op de lijst staat, wordt geweigerd met een melding die dat zegt, en je kiest een ander. Als de dienst niet bereikt kan worden, kan je wachtwoord nu niet worden gecontroleerd, dus wordt het niet geaccepteerd of gewijzigd. Probeer het over een paar minuten opnieuw. Een link die je hebt gekregen, werkt nog tot hij verloopt.

## Je wachtwoord wijzigen

Kies **Wachtwoord wijzigen** in het menu **Account**. De pagina vraagt je **Huidig wachtwoord**, een **Nieuw wachtwoord**, en dat nog eens als **Wachtwoord bevestigen**. Het huidige wachtwoord wordt gevraagd omdat ingelogd zijn niet genoeg is: een telefoon die ontgrendeld is blijven liggen, zou anders iedereen die hem oppakt in staat stellen jou buiten te sluiten.

Na het wijzigen blijf je ingelogd in deze browser en worden alle andere browsers uitgelogd. De site stuurt een e-mail naar je adres om te melden dat het wachtwoord is gewijzigd, zodat je het merkt als jij het niet was. Een onjuist huidig wachtwoord telt mee voor dezelfde grenzen als het inloggen.

Als je het huidige wachtwoord niet meer weet, wijst de pagina naar **Wachtwoord vergeten?**.

Volgende: [Zorgen voor je account](looking-after-your-account.md).
