import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getEvangelioDelDia(req, res) {
  try {
    const { data: html } = await axios.get('https://www.eucaristiadiaria.cl/dia.php');
    const $ = cheerio.load(html);
    const contenido = [];

    $('div.color_cambio p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) contenido.push(text);
    });

    if (contenido.length === 0) {
      return res.status(404).json({ error: 'No se encontró el contenido litúrgico' });
    }

    // Resultado a retornar
    const resultado = {
      liturgiaDeLaPalabra: []
    };

    let estado = 'buscando';

    for (const linea of contenido) {
      const upper = linea.trim().toUpperCase();

      if (upper === 'LITURGIA DE LA PALABRA') {
        estado = 'liturgia';
        resultado.liturgiaDeLaPalabra.push(linea);
        continue;
      }

      if (estado === 'liturgia') {
        resultado.liturgiaDeLaPalabra.push(linea);
        if (linea.includes('\n\nPalabra de Dios')) {
          estado = 'buscandoSalmo';
        }
        continue;
      }
    }

    const secciones = extraerSecciones(resultado.liturgiaDeLaPalabra);

    res.json({
      liturgiaDeLaPalabra: secciones.liturgia.join("\n"),
      salmo: secciones.salmo.join("\n"),
      evangelio: secciones.evangelio.join("\n"),
    });

  } catch (error) {
    console.error('Error al obtener el evangelio:', error);
    return res.status(500).json({ error: 'No se pudo obtener el Evangelio del día' });
  }
}

function extraerSecciones(texto) {
  const liturgia = [];
  const salmo = [];
  const evangelio = [];
  const oracion = [];

  let estado = '';

  for (const linea of texto) {
    const upper = linea.trim().toUpperCase();

    if (upper === 'LITURGIA DE LA PALABRA') {
      estado = 'liturgia';
      liturgia.push(linea); // incluir el título
      continue;
    }
    if (upper.startsWith('SALMO RESPONSORIAL')) {
      estado = 'salmo';
      salmo.push(linea); // incluir el título
      continue;
    }
    if (upper === 'EVANGELIO') {
      estado = 'evangelio';
      evangelio.push(linea); // incluir el título
      continue;
    }
    if (upper.startsWith('ORACIÓN SOBRE LAS OFRENDAS')) {
      estado = 'oracion';
      oracion.push(linea); // incluir el título
      continue;
    }

    if (estado === 'liturgia') {
      liturgia.push(linea);
    } else if (estado === 'salmo') {
      salmo.push(linea);
    } else if (estado === 'evangelio') {
      evangelio.push(linea);
    } else if (estado === 'oracion') {
      oracion.push(linea);
    }
  }

  return {
    liturgia,
    salmo,
    evangelio,
    oracion
  };
}