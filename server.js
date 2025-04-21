const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de la Biblia Católica!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});