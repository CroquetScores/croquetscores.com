# API:ets slutpunkter

Varje adress ligger under `/api/v1` på webbplatsen, och varje svar är JSON. Det som gäller dem alla, som nycklar, kvoter, fel och hur man frågar billigt, står i [hjälpen för apputvecklare](index.md).

Det finns två slag, och en sida för vartdera:

- [GET-slutpunkterna](get-endpoints.md) läser: ett års turneringar, en turnering, en tävling, dess ställning och partier, de sporter, format och länder en turnering kan ha, spelarna i världsrankingen i Association Croquet och Golf Croquet och deras partier, vad en nyckel får göra och vad som ändrats eller arkiverats.
- [POST-slutpunkterna](post-endpoints.md) ändrar något: att skapa en turnering, dess tävlingar, spelare, lag och partier, och vem som får arrangera den och föra resultat.
