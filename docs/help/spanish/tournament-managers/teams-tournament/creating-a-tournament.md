# Crear un torneo

Pulsa **Nuevo torneo**, encima de la lista de torneos de la administración. Está encima de la lista y no debajo para que una lista larga no lo saque de la pantalla de un teléfono.

![El formulario de nuevo torneo, rellenado para un torneo por equipos](../../../english/tournament-managers/teams-tournament/images/new-tournament.png)

El formulario pide todo aquello con lo que empieza un torneo. Lo que más importa aquí es el **Formato**, que es lo que hace que un torneo sea por equipos.

## Lo que pide el formulario

**Nombre.** Lo que buscan los lectores para encontrar el torneo, como "Trans-Tasman Tests". Tiene entre 3 y 254 caracteres. Un nombre todo en minúsculas, o todo en mayúsculas, se rechaza, porque parecería un error en cada página en que se muestre. Dos torneos pueden tener el mismo nombre, ya que el mismo torneo se juega cada año.

**Empieza** y **Termina.** Los días en que se juega el torneo. Todos los tests se juegan dentro de ellos, así que ponlos de modo que cubran todo el evento. Un torneo no puede terminar antes de empezar, ni empezar o terminar después del final del año que viene. Un torneo pertenece al año en que empieza, que es también el año de su dirección.

**Formato.** Elige uno de los formatos por equipos:

- **Por equipos** es el formato general para cualquier evento entre equipos.
- **Eire Cup**, **Interstate Shield** y **GC World Team Championship** son eventos concretos, cada uno guardado como formato propio para que pueda llevarse como se lleva ese evento.

Estándar es el único formato que no es por equipos, y no es el que quieres aquí. Gateball Scores no ofrece formato, ya que todos sus torneos son torneos estándar de gateball; un torneo por equipos se crea en Croquet Scores.

**Deporte.** Los deportes que ofrece el sitio web, en su orden: Croquet Asociación, Golf Croquet, Croquet americano de 6 aros y Ricochet.

**País** y **Región.** Dónde se juega el torneo. La región se pide solo cuando el país que eliges está dividido en regiones, como los estados de Australia, y ni siquiera entonces hace falta elegirla.

**Subtítulo.** Lo que quieras que sepan los lectores y no tiene campo propio: dónde aparcar, a qué hora se come, a quién llamar. Se muestra bajo el nombre del torneo en todas las páginas públicas. Se escribe en Markdown, así que una palabra se pone en negrita con asteriscos alrededor y una lista se hace con un guion al principio de cada línea. Puede tener hasta 2000 caracteres, y puede dejarse vacío.

**Jugado con hándicap.** Márcalo para un evento con hándicap.

**Permite empates.** Márcalo cuando una partida pueda acabar sin que ninguno de los dos jugadores gane. Si está marcado, un resultado introducido con los puntos igualados y sin marca se guarda como empate; si no lo está, una partida con los puntos igualados tiene que decir quién ganó mediante una marca tras los puntos del ganador, como "6w".

**Los tests igualados son empate.** Se pregunta solo una vez elegido un formato por equipos. Un test lo gana el equipo que gana más de sus partidos, y uno igualado en partidos se decide por partidas netas, y después por aros netos, a menos que esto esté marcado, en cuyo caso un test igualado en partidos es empate, como lo tienen algunos eventos por equipos. Empieza sin marcar para Por equipos, y marcado para el GC World Team Championship, que siempre ha dado por empatado un test igualado.

**Cuenta para el ranking mundial.** Se pregunta solo cuando puede contar: un torneo de Croquet Asociación o de Golf Croquet que ni se juega con hándicap ni permite empates. Empieza marcado.

**Evento de nivel nacional** y **Evento de nivel internacional.** Un torneo puede ser lo uno, lo otro o ninguno, pero nunca ambos: marcar uno desmarca el otro.

## Crearlo

Pulsa **Crear torneo**. Se te lleva a la página del torneo en la administración, abierta en su pestaña Equipos, y eres su primer gestor. Queda listado en la administración bajo el año en que empieza.

![Un torneo recién creado, todavía sin equipos](../../../english/tournament-managers/teams-tournament/images/tournament-page-empty.png)

La dirección pública del torneo se forma con su año, su deporte y su nombre, como `/2026/ac/trans-tasman-tests`. Conserva esa dirección cuando más adelante se corrige su nombre, para que un enlace ya enviado siga encontrándolo; solo se mueve cuando cambia el año en que empieza o su deporte.

## Si algo se rechaza

Lo que se rechaza se dice bajo el campo al que se refiere, y lo que has escrito sigue escrito. No se guarda nada hasta que se acepta cada campo. Lo que más a menudo se rechaza es un nombre escrito todo en minúsculas, un final anterior al comienzo y un país sin elegir.

Siguiente: [Equipos](teams.md).
