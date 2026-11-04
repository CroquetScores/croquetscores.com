# Rankings

Cuando una competición cuenta para el ranking mundial, sus resultados se envían al ranking como un archivo, que el sitio escribe a partir de lo que has introducido. La pestaña **Rankings** es donde lo tienes.

## La pestaña

Abre la página del torneo y elige **Rankings**, la última de sus pestañas. Dice que los rankings mundiales usan los resultados del torneo mediante el archivo, así que los gestores no tienen que hacer nada. El archivo es un archivo de texto para Croquet de asociación y una hoja de cálculo para Croquet golf y American 6 Wicket. Bajo las palabras está **Descargar partidas para el ranking mundial**, que guarda el archivo. Está ahí antes de introducir un solo resultado, y da un archivo sin nada dentro hasta que hay alguno.

La pestaña solo está en la página de un torneo que cuenta para los rankings mundiales, es decir, uno con alguna competición que cuenta. Se ofrece a sus gestores y a los responsables del ranking mundial de su deporte, y no a un anotador que no sea ninguna de las dos cosas. El archivo mismo está en la dirección propia del torneo seguida de `/rankings`, como `/2026/ac/spring-open/rankings`, que es la dirección que el sitio siempre le ha dado, y cualquiera que tenga la dirección puede abrirlo.

## Qué hay en el archivo

Está todo resultado que se ha introducido y no se ha archivado, en el orden en que se introdujo, incluido un resultado retirado y los de un jugador que se ha retirado. Un resultado archivado no está. Un partido ganado por un bye o por incomparecencia no se jugó, así que no tiene línea.

Un jugador aparece con su nombre en el ranking mundial, que es su nombre cuando no se le ha dado otro.

Para **Croquet de asociación** hay una sección por cada competición que tiene algún resultado: su evento, sus fechas, su ganador, si fueron partidos o partidas sueltas, y una línea numerada por cada resultado, como "1 Sam Someone beat Alex Another +9". Un resultado es la diferencia entre los aros del ganador y los del perdedor, con un más cuando el ganador hizo más aros, y los peels a continuación. El partido de una eliminatoria es una línea, con el resultado de cada partida por turno. La línea **Winner** de cada sección (está en inglés en el archivo) se deja vacía, porque un test lo gana un equipo y no un jugador.

Para **Croquet golf y American 6 Wicket** hay una hoja de cálculo: el nombre del torneo, sus días y cuántas partidas tiene, y luego una línea numerada por cada partida, con el apellido y el nombre del ganador, "beat", los del perdedor y los dos resultados. Cada partida del partido de una eliminatoria es una línea propia. Debajo de la última, la línea **Tournament winner:** (también en inglés en el archivo) se deja vacía, para que la rellene quien use el archivo.

## Cuando no hay archivo

Un torneo en el que ninguna competición cuenta para el ranking mundial no tiene archivo. Abrir su dirección de rankings muestra una página que lo dice y explica por qué: su deporte no tiene ranking mundial, o ninguna de sus competiciones cuenta, porque cada una se juega con hándicap, permite empates o se desmarcó para que no cuente. Eso se fija al añadir cada competición, y se cambia con su **Editar**. En el archivo solo están las competiciones que cuentan.

Siguiente: [Cambiar, archivar y restaurar un torneo](changing-and-archiving.md).
