# Novedades

## Publicado el 2026-10-29

### Encontrar cosas

- **Escribe un país, una región o un deporte.** Los campos que acotan los torneos, en la página de inicio y en la página de un año, ahora son cuadros en los que escribes, no listas por las que desplazarte. Escribe parte de un nombre, como Zela, y se sugieren los nombres que la contienen. Pulsa la flecha del final del cuadro, o la tecla de flecha hacia abajo, para ver todos los nombres, de cinco en cinco y con el resto para desplazarse. Pulsa una sugerencia, o muévete con las teclas de flecha y pulsa Intro, para elegirla. Un cuadro vacío significa cualquiera. Las palabras que no son el nombre de un país o de un deporte no pueden quedarse en el cuadro: se te pide que elijas uno, y la tecla Escape devuelve el que tenías.
- **La página de un jugador mantiene las fechas de cada torneo en una línea.** En un teléfono, las fechas de los torneos de la página de un jugador se partían en dos líneas. Ahora se quedan en una, y lo que se parte es el nombre del torneo.

### Gestionar un torneo

- **Elige el país, la región y el deporte escribiendo.** El formulario que crea o cambia un torneo los pide en los mismos cuadros. Un torneo necesita un país y un deporte, así que se te pide que elijas uno antes de poder salir de cualquiera de los cuadros o enviar el formulario. Corregir las palabras del país ya no hace perder la región que habías elegido. Elegir otro país sí la borra.
- **Las banderas también se escriben.** La bandera de un jugador o de un equipo se elige de la misma manera. Deja el cuadro vacío si no quieres bandera.
- **Se sugiere lo que representa un jugador.** Mientras escribes lo que representa un jugador, se sugieren los clubes y países por los que se han añadido jugadores, en cualquier torneo y en cualquier deporte. Escribe dos letras para empezar. Se sugieren como máximo diez, por orden alfabético, y un nombre que solo se diferencia en las mayúsculas se sugiere una vez, tal como se escribió la primera vez. No se miran los jugadores archivados ni los de un equipo.
- **La ayuda explica las rondas de un grupo.** **Rondas** es cuántas veces se enfrenta cada pareja de jugadores de un grupo, con un partido en cada ronda. Empieza en 1, que es lo que casi siempre necesita un grupo. Súbelo solo para un grupo en el que se vuelven a enfrentar, como en una doble liguilla. La página de las competiciones lo explica, y un grupo y un suizo ahora tienen una sección cada uno.

### Torneos traídos de los sitios antiguos

- **Se quitan más hándicaps del nombre para la clasificación mundial.** El número que va después del último espacio del nombre de un jugador en los sitios antiguos, entero o con decimales como 5.5 o 5,5, con signo más o menos o sin él, ya no se toma por parte del nombre al buscar su clasificación mundial. Lo mismo vale para un hándicap después de un punto y coma, como en Tim Murphy; 5.5. Dos números al final, como en Tim Murphy 3 5, se dejan, porque no hay forma de saber cuál se quiso decir, y también se deja un nombre que es solo un número.

## Publicado el 2026-10-28

### Encontrar cosas

- **Los resultados de búsqueda son tablas.** Los torneos y las competiciones que encuentra una búsqueda ahora se presentan como las listas de la página de inicio: los días en que se jugó cada uno, el tipo de deporte, la bandera de su país y el nombre. Una competición muestra los días, el tipo de deporte y la bandera de su torneo, y el torneo en el que está. Las fechas y los nombres se pueden ordenar, cada tabla por separado, y el orden queda en la dirección de la página junto a lo que escribiste. Ordenar solo reordena los cien resultados que se muestran, que son los que mejor coinciden con tus palabras, no todos los que coinciden.
- **Los países con más actividad van primero.** Allí donde elijas un país, la lista ahora empieza por Australia, Egipto, Inglaterra, Nueva Zelanda, España y Estados Unidos, luego los demás países en los que se han jugado torneos desde 2025, y después todos los demás, con una línea entre los tres grupos.
- **Cada torneo muestra su deporte.** En una tableta o una pantalla más ancha, las listas de torneos de la página de inicio y de la página de un año muestran el deporte del torneo como un código corto, como GC o AC, con un color propio para cada deporte, después de las fechas. En un teléfono se omite el código para dejar espacio a los nombres.
- **Página de inicio.** Los próximos torneos de la página de inicio ahora están debajo de los resultados recientes en cualquier ancho de pantalla.
- **Las banderas ya no abarrotan el teléfono.** En un teléfono, la columna de banderas se omite en todas las listas de torneos, para que los nombres tengan más espacio.
- **La lista de países se mantiene abierta en Chrome en Linux.** Al pulsar el campo del país en la página de inicio, la lista se abría y se cerraba enseguida. Ahora se mantiene abierta y se desplaza.

### Seguir un torneo

- **Hándicaps.** Los gestores de un torneo ahora pueden dar un hándicap a un jugador, como 4, +4 o -1.5. Se muestra después del nombre del jugador, con lo que representa si hay algo, como en Tim Murphy (4, Australia).
- **Peeling en la cuadrícula suiza.** Un resultado en la cuadrícula suiza ahora termina con el peeling de la partida, como ya hace el archivo de texto de las clasificaciones. Una partida ganada por 26tp a 17 se lee +9tp para el ganador y -9tp para el perdedor. Una partida sin peeling se lee como antes.

### Torneos traídos de los sitios antiguos

- **Más torneos están en el país correcto.** Muchos torneos llegaron con el país equivocado, porque los sitios antiguos solo conocían la zona horaria. Ahora el sitio lee el país en el nombre de un torneo cuando puede, como Irish, Welsh, Bayfield o CroqCan, y pone cada partido de Inglaterra contra Escocia en el país que fue anfitrión ese año. Gracias a Chris Williams por su ayuda con esto.
- **Se traen los torneos que aún no se han jugado** aunque sus gestores todavía no hayan añadido una competición, para que puedas encontrar cuándo y dónde se juegan.
- **Un hándicap después del nombre de un jugador** en los sitios antiguos, como en Tim Murphy 1, ya no se toma por parte del nombre al buscar su clasificación mundial.

## Publicado el 2026-10-27

Croquet Scores se ha reescrito por completo con IA, en TypeScript. Esto es lo que vas a notar.

### Encontrar cosas

- **Buscar.** Todas las páginas tienen un cuadro de búsqueda arriba. Escribe un nombre y pulsa Buscar para encontrar torneos, competiciones y jugadores. Los resultados salen en tres listas, y una lista vacía se omite. Si hay más de cien de un mismo tipo, la página lo dice, y añadir una palabra a tu búsqueda la acota.
- **Acota los torneos por país, región y deporte.** En la página de inicio, elige un país para ver solo los torneos que se juegan en él. Una vez elegido un país, puedes elegir un estado o provincia de ese país, y también un deporte. Lo que elijas queda en la dirección de la página, así que puedes guardarla en favoritos o enviársela a alguien, y el botón de retroceso lo deshace. **Elegir un estado o provincia solo encuentra torneos nuevos.** Los más antiguos no tienen estado ni provincia, así que al elegir uno se dejan fuera.

### Seguir un torneo

- **Notas de los gestores.** Los gestores de un torneo ahora pueden escribir notas para decir a los jugadores lo que necesitan saber mientras se juega: el formato, un cambio en el orden de juego, la hora de la comida. Están en la nueva sección Notas del torneo, con las más recientes primero y el tiempo que hace que se escribió cada una.
- **Un asterisco (\*) marca lo que no has leído.** Una nota lo tiene hasta que la abres, y de nuevo si se modifica después de que la leas. Mientras haya una nota sin leer, la sección Notas también lo tiene, en todas las páginas del torneo, así ves que hay novedades sin ir a mirar. Los comentarios se marcan de la misma manera. Tu navegador recuerda lo que has leído, así que no necesitas iniciar sesión. Otro teléfono u ordenador empieza sin nada leído.
- **Los comentarios son más fáciles de seguir.** En el sitio antiguo, cada comentario nuevo llevaba la página hasta el final, y quien repasaba comentarios anteriores perdía el sitio. Ahora la página solo baja hasta un comentario nuevo si ya estás al final, leyendo el último. Si has subido para leer comentarios anteriores, te deja donde estás.

### El sitio

- **Tu idioma.** El sitio ahora está en diecisiete idiomas: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska y Cymraeg. Se te muestra el primer idioma que pide tu navegador y que el sitio tiene, o inglés si no tiene ninguno. Para elegir otro, usa la lista del pie de página, al final de cualquier página, y pulsa el botón que hay junto a ella. Si quieres que se añada un idioma, escribe a <croquetscores@gmail.com>.
- **Claro u oscuro.** También en el pie de página: elige Claro, Oscuro o Sistema. Sistema sigue a tu teléfono u ordenador. El sitio recuerda tu elección en todas las páginas y en cada visita.
- **Qué versión estás usando.** El pie de página ahora muestra la versión del sitio que estás viendo, como v234. Si informas de un problema, indica por favor de qué versión era.

### Código abierto

El código ahora es de código abierto, con la Licencia Pública General de GNU Affero versión 3 (AGPL-3.0). Cualquiera puede leerlo, usarlo y modificarlo, y quien ponga en marcha una versión modificada como sitio web debe compartir sus cambios con la misma licencia.
