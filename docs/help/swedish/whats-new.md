# Nytt

## Släppt 2026-10-28

### Hitta saker

- **Sökresultaten är tabeller.** Turneringarna och tävlingarna som en sökning hittar står nu som listorna på startsidan: dagarna då varje turnering spelades, sporttypen, flaggan för dess land och namnet. En tävling visar sin turnerings dagar, sporttyp och flagga samt turneringen den ingår i. Datumen och namnen kan sorteras, varje tabell för sig, och sorteringen sparas i sidans adress bredvid det du skrev. Sorteringen ordnar bara om de hundra resultat som visas, de som bäst matchar dina ord, inte alla träffar.
- **De mest spelade länderna står först.** Överallt där du väljer ett land börjar listan nu med Australien, Egypten, England, Nya Zeeland, Spanien och USA, sedan de andra länderna där turneringar har spelats sedan 2025, och sist alla övriga, med en linje mellan de tre grupperna.
- **Varje turnering visar sin sport.** På en surfplatta eller något bredare visar turneringslistorna på startsidan och på ett års sida turneringens sport som en kort kod, till exempel GC eller AC, i en egen färg för varje sport, efter datumen. På en telefon utelämnas koden för att ge namnen plats.
- **Startsidan.** Startsidans kommande turneringar står nu under de senaste resultaten i alla bredder.
- **Flaggorna trängs inte längre på en telefon.** På en telefon utelämnas flaggkolumnen i alla turneringslistor, så namnen får mer plats.
- **Landslistan förblir öppen i Chrome på Linux.** När du tryckte på landsfältet på startsidan öppnades listan och stängdes direkt igen. Nu förblir den öppen, och den går att rulla.

### Följa en turnering

- **Handikapp.** En turnerings ansvariga kan nu ge en spelare ett handikapp, till exempel 4, +4 eller -1.5. Det visas efter spelarens namn, tillsammans med vad spelaren representerar om det finns något, som i Tim Murphy (4, Australien).
- **Poängskillnad i schweizerrutnätet.** Ett resultat i schweizerrutnätet slutar nu med partiets poängskillnad (peeling), som rankingtextfilen redan gör. Ett parti som vanns med 26tp mot 17 står som +9tp för vinnaren och -9tp för förloraren. Ett parti utan peeling står som förut.

### Turneringar som förts över från de gamla webbplatserna

- **Fler av dem har rätt land.** Många turneringar fördes över med fel land, eftersom de gamla webbplatserna bara kände till tidszonen. Webbplatsen läser nu landet ur en turnerings namn där det går, till exempel Irish, Welsh, Bayfield eller CroqCan, och placerar varje match mellan England och Skottland i det land som var värd det året. Tack till Chris Williams för hans hjälp med detta.
- **Turneringar som ännu inte har spelats förs över** även om deras ansvariga ännu inte har lagt till någon tävling, så att du kan se när och var de spelas.
- **Ett handikapp efter en spelares namn** på de gamla webbplatserna, som i Tim Murphy 1, tas inte längre för en del av namnet när spelarens världsranking slås upp.

## Släppt 2026-10-27

Croquet Scores har skrivits om helt med AI, i TypeScript. Här är vad du kommer att märka.

### Hitta saker

- **Sök.** Varje sida har en sökruta högst upp. Skriv ett namn och tryck på Sök för att hitta turneringar, tävlingar och spelare. Resultaten står i tre listor, och en lista utan innehåll utelämnas. Om det finns fler än hundra av en sort säger sidan det, och om du lägger till ett ord i sökningen blir den smalare.
- **Avgränsa turneringarna efter land, region och sport.** På startsidan väljer du ett land för att bara se turneringarna som spelas där. När du har valt ett land kan du välja en delstat eller provins i det, och du kan välja en sport också. Det du valde står i sidans adress, så du kan spara den som bokmärke eller skicka den till någon, och bakåtknappen ångrar det. **Att välja en delstat eller provins hittar bara nya turneringar.** Äldre turneringar fick ingen delstat eller provins, så de utelämnas när du väljer en.

### Följa en turnering

- **Anteckningar från arrangörerna.** En turnerings arrangörer kan nu skriva anteckningar för att berätta för spelarna vad de behöver veta medan turneringen spelas: formatet, en ändring i speltablån, tiden för lunchen. De finns i turneringens nya avdelning Anteckningar, med de nyaste överst och hur länge sedan varje anteckning skrevs.
- **En asterisk (\*) markerar det du inte har läst.** En anteckning har en tills du öppnar den, och igen om den ändras efter att du läst den. Så länge någon anteckning är oläst har avdelningen Anteckningar också en, på varje sida i turneringen, så att du ser att det finns nyheter utan att behöva gå och titta. Kommentarer markeras på samma sätt. Din webbläsare kommer ihåg vad du har läst, så du behöver inte logga in. En annan telefon eller dator börjar med ingenting läst.
- **Kommentarerna är lättare att följa.** På den gamla webbplatsen kastade varje nytt inlägg sidan längst ned, så den som bläddrade tillbaka bland tidigare inlägg tappade sin plats. Nu flyttas sidan ned till ett nytt inlägg bara om du redan är längst ned och läser den senaste. Om du har bläddrat tillbaka för att läsa tidigare inlägg lämnar den dig där du är.

### Webbplatsen

- **Ditt språk.** Webbplatsen finns nu på sjutton språk: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska och Cymraeg. Du får det första språk som din webbläsare ber om och som webbplatsen har, eller engelska om den inte har något. Om du vill välja ett annat använder du listan i sidfoten längst ned på varje sida och trycker på knappen bredvid. Om du vill att ett språk ska läggas till kan du mejla <croquetscores@gmail.com>.
- **Ljust eller mörkt.** Också i sidfoten: välj Ljust, Mörkt eller System. System följer din telefon eller dator. Webbplatsen kommer ihåg ditt val på varje sida och vid varje besök.
- **Vilken version du använder.** Sidfoten visar nu vilken version av webbplatsen du tittar på, till exempel v234. Om du rapporterar ett problem, säg gärna vilken version det var.

### Öppen källkod

Koden är nu öppen källkod, under GNU Affero General Public License version 3 (AGPL-3.0). Vem som helst får läsa den, använda den och ändra den, och den som kör en ändrad version som webbplats måste dela sina ändringar under samma licens.
