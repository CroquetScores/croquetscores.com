# Novinky pro organizátory turnajů

## Vydáno 2026-11-25

### Turnaj

- **Před uložením turnaje s názvem jako test se systém zeptá.** Když vytvoříte turnaj, který má v názvu celé slovo „test“, „testing“, „trial“, „fake“ nebo „dummy“, otevře se nejprve dialog, který říká, že turnaj bude uložen a zveřejněn pro všechny, a odkazuje na zkušební web, kam test patří. **Uložit tento turnaj** turnaj vytvoří a **Zrušit** nechá formulář tak, jak jste ho vyplnili. Na zkušebním webu se neptá, ani při změně turnaje.

### Soutěže

- **Kontumace zapsaná jako skóre se zeptá, zda soupeře nechat odstoupit.** Když stisknete **Přidat hru** u skóre, které obsahuje „w/o“, otevře se dialog s názvem poraženého: **Nechat soupeře odstoupit**, **Přidat skóre** nebo **Zrušit**. Odstoupení soupeře nepřidá žádnou hru a vyprázdní dialog skóre pro další. Hráč, který odstoupil, už nehraje a hry, které neodehrál, se rozhodnou bez něj, což je lepší než započítat hru, která se nikdy nehrála. Ptá se jen u nového skóre a ne v testovací soutěži ani v soutěži Advantage.

### Aplikace

- **API je nyní `v1`.** Adresy aplikace jsou na `/api/v1`, kde byly na `/api/v0`. Aplikaci, která stále volá `/api/v0`, přesměrování pošle na novou adresu, takže dál funguje, ale měla by se změnit, protože přesměrování může být zrušeno.

## Vydáno 2026-11-24

### Soutěže

- **Souhrn bloku uvádí i rozdíl her.** Kde se zápasy bloku hrají na více než jednu hru, souhrn uvádí výhry, prohry, rozdíl her a rozdíl branek, protože rozdíl her rozhoduje při shodě dřív než branky. Souhrn už neříká, jak se jeho hráči řadí.

- **Dlaždice soutěže v liště oddílů je tak široká jako její název.** Krátký název už nemá dlaždici stejně širokou jako dlouhý.

### Aplikace

- **Klíč teď může něco měnit.** Klíč vytvořený ke čtení a zápisu smí v turnaji dělat to, co smí účet, pro který byl vytvořen: klíč organizátora všechno, klíč zapisovatele to, co se dělá se skóre, a nic jiného. Vytvořte ho v části **Klíče API** ve svém účtu, podle potřeby ho omezte na jeden turnaj a kdykoli ho zrušte. **Koncové body API pro POST** v nápovědě říkají, co smí aplikace poslat. Stále se ladí a některé budou odebrány. Klíč uchovávejte v tajnosti jako heslo.

## Vydáno 2026-11-22

### Turnaj

- **Lze zvolit kroketové regiony Nového Zélandu.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury a další regiony, na které se dělí novozélandské národní turnaje, jsou uvedeny jako region turnaje vedle provincií.

- **E-mail o odebraném národním nebo mezinárodním statusu to říká.** Když administrátor turnaji status odebere, e-mail jeho správcům nyní říká, že byl odebrán, a prosí vás, abyste napsali, proč nesouhlasíte, pokud nesouhlasíte. Jako příklad národní akce uvádí Australian Open a jako příklad mezinárodní WCF Association Croquet Singles.

### Hráči

- **Jméno ve světovém žebříčku, které světový žebříček nezná, následuje opravené jméno.** Oprava jména nechávala **Jméno hráče ve světovém žebříčku** beze změny, takže hráč přidaný jako „aaa“ a opravený na „Tim Murphy“ byl žebříčku dál znám jako „aaa“. Kde žebříček nezná jméno, se kterým byl hráč otevřen, stane se nyní opraveným jménem, jak ho píšete, dokud sami nezačnete psát do jména ve světovém žebříčku. Jméno, které žebříček zná, což ukazuje zaškrtnutí vedle něj, zůstane.

- **Handicap se zobrazuje jako číslo, kterým je.** Seznam hráčů ukazuje „4“ pro handicap, který jste napsali jako „4.0“, a „4“ pro „+4“. Handicap s desetinnou částí, například „-1.5“, se ukáže tak, jak je. Stále ho můžete napsat se znaménkem nebo s tečkou.

### Aplikace

- **Aplikace může číst vaše turnaje z API webu.** Web má veřejné API (viz **Nápověda pro vývojáře aplikací**), které zatím jen čte. Ve svém účtu můžete v části **Klíče API** vytvořit klíč, který aplikaci dá vlastní limit: lze ho vytvořit jen pro čtení, nebo pro čtení i zápis, lze ho omezit na jeden turnaj a kdykoli ho můžete odvolat. Chraňte klíč stejně tajně jako heslo.

### Co vidí veřejnost

- **Připravované turnaje na úvodní stránce zahrnují turnaj, který začal v posledních dvou dnech.** Turnaj se uvádí od šedesáti dnů před začátkem do dne, kdy končí, ale ten, který začal před více než dvěma dny, se vynechá. Ve dnech, kdy se hraje, ho tedy lze najít dřív, než do něj někdo zapíše hru, a po prvních dvou dnech je mezi nedávnými výsledky, jakmile se přidá hra.

- **Pavouk říká, na kolik her se hrají zápasy každého kola.** Nad každým kolem v rozpisu pavouka a pod názvem každého kola v jeho přehledu nyní stojí „Nejvýše 3 her“, nebo to, co jste pro dané kolo zvolili, takže nikdo nemusí počítat políčka se skóre, aby to zjistil. Viz [Co vidí veřejnost](../tournament-managers/standard-tournament/what-the-public-sees.md).

## Vydáno 2026-11-15

### Turnaj

- **Dvě zaškrtávací políčka pro národní a mezinárodní akci jsou uzavřena do rámečku „Nepovinné“.** Na stránce, která turnaj vytváří nebo mění, byly **Akce na národní úrovni** a **Akce na mezinárodní úrovni** jediné, na co se pod podtitulkem ptalo, a někteří je považovali za volbu, kterou je nutné udělat. Turnaj nemusí být ani jedním, a rámeček to nyní říká. Slovo bylo přidáno do všech jazyků webu a překlady jiné než anglický by potřebovaly oko rodilého mluvčího.

- **Turnaj vytvořený jen jako test může administrátor archivovat a dá vám vědět.** Kdo se web učí, někdy vytvoří na skutečném webu turnaj, který byl vždy jen zkouškou. Administrátor jej nyní může archivovat a poslat e-mail jeho organizátorům, s uvedením webu určeného k vyzkoušení, kde si mohou zkoušet. Nic se nemaže, takže archivovaný turnaj lze obnovit. Organizátoři, kteří zapomněli své účty, a zapisovatelé e-mail nedostanou.

### Hráči

- **Pár ve čtyřhře lze zapsat také lomítkem, plusem nebo anglickým slovem „and“, nejen ampersandem.** „Sam Someone / Alex Another“ je stejný pár jako „Sam Someone & Alex Another“. Slovo „and“ se počítá, jen když stojí samo, takže jméno jako „Sam Anderson“ se za pár nepovažuje. Kde se pár hraje ve švýcarském systému nebo v bloku, uvádí se ve výsledku švýcarského systému jako „T. Murphy & A. Sharpe“ a v záhlaví tabulky bloku jako „TM&AS“.

## Vydáno 2026-11-11

### Turnaj

- **Název turnaje napovídá názvy, které web už má.** Turnaj bývá součástí série, která se hraje každý rok pod téměř stejným názvem. Když tedy na stránce, která turnaj vytváří nebo mění, píšete do pole **Název**, nabízejí se názvy turnajů na webu. Název se nabídne, když obsahuje každé zadané slovo, v libovolném pořadí a s libovolnou velikostí písmen, takže „CNSW Bronze“ najde „CNSW AC Bronze Medal“. Vyberete ho kliknutím nebo šipkami a klávesou Enter a pak ho můžete libovolně upravit. Klávesa Escape nabídku zavře. Název se nabídne jen jednou, kolik turnajů ho má, a turnaji, který měníte, se jeho vlastní název nenabízí.

### Soutěže

- **Soutěž se otevře na kartě Skóre, jakmile se zadala nějaká hra.** Když se k soutěži vrátíte zadat další skóre, už nemusíte pokaždé mačkat **Skóre**. Soutěž bez použité hry, včetně té, jejíž jediná hra je archivovaná, se stále otevře na kartě **Hráči**. Zapisovatel vidí jen **Skóre**, jako dřív.

- **Archivovaná soutěž nebo test dostane za název číslo, aby se jejich název mohl použít znovu.** Soutěž vytvořenou jako špatný druh je nutné archivovat a přidat znovu a nová teď může dostat název té staré. Archivací „Block A“ vznikne „Block A (1)“, s prvním číslem, kterým nekončí název žádné jiné soutěže. Adresa zůstane, jaká byla, a obnovená soutěž si nový název ponechá. Archivovaný test se čísluje stejně a při změně krátkého názvu týmu zůstane, jak byl. Viz [Soutěže](../tournament-managers/standard-tournament/competitions.md).

## Vydáno 2026-11-10

Toto jsou hlavní změny pro lidi, kteří vedou turnaje. [Nápověda pro organizátory turnajů](../tournament-managers/index.md) má všechny podrobnosti.

### Hráči

- **Hráči se zadávají jednou, do turnaje.** Na starém webu se hráči přidávali uvnitř každé soutěže. Nyní je karta **Hráči** turnaje místem, kde je přidáváte, opravujete, řadíte a archivujete, a hráč opravený tam je opraven v každé soutěži, v níž je, i na každé veřejné stránce. Viz [Hráči](../tournament-managers/standard-tournament/players.md).

- **Více hráčů lze přidat najednou.** Na kartě **Hráči** stiskněte **Přidat více hráčů**, vedle **Přidat hráče**, a vložte seznam s jedním řádkem pro každého hráče. Přidají se všichni hráči ze seznamu. První řádek seznamu pojmenovává pole.

- **Pár ve čtyřhře lze vytvořit ze dvou již zadaných hráčů.** Na kartě **Hráči** stiskněte **Přidat pár**, vyberte prvního a druhého hráče a stiskněte **Přidat pár** znovu. Pár se jmenuje „Sam Someone & Alex Another“, nebo „Peter & Rosie Landrebe“, pokud mají oba stejné příjmení. Dialog zůstává otevřený, takže lze vytvořit další pár. Viz [Hráči](../tournament-managers/standard-tournament/players.md#adding-a-pair).

- **Hráč může mít handicap**, například 4, +4 nebo -1.5. Zobrazuje se za jménem hráče, spolu s tím, koho nebo co zastupuje, pokud něco, jako v Tim Murphy (4, Australia).

- **Co hráč zastupuje, se napovídá.** Při psaní se nabízejí kluby a země, které hráči zastupovali při přidání, v jakémkoli turnaji a v jakémkoli sportu. Napište dvě písmena a nabídka se objeví.

### Soutěže

- **Jedno tlačítko přidává soutěž.** Místo samostatných tlačítek pro nový blok, nový švýcarský systém a nového pavouka stiskněte **Přidat soutěž**. Dialog se ptá na název a druh (blok, pavouk nebo švýcarský systém) a poté na to, co druh potřebuje: z kolika her se každý zápas hraje a u pavouka místa v jeho losu. Zůstává otevřený, takže můžete přidat několik najednou. Druh soutěže nelze později změnit: archivujte ji a přidejte znovu. Viz [Soutěže](../tournament-managers/standard-tournament/competitions.md).

- **Pavouk může převzít poražené z kola jiného pavouka.** V dialogu pavouka stiskněte **Přidat pavouka poražených**, pojmenujte ho a vyberte kolo, jehož poražení v něm hrají dál. Jeho hráči se do něj zařazují, jakmile se rozhodne každý zápas, takže je nezadáváte ručně.

- **U bloku lze určit, jak se rozlišují hráči se stejným počtem vyhraných zápasů.** V dialogu bloku vyberte jeho **Rozhodování shody**: rozdíl her, poté rozdíl branek, poté vzájemný zápas; samotný vzájemný zápas; nebo jiné, což je žádný známý způsob, takže hráči zůstanou se stejným výsledkem a dělí se o místo. Nový blok začíná na rozdílu her, poté rozdílu branek, poté vzájemném zápasu.

- **Soutěž může určit nejvyšší počet branek, do kterých se její hry hrají.** V dialogu soutěže přijímá **Nejvyšší počet branek** celé číslo alespoň 1. Nechte ho prázdné, pokud nemá být žádné maximum, a soutěž má obvyklý počet pro svůj sport: 26, nebo 13 v golfovém kroketu.

### Hráči v soutěži

- **Hráči se do soutěže zařazují ze seznamu.** Na stránce soutěže vyberte hráče turnaje z rozbalovacího seznamu a stiskněte **Přidat hráče**. Rozbalovací seznam nabízí jen hráče, kteří v soutěži ještě nejsou. V pavouku nabízí také **Bye** pro zbylá místa. Viz [Zařazování hráčů do soutěže](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Do soutěže lze přidat více hráčů najednou.** Na kartě **Hráči** soutěže stiskněte **Přidat více**, vedle **Přidat hráče**, zaškrtněte hráče, které chcete, nebo políčko nad seznamem pro všechny, a stiskněte **Přidat vybrané**. Zařadí se v pořadí turnaje. Pokud některé nelze přidat, druhý dialog řekne které a proč a zeptá se, zda přidat ostatní. Viz [Zařazování hráčů do soutěže](../tournament-managers/standard-tournament/entering-players-in-a-competition.md#adding-several).

### Turnaj

- **Nový turnaj začíná v měsíci, ve kterém právě jsme.** Jeho začátek je první den tohoto měsíce a konec je tentýž den; konec následuje začátek, dokud nevyberete vlastní.

- **Zemi, stát nebo provincii a sport vybíráte ze seznamů.** Turnaj potřebuje zemi a sport. Výběrem jiné země se stát nebo provincie vymaže. Vlajka hráče nebo týmu se vybírá ze seznamu, nejvytíženější země jsou nahoře.

- **Lišta oddílů drží krok se soutěžemi.** Po přidání, změně, přesunutí, archivaci nebo obnovení soutěže či testu nabízí lišta na stránce turnaje to, co turnaj nyní má, aniž byste stránku museli otevírat znovu.

- **Ikona nápovědy na více stránkách správy.** Kulatý otazník je na stránkách, které turnaj vytvářejí a mění, na řadě karet turnaje i soutěže a vedle seznamu turnajů. Každý vede k nápovědě k tomu, na co se díváte, v nové kartě, aby stránka zůstala zachována.

### Poznámky

- **Poznámky organizátora: používejte je místo komentáře, abyste hráčům řekli, co potřebují vědět.** Formát, změna pořadí her, čas oběda. Poznámka se píše na kartě **Poznámky** turnaje, s názvem a popisem v Markdownu, a před přidáním si ji můžete prohlédnout. Hráči najdou poznámky na veřejné stránce Poznámky turnaje. Poznámka, kterou nečetli, je označena hvězdičkou, stejně tak oddíl Poznámky na každé stránce turnaje, dokud ji neotevřou. Poznámka, kterou upravíte, je znovu označena každému, kdo ji četl. Viz [Poznámky](../tournament-managers/standard-tournament/notes.md).

- **Poznámky turnaje ze starého webu jsou nyní Podtitul.** Co jste tam napsali, se uchovává jako podtitul turnaje a stále se ukazuje pod názvem turnaje na každé veřejné stránce. Píše se v Markdownu a může mít až 2000 znaků. Je pro to, co by čtenáři měli vědět na jakékoli stránce. Pro novinky, které se mění v průběhu turnaje, použijte poznámku.

### Co vidí veřejnost

- **Blok ukazuje, kde je který hráč umístěn**, v posledním sloupci s hlavičkou #, s řádkem pod ním, který říká, jak se rozlišovali hráči se stejným počtem vyhraných zápasů.

- **Interstate Shield se řadí podle čistých zápasů.** Týmy se řadí podle testů, tedy vyhraných zápasů mínus prohraných zápasů.
