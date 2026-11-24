# Novedades

## Publicado el 2026-11-24

- **El resumen de un bloque dice también las partidas netas.** Donde los encuentros de un bloque son al mejor de más de una partida, su resumen dice victorias, derrotas, partidas netas y aros netos, ya que las partidas netas desempatan antes que los aros. Un bloque de partidas únicas dice victorias, derrotas y aros netos como antes. El resumen ya no dice cómo se clasifican sus jugadores.

- **La ficha de una competición en la barra de secciones es tan ancha como su nombre.** Un nombre corto como "Block A" tenía una ficha tan ancha como la de uno largo, y la barra se quedaba sin espacio antes de lo necesario.

- **En un teléfono las fechas de la página de inicio ocupan menos espacio.** La columna de las fechas es tan ancha como las fechas de un fin de semana, como "19-21 Nov", y los nombres tienen el resto. Las fechas que pasan de un mes al siguiente se parten antes del guion, de modo que la segunda línea empieza con él. En **Tus torneos recientes**, un torneo de este año no dice el año, y uno de otro año lo dice debajo de sus fechas.

### Para desarrolladores de aplicaciones

- **Una aplicación puede cambiar cosas, con una clave hecha para escribir.** Lo que cambian las propias páginas del sitio lo cambian las mismas direcciones de `/api/v0`: hacer un torneo, sus competiciones, jugadores, equipos y partidas, y quién puede gestionarlo y anotar los resultados. Una clave puede hacer lo que puede hacer la cuenta para la que se hizo, y la clave de un anotador puede hacer lo que se hace con los resultados y nada más. **Los puntos finales POST de la API**, en la ayuda, dicen qué recibe y qué responde cada dirección. Aún se están asentando, y algunos se quitarán.

- **Una aplicación puede preguntar qué puede ser un torneo.** Los deportes, los formatos y los países con sus regiones están en `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` y `/api/v0/countries`, en el idioma que pida la aplicación, de modo que aquello con lo que hace un torneo es lo que ofrece el sitio.

- **Una aplicación puede leer los jugadores del ranking mundial y sus partidas.** Los jugadores de Association Croquet que conocen los rankings mundiales están en `/api/v0/ac/world-ranking-players`, y las partidas de cada jugador, en el orden en que se añadieron, en la dirección que dice el jugador. Los nombres se actualizan desde los rankings cuando la lista se pide desde el principio, como mucho una vez por hora.

- **Los puntos finales de la API son dos páginas en la ayuda, una para los puntos finales GET y otra para los puntos finales POST,** en todos los idiomas.

### Responsables del ranking mundial

- **Un jugador de los rankings de Association Croquet se guarda por el número que le dan los rankings.** Un jugador al que los rankings cambian el nombre es el mismo jugador, el que sale de la lista se archiva y no se olvida, y el que vuelve a figurar deja de estar archivado. Una lista que da un nombre a dos jugadores, o un número a dos nombres, se rechaza entera y no se cambia nada, y se avisa al administrador por correo electrónico.

## Publicado el 2026-11-22

- **La página de inicio recuerda los torneos que has mirado hace poco.** Al abrir un torneo, pasa a ser el primero en **Tus torneos recientes**, entre el filtro y los resultados recientes, hasta cinco, para que puedas volver a los que sigues sin buscarlos en las listas. Se guardan en tu propio dispositivo, en una cookie que solo contiene las direcciones de los torneos, y la lista no se muestra hasta que hayas abierto uno. La ayuda dice qué es la cookie.

- **Los próximos torneos incluyen los que empezaron en los últimos dos días.** Un torneo que ha empezado y no ha terminado se muestra hasta el día en que termina, siempre que empezara hace dos días como máximo, de modo que en los días en que se juega se puede encontrar antes de que nadie haya anotado una partida en él. Los que empezaron hace más tiempo están en los resultados recientes cuando se añade una partida.

- **Una eliminatoria dice a cuántas partidas son los partidos de cada ronda.** Encima de cada ronda en el cuadro de una eliminatoria, y debajo del nombre de cada ronda en su resumen, aparece "Al mejor de 3", o lo que el gestor del torneo haya elegido para esa ronda.

- **Un resultado cabe en su casilla en el resumen de una eliminatoria, y un nombre se mantiene unido en el resumen de un bloque.** En una pantalla estrecha, un resultado Advantage escrito como "83% (5/6)" se salía de su casilla por encima de los nombres, y un nombre en el resumen de un bloque podía cortarse después del nombre de pila. Una pareja se mantiene unida a cada lado del símbolo &.

- **Puedes poner el sitio en la pantalla de inicio de tu teléfono.** Un botón en el pie de página lo ofrece cuando tu navegador puede, y **Añadir el sitio a tu pantalla de inicio** en la ayuda dice cómo, para un iPhone y para un teléfono Android. Croquet Scores y Gateball Scores tienen cada uno un icono, para que puedas distinguirlos.

- **Se listan las regiones de croquet de Nueva Zelanda.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury y las demás regiones en que se dividen los torneos nacionales de Nueva Zelanda se pueden elegir como la región de un torneo.

### Para desarrolladores de aplicaciones

- **Hay una API pública.** Una aplicación puede leer los torneos de un año, un torneo con sus competiciones y jugadores, las partidas y la clasificación de una competición, los torneos que han cambiado de año y los torneos que se han archivado, como JSON, en `/api/v0`. Es `v0` mientras está en desarrollo. Cualquiera puede leer, y una aplicación que envía una clave creada en **Claves de API** en tu cuenta tiene un límite propio, al principio 60 peticiones por minuto y 10.000 por día. Una aplicación sin clave comparte un límite según su dirección, 10 por minuto y 500 por día.

- **Una clave permite que una aplicación actúe por ti sin tu contraseña.** Crea una clave en tu cuenta, di para qué es y revócala cuando ya no quieras que se use. Una clave se puede crear solo para leer, o para leer y escribir, y se puede limitar a un torneo. Por ahora la API solo lee. Solo se guarda un hash de la clave, así que la clave se muestra una vez, cuando la creas.

- **Se pueden añadir campos a una respuesta sin una versión nueva.** Una aplicación debe ignorar un campo que no conoce. Un cambio que rompería una aplicación se hace como una versión nueva junto a la antigua, de modo que una aplicación escrita para `v1` sigue funcionando cuando llegue `v2`. **Ayuda para desarrolladores de aplicaciones** y **Los puntos de acceso de la API** en la ayuda dicen qué acepta y qué responde cada dirección, en todos los idiomas.

- **Un hándicap en la API es un número.** Es `4.5` y no `"4.5"`, y `null` cuando un jugador no tiene ninguno.

### Responsables del ranking mundial

- **Una segunda hoja de cálculo de partidas de Golf Croquet tiene el día en que se anotó cada una.** Añade `rankings2` a la dirección, donde está `rankings`, y la columna I dice el día en que se anotó cada partida, como una fecha de Excel, en la hora del lugar donde se juega el torneo. La pestaña Rankings la ofrece como **Descargar partidas para el ranking internacional con la fecha de la partida**. La primera hoja es como era, porque el programa de los responsables la lee por posición.

## Publicado el 2026-11-15

- **Una pareja de dobles es un solo jugador en la búsqueda, sea cual sea de los dos jugadores el que se nombre primero.** "Sam Someone & Alex Another" y "Alex Another & Sam Someone" eran dos entradas en la página de jugadores, y también lo eran "Peter & Rosie Landrebe" y "Rosie & Peter Landrebe". Ahora son una sola, en una sola dirección, listada con el nombre que escribió el torneo más reciente.

- **Una pareja de dobles puede escribirse con una barra, con un signo más o con la palabra inglesa "and", y no solo con "&".** "Sam Someone / Alex Another", "Sam Someone + Alex Another" y "Sam Someone and Alex Another" se leen todos como una pareja. La palabra "and" solo cuenta cuando está sola, así que un nombre como "Sam Anderson" no se toma por una pareja.

- **Una pareja se dice de forma abreviada en los resultados del suizo y en las tablas de los grupos.** Un resultado del suizo daba la inicial del nombre del primer jugador y el apellido del segundo. Ahora dice a cada jugador, como "T. Murphy & A. Sharpe", y un apellido que comparten ambos se dice una sola vez, como "R. & P. Landrebe". Las columnas de la tabla de un grupo se titulan con las iniciales de cada jugador unidas por "&", como "TM&AS", o "RL&PL" si comparten apellido.

- **Guatemala figura con los países donde nadie ha jugado últimamente.** Antes aparecía con los países donde se han jugado torneos desde 2025.

- **El sitio cuenta cuántos lectores llegan y qué páginas leen.** Lo hace con el análisis web de Cloudflare, en cada página que ven los lectores. Las páginas en las que trabajan los gestores no se cuentan. No usa cookies y no identifica al usuario de ninguna otra manera que no sea su dirección IP.

- **Los torneos se publican como archivos que cualquiera puede usar.** Cada torneo público, de croquet y de gateball, se escribe en un archivo propio, con sus jugadores y competiciones, o sus equipos y tests donde se juega por equipos, con las partidas retiradas incluidas y dichas como retiradas. Se guardan en un repositorio de Git, `CroquetScores/data.croquetscores.com`, que se actualiza cada hora, de modo que puedes clasificar los resultados o construir algo con ellos, y una corrección aparece como un cambio con fecha. Ninguna cuenta, dirección de correo electrónico, nota ni comentario está en un archivo, ni nada archivado o de un sitio de prueba.

### En caso de emergencia

- **Hay una página para quien tenga que hacerse cargo del sitio.** Si quien lleva el sitio no puede, porque está enfermo o ausente mucho tiempo, cualquiera que haya iniciado sesión puede abrir **In case of emergency** en la administración, decir quién es y por qué se hace cargo, y pulsar **Send**. Tras una confirmación, lo que dijo se envía por correo electrónico a las personas que conocen la contraseña de la nota con todo lo que el sitio necesita, y las respuestas van a quien lo envió. Una cuenta puede pedirlo una vez cada 48 horas y se le dice cuándo podrá pedirlo de nuevo. La página se abre con una advertencia de que no se use salvo que se haya enviado un correo electrónico al administrador y no haya respondido en 48 horas, y de que no se pruebe. En cuanto se envía el mensaje, la página lo dice y no pide nada más.

## Publicado el 2026-11-11

- **El menú del teléfono se cierra al pulsar fuera de él.** El menú que se abre con el botón de la parte superior de una pantalla estrecha se cierra cuando pulsas en cualquier otro lugar de la página, además de cuando vuelves a pulsar el botón o sigues un enlace.

- **El menú de la cuenta se cierra al pulsar fuera de él.** La persona que aparece al final del encabezado, que se abre con Registrarse, Iniciar sesión y el resto, se cierra cuando pulsas en cualquier otro lugar de la página, además de cuando vuelves a pulsarla.

- **Pellizca y separa los dedos para cambiar el tamaño del texto.** En una pantalla táctil, pellizca con dos dedos para hacer el texto más pequeño y sepáralos para hacerlo más grande, hasta un tamaño entre la mitad y el doble del habitual. A diferencia del zoom del propio navegador, la página sigue teniendo el ancho de la pantalla, así que nunca tienes que desplazarte hacia los lados para leer una línea. El tamaño se conserva, de modo que es el mismo en todas las páginas y en todas las visitas. Un dedo sigue desplazando la página como antes.

- **El menú del teléfono se desplaza.** En una pantalla baja, el menú no es más alto que la pantalla y se desplaza dentro de ella, de modo que se puede llegar a todos los elementos, y la página de detrás se queda donde estaba hasta que se cierra el menú.

- **Pedro Echeguren ha mejorado el español.** Pedro revisó las palabras del sitio en español y las corrigió. Gracias, Pedro.

## Publicado el 2026-11-10

Croquet Scores se ha reescrito por completo. Espero que te guste la nueva versión.

### Encontrar cosas

- **Buscar.** Todas las páginas tienen un cuadro de búsqueda en la parte superior. Escribe un nombre y pulsa Buscar para encontrar torneos, competiciones y jugadores.

- **Filtrar los torneos por país, estado o provincia, y deporte.** En la página de inicio, elige un país para ver solo los torneos que se juegan en él. Una vez elegido un país, puedes elegir uno de sus estados o provincias, y también un deporte. Tu teléfono u ordenador recuerda lo que elegiste y empieza desde ahí la próxima vez. **Al elegir un estado o provincia solo se encuentran los torneos nuevos.** Los más antiguos no tenían estado ni provincia, así que al elegir uno se dejan fuera.

- **Filtrar los torneos por días.** Indica un primer día y un último día, juntos, y solo se muestran los torneos que empiezan entre ellos. Ambos días están incluidos.

- **La página de un año muestra sus meses.** Cada mes aparece cerrado, con el número de torneos que empiezan en él. Pulsa un mes para abrir sus torneos, y abre todos los que quieras. **+ Mostrar todo** abre todos los meses.

- **Las listas largas se dividen en páginas.** Una lista de torneos muestra cien a la vez, así que una búsqueda amplia ya no carga todas las filas de golpe.

- **La ayuda encuentra una respuesta por lo que quieres decir.** Haz una pregunta en el cuadro de búsqueda de la primera página de la ayuda y encontrará el artículo aunque use otras palabras con el mismo significado. La primera página también ofrece preguntas populares y los temas en tarjetas.

### Seguir un torneo

- **Notas de los gestores.** Los gestores de un torneo ahora pueden escribir notas para contar a sus jugadores lo que necesitan saber mientras se juega: el formato, un cambio en el orden de juego, la hora del almuerzo. Están en la nueva sección Notas del torneo, con las más recientes primero y el tiempo que hace que se escribió cada una.

- **Un asterisco (\*) marca lo que no has leído.** Una nota lo lleva hasta que la abres, y de nuevo si se modifica después de que la leas. Mientras haya alguna nota sin leer, la sección Notas también lo lleva, en todas las páginas del torneo, así puedes ver que hay novedades sin ir a mirar. Las crónicas se marcan de la misma manera. Tu navegador recuerda lo que has leído, así que no necesitas iniciar sesión. Otro teléfono u ordenador empieza sin nada leído.

- **La crónica es más fácil de seguir.** En el sitio anterior, cada comentario nuevo llevaba la página hasta el final, y quien estaba repasando comentarios anteriores perdía el lugar. Ahora la página solo baja hasta un comentario nuevo si ya estás al final, leyendo lo último. Si has subido para leer comentarios anteriores, te deja donde estás.

- **Un bloque muestra el puesto de cada jugador.** La última columna da el puesto de cada jugador: 1, o =2 cuando no se puede desempatar a los jugadores y comparten el segundo. Cuando los jugadores empatan en los partidos ganados, una línea debajo explica cómo se desempató.

- **El orden de juego se puede ordenar.** Pulsa Partida para ordenar las partidas por el nombre del ganador, o Fecha para ordenarlas por cuándo se añadió cada una. Vuelve a pulsar para invertir el orden. El sitio recuerda cómo ordenaste, en todas las competiciones y también en las listas de torneos, y un enlace debajo de la lista, Volver al orden habitual, lo olvida.

- **Se muestran los hándicaps.** Cuando un jugador tiene hándicap, aparece después de su nombre, junto con lo que representa, como en Tim Murphy (4, Australia).

- **Una competición indica a cuántos aros se juegan sus partidas** cuando no es lo habitual en su deporte, como "Se juega a 14 aros".

### El sitio

- **Tu idioma.** El sitio está ahora en doce idiomas: afrikáans, árabe (Egipto), checo, inglés, alemán, griego, letón, noruego, portugués, español, sueco y galés. Se te muestra el primer idioma que pide tu navegador y que el sitio tiene, o inglés si no tiene ninguno. Para elegir otro, usa la lista del pie de página, al final de cualquier página, y pulsa el botón que hay junto a ella. Si quieres que se añada un idioma, escribe a <croquetscores@gmail.com>.

- **Claro u oscuro.** También en el pie de página: elige Claro, Oscuro o Del sistema. Del sistema sigue a tu teléfono u ordenador. El sitio recuerda tu elección en todas las páginas y en todas las visitas.

- **Qué versión tienes.** El pie de página ahora muestra la versión del sitio que estás viendo, como v234. Si informas de un problema, indica por favor de qué versión se trataba.

- **Tus datos.** La página /data-deletion-policy explica cómo hacer que se borre lo que el sitio guarda sobre ti, qué se borra y qué se conserva.

### Código abierto

El código ahora es de código abierto, bajo la Licencia Pública General de GNU Affero versión 3 (AGPL-3.0). Cualquiera puede leerlo, usarlo y modificarlo, y quien ejecute una versión modificada como sitio web debe compartir sus cambios con la misma licencia.
