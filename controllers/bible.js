import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar el JSON de la Biblia
const rawData = fs.readFileSync(path.resolve(__dirname, '../db/biblia.json'), 'utf-8');
const originalBiblia = JSON.parse(rawData);

// Normalizar las claves a minúsculas
const biblia = {};
for (const key in originalBiblia) {
  biblia[key.toLowerCase()] = originalBiblia[key];
}

export async function getBooks(req, res) {
    const libros = Object.keys(biblia);
    if (libros.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' });
    }
    res.json(libros);
}

export async function getBook(req, res) {
    const libro = req.params.libro.toLowerCase();
    const contenido = biblia[libro];

    if (contenido) {
        res.json(contenido);
    } else {
        res.status(404).json({ error: 'Libro no encontrado' });
    }
}

export async function getChapters(req, res) {
    const libro = req.params.libro.toLowerCase();
    const contenido = biblia[libro];
  
    if (contenido && contenido.chapters) {
      const capitulos = contenido.chapters.map(chapter => chapter.chapter);
      console.log(capitulos);
      
      res.json(capitulos);
    } else {
      res.status(404).json({ error: 'Capítulos no encontrados' });
    }
}

export async function getChapter(req, res) {
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
}

export async function getVersicles(req, res) {
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
}

export async function getVersicle(req, res) {
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
}

export async function getVersicleOfLove(req, res) {
  const temasPopulares = ["amor", "fe", "esperanza", "gracia", "oración", "vida", "pecado", "lujuria", "Dios"];
  const versiculosPopulares = []; 
  
  // Obtener todos los libros disponibles
  const libros = Object.keys(biblia);
  
  // Buscar versículos que contengan las palabras clave en el texto
  for (const libro of libros) {
    const contenido = biblia[libro];
    if (contenido && contenido.chapters) {
      for (const chapter of contenido.chapters) {
        if (chapter.verses) {
          for (const versiculo in chapter.verses) {
            const texto = chapter.verses[versiculo];
            // Verificar si el texto del versículo contiene alguna de las palabras clave
            for (const tema of temasPopulares) {
              if (texto.toLowerCase().includes(tema)) {
                versiculosPopulares.push({
                  libro: libro,
                  capitulo: chapter.chapter,
                  versiculo: versiculo,
                  texto: texto,
                  tema: tema  // Guardar el tema asociado al versículo
                });
                break;  // Si encontramos uno, no necesitamos seguir buscando otros temas en el mismo versículo
              }
            }
          }
        }
      }
    }
  }

  // Verificar si se encontraron versículos populares
  if (versiculosPopulares.length > 0) {
    // Seleccionar un versículo aleatorio entre los populares
    const randomIndex = Math.floor(Math.random() * versiculosPopulares.length);
    const randomVersiculo = versiculosPopulares[randomIndex];

    // Devolver el versículo aleatorio
    return res.json({
      libro: randomVersiculo.libro,
      capitulo: randomVersiculo.capitulo,
      versiculo: randomVersiculo.versiculo,
      texto: randomVersiculo.texto,
      tema: randomVersiculo.tema
    });
  } else {
    // Si no se encontraron versículos populares
    return res.status(404).json({ error: 'No se encontraron versículos populares' });
  }
}