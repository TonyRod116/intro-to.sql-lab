import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import UserAgent from 'user-agents';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.totalhomes.es/';
const OUTPUT_DIR = path.join(__dirname, 'totalhomes-scraped');

// Configurar user agent aleatorio
const userAgent = new UserAgent();
const randomUA = userAgent.toString();

console.log('🚀 Iniciando scraping simple de totalhomes.es...');
console.log('📱 User Agent:', randomUA);

// Función para descargar una URL
async function downloadUrl(url, filePath) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': randomUA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000
    });
    
    // Crear directorio si no existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Guardar archivo
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Descargado: ${url}`);
    return true;
  } catch (error) {
    console.log(`⚠️ Error descargando ${url}:`, error.message);
    return false;
  }
}

// Función para procesar HTML
function processHtml(html) {
  console.log('🔧 Procesando HTML...');
  
  // Reemplazar URLs absolutas por relativas
  html = html.replace(/https?:\/\/www\.totalhomes\.es\//g, './');
  html = html.replace(/https?:\/\/totalhomes\.es\//g, './');
  
  // Reemplazar rutas de WordPress
  html = html.replace(/\/wp-content\//g, './wp-content/');
  html = html.replace(/\/wp-includes\//g, './wp-includes/');
  
  return html;
}

// Función principal
async function scrapeTotalHomes() {
  try {
    console.log('🎯 Iniciando scraping...');
    
    // Limpiar y crear directorio de salida
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // Descargar página principal
    console.log('📄 Descargando página principal...');
    const mainPagePath = path.join(OUTPUT_DIR, 'index.html');
    const mainPageSuccess = await downloadUrl(TARGET_URL, mainPagePath);
    
    if (mainPageSuccess) {
      // Procesar HTML principal
      let html = fs.readFileSync(mainPagePath, 'utf8');
      html = processHtml(html);
      fs.writeFileSync(mainPagePath, html);
      console.log('🔧 HTML procesado y guardado');
    }
    
    // Lista de recursos importantes a descargar
    const resources = [
      // CSS principales
      'https://www.totalhomes.es/wp-content/themes/hello-elementor/style.css',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/css/frontend.min.css',
      
      // Fuentes Font Awesome
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff2',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-regular-400.woff2',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-regular-400.woff',
      
      // Fuentes Elementor
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff2',
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff',
      
      // JavaScript
      'https://www.totalhomes.es/wp-content/plugins/elementor/assets/js/frontend.min.js',
      'https://www.totalhomes.es/wp-content/themes/hello-elementor/js/hello-elementor.js',
    ];
    
    console.log('📥 Descargando recursos adicionales...');
    let successCount = 0;
    
    for (const resource of resources) {
      const url = new URL(resource);
      const filePath = path.join(OUTPUT_DIR, url.pathname);
      
      const success = await downloadUrl(resource, filePath);
      if (success) successCount++;
      
      // Pequeña pausa entre descargas
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`✅ Scraping completado!`);
    console.log(`📊 Recursos descargados: ${successCount}/${resources.length}`);
    console.log(`📁 Archivos guardados en: ${OUTPUT_DIR}`);
    
    // Mostrar estructura de archivos
    console.log('\n📂 Estructura de archivos:');
    const files = fs.readdirSync(OUTPUT_DIR, { recursive: true });
    files.forEach(file => {
      if (typeof file === 'string') {
        console.log(`  - ${file}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error durante el scraping:', error);
  }
}

// Ejecutar scraping
scrapeTotalHomes();
