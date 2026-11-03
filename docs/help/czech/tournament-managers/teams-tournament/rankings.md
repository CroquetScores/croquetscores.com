# Žebříčky

Kde se soutěž počítá do světových žebříčků, její výsledky se žebříčkům posílají jako soubor, který pro vás web napíše z toho, co jste zadali. Karta **Žebříčky** je místo, kde ho získáte.

## Karta

Otevřete stránku turnaje a vyberte **Žebříčky**, poslední z jeho karet. Říká, že světové žebříčky používají výsledky turnaje prostřednictvím souboru, takže organizátoři nemusí dělat nic. Soubor je textový pro asociační kroket a tabulka pro golfový kroket a americký kroket. Pod slovy je **Stáhnout hry pro světový žebříček**, které soubor uloží. Je tam dříve, než se zadá jediné skóre, a dává soubor, v němž nic není, dokud se nějaké nezadá.

Karta je jen na stránce turnaje, který se počítá do světových žebříčků, tedy takového, který má soutěž, jež se počítá. Nabízí se jeho organizátorům a správcům světového žebříčku jeho sportu, a ne zapisovateli, který není ani jedním z nich. Samotný soubor je na vlastní adrese turnaje s příponou `/rankings`, například `/2026/ac/spring-open/rankings`, což je adresa, kterou mu web vždy dával, a kdokoli, kdo ji má, ji může otevřít.

## Co je v souboru

Je v něm každé skóre, které bylo zadáno a není archivováno, v pořadí, v jakém bylo zadáno, včetně skóre, které bylo neuznáno, a skóre hráče, který odstoupil. Archivované skóre v něm není. Zápas vyhraný kontumačně (bye či walkover) se nehrál, a proto nemá řádek.

Hráč je uveden svým jménem ve světovém žebříčku, což je jeho jméno, kde nebylo dáno jiné.

**Asociační kroket** má blok pro každou soutěž, která má skóre: její akci, data, vítěze, zda šlo o zápasy nebo jednotlivé hry, a číslovaný řádek pro každý výsledek, například „1 Sam Someone beat Alex Another +9“. Skóre je počet branek vítěze minus poraženého, s plusem, když vítěz dal víc, a s peely za ním. Zápas v pavouku je jeden řádek, s postupně skóre každé hry. Řádek **Winner** každého bloku zůstává prázdný, protože test vyhrává tým, a ne hráč.

**Golfový kroket a americký kroket** mají tabulku: název turnaje, jeho dny a kolik her obsahuje, potom číslovaný řádek pro každou hru, s příjmením a křestním jménem vítěze, „beat“, poraženým a oběma skóre. Každá hra zápasu v pavouku je vlastní řádek. Pod posledním je řádek **Tournament winner:** ponechán prázdný, aby ho vyplnil ten, kdo soubor používá. (Obsah souboru je anglicky, a proto tato slova v souboru zůstávají anglicky.)

## Když soubor není

Turnaj, jehož žádná soutěž se nepočítá do světových žebříčků, soubor nemá. Otevření jeho adresy žebříčků ukáže stránku, která říká, že a proč: jeho sport nemá světové žebříčky, nebo se nepočítá žádná z jeho soutěží, protože každá se hraje s handicapy, povoluje remízy, nebo byla odškrtnuta, aby se nepočítala. To se nastavuje při přidání každé soutěže a mění jejím **Upravit**. V souboru jsou jen soutěže, které se počítají.

Další: [Změna, archivace a obnovení turnaje](changing-and-archiving.md).
