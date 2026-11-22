# نقاط وصول الـ API

كل عنوان هنا تحت `/api/v0` على الموقع، وكل رد JSON. اللي بيسري على الكل، زي المفاتيح والحصص والأخطاء وإزاي تسأل بالرخيص، موجود في [المساعدة لمطوّري التطبيقات](index.md). ممكن تتضاف حقول لأي رد من غير نسخة جديدة (شوف [ممكن تتضاف حقول](index.md#fields-may-be-added))، فتجاهل اللي ما تعرفوش.

البطولة، أو المسابقة، بتتسمّى في العنوان بالجزء من الـ id بتاعها اللي بعد الشرطة المايلة: لـ `tournament/4f2a…` العنوان بيقول `4f2a…`. كل رد بيقول في `href` فين تلاقي اللي بيتكلم عنه، وفي `uri` فين الموقع بيعرضه، كمسار بيبدأ بشرطة مايلة.

## بطولات سنة {#tournaments}

`GET /api/v0/tournaments?year=2026`

بتاخد:

- `year`، لازم، رقم صحيح زي `2026`.
- `sport`، كود رياضة (شوف [الرياضات](#sports))، علشان تعرض الرياضة دي بس. من غيره سنة كل الرياضات طلب واحد.
- `changedSince`، لحظة مكتوبة زي `2026-03-01T10:00:00Z`، علشان تعرض اللي اتغيّر بعدها بس.
- `page` و`pageSize`، والصفحة فيها 100 على الأكتر.

بترد بـ `tournaments`، كل واحدة فيها:

- `id` و`name` و`starts` و`finishes` و`country` و`region` (أو `null`) و`sport`
- `uri` و`href`
- `national` و`international`، لو المنظّم علّم عليهم
- `changedAt`، إمتى آخر مرة اتحفظ حاجة عن البطولة أو عن أي مسابقة فيها
- `etag`، متعمل من اللي البطولة بتقوله، علشان تعرف أنهي بطولات في قايمة اتغيّرت

و`total` و`page` و`pageSize` و`next`، اللي بيقول فين الصفحة الجاية، أو `null` في الأخيرة. الـ id بيفضل هو هو مهما البطولة اتسمّت من جديد أو اتنقلت. القايمة بتتسأل تاني بالـ `ETag` اللي بعتته، وبيتردّ عليها بـ `304` لو مفيش حاجة اتغيّرت.

## بطولة واحدة {#tournament}

`GET /api/v0/tournaments/{id}`

بتقول اللي القايمة بتقوله عنها، و:

- `competitions`: كل واحدة فيها `id` و`name` و`kind` (`block` أو `swiss` أو `knockout` أو `test`) و`uri` و`href` و`changedAt` و`etag`.
- `players`، للبطولة اللي بيلعبها لاعبين: كل واحد فيهم `id` و`name` و`worldRankingName` و`handicap` كرقم (أو `null`) و`representing` (أو `null`) و`etag`.
- `teams`، للبطولة اللي بتلعبها فرق وملهاش لاعبين خاصين بيها: كل فريق فيه `id` و`name` و`shortName` و`players` بتاعته، كل واحد فيهم `id` و`name` و`worldRankingName`.

المفتاح اللي اتعمل لبطولة واحدة بيقرا دي ومفيش غيرها، وبيترفض لأي بطولة تانية بـ `ApiKey.LimitedToAnotherTournament`. الرد `304` لو الـ `ETag` أو الـ `Last-Modified` اللي اتبعت لسه سارٍ.

## الرياضات {#sports}

الـ `sport` اللي البطولة بتقوله، واللي ينفع تتطلب قايمة ليه، واحد من الأكواد دي:

| الكود | الرياضة             |
| ----- | ------------------- |
| `ac`  | Association Croquet |
| `gc`  | Golf Croquet        |
| `a6w` | American 6 Wicket   |
| `rc`  | Ricochet            |
| `gb`  | Gateball            |

ممكن تتضاف رياضة في المستقبل، زي الحقل (شوف [ممكن تتضاف حقول](index.md#fields-may-be-added))، فالتطبيق لازم يتعامل مع كود ما يعرفوش.

## مسابقة واحدة {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

بتقول `name` و`kind` و`href` و`uri` و`changedAt` للمسابقة، وفين الـ API بتتكلم عن ألعابها (`games`) وللبلوك والسويسري، اللي هما الوحيدين اللي عندهم ترتيب، عن ترتيبها (`standings`).

## ترتيب بلوك أو سويسري {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

بتقول المسابقة، و`standings`: لكل لاعب `playerId` و`name` و`withdrawn` و`played` و`won` و`netHoops` و`position` (أو `null`) و`shared`، يعني المركز متقسّم ولا لأ. البلوك بيزوّد `lost` و`gamesWon` و`netGames`، اللي السويسري ما بيقولهمش.

## ألعاب مسابقة {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

بتقول المسابقة وألعابها. كل لعبة فيها `id` و`winner` و`loser` و`drawn` و`withdrawn` (اتلعبت بس مبتتحسبش) و`round` (في الإقصائي، والأولى فيه 1، و`null` في غيره) و`changedAt`. كل جانب بيقول `playerId` بتاع اللاعب و`name` بتاعه و`score` بتاعه زي ما اتكتب، زي `26tp`. لو اللعبة خلصت تعادل، ترتيب الكتابة بس هو اللي بيحدّد أنهي جانب بيتسمّى الفايز.

اللقاء، وهو مباراة بين فريقين، بيقول `matches` مش `games`: كل مباراة فيها الـ `players` الاتنين، واحد من كل فريق، والـ `games` اللي بينهم.

## إيه اللي المفتاح يقدر يعمله {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

محتاجة مفتاح، وبتقول المفتاح ده يقدر يعمل إيه في البطولة: `part`، وهو دور حسابه (`manager` أو `scorer` أو `neither`)، و`mayRead` و`mayWrite`. التطبيق يقدر يقول ليه الكتابة هتترفض قبل ما يبعت واحدة. الرد لحساب المفتاح اللي سأل، فعمره ما بيتحفظ (`Cache-Control: no-store`).

## بطولات غيّرت سنتها {#changed-year}

`GET /api/v0/tournaments/changed-year`

بتعرض البطولات اللي بقت في سنة غير السنة اللي كانت فيها، علشان التطبيق ينقل اللي محتفظ بيه. بتاخد `changedSince` و`page` و`pageSize`. كل واحدة فيها `tournamentId` و`previousYear` و`newYear`.

## بطولات اتأرشفت {#archived}

`GET /api/v0/tournaments/archived`

بتعرض البطولات اللي اتأرشفت، علشان التطبيق يبطّل يعرضها. بتاخد `archivedSince`، مكتوب زي `2026-03-01T10:00:00Z`، و`page` و`pageSize`. كل واحدة فيها `tournamentId` و`archivedAt`.
