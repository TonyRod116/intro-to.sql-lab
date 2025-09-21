import websiteScraper from 'website-scraper';
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

console.log('🚀 Iniciando scraping de totalhomes.es...');
console.log('📱 User Agent:', randomUA);

// Configuración del scraper
const options = {
  urls: [TARGET_URL],
  directory: OUTPUT_DIR,
  userAgent: randomUA,
  request: {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    }
  },
  // Configuración de archivos a descargar
  filenameGenerator: 'bySiteStructure',
  // Descargar todos los recursos
  recursive: true,
  maxDepth: 2,
  // Incluir todos los tipos de archivos
  urlFilter: (url) => {
    // Permitir todos los dominios de totalhomes.es
    return url.includes('totalhomes.es') || 
           url.includes('wp-content') || 
           url.includes('wp-includes') ||
           url.startsWith('/') ||
           url.startsWith('./');
  },
  // Configuración de subdirectorios
  subdirectories: [
    { directory: 'css', extensions: ['.css'] },
    { directory: 'js', extensions: ['.js'] },
    { directory: 'images', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] },
    { directory: 'fonts', extensions: ['.woff', '.woff2', '.ttf', '.eot'] },
    { directory: 'wp-content', extensions: [] }
  ],
  // Configuración de requests
  requestConcurrency: 3,
  requestDelay: 1000, // 1 segundo entre requests
  // Configuración de archivos
  prettifyUrls: true,
  // Configuración de errores
  ignoreErrors: true,
  // Configuración de logs
  logLevel: 'info'
};

// Función para limpiar y procesar el HTML
function processHtml(html, baseUrl) {
  console.log('🔧 Procesando HTML...');
  
  // Reemplazar URLs absolutas por relativas
  html = html.replace(/https?:\/\/www\.totalhomes\.es\//g, './');
  html = html.replace(/https?:\/\/totalhomes\.es\//g, './');
  
  // Reemplazar rutas de WordPress
  html = html.replace(/\/wp-content\//g, './wp-content/');
  html = html.replace(/\/wp-includes\//g, './wp-includes/');
  
  // Reemplazar rutas de assets
  html = html.replace(/\/wp-content\/themes\//g, './wp-content/themes/');
  html = html.replace(/\/wp-content\/plugins\//g, './wp-content/plugins/');
  html = html.replace(/\/wp-content\/uploads\//g, './wp-content/uploads/');
  
  return html;
}

// Función para descargar recursos adicionales
async function downloadAdditionalResources() {
  console.log('📥 Descargando recursos adicionales...');
  
  const resources = [
    'https://www.totalhomes.es/wp-content/themes/hello-elementor/style.css',
    'https://www.totalhomes.es/wp-content/plugins/elementor/assets/css/frontend.min.css',
    'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff2',
    'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2',
    'https://www.totalhomes.es/wp-content/plugins/elementor/assets/lib/eicons/fonts/eicons.woff2'
  ];
  
  for (const resource of resources) {
    try {
      const response = await axios.get(resource, {
        headers: {
          'User-Agent': randomUA,
          'Accept': '*/*',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      });
      
      const url = new URL(resource);
      const filePath = path.join(OUTPUT_DIR, url.pathname);
      const dir = path.dirname(filePath);
      
      // Crear directorio si no existe
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Guardar archivo
      fs.writeFileSync(filePath, response.data);
      console.log(`✅ Descargado: ${url.pathname}`);
      
    } catch (error) {
      console.log(`⚠️ Error descargando ${resource}:`, error.message);
    }
  }
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
    
    // Ejecutar scraping
    const result = await websiteScraper(options);
    
    console.log('✅ Scraping completado!');
    console.log('📊 Archivos descargados:', result.length);
    
    // Procesar HTML principal
    const indexHtmlPath = path.join(OUTPUT_DIR, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
      let html = fs.readFileSync(indexHtmlPath, 'utf8');
      html = processHtml(html, TARGET_URL);
      fs.writeFileSync(indexHtmlPath, html);
      console.log('🔧 HTML procesado y guardado');
    }
    
    // Descargar recursos adicionales
    await downloadAdditionalResources();
    
    console.log('🎉 Scraping completado exitosamente!');
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
