import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';

export async function getEvangelioDelDia(req, res) {
  try {
    const { data: html } = await axios.get('https://www.eucaristiadiaria.cl/dia.php');
    const $ = cheerio.load(html);

    const rawFechaTexto = $('div.titulos').first().text().trim();
    const fechaMatch = rawFechaTexto.match(/(\d{1,2} de \w+ de \d{4})/i);

    let fechaFormateada = null;
    if (fechaMatch) {
      const fechaTexto = fechaMatch[1].toLowerCase().trim();
      const fecha = parse(fechaTexto, "d 'de' MMMM 'de' yyyy", new Date(), { locale: es });
      if (!isNaN(fecha)) {
        fechaFormateada = format(fecha, 'dd/MM/yyyy', { locale: es });
      }
    }

    let contenido = [];

    const htmlContenido = $('div.color_cambio').html();
    if (!htmlContenido) {
      return res.status(404).json({ error: 'No se encontró el contenido litúrgico' });
    }

    const textContenido = htmlContenido
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0);

    contenido = textContenido;

    const secciones = extraerSecciones(contenido);

    res.json({
      fecha: fechaFormateada,
      liturgiaDeLaPalabra: secciones.liturgia.map(limpiarHTML),
      salmo: secciones.salmo.map(limpiarHTML),
      evangelio: secciones.evangelio.map(limpiarHTML),
      oracion: secciones.oracion.map(limpiarHTML)
    });

  } catch (error) {
    console.error('Error al obtener el evangelio:', error);
    return res.status(500).json({ error: 'No se pudo obtener el Evangelio del día' });
  }
}

function extraerSecciones(lineas) {
  const liturgia = [];
  const salmo = [];
  const evangelio = [];
  const oracion = [];

  let estado = '';

  for (let linea of lineas) {
    const texto = linea.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

    if (texto.includes('LITURGIA DE LA PALABRA')) {
      estado = 'liturgia';
      continue;
    }
    if (texto.includes('SALMO RESPONSORIAL')) {
      estado = 'salmo';
      continue;
    }
    if (texto.includes('EVANGELIO') || texto.startsWith('+ EVANGELIO')) {
      estado = 'evangelio';
      continue;
    }
    if (texto.includes('ORACION SOBRE LAS OFRENDAS')) {
      estado = 'oracion';
      continue;
    }

    if (
      texto.includes('PREFACIO') ||
      texto.includes('ANTIFONA DE COMUNION') ||
      texto.includes('ORACION DESPUES DE LA COMUNION') ||
      texto.includes('ORACION DE LOS FIELES')
    ) {
      estado = '';
      continue;
    }

    switch (estado) {
      case 'liturgia':
        liturgia.push(linea);
        break;
      case 'salmo':
        salmo.push(linea);
        break;
      case 'evangelio':
        evangelio.push(linea);
        break;
      case 'oracion':
        oracion.push(linea);
        break;
    }
  }

  return { liturgia, salmo, evangelio, oracion };
}

function limpiarHTML(texto) {
  return he.decode(texto.replace(/\s+/g, ' ').trim());
}