# Los puntos finales GET de la API

Estas direcciones leen y no cambian nada; las que cambian algo están en [los puntos finales POST](post-endpoints.md). Cada dirección de aquí está bajo `/api/v0` en el sitio, y cada respuesta es JSON. Lo que vale para todas, como las claves, los límites, los errores y cómo preguntar con economía, está en la [ayuda para desarrolladores de aplicaciones](index.md). Pueden añadirse campos a cualquier respuesta sin una versión nueva (consulta [pueden añadirse campos](index.md#fields-may-be-added)), así que ignora lo que no conozcas.

Un torneo, o una competición, se nombra en una dirección con la parte de su id que va después de la barra: para `tournament/4f2a…`, la dirección dice `4f2a…`. Cada respuesta dice en un `href` dónde encontrar aquello de lo que habla, y en una `uri` dónde lo muestra el sitio, como una ruta que empieza con una barra.

## Los torneos de un año {#tournaments}

`GET /api/v0/tournaments?year=2026`

Acepta:

- `year`, obligatorio, un número entero como `2026`.
- `sport`, el código de un deporte (consulta [los deportes](#sports)), para listar solo ese deporte. Sin él, un año de todos los deportes es una sola petición.
- `changedSince`, un instante escrito como `2026-03-01T10:00:00Z`, para listar solo lo que cambió después.
- `page` y `pageSize`, donde una página tiene 100 como máximo.

Responde con `tournaments`, cada uno con:

- `id`, `name`, `starts`, `finishes`, `country`, `region` (o `null`), `sport`
- `uri` y `href`
- `national` e `international`, si el organizador las marcó
- `changedAt`, cuándo se guardó por última vez algo del torneo o de alguna de sus competiciones
- `etag`, hecho de lo que dice el torneo, para que veas cuáles de los torneos de una lista modificada cambiaron

y `total`, `page`, `pageSize` y `next`, que dice dónde está la página siguiente, o `null` en la última. El id sigue siendo el mismo por mucho que el torneo cambie de nombre o de sitio. La lista se vuelve a preguntar con el `ETag` que envió y se responde con `304` donde nada ha cambiado.

## Un torneo {#tournament}

`GET /api/v0/tournaments/{id}`

Dice lo que dice la lista de él y, además:

- `competitions`: cada una con `id`, `name`, `kind` (`block`, `swiss`, `knockout` o `test`), `uri`, `href`, `changedAt` y `etag`.
- `players`, en un torneo que juegan jugadores: cada uno con `id`, `name`, `worldRankingName`, `handicap` como un número (o `null`), `representing` (o `null`) y `etag`.
- `teams`, en un torneo que juegan equipos, que no tiene jugadores propios: cada uno con `id`, `name`, `shortName` y sus `players`, cada uno con `id`, `name` y `worldRankingName`.

Una clave hecha para un torneo lee ese y ningún otro, y se rechaza para cualquier otro con `ApiKey.LimitedToAnotherTournament`. La respuesta es `304` donde el `ETag` o el `Last-Modified` enviado sigue vigente.

## Los deportes {#sports}

El `sport` que dice un torneo, y para el que puede pedirse una lista, es uno de estos códigos:

| Código | Deporte             |
| ------ | ------------------- |
| `ac`   | Association Croquet |
| `gc`   | Golf Croquet        |
| `a6w`  | American 6 Wicket   |
| `rc`   | Ricochet            |
| `gb`   | Gateball            |

En el futuro puede añadirse un deporte, igual que un campo (consulta [pueden añadirse campos](index.md#fields-may-be-added)), así que una aplicación debe saber manejar un código que no conozca.

## Una competición {#competition}

`GET /api/v0/tournaments/{id}/competitions/{id}`

Dice el `name`, el `kind`, el `href`, la `uri` y el `changedAt` de la competición, y dónde habla la API de sus partidas (`games`) y, en un bloque y un suizo, que son los únicos que la tienen, de su clasificación (`standings`).

## La clasificación de un bloque o de un suizo {#standings}

`GET /api/v0/tournaments/{id}/competitions/{id}/standings`

Dice la competición y `standings`: de cada jugador `playerId`, `name`, `withdrawn`, `played`, `won`, `netHoops`, `position` (o `null`) y `shared`, si el puesto se comparte. Un bloque añade `lost`, `gamesWon` y `netGames`, que un suizo no dice.

## Las partidas de una competición {#games}

`GET /api/v0/tournaments/{id}/competitions/{id}/games`

Dice la competición y sus partidas. Cada partida tiene un `id`, un `winner` y un `loser`, `drawn`, `withdrawn` (jugada, pero que no cuenta para nada), `round` (de una eliminatoria, donde la primera es 1, y `null` en las demás) y `changedAt`. Cada lado dice el `playerId` del jugador, su `name` y su `score` tal como se tecleó, como `26tp`. Donde una partida quedó en tablas, solo el orden en que se teclearon decide qué lado se llama ganador.

Un test, el partido entre dos equipos, dice `matches` y no `games`: cada partido con los dos `players`, uno de cada equipo, y los `games` entre ellos.

## Qué puede hacer una clave {#permissions}

`GET /api/v0/tournaments/{id}/permissions`

Necesita una clave y dice qué puede hacer esa clave en el torneo: `part`, que es el papel de su cuenta (`manager`, `scorer` o `neither`), `mayRead` y `mayWrite`. Una aplicación puede decir por qué se rechazaría una escritura antes de enviar una. La respuesta es para la clave que preguntó, así que nunca se guarda (`Cache-Control: no-store`).

## Torneos que han cambiado de año {#changed-year}

`GET /api/v0/tournaments/changed-year`

Lista los torneos que han pasado a un año distinto de aquel en el que estaban, para que una aplicación pueda mover lo que guarda. Acepta `changedSince`, `page` y `pageSize`. Cada uno tiene `tournamentId`, `previousYear` y `newYear`.

## Torneos que se han archivado {#archived}

`GET /api/v0/tournaments/archived`

Lista los torneos que se han archivado, para que una aplicación pueda dejar de mostrarlos. Acepta `archivedSince`, escrito como `2026-03-01T10:00:00Z`, `page` y `pageSize`. Cada uno tiene `tournamentId` y `archivedAt`.
