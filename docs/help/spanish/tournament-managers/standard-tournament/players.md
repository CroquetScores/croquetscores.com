# Jugadores

La pestaña **Jugadores** de la página de un torneo es donde sus jugadores se inscriben, se corrigen, se ponen en orden y se apartan. Es la pestaña en la que se abre la página, porque inscribir a los jugadores es lo primero que se hace con un torneo.

Los jugadores se inscriben aquí una sola vez, en el torneo. En qué competiciones juega cada uno se elige después, en la página de cada competición, de entre los jugadores inscritos aquí. Véase [Inscribir jugadores en una competición](entering-players-in-a-competition.md).

![La pestaña Jugadores, con jugadores inscritos y uno archivado](images/players-tab.png)

## Añadir un jugador {#add-a-player}

Pulsa **Añadir jugador**, encima de la lista. Se abre un diálogo sobre la página.

![El diálogo Añadir jugador, rellenado](images/add-player-dialog.png)

**Nombre** es obligatorio. Es el nombre del jugador tal como se mostrará en todas las páginas, de entre 3 y 254 caracteres. Dos jugadores de un mismo torneo no pueden tener el mismo nombre, sea cual sea su uso de mayúsculas; cuando dos jugadores comparten nombre de verdad, distínguelos en el propio nombre, como "Andrew Hobbs (2)".

**Representa a** es aquello por lo que juega el jugador, escrito como lo diría un lector: un club, una región o un país, como "Canterbury Croquet Club". Se muestra entre paréntesis tras el nombre. Puede dejarse vacío. Según escribes, se ofrece lo que se ha añadido como representado por jugadores de cualquier torneo del sitio, donde una palabra suya empieza por lo que has escrito, para que un club se escriba como ya se ha escrito antes; la tecla de tabulación toma el que se muestra tras el cursor.

**Bandera** es la bandera que se muestra junto al nombre del jugador. Es una lista desplegable de los lugares por su nombre, con ninguna primero y después los lugares donde se juegan más torneos; escribe el comienzo de un nombre para ir a él. Puede dejarse en ninguna, como la mayoría de los jugadores. A qué representa un jugador y qué bandera lleva se guardan por separado, porque un jugador puede jugar por un club de un país y llevar la bandera de otro.

**Hándicap** es el hándicap del jugador, si tiene alguno: un signo, hasta dos cifras y una fracción de una cifra, como 4, +4 o -1.5. Se guarda como lo escribes, y se muestra entre paréntesis con aquello a lo que representa, antes de ello. Puede dejarse vacío.

**Nombre del jugador en el ranking mundial** es el nombre por el que el ranking mundial conoce al jugador. Se pide solo en un torneo de Croquet de asociación o de Croquet golf, los dos deportes de cuyos jugadores el ranking mundial lleva una lista. Los jugadores de American 6 Wicket son conocidos en el ranking por su propio nombre, así que ahí no se pide, y el nombre en el ranking mundial de cada jugador es siempre su nombre. Mientras añades a un jugador, sigue al nombre según lo escribes, porque la mayoría de los jugadores son conocidos en el ranking por su propio nombre, y deja de seguirlo en cuanto escribes en él. Si se deja vacío, se guarda como el nombre del jugador.

Según escribes un nombre, se ofrecen los jugadores que el ranking mundial conoce cuyos nombres empiezan así, para que puedas tomar un nombre tal como lo escribe el ranking en vez de teclearlo entero. Junto al nombre en el ranking mundial, una marca de verificación dice que el ranking conoce el nombre, y un signo de interrogación dice que no: puede que el nombre esté mal escrito, o que el jugador sea nuevo en el ranking. Es solo un aviso. Un nombre que el ranking no conoce se guarda igual que uno que sí.

Pulsa **Añadir**. El jugador se añade, el diálogo lo dice y sus campos se vacían para el siguiente, con el cursor de vuelta en el nombre. Añade toda la lista de este modo y después pulsa **Cancelar** para cerrar el diálogo. Cancelar no guarda nada que no estuviera ya añadido.

![El diálogo después de añadir un jugador](images/add-player-dialog-added.png)

Un jugador nunca se llama "Bye". Los byes de una eliminatoria se añaden en la propia eliminatoria, allí donde se inscriben sus jugadores, así que se rechaza un nombre que sea "Bye", o "Bye" con un número, como "Bye 2", "Bye-2" o "Bye (2)", y el diálogo explica por qué.

## Añadir varios jugadores {#adding-multiple-players}

Para añadir de una vez una lista entera, pulsa **Añadir jugadores**, junto a **Añadir jugador**. Se abre un diálogo sobre la página con un solo cuadro, que admite varias líneas de texto. Puedes copiar la lista de una hoja de cálculo y pegarla en el cuadro.

**La primera línea nombra los campos** (una lista cuya primera línea no nombra ninguno se rechaza, con «La primera línea debe contener los nombres de los campos»), separados por comas o por tabulaciones: **Name** y cualquiera de **Representing**, **Flag**, **Handicap** y **WorldRankingPlayerName**, en cualquier orden. Estos nombres se escriben en inglés, sea cual sea el idioma del sitio. **Name** debe ser uno de ellos. **Cada línea siguiente es un jugador**, con un valor para cada campo en el mismo orden, separados del mismo modo. Un jugador sin nada en un campo lo deja vacío, pero conserva la coma o la tabulación. Por ejemplo, con comas:

```
Name,Representing,Flag
Sam Someone,Canterbury Croquet Club,New Zealand
Alex Another,,England
```

- **Nombre, Representa a y Nombre del jugador en el ranking mundial** se rigen por las mismas reglas que al añadir un solo jugador (véase [Añadir un jugador](players.md#add-a-player)). Un nombre tiene entre 3 y 254 caracteres, no está ya en el torneo, sea cual sea su uso de mayúsculas, y no es "Bye".
- **Bandera** es el nombre del país o lugar, en tu idioma, tal como lo ofrece la lista del diálogo Añadir jugador, como Nueva Zelanda.
- **Hándicap** es un signo, hasta dos cifras y una fracción de una cifra, como 4, +4 o -1.5.
- Un jugador sin **WorldRankingPlayerName** es conocido por su nombre, como cuando se añade de uno en uno.
- **Comas o tabulaciones.** Las celdas copiadas de una hoja de cálculo están separadas por tabulaciones, y una lista escrita a mano suele estar separada por comas. Sirve cualquiera de las dos. Si la primera línea tiene una tabulación, toda la lista se lee con tabulaciones, y si no, con comas.
- Un valor que contiene el separador se escribe entre comillas dobles, como lo escribe una hoja de cálculo: "Smith, John" en una lista separada por comas. Una comilla dentro de un valor se escribe dos veces.
- A cada valor se le quitan los espacios de los extremos, y una línea sin nada se ignora.
- Una lista contiene como máximo 500 jugadores. Añade el resto en otra lista.

Pulsa **Añadir**. Toda la lista se comprueba antes de guardar nada, así que una lista con algo mal no añade a nadie. Lo que está mal se dice debajo del cuadro, en la línea donde está, contando la primera línea como línea 1. Se enumeran todos los fallos, no solo el primero, y lo que escribiste se queda para que puedas corregirlo. Una vez guardada la lista, el diálogo se cierra y la pestaña Jugadores muestra a los nuevos jugadores, en el orden en que los escribiste. A diferencia de **Añadir jugador**, que sigue abierto para el siguiente jugador, aquí no hay siguiente: la lista era el siguiente.

El **?** de la barra de título del diálogo lleva hasta aquí. Tanto este diálogo como Añadir jugador se quedan en la ventana estés donde estés en la página.

## Añadir una pareja {#adding-a-pair}

En un torneo de dobles, una pareja es un jugador por sí misma, así que se forma con dos jugadores ya inscritos en lugar de escribirla de nuevo. Pulsa **Añadir pareja**, junto a **Añadir jugador**. Se ofrece cuando hay dos jugadores entre los que elegir. Se abre un cuadro de diálogo con **Primer jugador** y **Segundo jugador**, cada uno elegido entre los jugadores en uso. La segunda lista deja fuera al jugador elegido primero, ya que un jugador no puede formar pareja consigo mismo. Pulsa **Añadir pareja** para formar la pareja. El cuadro sigue abierto, dice qué pareja se añadió y vacía las dos elecciones para poder formar la siguiente, como hace **Añadir jugador**. La pareja aparece enseguida en la lista que hay detrás del cuadro. Pulsa **Cancelar** cuando hayas formado todas las que necesitas.

![El cuadro de diálogo Añadir pareja, con dos jugadores elegidos](images/add-pair-dialog.png)

La pareja se llama según los dos jugadores, en el orden en que los elegiste: «Sam Someone & Alex Another». Cuando los dos tienen el mismo apellido, se llama por los dos nombres de pila y el apellido una sola vez: «Peter & Rosie Landrebe». El apellido es la última palabra de un nombre, con las palabras pequeñas que lo preceden (como en «van der Berg») y una generación que lo sigue (como en «Smith Jr»). Una generación sola no es un apellido.

La pareja representa lo que representan sus jugadores. Si solo uno de ellos representa algo, la pareja representa eso. Si los dos representan lo mismo, la pareja lo representa una vez. Si representan cosas distintas, la pareja representa las dos, primero la del primero y luego la del segundo, como «Canterbury Croquet Club / Melbourne».

Los dos jugadores se quedan como están y pueden seguir inscribiéndose en competiciones propias. Nada une después la pareja con ellos: si corriges o archivas a uno, la pareja conserva el nombre y la representación con que se formó, y se corrige por separado. La pareja se muestra con los demás jugadores, se inscribe en competiciones como cualquiera de ellos y se corrige o archiva como cualquiera de ellos. Se rechaza una pareja cuyo nombre ya tiene el torneo: los mismos dos jugadores en el mismo orden no pueden formar pareja dos veces. Los mismos dos en orden inverso son otro nombre y otra pareja.

## Corregir un jugador {#correcting-a-player}

Pulsa el nombre de un jugador, o su **Editar**, para abrir el mismo diálogo sobre ese jugador, titulado Editar jugador. Cambia lo que esté mal y pulsa **Guardar**, que guarda el cambio y cierra el diálogo. Un jugador cuyo nombre se corrige conserva el nombre en el ranking mundial que tenía, porque el ranking sigue conociéndolo por él. En American 6 Wicket el nombre de un jugador en el ranking mundial es siempre su nombre, así que corregir el nombre lo corrige también.

![El diálogo Editar jugador](images/edit-player-dialog.png)

Un jugador corregido aquí queda corregido en todas partes: en todas las competiciones en que está y en todas las páginas públicas.

## Poner en orden a los jugadores

Los jugadores se listan en el orden del torneo, que es el orden en que se ofrecen al inscribirlos en las competiciones y el orden en que se sortea una eliminatoria. **Subir** y **Bajar**, las flechas al final de cada fila, mueven a un jugador un puesto. Al primer jugador no se le ofrece Subir y al último no se le ofrece Bajar.

## Archivar un jugador {#archiving-a-player}

**Archivar** aparta a un jugador: inscrito por error, o retirado de todo el torneo. Un jugador archivado se lista bajo **Jugadores archivados**, tachado, después de los jugadores en uso, y ofrece solo **Restaurar**. Un jugador archivado no está en ninguna competición ni aparece en ninguna página pública.

Un jugador que ha jugado alguna partida no puede archivarse, porque sus partidas quedarían contra alguien que ya no está, así que a ese jugador no se le ofrece Archivar. Un jugador cuyas únicas partidas están archivadas sí puede.

Archivar a un jugador que no está en ninguna competición no pregunta antes, porque restaurarlo lo devuelve todo a su sitio. Archivar a un jugador que está en alguna competición pregunta antes, porque archivarlo lo quita de todas las competiciones en que está, y restaurarlo no lo devuelve a ellas.

![La pregunta que se hace antes de archivar a un jugador que está en competiciones](images/archive-player-asks.png)

Siguiente: [Competiciones](competitions.md).
