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

// Ruta para obtener capítulos de un libro (por ejemplo, "genesis")
app.get('/libros/:libro/capitulos', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const contenido = biblia[libro];

  if (contenido && contenido.chapters) {
    const capitulos = contenido.chapters.map(chapter => chapter.chapter);
    console.log(capitulos);
    
    res.json(capitulos);
  } else {
    res.status(404).json({ error: 'Capítulos no encontrados' });
  }
});

// Ruta para obtener un capítulo específico de un libro (por ejemplo, "genesis" y "1")
app.get('/libros/:libro/capitulos/:capitulo', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const capitulo = req.params.capitulo;

  const contenido = biblia[libro];
  if (contenido && contenido.chapters) {
    const chapter = contenido.chapters.find(ch => ch.chapter === capitulo);
    if (chapter) {
      res.json(chapter);
    } else {
      res.status(404).json({ error: 'Capítulo no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Libro o capítulos no encontrados' });
  }
});

// Ruta para obtener un versículo específico de un libro y capítulo (por ejemplo, "genesis", "1", "1")
app.get('/libros/:libro/capitulos/:capitulo/versiculos/:versiculo', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const capitulo = req.params.capitulo;
  const versiculo = req.params.versiculo;

  const contenido = biblia[libro];
  if (contenido && contenido.chapters) {
    const chapter = contenido.chapters.find(ch => ch.chapter === capitulo);
    if (chapter && chapter.verses && chapter.verses[versiculo]) {
      res.json({ [versiculo]: chapter.verses[versiculo] });
    } else {
      res.status(404).json({ error: 'Versículo no encontrado' });
    }
  } else {
    res.status(404).json({ error: 'Libro, capítulo o versículo no encontrados' });
  }
});

// Ruta para obtener múltiples versículos de un capítulo de un libro (por ejemplo, "genesis/1")
app.get('/libros/:libro/capitulos/:capitulo/versiculos', (req, res) => {
  const libro = req.params.libro.toLowerCase();
  const capitulo = req.params.capitulo;
  const contenido = biblia[libro];

  // Obtener los versículos solicitados desde el parámetro query
  const versiculosSolicitados = req.query.versiculos ? req.query.versiculos.split(',') : [];

  if (contenido && contenido.chapters) {
    const capítulo = contenido.chapters.find(ch => ch.chapter === capitulo);
    if (capítulo && capítulo.verses) {
      // Si se han solicitado versículos específicos, devolver solo esos
      if (versiculosSolicitados.length > 0) {
        const versiculos = {};
        versiculosSolicitados.forEach(num => {
          if (capítulo.verses[num]) {
            versiculos[num] = capítulo.verses[num];
          }
        });
        res.json(versiculos);
      } else {
        // Si no se han solicitado versículos específicos, devolver todos los versículos del capítulo
        res.json(capítulo.verses);
      }
    } else {
      res.status(404).json({ error: 'Versículos no encontrados en este capítulo' });
    }
  } else {
    res.status(404).json({ error: 'Capítulo no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});