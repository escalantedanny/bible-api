
# 📖 Bible API – API Católica en Español

**Bible API** es una API RESTful desarrollada en Node.js que permite acceder a contenido de la Biblia Católica en español, incluyendo el Evangelio diario, versículos por tema, capítulos y libros. Está pensada para desarrolladores que buscan integrar contenido bíblico en aplicaciones móviles, sitios web o bots.

---

## ✨ Funcionalidades

- 📅 **Evangelio diario** (extraído del sitio oficial de la Iglesia en Chile)
- 📘 **Acceso por libro, capítulo y versículo**
- 🎯 **Versículo aleatorio**
- 💬 **Versículos por temas** (amor, fe, esperanza, etc.)

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/escalantedanny/bible-api.git
cd bible-api
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Ejecuta el servidor

```bash
node server.js
```

> El servidor se iniciará en `http://localhost:3000`

---

## 📚 Endpoints

### ✅ Estado del servidor

`GET /ping`  
→ Devuelve un mensaje de estado para verificar que el servidor está activo.

---

### 📘 Libros de la Biblia

`GET /libros`  
→ Lista todos los libros disponibles en la base de datos.

---

### 📖 Versículos por capítulo

`GET /libros/:libro/capitulos/:capitulo/versiculos`  
→ Devuelve todos los versículos de un capítulo.

📌 Ejemplo:

```
/libros/juan/capitulos/3/versiculos
```

---

### 📖 Versículo específico

`GET /libros/:libro/capitulos/:capitulo/versiculos/:versiculo`  
→ Devuelve un versículo puntual de un libro y capítulo.

📌 Ejemplo:

```
/libros/juan/capitulos/3/versiculos/16
```

---

### 🎯 Versículo aleatorio

`GET /versiculos/aleatorios`  
→ Devuelve un versículo aleatorio desde toda la base de datos.

---

### 💡 Versículos por tema

`GET /libros/:tema/versiculos/aleatorio`  
→ Devuelve un versículo aleatorio relacionado con el tema indicado (ej: fe, amor, esperanza).

📌 Ejemplo:

```
/libros/fe/versiculos/aleatorio
```

---

### 📅 Evangelio diario

`GET /libros/evangelio`  
→ Devuelve el Evangelio del día extraído desde [iglesia.cl](https://www.iglesia.cl/santo_evangelio.php)

---

## 🧪 Ejemplos de uso

```bash
curl http://localhost:3000/ping
curl http://localhost:3000/libros
curl http://localhost:3000/libros/juan/capitulos/3/versiculos/16
curl http://localhost:3000/versiculos/aleatorios
curl http://localhost:3000/libros/fe/versiculos/aleatorio
curl http://localhost:3000/libros/evangelio
```

---

## ⚙️ Tecnologías usadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- Web Scraping para el Evangelio diario
- Archivos JSON como base de datos

---

## 📌 Mejoras futuras

- Soporte multi-versión (Biblia Latinoamericana, Reina-Valera, etc.)
- Documentación Swagger
- Autenticación por API Key
- Estadísticas de uso
- Panel web para administración de contenido

---

## 🤝 Contribuciones

¡Contribuciones son bienvenidas!

1. Haz un **fork** del repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza tus cambios
4. Haz commit: `git commit -am 'Agregada nueva función'`
5. Sube tus cambios: `git push origin feature/nueva-funcionalidad`
6. Abre un **Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 🙌 Autor

Desarrollado con fe por [@escalantedanny](https://github.com/escalantedanny)  
📧 Contacto: danny.ezequiel@gmail.com
