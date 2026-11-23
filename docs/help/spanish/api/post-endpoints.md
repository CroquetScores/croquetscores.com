# Los puntos finales POST de la API

**NOTA: Esto es un borrador. Hay algunos puntos finales que sé que se eliminarán.**

Estas direcciones cambian algo. Las que solo leen están en [los puntos finales GET](get-endpoints.md). Cada dirección de aquí está bajo `/api/v0` en el sitio, y lo que cambian las propias páginas del sitio lo cambian esas mismas direcciones, de modo que una aplicación no tiene un conjunto menor que el del sitio. Lo que vale para todas, como las claves, los límites y los errores, está en la [ayuda para desarrolladores de aplicaciones](index.md); quién puede escribir está [más abajo](#who-may-write).

Un torneo, una competición y el resto se nombran en una dirección con la parte de su id que va después de la barra: para `tournament/4f2a…` la dirección dice `4f2a…`. Un cuerpo nombra otras cosas del mismo modo, como hace `player` más abajo, salvo donde dice que es el id completo.

Envía el cuerpo como JSON, con `Content-Type: application/json`. Un campo omitido es lo mismo que uno vacío, y se rechaza como tal. Lo que se envíe y esta página no nombre se ignora. Una respuesta lleva `Cache-Control: no-store`.

## Quién puede escribir {#who-may-write}

Una petición que cambia algo la hace una clave creada para escribir (consulta [claves](index.md#keys)) o una persona que ha iniciado sesión en el sitio. Una clave puede hacer lo que puede hacer la cuenta para la que se creó, y nada más:

- Una clave creada solo para leer se rechaza con `ApiKey.ReadOnly`.
- Una clave creada para un torneo solo puede cambiar ese torneo. Para otro se rechaza con `ApiKey.LimitedToAnotherTournament`, y no puede crear un torneo, que no pertenece a ninguno.
- Los gestores de un torneo pueden cambiar todo lo que le concierne.
- Los anotadores de un torneo pueden hacer lo que se hace con los resultados, y nada más: añadir una partida, corregirla, moverla, archivarla, restaurarla, retirarla y deshacer su retirada. Cualquier otra cosa del torneo se les rechaza con `Tournament.NotAManager`.
- Cualquier otra persona se rechaza con `Tournament.NotAManager`, o con `Tournament.NotAManagerOrScorer` donde se habría admitido a un anotador.

`GET /api/v0/tournaments/{id}/permissions` dice qué papel tiene una clave en un torneo (consulta [qué puede hacer una clave](get-endpoints.md#permissions)), para que una aplicación pueda decir por qué se rechazaría una escritura antes de enviarla.

## Qué es una respuesta {#answers}

Una petición que crea algo se responde con `201` y el `id` de lo nuevo, que es su id completo, como lo dicen los puntos finales GET. Una petición que cambia algo que ya existe se responde con `204`, sin nada en el cuerpo. Una petición rechazada se responde como cualquier error (consulta [errores](index.md#errors)): con su `code`, en el que se apoya una aplicación, y con el `field` al que se refería, donde lo hubo.

Enviar una petición dos veces no es lo mismo que enviarla una: una partida añadida dos veces son dos partidas. Una aplicación a la que no se le dice si una petición llegó debería leer lo que cambió antes de volver a enviarla.

## Torneos {#tournaments}

### Crear un torneo {#create-tournament}

`POST /api/v0/tournaments`

Recibe `name`, `starts` y `finishes` (escritos como `2026-10-03T00:00:00Z`), `format`, `sport` (un código, consulta [los deportes](get-endpoints.md#sports)), `country` (un código como `au`) y, si quieres, `region`, `subtitle`, `levelTestsDrawn`, `national` e `international`, cada uno de los tres últimos `true` o `false`. Responde `201` con `id` y `address`, que es donde el sitio lo muestra.

### Archivar, restaurar o quitar el estatus destacado {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

`POST /api/v0/tournaments/{id}/remove-notable-status`

No reciben cuerpo y responden `204`. Quitar el estatus destacado, que dice que el torneo no es ni nacional ni internacional, es cosa de un administrador.

### Eliminar un torneo de prueba {#delete-tournament}

`POST /api/v0/tournaments/{id}/delete`

Es cosa de un administrador, que ha juzgado que el torneo es de prueba. Recibe `message`, que se les dice a los gestores del torneo, y `archive`, `true` para archivar también el torneo. Responde `204`.

### Añadir una nota de gestor {#notes}

`POST /api/v0/tournaments/{id}/notes`

Recibe `title` y `description`. Responde `201` con el `id` de la nota. Una descripción puede tener hasta 750 000 caracteres, y la petición puede ser tan grande como eso requiera.

## Las personas que tienen un papel en un torneo {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Hacen a alguien anotador o gestor. Reciben `emailAddress`, la dirección de correo electrónico de su cuenta, y responden `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Quitan a un anotador o a un gestor. No reciben cuerpo y responden `204`. El `account` es la parte del id de la cuenta que va después de `account/`.

## Competiciones {#competitions}

### Añadir una competición {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Recibe `kind`, uno de `block`, `swiss`, `knockout` o `losers-knockout`, y un `name`, y luego lo que tiene su tipo:

- Un bloque recibe `bestOf` y `rounds` (cuántas veces juega cada uno contra cada uno) y puede recibir `tieBreak`.
- Un suizo recibe `bestOf`.
- Una eliminatoria recibe `places` y `rounds`, una lista con el al mejor de cuántas de cada ronda, y puede recibir `losers`, una lista de eliminatorias de perdedores que se crean con ella, cada una con un `name` y una `round`.
- Una eliminatoria de perdedores recibe `from`, la competición cuyos perdedores toma, y la `round` de la que los toma.

Un bloque, un suizo y una eliminatoria también pueden recibir cómo se juegan y se cuentan: `handicap`, `drawsAllowed`, `worldRankings` y `advantage`, cada uno `true` o `false`, y `maximumHoops`, un número, o `null` para ningún máximo. Una competición que dice `advantage` se rechaza con `Advantage.NotOffered` mientras el sitio no ofrezca Advantage Golf Croquet. Responde `201` con el `id` de la competición.

### Añadir un test {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Un test es el partido entre dos equipos de un torneo por equipos. Recibe `firstTeam` y `secondTeam`, cada uno el id de un equipo después de `team/`, `starts` y `finishes`, `expectedMatches`, `bestOf`, `group` y las mismas reglas que puede recibir una competición. Responde `201` con su `id`, que es el de una competición.

### Mover, archivar o restaurar una competición {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

La suben o la bajan un lugar en la lista del torneo, o la archivan, o la restauran. No reciben cuerpo y responden `204`. Un test también se mueve, se archiva y se restaura con estos.

## Los jugadores de una competición {#competition-players}

### Inscribir a un jugador {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Inscribe en la competición a uno de los jugadores del torneo. Recibe `player`, la parte del id del jugador del torneo que va después de `tournament-player/`. Responde `201` con `id`, que es el id del jugador en la competición y no en el torneo.

### Inscribir a muchos jugadores {#enter-players}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/many`

Recibe `players`, una lista de jugadores del torneo como `player` más arriba, y `enterWhatCan`. Por defecto se inscribe a todos o a ninguno. Donde algunos no pueden inscribirse, la respuesta dice cuáles y no inscribe a nadie, para que el gestor pueda elegir; envía `enterWhatCan` como `true` para inscribir a los demás. Responde `201` con `ids`, en el orden en que se dieron los jugadores, y `refused`.

### Mover, retirar, reincorporar o quitar a un jugador {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Suben o bajan a un jugador un lugar, lo retiran, deshacen su retirada o lo sacan de la competición. El `player` es la parte de su id en la competición que va después de `competition-player/`. No reciben cuerpo y responden `204`.

Todo bye de una competición tiene el mismo id, así que un bye se distingue por `order`, un número entero que se añade a la dirección como `?order=2`. Cualquier otra cosa se rechaza con `Request.Invalid`.

## Las partidas de una competición {#games}

### Añadir una partida {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Recibe el `winner` y el `loser`, cada uno la parte del id de un jugador de la competición que va después de `competition-player/`, y los resultados. Los jugadores de un test no son suyos, así que en un test cada uno es el id completo de un jugador de uno de sus equipos, como `team-player/…`.

Los resultados son como los guarda la competición:

- `winnerScore` y `loserScore`, tal como se escribieron, como `26` o `26tp`.
- Para una competición que se juega como Advantage Golf Croquet, en su lugar, `winnerHoops`, `winnerTarget`, `loserHoops` y `loserTarget`: los aros que hizo cada lado y los aros a los que jugaba. Una `w` después de uno, como `"3w"`, dice que ese lado ganó donde las fracciones son iguales.

Una petición con el tipo de resultado que la competición no guarda se rechaza, con `Game.AdvantageScoreTyped` o `Game.HoopsAndTargetsNotAdvantage`. Responde `201` con el `id` de la partida.

### Corregir una partida {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Recibe los resultados como al añadir una partida y, donde cambiaron, `winner` y `loser`. Un jugador que no se envía es el que la partida ya tiene. El `game` es la parte de su id que va después de `game/`. Responde `204`.

### Mover, archivar, restaurar o retirar una partida {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Suben o bajan el resultado de un test un lugar, archivan una partida o la restauran, la retiran (se jugó y no cuenta) o deshacen su retirada. No reciben cuerpo y responden `204`. Estos, y los dos de arriba, son lo que puede hacer un anotador.

## Los jugadores de un torneo {#tournament-players}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Suben o bajan a uno de los jugadores del torneo un lugar, o lo archivan o lo restauran. El `player` es la parte de su id que va después de `tournament-player/`. No reciben cuerpo y responden `204`.

## Los equipos de un torneo {#teams}

### Añadir un equipo {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Recibe `name` y `shortName`, y puede recibir `flag`. Responde `201` con el `id` del equipo.

### Añadir un jugador a un equipo {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Recibe `name`, y puede recibir `worldRankingName`. Responde `201` con el `id` del jugador.

### Mover, archivar o restaurar un equipo {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

No reciben cuerpo y responden `204`.

### Mover, archivar o restaurar a un jugador de un equipo {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

El `player` es la parte de su id que va después de `team-player/`. No reciben cuerpo y responden `204`.
