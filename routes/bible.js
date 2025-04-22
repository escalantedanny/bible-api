import express from 'express';
import { 
    getBooks, 
    getBook,
    getChapters,
    getChapter,
    getVersicles,
    getVersicle,
    getVersicleOfLove
} from '../controllers/bible.js';

const router = express.Router();

// Ruta para obtener todos los libros
router.get('/', getBooks);

// Ruta para obtener un libro específico (por ejemplo, "genesis")
router.get('/:libro', getBook)

// Ruta para obtener capítulos de un libro (por ejemplo, "genesis")
router.get('/:libro/capitulos', getChapters)

// Ruta para obtener un capítulo específico de un libro (por ejemplo, "genesis" y "1")
router.get('/:libro/capitulos/:capitulo', getChapter)

// Ruta para obtener múltiples versículos de un capítulo de un libro (por ejemplo, "genesis/1")
router.get('/:libro/capitulos/:capitulo/versiculos', getVersicles)

// Ruta para obtener un versículo específico de un libro y capítulo (por ejemplo, "genesis", "1", "1")
router.get('/:libro/capitulos/:capitulo/versiculos/:versiculo', getVersicle)

// Ruta para obtener versículo de amor aleatorio
router.get('/versiculos/amor/aleatorio', getVersicleOfLove);

export { router as bibleRouter };