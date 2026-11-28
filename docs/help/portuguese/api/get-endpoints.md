# Os endpoints GET da API

Estes endereços leem e não mudam nada; os que mudam algo estão nos [endpoints POST](post-endpoints.md). Todo endereço aqui fica sob `/api/v1` no site, e toda resposta é JSON. O que vale para todos, como chaves, cotas, erros e perguntar com economia, está na [ajuda para desenvolvedores de aplicativos](index.md). Campos podem ser acrescentados a qualquer resposta sem uma nova versão (veja [campos podem ser acrescentados](index.md#fields-may-be-added)), então ignore o que você não conhece.

Um torneio, ou uma competição, é nomeado num endereço pela parte do seu id que vem depois da barra: para `tournament/4f2a…`, o endereço diz `4f2a…`. Toda resposta diz onde encontrar aquilo de que ela fala num `href`, e onde o site o mostra numa `uri`, um caminho que começa com uma barra.

## Os torneios de um ano {#tournaments}

`GET /api/v1/tournaments?year=2026`

Aceita:

- `year`, obrigatório, um número inteiro como `2026`.
- `sport`, o código de um esporte (veja [os esportes](#sports)), para listar só esse esporte. Sem ele, um ano de todos os esportes é uma única requisição.
- `changedSince`, um instante escrito como `2026-03-01T10:00:00Z`, para listar só o que mudou depois dele.
- `page` e `pageSize`, em que uma página tem no máximo 100.

Responde com `tournaments`, cada um com:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (ou `null`), `sport`
- `uri` e `href`
- `national` e `international`, se o organizador marcou essas opções
- `changedAt`, quando algo foi guardado pela última vez sobre o torneio ou sobre alguma de suas competições
- `etag`, feito do que o torneio diz, para que você veja quais torneios de uma lista alterada mudaram

e `total`, `page`, `pageSize` e `next`, que diz onde está a próxima página, ou `null` na última. O id continua o mesmo, por mais que o torneio seja renomeado ou mudado de lugar. A lista é perguntada de novo com o `ETag` que ela enviou e respondida com `304` onde nada mudou.

## Um torneio {#tournament}

`GET /api/v1/tournaments/{id}`

Diz o que a lista diz dele e, além disso:

- `competitions`: cada uma com `id`, `name`, `kind` (`block`, `swiss`, `knockout` ou `test`), `uri`, `href`, `changedAt` e `etag`.
- `players`, para um torneio jogado por jogadores: cada um com `id`, `name`, `worldRankingName`, `handicap` como um número (ou `null`), `representing` (ou `null`) e `etag`.
- `teams`, para um torneio jogado por equipes, que não tem jogadores próprios: cada uma com `id`, `name`, `shortName` e seus `players`, cada um com `id`, `name` e `worldRankingName`.

Uma chave feita para um torneio lê esse e nenhum outro, e é recusada para qualquer outro com `ApiKey.LimitedToAnotherTournament`. A resposta é `304` onde o `ETag` ou o `Last-Modified` enviado está atualizado.

## O que um torneio pode ser {#choices}

Três listas dizem o que um torneio pode ser no site consultado: seus esportes, seus formatos e os países em que ele pode ser realizado. São o que o formulário do próprio site para um novo torneio oferece, de modo que um torneio feito com um código de uma delas é aceito por [criar um torneio](post-endpoints.md#create-tournament). Elas não precisam de chave. Cada uma recebe `language`, o código de um idioma como `de`, para nomear suas opções nesse idioma; um código que o site não oferece é recusado com `400`, e o `code` dele diz qual lista o recusou: `Sports.LanguageNotOffered`, `Formats.LanguageNotOffered` ou `Countries.LanguageUnknown`. Sem ele, os esportes e os países são nomeados em inglês, e os formatos no idioma que o navegador ou o cookie do site diz; diga então um `language` onde os nomes são mostrados. Cada resposta traz um `ETag` e é respondida com `304` onde não mudou.

### Os esportes {#sports}

`GET /api/v1/tournaments/sports`

Responde com `sports`, cada um com `code` e `name`. O `sport` que um torneio diz, e o que uma lista pode pedir, é um destes códigos. O Croquet Scores oferece `ac` (Association Croquet), `gc` (Golf Croquet), `a6w` (American 6 Wicket), `rc` (Ricochet) e `gb` (Gateball); o Gateball Scores oferece só Gateball. Um esporte pode ser acrescentado no futuro, como um campo pode (veja [campos podem ser acrescentados](index.md#fields-may-be-added)), então um app deve lidar com um código que não conhece.

### Os formatos {#formats}

`GET /api/v1/tournaments/formats`

Responde com `formats`, cada um com `code`, o nome com que um torneio é feito, `name`, `teams`, se é jogado por equipes, e `drawsLevelTests`, se um torneio nele sorteia um teste de desempate a menos que diga que não.

### Os países {#countries}

`GET /api/v1/countries`

Responde com `countries`, cada um com `code` (como `au`), `name` e `regions`, cada uma com `code` e `name`. Estão na ordem dos nomes deles no idioma pedido. Uma região é nomeada como foi registrada, em geral no idioma do próprio país. Um país que não é dividido tem uma região, que é ele mesmo.

## Uma competição {#competition}

`GET /api/v1/tournaments/{id}/competitions/{id}`

Diz o `name`, o `kind`, o `href`, a `uri` e o `changedAt` da competição, e onde a API fala de seus jogos (`games`) e, para um bloco e um suíço, que são os únicos que as têm, de sua classificação (`standings`).

## A classificação de um bloco ou de um suíço {#standings}

`GET /api/v1/tournaments/{id}/competitions/{id}/standings`

Diz a competição e `standings`: para cada jogador `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (ou `null`) e `shared`, se a posição é dividida. Um bloco acrescenta `lost`, `gamesWon` e `netGames`, que um suíço não diz.

## Os jogos de uma competição {#games}

`GET /api/v1/tournaments/{id}/competitions/{id}/games`

Diz a competição e seus jogos. Cada jogo tem um `id`, um `winner` e um `loser`, `drawn`, `withdrawn` (jogado, mas sem valer nada), `round` (de um mata-mata, em que a primeira é 1, e `null` nos outros) e `changedAt`. Cada lado diz o `playerId` do jogador, o seu `name` e o seu `score` como foi digitado, como `26tp`. Onde um jogo terminou empatado, só a ordem em que foram digitados decide qual lado se chama vencedor.

Um teste, a partida entre duas equipes, diz `matches` e não `games`: cada partida com os dois `players`, um de cada equipe, e os `games` entre eles.

## O que uma chave pode fazer {#permissions}

`GET /api/v1/tournaments/{id}/permissions`

Precisa de uma chave e diz o que essa chave pode fazer no torneio: `part`, que é o papel da conta dela (`manager`, `scorer` ou `neither`), `mayRead` e `mayWrite`. Um aplicativo pode dizer por que uma escrita seria recusada antes de enviar uma. A resposta é para a chave que perguntou, então nunca é guardada (`Cache-Control: no-store`).

## Torneios que mudaram de ano {#changed-year}

`GET /api/v1/tournaments/changed-year`

Lista os torneios que passaram para outro ano que não o em que estavam, para que um aplicativo possa mover o que guarda. Aceita `changedSince`, `page` e `pageSize`. Cada um tem `tournamentId`, `previousYear` e `newYear`.

## Torneios que foram arquivados {#archived}

`GET /api/v1/tournaments/archived`

Lista os torneios que foram arquivados, para que um aplicativo possa deixar de mostrá-los. Aceita `archivedSince`, escrito como `2026-03-01T10:00:00Z`, `page` e `pageSize`. Cada um tem `tournamentId` e `archivedAt`.

## Jogadores do ranking mundial {#world-ranking-players}

`GET /api/v1/ac/world-ranking-players` para Association Croquet e `GET /api/v1/gc/world-ranking-players` para Golf Croquet

Lista os jogadores desse esporte que os rankings mundiais conhecem, na ordem dos seus nomes. Os dois são pedidos e respondidos da mesma forma, exceto onde aqui se diz outra coisa. Cada um aceita `changedSince`, escrito como `2026-03-01T10:00:00Z`, `page` e `pageSize`, em que uma página tem no máximo 100. Responde com `worldRankingPlayers`, cada um com:

- `id`, e `worldRankingId`, o número que os rankings dão ao jogador
- `name`, como os rankings o nomeiam
- `country`, de onde o jogador é, como o código próprio do site para isso, um dos códigos nos [países](#countries). Um jogador de Golf Croquet sempre tem um, e dois jogadores de Golf Croquet podem ter o mesmo nome em países diferentes. Um jogador de Association Croquet tem um quando a lista dos rankings foi lida desde que ele foi acrescentado, e até então é omitido
- `games`, onde a API fala dos jogos do jogador (veja [os jogos de um jogador](#world-ranking-player-games))
- `archivedAt`, quando o jogador foi arquivado, ou `null`
- `changedAt`, e `etag`, feito do que o jogador diz

e `total`, `page`, `pageSize` e `next`, como os torneios de um ano. A lista é pedida de novo com o `ETag` que enviou, e respondida com `304` onde nada mudou. Um jogador que os rankings deixam de listar continua listado, com `archivedAt`, para que um app que o guardou possa saber que ele saiu. O `id` é o que se deve guardar: os rankings podem mudar o número de um jogador, e o `id` é o que continua sendo o mesmo jogador.

Pedida sem `page`, a lista primeiro atualiza os nomes a partir do próprio site dos rankings mundiais, no máximo uma vez por hora para cada esporte. Pedida uma página por número, a primeira inclusive, ela só diz o que o site guardou, de modo que um app que segue as páginas não faz o site dos rankings ser lido para cada uma delas. Onde o site dos rankings não pode ser lido, os nomes são os da última vez em que foram atualizados.

Uma requisição recusada é recusada com um `code` que começa com `WorldRankingPlayers.` para Association Croquet, como `WorldRankingPlayers.PageNotWhole`, e com `GolfCroquetWorldRankingPlayers.` para Golf Croquet, e um `field`.

## Os jogos de um jogador do ranking mundial {#world-ranking-player-games}

`GET /api/v1/ac/world-ranking-players/{id}/games` e `GET /api/v1/gc/world-ranking-players/{id}/games`

O `id` é a parte do `id` do jogador depois da barra, como `games` na lista acima o dá. Lista os jogos desse esporte que o jogador jogou, seja num bloco, num sistema suíço, num mata-mata ou num teste, e tenha jogado por si ou por uma equipe. Aceita `changedSince`, `page` e `pageSize` como a lista de jogadores, e responde com `games`, na ordem em que foram adicionados, cada um do lado do jogador:

- `id`, `tournamentId` e `competitionId`
- `won`, se o jogador ganhou, o que é `false` num empate, e `drawn`
- `score`, o do jogador, e `opponentScore`, ambos como foram digitados, como `26tp`
- `opponentName`, como os rankings o nomeiam onde o adversário é um jogador do ranking mundial e, nos outros casos, como o torneio o guarda, e `opponentId`, o `id` do adversário na lista acima, ou `null` onde ele não é um
- `archived` e `withdrawn`: um jogo de uma competição ou torneio arquivado, ou um jogo arquivado ou retirado, é listado e diz isso, para que um app que o guardou possa deixar de contá-lo
- `addedAt`, ou `null` para um jogo adicionado antes de o site guardar quando, e `changedAt`
- `etag`

e `total`, `page`, `pageSize` e `next`. Um jogo é do jogador quando ele é um jogador de um torneio desse esporte. O site descobre qual jogador do ranking mundial um jogador de torneio é pelo nome com que os rankings o conhecem. Onde os rankings dão esse nome a dois jogadores, como a lista de Golf Croquet faz com jogadores de países diferentes, o site os distingue por quem o jogador do torneio representa, quando é um dos países deles, e, se isso não bastar, pelo país em que o torneio é disputado. Um jogador de torneio que isso não distingue não é de ninguém, nem os jogos dele, e um adversário que isso não distingue é nomeado sem `opponentId`.

Um jogador que o site não conhece é recusado com `404` e `WorldRankingPlayers.NotFound`, ou `GolfCroquetWorldRankingPlayers.NotFound` para Golf Croquet, o que não é o mesmo que um jogador sem jogos, que tem uma lista vazia. Uma requisição recusada por causa da página é recusada com um `code` que começa com `WorldRankingPlayerGames.`, ou `GolfCroquetWorldRankingPlayerGames.` para Golf Croquet, e um `field`.
