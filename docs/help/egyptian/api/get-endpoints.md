# نقاط وصول GET في الـ API

العناوين دي بتقرا وماتغيّرش حاجة؛ اللي بتغيّر حاجة موجودة في [نقاط وصول POST](post-endpoints.md). كل عنوان هنا تحت `/api/v0` على الموقع، وكل رد JSON. اللي بيسري على الكل، زي المفاتيح والحصص والأخطاء وإزاي تسأل بالرخيص، موجود في [المساعدة لمطوّري التطبيقات](index.md). ممكن تتضاف حقول لأي رد من غير نسخة جديدة (شوف [ممكن تتضاف حقول](index.md#fields-may-be-added))، فتجاهل اللي ما تعرفوش.

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

## البطولة ممكن تبقى إيه {#choices}

تلات قوايم بتقول البطولة ممكن تبقى إيه على الموقع اللي اتسأل: رياضاته وأشكاله والبلاد اللي ممكن تتلعب فيها. دي اللي بيعرضها نموذج الموقع نفسه لبطولة جديدة، فالبطولة اللي بتتعمل بكود من واحدة منها بتتقبل في [إنشاء بطولة](post-endpoints.md#create-tournament). مش محتاجة مفتاح. كل واحدة بتاخد `language`، علامة لغة زي `de`، علشان تسمّي اختياراتها بيها؛ والعلامة اللي الموقع مبيقدّمهاش بتترفض بـ `400`، والـ `code` بتاعها بيقول أنهي قايمة رفضتها: `Sports.LanguageNotOffered` أو `Formats.LanguageNotOffered` أو `Countries.LanguageUnknown`. من غيرها، الرياضات والبلاد بتتسمّى بالإنجليزي، والأشكال باللغة اللي المتصفح أو كوكيز الموقع بيقولها، فقول `language` في الأماكن اللي الأسامي بتتعرض فيها. كل رد بيشيل `ETag` وبيتردّ بـ `304` لو ماتغيّرش.

### الرياضات {#sports}

`GET /api/v0/tournaments/sports`

بيرد بـ `sports`، كل واحدة فيها `code` و`name`. الـ `sport` اللي البطولة بتقوله، واللي ينفع تتطلب قايمة ليه، واحد من الأكواد دي. Croquet Scores بيقدّم `ac` (Association Croquet) و`gc` (Golf Croquet) و`a6w` (American 6 Wicket) و`rc` (Ricochet) و`gb` (Gateball)؛ و Gateball Scores بيقدّم Gateball بس. ممكن تتضاف رياضة في المستقبل، زي الحقل (شوف [ممكن تتضاف حقول](index.md#fields-may-be-added))، فالتطبيق لازم يتعامل مع كود ما يعرفوش.

### الأشكال {#formats}

`GET /api/v0/tournaments/formats`

بيرد بـ `formats`، كل واحد فيه `code`، وهو الاسم اللي البطولة بتتعمل بيه، و`name` و`teams`، يعني بتتلعب بفرق ولا لأ، و`drawsLevelTests`، يعني البطولة اللي بالشكل ده بتسحب اختبار تعادل إلا لو قالت إنها مش هتسحبه.

### البلاد {#countries}

`GET /api/v0/countries`

بيرد بـ `countries`، كل واحدة فيها `code` (زي `au`) و`name` و`regions`، كل واحدة فيها `code` و`name`. مترتّبة بترتيب أسمائها باللغة المطلوبة. المنطقة بتتسمّى زي ما اتسجّلت، ومعظمها بلغة بلدها. البلد اللي مش متقسّم ليه منطقة واحدة، وهي نفسه.

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

## لاعبين التصنيف العالمي {#world-ranking-players}

`GET /api/v0/ac/world-ranking-players`

بيعرض لاعبين Association Croquet اللي التصنيفات العالمية تعرفهم. بياخد `changedSince`، مكتوب زي `2026-03-01T10:00:00Z`، و`page` و`pageSize`، والصفحة فيها 100 على الأكتر. بيرد بـ `worldRankingPlayers`، كل واحد فيه:

- `id`، و`worldRankingId`، الرقم اللي التصنيفات بتدّيه للاعب
- `name`، زي ما التصنيفات بتسمّيه
- `games`، المكان اللي الـ API بتحكي فيه عن ألعاب اللاعب (شوف [ألعاب لاعب](#world-ranking-player-games))
- `archivedAt`، إمتى اللاعب اتأرشف، أو `null`
- `changedAt`، و`etag`، متعمل من اللي اللاعب بيقوله

و`total` و`page` و`pageSize` و`next`، زي بطولات سنة. القايمة بتتسأل تاني بالـ `ETag` اللي بعتته، وبتتردّ بـ `304` لو مفيش حاجة اتغيّرت. الطلب المرفوض بيترفض بـ `code` بيبدأ بـ `WorldRankingPlayers.`، زي `WorldRankingPlayers.PageNotWhole`، وبـ `field`.

## ألعاب لاعب في التصنيف العالمي {#world-ranking-player-games}

`GET /api/v0/ac/world-ranking-players/{id}/games`

الـ `id` هو الجزء من `id` اللاعب اللي بعد الشرطة المايلة، زي ما `games` في القايمة اللي فوق بتقوله. بيعرض ألعاب Association Croquet اللي اللاعب لعبها، سواء في بلوك أو نظام سويسري أو إقصائي أو اختبار، وسواء لعب لنفسه أو لفريق. بياخد `changedSince` و`page` و`pageSize` زي قايمة اللاعبين، وبيرد بـ `games`، بالترتيب اللي اتضافت بيه، كل لعبة من ناحية اللاعب:

- `id` و`tournamentId` و`competitionId`
- `won`، يعني اللاعب كسب ولا لأ، وهو `false` لو اتعادلوا، و`drawn`
- `score`، بتاع اللاعب، و`opponentScore`، الاتنين زي ما اتكتبوا، زي `26tp`
- `opponentName`، زي ما التصنيفات بتسمّيه لو الخصم لاعب في التصنيف العالمي، وزي ما البطولة شايلاه لو لأ، و`opponentId`، الـ `id` بتاع الخصم في القايمة اللي فوق، أو `null` لو مش واحد منهم
- `archived` و`withdrawn`: لعبة مسابقة أو بطولة متأرشفة، أو لعبة متأرشفة أو مسحوبة، بتتعرض وبتقول كده، علشان التطبيق اللي شايلها يبطّل يحسبها
- `addedAt`، أو `null` للعبة اتضافت قبل ما الموقع يبقى بيسجّل إمتى، و`changedAt`
- `etag`

و`total` و`page` و`pageSize` و`next`. اللاعب اللي الموقع ما يعرفوش بيترفض بـ `404` و`WorldRankingPlayers.NotFound`، وده مش زي لاعب من غير ألعاب، اللي ليه قايمة فاضية.
