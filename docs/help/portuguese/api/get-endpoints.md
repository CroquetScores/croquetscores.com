# Os endpoints GET da API

Estes endereços leem e não mudam nada; os que mudam algo estão nos [endpoints POST](post-endpoints.md). Todo endereço aqui fica sob `/api/v0` no site, e toda resposta é JSON. O que vale para todos, como chaves, cotas, erros e perguntar com economia, está na [ajuda para desenvolvedores de aplicativos](index.md). Campos podem ser acrescentados a qualquer resposta sem uma nova versão (veja [campos podem ser acrescentados](index.md#fields-may-be-added)), então ignore o que você não conhece.

Um torneio, ou uma competição, é nomeado num endereço pela parte do seu id que vem depois da barra: para `tournament/4f2a…`, o endereço diz `4f2a…`. Toda resposta diz onde encontrar aquilo de que ela fala num `href`, e onde o site o mostra numa `uri`, um caminho que começa com uma barra.

## Os torneios de um ano {#tournaments}

`GET /api/v0/tournaments?year=2026`

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

`GET /api/v0/tournaments/{id}`

Diz o que a lista diz dele e, além disso:

- `competitions`: cada uma com `id`, `name`, `kind` (`block`, `swiss`, `knockout` ou `test`), `uri`, `href`, `changedAt` e `etag`.
- `players`, para um torneio jogado por jogadores: cada um com `id`, `name`, `worldRankingName`, `handicap` como um número (ou `null`), `representing` (ou `null`) e `etag`.
- `teams`, para um torneio jogado por equipes, que não tem jogadores próprios: cada uma com `id`, `name`, `shortName` e seus `players`, cada um com `id`, `name` e `worldRankingName`.

Uma chave feita para um torneio lê esse e nenhum outro, e é recusada para qualquer outro com `ApiKey.LimitedToAnotherTournament`. A resposta é `304` onde o `ETag` ou o `Last-Modified` enviado está atualizado.

## Os esportes {#sports}

O `sport` que um torneio diz, e para o qual uma lista pode ser pedida, é um destes códigos:

| Código | Esporte             |
| ------ | ------------------- |
| `ac`   | Association Croquet |
| `gc`   | Golf Croquet        |
| `a6w`  | American 6 Wicket   |
| `rc`   | Ricochet            |
| `gb`   | Gateball            |

Um esporte pode ser acrescentado no futuro, como um campo (veja [campos podem ser acrescentados](index.md#fields-may-be-added)), então um aplicativo deve lidar com um código que não conhece.

## Uma competição {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Diz o `name`, o `kind`, o `href`, a `uri` e o `changedAt` da competição, e onde a API fala de seus jogos (`games`) e, para um bloco e um suíço, que são os únicos que as têm, de sua classificação (`standings`).

## A classificação de um bloco ou de um suíço {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Diz a competição e `standings`: para cada jogador `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (ou `null`) e `shared`, se a posição é dividida. Um bloco acrescenta `lost`, `gamesWon` e `netGames`, que um suíço não diz.

## Os jogos de uma competição {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Diz a competição e seus jogos. Cada jogo tem um `id`, um `winner` e um `loser`, `drawn`, `withdrawn` (jogado, mas sem valer nada), `round` (de um mata-mata, em que a primeira é 1, e `null` nos outros) e `changedAt`. Cada lado diz o `playerId` do jogador, o seu `name` e o seu `score` como foi digitado, como `26tp`. Onde um jogo terminou empatado, só a ordem em que foram digitados decide qual lado se chama vencedor.

Um teste, a partida entre duas equipes, diz `matches` e não `games`: cada partida com os dois `players`, um de cada equipe, e os `games` entre eles.

## O que uma chave pode fazer {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Precisa de uma chave e diz o que essa chave pode fazer no torneio: `part`, que é o papel da conta dela (`manager`, `scorer` ou `neither`), `mayRead` e `mayWrite`. Um aplicativo pode dizer por que uma escrita seria recusada antes de enviar uma. A resposta é para a chave que perguntou, então nunca é guardada (`Cache-Control: no-store`).

## Torneios que mudaram de ano {#changed-year}

`GET /api/v0/tournaments/changed-year`

Lista os torneios que passaram para outro ano que não o em que estavam, para que um aplicativo possa mover o que guarda. Aceita `changedSince`, `page` e `pageSize`. Cada um tem `tournamentId`, `previousYear` e `newYear`.

## Torneios que foram arquivados {#archived}

`GET /api/v0/tournaments/archived`

Lista os torneios que foram arquivados, para que um aplicativo possa deixar de mostrá-los. Aceita `archivedSince`, escrito como `2026-03-01T10:00:00Z`, `page` e `pageSize`. Cada um tem `tournamentId` e `archivedAt`.
