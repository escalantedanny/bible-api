import express from 'express';
import { 
    getBooks, 
    getBook,
    getChapters,
    getChapter,
    getVersicles,
    getVersicle,
    getVersicleOfLove,
    getRandomVersicle,
    searchVersicles,
    ping,
    getEvangelioDelDia
} from '../controllers/bible.js';

const router = express.Router();

// Rutas más específicas al inicio
router.get('/ping', ping)
router.get('/versiculos/amor/aleatorio', getVersicleOfLove);
router.get('/versiculos/aleatorios', getRandomVersicle);
router.get('/search', searchVersicles);
router.get('/evangelio', getEvangelioDelDia);

// Luego rutas por parámetro
router.get('/:libro/capitulos/:capitulo/versiculos/:versiculo', getVersicle);
router.get('/:libro/capitulos/:capitulo/versiculos', getVersicles);
router.get('/:libro/capitulos/:capitulo', getChapter);
router.get('/:libro/capitulos', getChapters);
router.get('/:libro', getBook);

// Finalmente la raíz
router.get('/', getBooks);

export { router as bibleRouter };