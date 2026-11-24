# Co je nového

## Vydáno 2026-11-24

- **Souhrn bloku uvádí i rozdíl her.** Kde se zápasy bloku hrají na více než jednu hru, souhrn uvádí výhry, prohry, rozdíl her a rozdíl branek, protože rozdíl her rozhoduje při shodě dřív než branky. Blok jednotlivých her uvádí výhry, prohry a rozdíl branek jako dřív. Souhrn už neříká, jak se jeho hráči řadí.

- **Dlaždice soutěže v liště oddílů je tak široká jako její název.** Krátký název jako „Block A“ měl dlaždici stejně širokou jako dlouhý, takže liště došlo místo dřív, než bylo třeba.

- **Na telefonu zabírají data na úvodní stránce méně místa.** Sloupec s daty je tak široký jako data víkendu, například „19-21 Nov“, a jména mají zbytek. Data, která přecházejí z jednoho měsíce do druhého, se zalomí před spojovníkem, takže druhý řádek jím začíná. V části **Vaše nedávné turnaje** turnaj tohoto roku neuvádí rok a turnaj z jiného roku ho uvádí pod svými daty.

### Pro vývojáře aplikací

- **Aplikace může něco měnit klíčem, který byl vytvořen pro zápis.** Co mění vlastní stránky webu, mění stejné adresy na `/api/v0`: vytvoření turnaje, jeho soutěží, hráčů, týmů a her a to, kdo ho smí řídit a zapisovat. Klíč smí dělat to, co smí účet, pro který byl vytvořen, a klíč zapisovatele smí dělat to, co se dělá se skóre, a nic jiného. **Koncové body API pro POST** v nápovědě říkají, co každá adresa přijímá a čím odpovídá. Stále se ladí a některé budou odebrány.

- **Aplikace se může zeptat, čím může turnaj být.** Sporty, formáty a země s jejich regiony jsou na `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` a `/api/v0/countries`, v jazyce, o který aplikace požádá, takže to, s čím turnaj vytvoří, je to, co web nabízí.

- **Aplikace může číst hráče světového žebříčku a jejich hry.** Hráči Association Croquet, které světové žebříčky znají, jsou na `/api/v0/ac/world-ranking-players` a hry každého hráče, v pořadí, v jakém byly přidány, na adrese, kterou hráč uvádí. Jména se aktualizují podle žebříčků, když se seznam žádá od začátku, nejvýše jednou za hodinu.

- **Koncové body API jsou v nápovědě dvě stránky, jedna pro koncové body pro GET a jedna pro koncové body pro POST,** v každém jazyce.

### Správci světového žebříčku

- **Hráč žebříčků Association Croquet se vede podle čísla, které mu žebříčky dávají.** Hráč, kterého žebříčky přejmenují, je stejný hráč, ten, kdo vypadne ze seznamu, se archivuje a nezapomíná, a ten, kdo je uveden znovu, už není archivován. Seznam, který dává jedno jméno dvěma hráčům nebo jedno číslo dvěma jménům, se odmítne celý a nic se nezmění, a administrátor je informován e-mailem.

## Vydáno 2026-11-22

- **Úvodní stránka si pamatuje turnaje, na které jste se nedávno dívali.** Když otevřete turnaj, objeví se jako první v **Vaše nedávné turnaje**, mezi filtrem a nedávnými výsledky, nejvýše pět, abyste se mohli vrátit k těm, které sledujete, aniž byste je hledali v seznamech. Ukládá se na vašem vlastním zařízení v cookie, která obsahuje jen adresy turnajů, a seznam se nezobrazí vůbec, dokud nějaký turnaj neotevřete. Nápověda říká, co ta cookie je.

- **Připravované turnaje zahrnují i ty, které začaly v posledních dvou dnech.** Turnaj, který začal a neskončil, se uvádí až do dne, kdy končí, pokud začal před nejvýše dvěma dny, takže ho lze ve dnech, kdy se hraje, najít dřív, než do něj někdo zapíše hru. Ty, které začaly dříve, jsou mezi nedávnými výsledky, jakmile se do nich přidá hra.

- **Pavouk říká, na kolik her se hrají zápasy každého kola.** Nad každým kolem v rozpisu pavouka a pod názvem každého kola v jeho přehledu stojí „Nejvýše 3 her“, nebo to, co pro dané kolo zvolil správce turnaje.

- **Skóre se vejde do svého políčka v přehledu pavouka a jméno drží pohromadě v přehledu bloku.** Na úzké obrazovce přetékalo skóre Advantage zapsané jako „83% (5/6)“ ze svého políčka přes jména a jméno v přehledu bloku se mohlo zalomit za křestním jménem. Dvojice drží pohromadě na každé straně svého ampersandu.

- **Web si můžete přidat na plochu telefonu.** Tlačítko v patičce to nabídne, když to váš prohlížeč umí, a **Přidání webu na plochu telefonu** v nápovědě říká jak, pro iPhone i pro telefon s Androidem. Croquet Scores a Gateball Scores mají každý svou ikonu, abyste je od sebe rozeznali.

- **Jsou uvedeny kroketové regiony Nového Zélandu.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury a další regiony, na které se dělí novozélandské národní turnaje, lze zvolit jako region turnaje.

### Pro vývojáře aplikací

- **Existuje veřejné API.** Aplikace může číst turnaje jednoho roku, turnaj s jeho soutěžemi a hráči, hry a pořadí soutěže, turnaje, které změnily rok, a turnaje, které byly archivovány, jako JSON na adrese `/api/v0`. Dokud se vyvíjí, je `v0`. Číst smí kdokoli a aplikace, která posílá klíč vytvořený v části **Klíče API** ve vašem účtu, má vlastní limit, zpočátku 60 požadavků za minutu a 10 000 za den. Aplikace bez klíče sdílí limit podle své adresy, 10 za minutu a 500 za den.

- **Klíč umožní aplikaci jednat za vás bez vašeho hesla.** Vytvořte klíč ve svém účtu, řekněte, k čemu je, a odvolejte ho, až nebudete chtít, aby se používal. Klíč lze vytvořit jen pro čtení, nebo pro čtení i zápis, a lze ho omezit na jeden turnaj. API zatím jen čte. Uchovává se jen otisk (hash) klíče, takže se klíč ukáže jednou, když ho vytvoříte.

- **Do odpovědi mohou přibýt pole bez nové verze.** Aplikace musí ignorovat pole, které nezná. Změna, která by aplikaci rozbila, se provede jako nová verze vedle staré, takže aplikace napsaná pro `v1` funguje dál, i když přijde `v2`. **Nápověda pro vývojáře aplikací** a **Koncové body API** v nápovědě říkají, co která adresa přijímá a odpovídá, ve všech jazycích.

- **Handicap v API je číslo.** Je `4.5` a ne `"4.5"`, a `null`, kde ho hráč nemá.

### Správci světového žebříčku

- **Druhá tabulka her Golf Croquetu má den, kdy byla každá hra zapsána.** Přidejte k adrese `rankings2` tam, kde je `rankings`, a sloupec I říká den, kdy byla každá hra zapsána, jako datum v Excelu, v čase místa, kde se turnaj hraje. Karta Žebříčky ji nabízí jako **Stáhnout hry pro světový žebříček s datem hry**. První tabulka zůstala, jaká byla, protože software správců ji čte podle pozice.

## Vydáno 2026-11-15

- **Pár ve čtyřhře je ve vyhledávání jeden hráč, ať je jmenován jako první kterýkoli z obou hráčů.** „Sam Someone & Alex Another“ a „Alex Another & Sam Someone“ byly na stránce hráčů dva záznamy, stejně jako „Peter & Rosie Landrebe“ a „Rosie & Peter Landrebe“. Nyní jsou jeden, na jedné adrese, uvedený pod jménem, které napsal nejnovější turnaj.

- **Pár ve čtyřhře lze zapsat také lomítkem, plusem nebo anglickým slovem „and“, nejen ampersandem.** „Sam Someone / Alex Another“, „Sam Someone + Alex Another“ i „Sam Someone and Alex Another“ se čtou jako pár. Slovo „and“ se počítá, jen když stojí samo, takže jméno jako „Sam Anderson“ se za pár nepovažuje.

- **Pár se ve výsledcích švýcarského systému a v tabulkách bloků uvádí krátce.** Výsledek švýcarského systému uváděl první písmeno křestního jména prvního hráče a příjmení druhého. Nyní uvádí každého hráče, jako „T. Murphy & A. Sharpe“, a příjmení, které mají oba společné, se uvede jednou, jako „R. & P. Landrebe“. Sloupce tabulky bloku jsou nadepsány iniciálami každého hráče spojenými ampersandem, například „TM&AS“, nebo „RL&PL“ při společném příjmení.

- **Guatemala je zařazena mezi země, kde se v poslední době nehrálo.** Dříve byla uváděna mezi zeměmi, ve kterých se turnaje hrály od roku 2025.

- **Web počítá, kolik čtenářů přichází a které stránky čtou.** Používá k tomu webovou analytiku Cloudflare na každé stránce, kterou čtenáři vidí. Stránky, ve kterých pracují organizátoři, se nepočítají. Nepoužívá cookies a uživatele neidentifikuje jinak než podle jeho IP adresy.

- **Turnaje jsou zveřejňovány jako soubory, které může používat kdokoli.** Každý veřejný turnaj, v kroketu i v gateballu, se zapisuje do vlastního souboru, s jeho hráči a soutěžemi, nebo s týmy a testy tam, kde se hraje v týmech, včetně odstoupených her, které jsou označeny jako odstoupené. Jsou uloženy v repozitáři Git `CroquetScores/data.croquetscores.com`, který se aktualizuje každou hodinu, takže můžete výsledky řadit nebo z nich něco stavět a oprava se ukáže jako změna s datem. V souboru není žádný účet, e-mailová adresa, poznámka ani komentář, a také nic archivovaného ani z webu určeného k vyzkoušení.

### Pro případ nouze

- **Existuje stránka pro někoho, kdo musí web převzít.** Pokud ten, kdo web provozuje, nemůže, protože je nemocný nebo dlouho pryč, může kdokoli přihlášený otevřít v administraci **In case of emergency**, napsat, kdo je a proč web přebírá, a stisknout **Send**. Po potvrzení se to, co napsal, pošle e-mailem lidem, kteří znají heslo k poznámce se vším, co web potřebuje, a odpovědi chodí odesílateli. Účet může požádat jednou za 48 hodin a je mu řečeno, kdy může požádat znovu. Stránka začíná varováním, aby se nepoužívala, pokud administrátor nebyl e-mailem zpraven a neodpověděl do 48 hodin, a aby se netestovala. Jakmile je zpráva odeslána, stránka to oznámí a nežádá nic dalšího.

## Vydáno 2026-11-11

- **Menu na telefonu se zavře stisknutím mimo něj.** Menu za tlačítkem v horní části úzké obrazovky se zavře, když stisknete kdekoli jinde na stránce, stejně jako když znovu stisknete tlačítko nebo otevřete odkaz.

- **Nabídka Účet se zavře stisknutím mimo ni.** Postava na konci záhlaví, která otevírá možnosti Registrovat se, Přihlásit se a další, se zavře, když stisknete kdekoli jinde na stránce, stejně jako když ji znovu stisknete.

- **Sevřením a roztažením prstů změníte velikost textu.** Na dotykové obrazovce text zmenšíte sevřením dvou prstů a zvětšíte ho jejich roztažením, na velikost mezi polovinou a dvojnásobkem běžné velikosti. Na rozdíl od přiblížení v samotném prohlížeči zůstává stránka stejně široká jako obrazovka, takže nemusíte posouvat obsah do stran, abyste přečetli řádek. Velikost se pamatuje, a je tedy stejná na každé stránce i při každé návštěvě. Jedním prstem se stránka posouvá jako dřív.

- **Menu na telefonu se posouvá.** Na nízké obrazovce není menu vyšší než obrazovka a posouvá se uvnitř ní, takže se dá dosáhnout na každou položku. Stránka za ním zůstane na místě, dokud se menu nezavře.

- **Pedro Echeguren vylepšil španělštinu.** Pedro prošel španělská slova webu a opravil je. Děkuji, Pedro.

## Vydáno 2026-11-10

Croquet Scores bylo celé napsáno znovu. Doufám, že se vám nová verze bude líbit.

### Vyhledávání

- **Hledat.** Každá stránka má nahoře vyhledávací pole. Zadejte jméno a stiskněte Hledat, aby se našly turnaje, soutěže a hráči.

- **Zúžení turnajů podle země, státu nebo provincie a sportu.** Na domovské stránce vyberte zemi a uvidíte jen turnaje, které se v ní hrají. Po výběru země můžete vybrat i její stát nebo provincii a také sport. Váš telefon nebo počítač si vaši volbu pamatuje a příště z ní vyjde. **Výběr státu nebo provincie najde jen nové turnaje.** Starším turnajům stát ani provincie zadány nebyly, takže je výběr vynechá.

- **Zúžení turnajů podle dnů.** Zadejte první a poslední den, obojí dohromady, a vypíšou se jen turnaje, které začínají mezi nimi. Oba dny se počítají.

- **Stránka roku ukazuje jeho měsíce.** Každý měsíc je ve výpisu zavřený a říká, kolik turnajů v něm začíná. Stiskněte měsíc, aby se otevřely jeho turnaje, a otevřít jich můžete, kolik chcete. **+ Zobrazit vše** otevře každý měsíc.

- **Dlouhé seznamy jsou na stránkách.** Seznam turnajů ukazuje sto položek najednou, takže se při širokém hledání už nenačítá každý řádek naráz.

- **Nápověda najde odpověď podle toho, co myslíte.** Zeptejte se v hledacím poli na první stránce nápovědy a najde článek, i když článek používá jiná slova stejného významu. První stránka nabízí také oblíbené otázky a témata jako karty.

### Sledování turnaje

- **Poznámky od organizátorů.** Organizátoři turnaje teď mohou psát poznámky, kterými hráčům sdělí, co potřebují vědět během hry: formát, změnu pořadí hry, čas oběda. Jsou v novém oddíle turnaje Poznámky, nejnovější nahoře, a u každé je napsáno, před jak dlouhou dobou vznikla.

- **Hvězdička (\*) označuje, co jste nečetli.** Poznámka ji má, dokud ji neotevřete, a znovu, pokud se po přečtení změní. Dokud je jakákoli poznámka nepřečtená, má hvězdičku i oddíl Poznámky, na každé stránce turnaje, takže vidíte, že jsou novinky, aniž byste je museli jít hledat. Komentáře jsou označeny stejně. Váš prohlížeč si pamatuje, co jste přečetli, takže se nemusíte přihlašovat. Jiný telefon nebo počítač začíná s tím, že nic přečtené není.

- **Komentář se lépe sleduje.** Na starém webu každý nový komentář srazil stránku úplně dolů, takže kdo se vracel k dřívějším komentářům, ztratil místo. Teď se stránka k novému komentáři posune jen tehdy, když už jste dole a čtete ten nejnovější. Pokud jste se vrátili ke starším komentářům, nechá vás tam, kde jste.

- **Blok ukazuje, na kterém místě je každý hráč.** Poslední sloupec uvádí umístění každého hráče: 1, nebo =2, kde hráče nelze rozlišit a dělí se o druhé místo. Kde jsou hráči shodní v počtu vyhraných zápasů, řádek pod tím říká, jak byli rozlišeni.

- **Pořadí hry lze řadit.** Stiskněte Hra, aby se hry seřadily podle jména vítěze, nebo Datum, aby se seřadily podle toho, kdy byla každá přidána. Dalším stisknutím řazení obrátíte. Web si pamatuje, jak jste řadili, u každé soutěže i u seznamů turnajů, a odkaz pod seznamem, Zpět na obvyklé pořadí, to zapomene.

- **Zobrazují se handicapy.** Má-li hráč handicap, je za jeho jménem, spolu s tím, koho zastupuje, jako v Tim Murphy (4, Australia).

- **Soutěž říká, na kolik branek se její hry hrají,** pokud to není obvyklé pro její sport, jako „Počet branek ve hře: 14“.

### Web

- **Váš jazyk.** Web je teď ve dvanácti jazycích: afrikánština, arabština (Egypt), čeština, angličtina, němčina, řečtina, lotyština, norština, portugalština, španělština, švédština a velština. Zobrazí se první jazyk, o který váš prohlížeč žádá a který web má, a když žádný nemá, angličtina. Chcete-li zvolit jiný, použijte seznam v zápatí dole na kterékoli stránce a stiskněte tlačítko Změnit vedle něj. Pokud byste chtěli přidat nějaký jazyk, napište na <croquetscores@gmail.com>.

- **Světlý nebo tmavý motiv.** Také v zápatí: vyberte Světlý, Tmavý nebo Systémový. Systémový se řídí vaším telefonem nebo počítačem. Web si vaši volbu pamatuje na každé stránce a při každé návštěvě.

- **Která verze je spuštěná.** Zápatí teď ukazuje verzi webu, kterou si prohlížíte, například v234. Když nahlásíte problém, napište prosím, o kterou verzi šlo.

- **Vaše data.** Stránka /data-deletion-policy říká, jak si nechat smazat, co si o vás web uchovává, co se maže a co se zachovává.

### Open source

Kód je teď open source, pod licencí GNU Affero General Public License verze 3 (AGPL-3.0). Kdokoli si ho může přečíst, používat ho a měnit ho a kdokoli, kdo upravenou verzi provozuje jako web, musí své změny sdílet pod toutéž licencí.
