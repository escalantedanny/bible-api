# bible-api
API for the Catholic Bible in Spanish and some other functions of the Catholic Church

## Install 

 * Clone the repository:
 
 `$ git clone`

  Change for dir into bible-api:

 `$ cd bible-api`

 ## Building bible-api in local

  `$ npm install`

 ## Making bible-api local

  `$ node server.js`

 ## Ejemplos de endpoints:
- `/ping` — vida del servicio
- `/libros` — Lista de libros
- `/libros//versiculos/amor/aleatorio` — Versiculo de amor aleatorio de la biblia
- `/versiculos/aleatorios` — Versiculo aleatorio
- `/libros/evangelio` — Detalle sobre el evangelio del dia
- `/libros/{libro}/capitulos/{capitulo}/versiculos/{versiculo}` — Detalle versiculo en especifico
- `/libros/{libro}/capitulos/{capitulo}/versiculos` — Detalle todos los versiculos del capitulo
- `/libros/{libro}/capitulos/{capitulo}` — Detalle del capítulo
- `/libros/{libro}/capitulos` — Detalle del Libro en Capitulos
- `/libros/{libro}` — Detalle del Libro
- `/search?q=palabra` — Búsqueda por palabra o frase
