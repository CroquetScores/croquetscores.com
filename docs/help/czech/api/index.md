# Nápověda pro vývojáře aplikací

Croquet Scores má veřejné API, aby aplikace mohla sledovat turnaje daného sportu, aniž by četla stránky webu. Odpovídá ve formátu JSON a během vývoje je na adrese `/api/v0`. Až bude vydáno, bude na adrese `/api/v1`.

## Jak to s ním je {#where-it-stands}

API je ve vývoji, a proto je označeno `v0`. Až ho všichni, kterých se týká, přijmou, stane se z něj `v1`.

Změna, která by aplikaci rozbila, se nikdy neprovede ve stávající verzi. Provede se jako nová verze vedle staré, takže aplikace napsaná pro `v1` funguje dál, i když přijde `v2`. Co se za rozbití nepovažuje, říkáme dále, aby s tím mohla aplikace počítat.

## Pole mohou přibýt {#fields-may-be-added}

Do odpovědi může v budoucnu přibýt pole, aniž by se změnila verze, protože aplikace napsaná tak, že ignoruje, co nezná, tím nic neztratí. Aplikace proto musí ignorovat každé pole, které nezná, a nesmí selhat kvůli takovému poli ani kvůli pořadí, v jakém pole přicházejí.

Co aplikace bylo řečeno, se bez nové verze nemění: název pole, jeho typ a jeho význam.

Znění chybové zprávy (`message`) se může kdykoli změnit. Aplikace čte `code` a `message` nikdy.

## Levné dotazování {#reading-cheaply}

Každá odpověď nese `ETag`. Položíte-li stejný dotaz znovu a pošlete ho v `If-None-Match`, odpověď je `304` a nic dalšího, pokud se nic nezměnilo. Turnaj a soutěž nesou také `Last-Modified`, s nímž lze poslat `If-Modified-Since`. Seznam se posuzuje jen podle svého `ETag`, protože seznam, který o turnaj přišel, nemá novější datum, kterým by to řekl.

Každý turnaj v seznamu nese také vlastní `etag`, vytvořený z toho, co říká. Aplikace, které se řekne, že se seznam změnil, pozná, které turnaje v něm se změnily, aniž by je porovnávala pole po poli.

Seznam turnajů jednoho roku přijímá `changedSince`, zapsané jako `2026-03-01T10:00:00Z`, aby aplikace, která rok čte znovu, žádala jen to, co se změnilo. Seznam je stránka o nejvýše 100 položkách s cestou k další a přijímá `page` a `pageSize`.

Co která adresa odpovídá, je v [koncových bodech API](endpoints.md).

## Klíče {#keys}

Číst smí kdokoli: požadavek bez klíče se vyřizuje stejně jako požadavek s klíčem. Klíč říká, na čí limit se požadavek počítá a co smí volající kromě čtení.

Klíč vytvoříte ve svém účtu v části **Klíče API** tlačítkem **Vytvořit klíč**. Posílejte ho s každým požadavkem jako nosný token (bearer token):

```
Authorization: Bearer <the key>
```

Klíč nikdy nedávejte do adresy, kterou si pamatují prohlížeče, proxy servery i logy. Chraňte klíč stejně tajně jako heslo. Klíč, který nefunguje, se odmítne odpovědí `401`, aby aplikace, která si myslí, že klíč posílá, zjistila, že tomu tak není.

## Limity {#allowances}

Každý požadavek se počítá do limitu, minutového i denního, ať se ptá na cokoli. Klíč začíná na 60 za minutu a 10 000 za den, což může administrátor pro jednoho partnera zvýšit. Požadavek bez klíče nebo s klíčem, který nefunguje, se počítá na jeho adresu, a to s limitem 10 za minutu a 500 za den.

Aplikace, která svůj limit vyčerpala, dostane odpověď `429` s údajem, jak dlouho má čekat. Požadavek vyřízený odpovědí `304` se počítá jako každý jiný.

## Chyby {#errors}

Každá chyba má stejný tvar:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

Na `code` aplikace spoléhá. `field` je ta část požadavku, která byla špatně, pokud nějaká byla. `message` je pro toho, kdo čte log.
