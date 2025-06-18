import express from 'express';
import { bibleRouter } from './routes/bible.js';

const app = express();

app.use('/libros', bibleRouter);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API escuchando en http://0.0.0.0:${port}/libros`);
});