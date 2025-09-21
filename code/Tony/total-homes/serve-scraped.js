import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5174;
const SCRAPED_DIR = path.join(__dirname, 'totalhomes-scraped');

// Servir archivos estáticos
app.use(express.static(SCRAPED_DIR));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(SCRAPED_DIR, 'index.html'));
});

// Ruta para cualquier archivo
app.get('/*', (req, res) => {
  const filePath = path.join(SCRAPED_DIR, req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Archivo no encontrado');
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor iniciado!');
  console.log(`📱 URL: http://localhost:${PORT}`);
  console.log(`📁 Sirviendo desde: ${SCRAPED_DIR}`);
  console.log('\n🎯 Sitio clonado de totalhomes.es disponible!');
});
