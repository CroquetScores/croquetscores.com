# Žebříčky

Kde se soutěž počítá do světových žebříčků, její výsledky se do žebříčků posílají jako soubor, který web píše za vás z toho, co jste zadali. Karta **Žebříčky** je místo, kde ho máte.

## Karta

Otevřete stránku turnaje a zvolte **Žebříčky**, poslední z jejích karet. Říká, stejnými slovy bez ohledu na sport, že světové žebříčky použijí výsledky turnaje prostřednictvím souboru, takže organizátoři nemusí dělat nic. Pod tím je **Stáhnout hry pro světový žebříček**, odkaz na soubor, který ho uloží. Soubor je textový pro asociační kroket a tabulka pro golfový kroket a americký kroket (6 branek). Je tu dřív, než se zadá jediné skóre, a do té doby je prázdný. Karta se nabízí i správcům světového žebříčku daného sportu, aby z ní převzali hry.

Karta je jen na stránce turnaje ve sportu, který má světové žebříčky, a jen pro jeho organizátory: zapisovateli se nenabízí. Samotný soubor je na vlastní adrese turnaje s `/rankings` na konci, například `/2026/ac/spring-open/rankings`, což je adresa, kterou web vždy dával, a kdokoli, kdo ji má, ji může otevřít.

## Co je v souboru

Je v něm každé zadané a nearchivované skóre, v pořadí, v jakém bylo zadáno, včetně skóre, které bylo neuznáno, a skóre hráče, který odstoupil. Archivované skóre v něm není. Zápas vyhraný bye nebo kontumačně se nehrál, a proto nemá řádek.

Hráč je uveden svým jménem ve světovém žebříčku, což je jeho jméno, pokud mu nebylo dáno jiné.

**Asociační kroket** má blok pro každou soutěž, která má skóre: její událost, data, vítěze, zda šlo o zápasy, nebo jednotlivé hry, a číslovaný řádek pro každý výsledek, například „1 Sam Someone beat Alex Another +9“. Skóre je rozdíl branek vítěze a poraženého, s plusem, kde vítěz dal víc, a peely za ním. Zápas pavouka je jeden řádek, s postupným skóre každé hry. Web pojmenuje vítěze, jak nejlépe umí: vítěz posledního zápasu pavouka, hráč, kterého blok umístí první (viz jeho rozhodování shody), a v soutěži jednotlivých her ten, kdo vyhrál nejvíc. Kde se hráči nedají pro první místo rozlišit, nechá řádek **Winner** prázdný a správci světového žebříčku to rozhodnou.

**Golfový kroket a americký kroket (6 branek)** mají tabulku: název turnaje, jeho dny a kolik her obsahuje, pak číslovaný řádek pro každou hru, s příjmením a křestním jménem vítěze, slovem „beat“, poraženým a dvěma skóre. Každá hra zápasu pavouka je samostatný řádek. Pod posledním je řádek **Tournament winner:** ponechaný prázdný, aby ho vyplnil ten, kdo soubor používá.

## Když soubor není

Turnaj, z jehož soutěží se žádná nepočítá do světových žebříčků, soubor nemá. Otevření jeho adresy žebříčků ukáže stránku, která to říká i proč: jeho sport nemá světové žebříčky, nebo se žádná z jeho soutěží nepočítá, protože každá se hraje s handicapy, povoluje remízy, nebo byla označena, že se počítat nemá. To se nastavuje při přidání každé soutěže a mění se jejím **Upravit**. V souboru jsou jen soutěže, které se počítají.

Další: [Změna, archivace a obnovení turnaje](changing-and-archiving.md).
