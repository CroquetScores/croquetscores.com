# Os endpoints POST da API

Estes endereços mudam alguma coisa. Os que só leem estão nos [endpoints GET](get-endpoints.md). Todo endereço aqui fica sob `/api/v1` no site, e o que as próprias páginas do site mudam é mudado por esses mesmos endereços, de modo que um aplicativo não tem um conjunto menor que o do site. O que vale para todos, como chaves, cotas e erros, está na [ajuda para desenvolvedores de aplicativos](index.md); quem pode escrever está [abaixo](#who-may-write).

Um torneio, uma competição e o resto são nomeados em um endereço pela parte do id deles depois da barra: para `tournament/4f2a…` o endereço diz `4f2a…`. Um corpo nomeia outras coisas do mesmo modo, como `player` faz abaixo, exceto onde diz que é o id inteiro.

Envie o corpo como JSON, com `Content-Type: application/json`. Um campo omitido é o mesmo que um vazio e é recusado como tal. O que for enviado e esta página não citar é ignorado. Uma resposta traz `Cache-Control: no-store`.

## Quem pode escrever {#who-may-write}

Uma requisição que muda algo é feita por uma chave criada para escrever (veja [chaves](index.md#keys)) ou por uma pessoa conectada ao site. Uma chave pode fazer o que a conta para a qual foi criada pode fazer, e nada mais:

- Uma chave criada só para ler é recusada com `ApiKey.ReadOnly`.
- Uma chave criada para um torneio só pode mudar esse torneio. Para outro, é recusada com `ApiKey.LimitedToAnotherTournament`, e não pode criar um torneio, que não pertence a nenhum.
- Os organizadores de um torneio podem mudar tudo nele.
- Os anotadores de um torneio podem fazer o que se faz com os resultados, e nada mais: adicionar um jogo, corrigi-lo, movê-lo, arquivá-lo, restaurá-lo, retirá-lo e desfazer a retirada. Qualquer outra coisa no torneio é recusada a eles com `Tournament.NotAManager`.
- Qualquer outra pessoa é recusada com `Tournament.NotAManager`, ou com `Tournament.NotAManagerOrScorer` onde um anotador teria sido aceito.

`GET /api/v1/tournaments/{id}/permissions` diz qual papel uma chave tem em um torneio (veja [o que uma chave pode fazer](get-endpoints.md#permissions)), para que um aplicativo possa dizer por que uma escrita seria recusada antes de enviá-la.

## O que é uma resposta {#answers}

Uma requisição que cria algo é respondida com `201` e o `id` da coisa nova, que é o id inteiro dela, como os endpoints GET o dizem. Uma requisição que muda algo que já existe é respondida com `204`, sem nada no corpo. Uma requisição recusada é respondida como qualquer erro (veja [erros](index.md#errors)): pelo seu `code`, em que um aplicativo se apoia, e pelo `field` a que se referia, onde houve um.

Enviar uma requisição duas vezes não é o mesmo que enviá-la uma: um jogo adicionado duas vezes são dois jogos. Um aplicativo que não soube se uma requisição passou deve ler o que ela mudou antes de enviá-la de novo.

## Torneios {#tournaments}

### Criar um torneio {#create-tournament}

`POST /api/v1/tournaments`

Recebe `name`, `starts` e `finishes` (escritos como `2026-10-03T00:00:00Z`), `format` (um código, veja [os formatos](get-endpoints.md#formats)), `sport` (um código, veja [os esportes](get-endpoints.md#sports)), `country` (um código como `au`, veja [os países](get-endpoints.md#countries)) e, se quiser, `region` (um código do país, da mesma lista), `subtitle`, `levelTestsDrawn`, `national` e `international`, cada um dos três últimos `true` ou `false`. Responde `201` com `id` e `address`, que é onde o site o mostra.

### Arquivar ou restaurar um torneio {#tournament-actions}

`POST /api/v1/tournaments/{id}/archive`

`POST /api/v1/tournaments/{id}/restore`

Não recebem corpo e respondem `204`.

### Adicionar uma nota de organizador {#notes}

`POST /api/v1/tournaments/{id}/notes`

Recebe `title` e `description`. Responde `201` com o `id` da nota. Uma descrição pode ter até 750.000 caracteres, e a requisição pode ser tão grande quanto isso exigir.

## As pessoas que têm um papel em um torneio {#people}

`POST /api/v1/tournaments/{id}/scorers`

`POST /api/v1/tournaments/{id}/managers`

Tornam alguém anotador ou organizador. Recebem `emailAddress`, o endereço de e-mail da conta da pessoa, e respondem `204`.

`POST /api/v1/tournaments/{id}/scorers/{account}/remove`

`POST /api/v1/tournaments/{id}/managers/{account}/remove`

Tiram um anotador ou um organizador. Não recebem corpo e respondem `204`. O `account` é a parte do id da conta depois de `account/`.

## Competições {#competitions}

### Adicionar uma competição {#add-competition}

`POST /api/v1/tournaments/{id}/competitions`

Recebe `kind`, um entre `block`, `swiss`, `knockout` ou `losers-knockout`, e um `name`, depois o que o tipo dela tem:

- Um bloco recebe `bestOf` e `rounds` (quantas vezes cada um joga contra cada um) e pode receber `tieBreak`.
- Um suíço recebe `bestOf`.
- Um mata-mata recebe `places` e `rounds`, uma lista com a melhor de quantos para cada rodada, e pode receber `losers`, uma lista de mata-matas dos perdedores a serem criados com ele, cada um com um `name` e uma `round`.
- Um mata-mata dos perdedores recebe `from`, a competição cujos perdedores ele toma, e a `round` de que os toma.

Um bloco, um suíço e um mata-mata também podem receber como são jogados e contados: `handicap`, `drawsAllowed`, `worldRankings` e `advantage`, cada um `true` ou `false`, e `maximumHoops`, um número, ou `null` para nenhum máximo. Uma competição que diz `advantage` é recusada com `Advantage.NotOffered` enquanto o site não oferece o Advantage Golf Croquet. Responde `201` com o `id` da competição.

### Adicionar um teste {#add-test}

`POST /api/v1/tournaments/{id}/tests`

Um teste é a partida entre duas equipes de um torneio por equipes. Recebe `firstTeam` e `secondTeam`, cada um o id de uma equipe depois de `team/`, `starts` e `finishes`, `expectedMatches`, `bestOf`, `group` e as mesmas regras que uma competição pode receber. Responde `201` com o seu `id`, que é o de uma competição.

### Mover, arquivar ou restaurar uma competição {#competition-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/restore`

Movem-na um lugar para cima ou para baixo na lista do torneio, ou a arquivam, ou a restauram. Não recebem corpo e respondem `204`. Um teste também é movido, arquivado e restaurado por estes.

## Os jogadores de uma competição {#competition-players}

### Inscrever um jogador {#enter-player}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players`

Inscreve na competição um dos jogadores do torneio. Recebe `player`, a parte do id do jogador do torneio depois de `tournament-player/`. Responde `201` com `id`, que é o id do jogador na competição e não no torneio.

### Mover, retirar, trazer de volta ou remover um jogador {#competition-player-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Movem um jogador um lugar para cima ou para baixo, retiram-no, desfazem a retirada dele ou tiram-no da competição. O `player` é a parte do id dele na competição depois de `competition-player/`. Não recebem corpo e respondem `204`.

Todo bye em uma competição tem o mesmo id, então um bye se distingue por `order`, um número inteiro acrescentado ao endereço como `?order=2`. Qualquer outra coisa é recusada com `Request.Invalid`.

## Os jogos de uma competição {#games}

### Adicionar um jogo {#add-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games`

Recebe o `winner` e o `loser`, cada um a parte do id de um jogador da competição depois de `competition-player/`, e os resultados. Os jogadores de um teste não são dele, então, para um teste, cada um é o id inteiro de um jogador em uma de suas equipes, como `team-player/…`.

Os resultados são como a competição os guarda:

- `winnerScore` e `loserScore`, como foram digitados, como `26` ou `26tp`.
- Para uma competição jogada como Advantage Golf Croquet, no lugar deles, `winnerHoops`, `winnerTarget`, `loserHoops` e `loserTarget`: os arcos que cada lado fez e os arcos até onde jogava. Um `w` depois de um deles, como `"3w"`, diz que esse lado venceu onde as frações são iguais.

Uma requisição com o tipo de resultado que a competição não guarda é recusada, com `Game.AdvantageScoreTyped` ou `Game.HoopsAndTargetsNotAdvantage`. Responde `201` com o `id` do jogo.

### Corrigir um jogo {#correct-game}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Recebe os resultados como ao adicionar um jogo e, onde mudaram, `winner` e `loser`. Um jogador que não é enviado é o que o jogo já tem. O `game` é a parte do id dele depois de `game/`. Responde `204`.

### Mover, arquivar, restaurar ou retirar um jogo {#game-actions}

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Movem o resultado de um teste um lugar para cima ou para baixo, arquivam um jogo ou o restauram, retiram-no (foi jogado e não conta) ou desfazem a retirada dele. Não recebem corpo e respondem `204`. Estes, e os dois acima, são o que um anotador pode fazer.

## Os jogadores de um torneio {#tournament-players}

### Adicionar um jogador {#add-tournament-player}

`POST /api/v1/tournaments/{id}/players`

Adiciona um jogador ao torneio. Recebe `name`, e pode receber `representing`, `handicap`, `flag` e `worldRankingName`; o que fica de fora ou vazio fica sem ser dito. Responde `201` com o `id` do jogador, que é o id inteiro dele, como os endpoints GET o dizem. Um jogador sem nome, ou com o nome de um que já está lá, é recusado. Um jogador é [inscrito](#enter-player) numa competição com a parte deste `id` depois de `tournament-player/`.

### Mover, arquivar ou restaurar um jogador {#tournament-player-actions}

`POST /api/v1/tournaments/{id}/players/{player}/up`

`POST /api/v1/tournaments/{id}/players/{player}/down`

`POST /api/v1/tournaments/{id}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/players/{player}/restore`

Movem um dos jogadores do torneio um lugar para cima ou para baixo, ou os arquivam ou restauram. O `player` é a parte do id dele depois de `tournament-player/`. Não recebem corpo e respondem `204`.

## As equipes de um torneio {#teams}

### Adicionar uma equipe {#add-team}

`POST /api/v1/tournaments/{id}/teams`

Recebe `name` e `shortName`, e pode receber `flag`. Responde `201` com o `id` da equipe.

### Adicionar um jogador a uma equipe {#add-team-player}

`POST /api/v1/tournaments/{id}/teams/{team}/players`

Recebe `name`, e pode receber `worldRankingName`. Responde `201` com o `id` do jogador.

### Mover, arquivar ou restaurar uma equipe {#team-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/restore`

Não recebem corpo e respondem `204`.

### Mover, arquivar ou restaurar um jogador de equipe {#team-player-actions}

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/restore`

O `player` é a parte do id dele depois de `team-player/`. Não recebem corpo e respondem `204`.
