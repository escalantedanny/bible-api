import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Cargar el JSON de la Biblia
const rawData = fs.readFileSync(path.resolve('db/biblia.json'), 'utf-8');
const originalBiblia = JSON.parse(rawData);

// Normalizar las claves a minúsculas
const biblia = {};
for (const key in originalBiblia) {
  biblia[key.toLowerCase()] = originalBiblia[key];
}
// Ruta principal de libros
app.get('/libros', (req, res) => {
  const libros = Object.keys(biblia);
  if (libros.length === 0) {
    return res.status(404).json({ error: 'No se encontraron libros' });
  }
  res.json(libros);
});

// Ruta para obtener un libro específico (por ejemplo, "genesis")
app.get('/libros/:libro', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const contenido = biblia[libro];

  if (contenido) {
    res.json(contenido);
  } else {
    res.status(404).json({ error: 'Libro no encontrado' });
  }
});

// Ruta para obtener un capítulo específico de un libro
app.get('/libros/:libro/:capitulo', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const capitulo = req.params.capitulo;
  if (biblia[libro] && biblia[libro][capitulo]) {
    res.json(biblia[libro][capitulo]);
  } else {
    res.status(404).json({ error: 'Capítulo no encontrado' });
  }
});

// Ruta para obtener un versículo específico de un capítulo
app.get('/libros/:libro/:capitulo/:versiculo', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const capitulo = req.params.capitulo;
  const versiculo = req.params.versiculo;
  if (biblia[libro] && biblia[libro][capitulo] && biblia[libro][capitulo][versiculo]) {
    res.json(biblia[libro][capitulo][versiculo]);
  } else {
    res.status(404).json({ error: 'Versículo no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});