import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Para __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const santosPath = path.resolve('./db/santos.json');

const BASE_URL = 'https://es.catholic.net/op/santoral/santoral.html?mes=';
const DB_PATH = path.resolve(__dirname, '../db/santos.json');

async function scrapeMonth(month) {
  const url = `${BASE_URL}${String(month).padStart(2, '0')}`;
  const { data } = await axios.get(url);
  const $ = load(data);

  const saints = [];

  $("div.twelve.column").each((_, el) => {
    const anchor = $(el).find("a.Titulodestacados");
    const name = anchor.text().trim();
    const link = anchor.attr("href") || '';
    const img = anchor.find("img").attr("src") || '';
    const fullLink = link.startsWith('http') ? link : `https://es.catholic.net${link}`;

    const rawText = $(el).find("span#art_texto").text().trim();
    const description = rawText.split(',')[0].trim();
    const dateText = rawText.split(',')[1]?.trim(); // ej. "23 de enero"

    const day = dateText?.split(' ')[0];

    if (name && dateText && day) {
      saints.push({
        name,
        description,
        date: dateText,
        day: Number(day),
        link: fullLink,
        img: img
      });
    }
  });

  return saints;
}

export async function scrapeAllSaints() {
  const dataByMonth = {};

  for (let m = 1; m <= 12; m++) {
    console.log(`Scraping mes ${m}...`);
    const monthSaints = await scrapeMonth(m);
    dataByMonth[m.toString()] = monthSaints;
  }

  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(dataByMonth, null, 2), 'utf-8');

  console.log(`✅ Guardado santos organizados por mes en: ${DB_PATH}`);
}

// Función para tu API (puedes dejarla como estaba)
export async function getSaintsOfTheDay(req, res) {
  //scrapeAllSaints()
  try {
    const data = await fs.readFile(santosPath, 'utf-8');
    const santosPorMes = JSON.parse(data);

    // Extraer mes y día de los parámetros
    const mes = parseInt(req.params.mes);
    const dia = parseInt(req.params.dia);

    if (isNaN(mes) || isNaN(dia) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
      return res.status(400).json({ error: 'Mes o día inválido' });
    }

    const santosDelMes = santosPorMes[String(mes)] || [];
    const santosDelDia = santosDelMes.filter(santo => parseInt(santo.day) === dia);

    return res.json(santosDelDia);
  } catch (error) {
    console.error('Error al cargar los santos:', error);
    return res.status(500).json({ error: 'No se pudo cargar los santos' });
  }
}

// Si quieres correr el scrapper solo, descomenta esta línea para hacer pruebas:
// scrapeAllSaints().catch(console.error);