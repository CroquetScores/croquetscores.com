# Novedades para los gestores de torneo

## Publicado el 2026-10-23

Estos son los cambios principales desde la última versión. Cada uno enlaza con la pull request que lo hizo.

- **El hándicap, los resultados con empate y los rankings mundiales se fijan en cada competición.** Antes los decidía el torneo, así que un torneo no podía tener un grupo con hándicap junto a otro sin él, ni un test que admita empate junto a una eliminatoria que no lo admite. Ahora cada competición, y cada test, pide los tres al añadirse o editarse, y el formulario del torneo ya no los pide. El último se pide solo donde el deporte tiene rankings mundiales, y una competición que no cuenta se deja fuera del archivo de rankings. Consulta [Competiciones](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **La lista de torneos de la administración se puede acotar por país, región y deporte.** Las opciones quedan en la dirección, de modo que se puede enlazar una lista filtrada, y solo se ofrece lo que contiene tu lista. La región se ofrece cuando se ha elegido un país. Los torneos anteriores a noviembre de 2026 no tienen región, así que al elegir una se ocultan, y las listas públicas lo dicen. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Los responsables del ranking mundial son ahora un rol para cada deporte.** Un responsable de croquet de asociación ve y se ocupa de los torneos de croquet de asociación, y uno de croquet golf, de los de croquet golf. Un torneo que gestionas o en el que anotas sigue en tu lista sea cual sea su deporte. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **La pestaña Rankings explica el archivo en un párrafo, sea cual sea el deporte,** con el enlace de descarga debajo. Consulta [Rankings](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **El nombre de un torneo no puede estar todo en minúsculas ni todo en mayúsculas,** y el mensaje ahora lo dice como una regla. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Quitar es una papelera** en las pestañas de gestores y anotadores, en los jugadores de la competición y en la página de cuentas del administrador, como ya lo eran Archivar y Eliminar. Al señalarla sigue llamándose Quitar, y un lector de pantalla sigue leyéndola como Quitar. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Todos los idiomas tienen palabras nuevas.** Las palabras del sitio en los otros dieciséis idiomas se han escrito de nuevo, y la ayuda se ha puesto al día con ellas. La ayuda para lectores y para cuentas, y los términos de uso, también están ya en todos los idiomas. Ninguno ha sido leído aún por un hablante nativo, así que cuéntanos lo que suene mal. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Entre bastidores.** La importación de los sitios antiguos asigna algunas zonas horarias y otro país a un torneo ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), y carga un volcado en el servidor y crea los modelos de lectura con un script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). El sitio se despliega con un script, desde un ordenador o desde GitHub, y ya no en cada fusión ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Publicado el 2026-10-19

Estos son los cambios principales para quienes organizan torneos. La [ayuda para los gestores de torneo](../tournament-managers/index.md) tiene todos los detalles.

- **Los jugadores se introducen una sola vez, en el torneo.** En el sitio antiguo, los jugadores se añadían dentro de cada competición. Ahora la pestaña **Jugadores** del torneo es donde los añades, corriges, ordenas y archivas, y un jugador corregido ahí queda corregido en todas las competiciones en las que está y en todas las páginas públicas. Consulta [Jugadores](../tournament-managers/standard-tournament/players.md).

- **Los jugadores se incluyen en una competición desde una lista.** En la página de una competición, elige un jugador del torneo en el menú desplegable y pulsa **Añadir jugador**. El menú ofrece solo los jugadores que aún no están en la competición. En una eliminatoria ofrece también **Bye** para las plazas que sobran. Consulta [Inscribir jugadores en una competición](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Un solo botón añade una competición.** En lugar de los botones separados de nuevo grupo, nuevo suizo y nueva eliminatoria, pulsa **Añadir competición**. El cuadro de diálogo pide el nombre y el tipo (un grupo, una eliminatoria o un suizo), y luego lo que ese tipo necesita: al mejor de cuántas partidas es cada partido y, en una eliminatoria, las plazas de su cuadro. Se queda abierto para que puedas añadir varias a la vez. El tipo de una competición no se puede cambiar después: archívala y añádela de nuevo. Consulta [Competiciones](../tournament-managers/standard-tournament/competitions.md).

- **Notas de los gestores: úsalas en lugar de los comentarios para decir a los jugadores lo que necesitan saber.** El formato, un cambio en el orden de juego, la hora de la comida. Una nota se escribe en la pestaña **Notas** del torneo, con un título y una descripción en Markdown, y puedes verla en vista previa antes de añadirla. Los jugadores encuentran las notas en la página pública Notas del torneo. Una nota que no han leído se marca con un asterisco, y también la sección Notas en todas las páginas del torneo, hasta que la abran. Una nota que edites se marca de nuevo para todos los que ya la habían leído. Consulta [Notas](../tournament-managers/standard-tournament/notes.md).

- **Las notas del torneo del sitio antiguo ahora son el Subtítulo.** Lo que escribiste ahí se conserva como subtítulo del torneo, y se sigue mostrando bajo el nombre del torneo en todas las páginas públicas. Se escribe en Markdown y puede tener hasta 2000 caracteres. Sirve para lo que los lectores deben saber en cualquier página en la que estén. Usa una nota para las novedades que cambian a medida que avanza el torneo.
