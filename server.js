import express from 'express';
import { bibleRouter } from './routes/bible.js';

const app = express();
const port = 3000;

app.use('/libros', bibleRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}/libros`);
});