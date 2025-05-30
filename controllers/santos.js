import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function getSaintsOfTheDay(req, res) {
  try {
    const url = 'http://es.catholic.net/rss/santoral.xml';
    const response = await axios.get(url);

    const result = await parseStringPromise(response.data);
    const items = result?.rss?.channel?.[0]?.item ?? [];

    // Extraer los datos relevantes
    const santos = items.map(item => ({
      nombre: item.title[0],
      descripcion: item.description[0].trim(),
      link: item.link[0]
    }));

    return res.json(santos);
  } catch (error) {
    return res.status(404).json({ error: 'connected' });
  }
}

