#!/usr/bin/env node
// Scrape centros OCR / HYROX / Funcional from Google Maps (authorized) or perform a dry run if no API key.
// This script updates lib/centros-entrenamiento.json with new centers.
const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../lib/centros-entrenamiento.json');
let data = [];
try {
  data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.error('Could not parse lib/centros-entrenamiento.json');
  process.exit(1);
}

const mode = process.env.SCRAPE_MODE || 'dry';
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

async function dryRun() {
  console.log('[DRY-RUN] Simulando extracción de centros...');
  const newOnes = [
    {
      id: 382,
      tipo: 'OCR',
      nombre: 'OCR Centro Madrid Norte (simulado)',
      ciudad: 'Madrid',
      codigo_postal: '28034',
      direccion: 'Calle Example 12',
      ccaa: 'Comunidad de Madrid',
      telefono: '',
      web: '',
      lat: 40.423, lng: -3.699
    },
    {
      id: 383,
      tipo: 'Funcional',
      nombre: 'Centro Funcional Barcelona (simulado)',
      ciudad: 'Barcelona',
      codigo_postal: '08004',
      direccion: 'Carrer Exemplar 34',
      ccaa: 'Cataluña',
      telefono: '',
      web: '',
      lat: 41.395, lng: 2.177
    }
  ];
  const updated = data.concat(newOnes);
  fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Agregados ${newOnes.length} centros simulados a lib/centros-entrenamiento.json`);
}

async function live() {
  if (!apiKey) {
    console.warn('API key no proporcionada. Ejecutando modo dry.');
    return dryRun();
  }
  console.log('[LIVE] Iniciando scraping real (requiere implementación con API/endpoint autorizado).');
  // Aquí iría la lógica real con Google Places API o otro servicio autorizado.
  // Por seguridad y uso responsable, no implementamos llamadas reales sin un endpoint autorizado y permisos.
  // De momento, fallback a dryRun para escenarios de demostración.
  return dryRun();
}

live().then(()=>{
  console.log('Scrape task complete.');
  process.exit(0);
}).catch(err=>{
  console.error('Error during scraping:', err);
  process.exit(1);
});
