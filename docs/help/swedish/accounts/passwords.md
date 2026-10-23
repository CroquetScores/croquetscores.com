# Lösenord

## Vad webbplatsen kräver av ett lösenord

Varje gång du väljer ett lösenord, när du bekräftar din e-postadress, anger ett nytt lösenord eller byter ett, kräver webbplatsen att lösenordet:

- är **minst 12 tecken** långt;
- skrivs två gånger lika, andra gången som **Bekräfta lösenordet**;
- inte är ett som har **förekommit i ett dataintrång** någon annanstans.

Mellanslag i början och slutet tas bort, som när du loggar in, så ett överblivet mellanslag låser inte ute dig. Mellanslag mitt i behålls, vilket passar en lösenfras på flera ord.

## Att välja ett bra

Webbplatsen kräver längd och inget annat, inga versaler, siffror eller symboler. Det följer dagens råd: ett långt lösenord som aldrig används någon annanstans är starkare och lättare att komma ihåg än ett kort som gjorts svårläst. Rådet som webbplatsen följer kommer från det amerikanska National Institute of Standards and Technology, och du kan läsa det i [NIST:s riktlinjer för digital identitet, om lösenord](https://pages.nist.gov/800-63-4/sp800-63b.html).

I korthet:

- **Gör det långt.** Flera orelaterade ord blir en lösenfras som är lätt att komma ihåg och svår att gissa.
- **Använd det här och ingen annanstans.** Ett lösenord som används på två webbplatser är bara så säkert som den svagare av dem, och lösenord som stulits från en prövas på andra.
- **Förvara det i en lösenordshanterare** om du kan, som kan skapa ett långt lösenord för varje webbplats och komma ihåg dem alla.
- **Byt det inte enligt ett schema.** Byt det när du tror att någon annan kan känna till det, och inte annars.

## Hur webbplatsen kontrollerar om ett lösenord har läckt

Listor över lösenord som stulits från andra webbplatser publiceras, och de som försöker ta sig in på konton prövar dem först. När du väljer ett lösenord frågar därför webbplatsen en extern tjänst om det finns på en sådan lista. Tjänsten drivs av en tredje part, och webbplatsen använder den bara till detta.

Ditt lösenord lämnar inte webbplatsen. Webbplatsen gör ett enkelriktat fingeravtryck av det, som inte kan göras om till lösenordet, och skickar till tjänsten bara de fem första tecknen av fingeravtrycket. Tjänsten svarar med resten av fingeravtrycket för varje läckt lösenord som börjar likadant, vilket är flera hundra, och webbplatsen letar efter sitt eget bland dem. Tjänsten får alltså veta att ditt lösenord är ett av flera hundra, men aldrig vilket. [Så fungerar det, förklarat av Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), berättar mer.

Ett lösenord som finns på listan avvisas med ett meddelande som säger det, och du väljer ett annat. Om tjänsten inte kan nås går det inte att kontrollera ditt lösenord just nu, så det godtas eller byts inte. Försök igen om några minuter. En länk du fått fungerar fortfarande tills den går ut.

## Att byta lösenord

Välj **Byt lösenord** i menyn **Konto**. Sidan frågar efter ditt **Nuvarande lösenord**, ett **Nytt lösenord** och det igen som **Bekräfta lösenordet**. Det nuvarande efterfrågas eftersom det inte räcker att vara inloggad: en olåst telefon som glömts bort skulle annars låta den som tar upp den låsa ute dig.

När det är bytt förblir du inloggad i den här webbläsaren och alla andra loggas ut. Webbplatsen skickar ett e-postmeddelande till din adress om att lösenordet har bytts, så att du får veta det om det inte var du. Ett felaktigt nuvarande lösenord räknas mot samma gränser som inloggningen har.

Om du inte minns det nuvarande lösenordet pekar sidan på **Glömt lösenord?**.

Nästa: [Ta hand om ditt konto](looking-after-your-account.md).
