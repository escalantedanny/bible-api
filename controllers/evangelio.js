const axios = require('axios');
const cheerio = require('cheerio');

async function obtenerEvangelio() {
  try {
    const { data } = await axios.get('https://www.iglesia.cl/santo_evangelio.php');
    const $ = cheerio.load(data);

    // Suponiendo que el Evangelio está dentro de un elemento con la clase 'evangelio'
    const evangelio = $('.evangelio').text().trim();

    console.log('Evangelio del día:');
    console.log(evangelio);
  } catch (error) {
    console.error('Error al obtener el Evangelio:', error);
  }
}

obtenerEvangelio();