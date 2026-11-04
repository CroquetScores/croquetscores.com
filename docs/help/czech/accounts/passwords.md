# Hesla

## Co web od hesla žádá

Všude, kde si volíte heslo, tedy při potvrzení e-mailové adresy, při nastavení nového hesla nebo při jeho změně, web žádá, aby heslo:

- mělo **alespoň 12 znaků**;
- bylo napsáno dvakrát stejně, podruhé jako **Potvrzení hesla**;
- nebylo takové, které se **objevilo při úniku dat** jinde.

Mezery na začátku a na konci se odstraňují, stejně jako při přihlášení, takže vás zatoulaná mezera nezamkne venku. Mezery uprostřed se zachovávají, což se hodí pro několikaslovnou frázi.

## Jak zvolit dobré heslo

Web žádá délku a nic jiného: ne velká písmena, číslice ani symboly. Odpovídá to současným doporučením, podle nichž je dlouhé heslo, které nikde jinde nepoužíváte, silnější a snáze zapamatovatelné než krátké, které se špatně čte. Web se řídí doporučením amerického Národního institutu pro standardy a technologie (NIST), které si můžete přečíst v [pokynech NIST k digitální identitě, kapitola o heslech](https://pages.nist.gov/800-63-4/sp800-63b.html).

Ve zkratce:

- **Zvolte dlouhé.** Několik nesouvisejících slov tvoří frázi, která se snadno pamatuje a špatně hádá.
- **Používejte ho tady a nikde jinde.** Heslo použité na dvou webech je jen tak bezpečné jako slabší z nich a hesla ukradená z jednoho se zkoušejí na dalších.
- **Uchovávejte ho ve správci hesel**, pokud můžete; ten umí vytvořit dlouhé heslo pro každý web a všechna si pamatovat.
- **Neměňte ho podle rozvrhu.** Změňte ho, když si myslíte, že ho zná někdo jiný, a jinak ne.

## Jak web kontroluje prozrazené heslo

Seznamy hesel ukradených z jiných webů jsou zveřejněny a lidé, kteří se snaží dostat do účtů, je zkoušejí jako první. Když si tedy volíte heslo, web se externí služby zeptá, zda na takovém seznamu je. Službu provozuje třetí strana a web ji používá jen k tomuto.

Vaše heslo web neopouští. Web z něj vytvoří jednosměrný otisk, který nelze převést zpět na heslo, a službě pošle jen prvních pět znaků tohoto otisku. Služba odpoví zbytky otisků všech prozrazených hesel, která začínají stejně, což je několik set hesel, a web mezi nimi hledá ten svůj. Služba se tak dozví, že vaše heslo je jedním z několika set, a nikdy které. Více říká [vysvětlení společnosti Cloudflare, jak to funguje](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/).

Heslo, které na seznamu je, se odmítne se zprávou, která to říká, a vy zvolíte jiné. Pokud se služba nedá zastihnout, vaše heslo se teď nedá zkontrolovat, a proto se nepřijme ani nezmění. Zkuste to znovu za několik minut. Odkaz, který jste dostali, stále funguje, dokud nevyprší.

## Změna hesla

Zvolte **Změnit heslo** v nabídce **Účet**. Stránka se ptá na vaše **Současné heslo**, **Nové heslo** a znovu na něj jako **Potvrzení hesla**. Současné heslo se vyžaduje proto, že přihlášení nestačí: odemčený telefon by jinak umožnil tomu, kdo ho zvedne, aby vás zamkl venku.

Po změně zůstanete přihlášeni v tomto prohlížeči a všechny ostatní jsou odhlášeny. Web na vaši adresu pošle e-mail, že heslo bylo změněno, abyste se to dozvěděli, pokud jste to nebyli vy. Špatné současné heslo se počítá do stejných limitů jako přihlašování.

Pokud si současné heslo nepamatujete, stránka odkáže na **Zapomenuté heslo?**.

Další: [Péče o váš účet](looking-after-your-account.md).
