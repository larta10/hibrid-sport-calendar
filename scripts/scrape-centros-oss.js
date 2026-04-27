#!/usr/bin/env node
// OSS scraping workflow using OpenStreetMap (Nominatim + Overpass)
// Cities: Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Murcia, Palma
// Note: This script is designed for a first batch and should be run with proper rate limiting.

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const jsonPath = path.resolve(__dirname, "../lib/centros-entrenamiento.json");
let existing = [];
try { existing = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (e) { existing = []; }
const lastId = existing.length ? Math.max(...existing.map(c => c.id)) : 0;

const CITIES = [
  { city: 'Madrid', lat: 40.4168, lon: -3.7038 },
  { city: 'Barcelona', lat: 41.3879, lon: 2.16992 },
  { city: 'Valencia', lat: 39.46975, lon: -0.37739 },
  { city: 'Sevilla', lat: 37.3891, lon: -5.9845 },
  { city: 'Bilbao', lat: 43.262, lon: -2.935 },
  { city: 'Málaga', lat: 36.7213, lon: -4.4219 },
  { city: 'Zaragoza', lat: 41.6488, lon: -0.8891 },
  { city: 'Murcia', lat: 37.992, lon: -1.1307 },
  { city: 'Palma', lat: 39.5696, lon: 2.6502 }
];

const RADIUS = 20000; // 20 km
const KEYWORDS = /(OCR|HYROX|Functional|Functional fitness|obstacle|CrossFit)/i;

async function geocodeCity(city) {
  const q = encodeURIComponent(city);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}+Spain&format=json&limit=1`;
  const r = await fetch(url, { headers: { 'User-Agent': 'HybridRaceHub-OSS-Scraper/1.0' }});
  const arr = await r.json().catch(() => []);
  if (Array.isArray(arr) && arr.length > 0) {
    return { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon) };
  }
  return null;
}

async function queryOverpass(lat, lon) {
  // OSS: broaden query to retrieve gyms/fitness centers in radius and filter later by keywords
  const query = `
  [out:json][timeout:60];
  (
    node["amenity"~"gym|fitness_center|fitness_centre|sports_center|sports_centre"](around:${RADIUS},${lat},${lon});
    way["amenity"~"gym|fitness_center|fitness_centre|sports_center|sports_centre"](around:${RADIUS},${lat},${lon});
    relation["amenity"~"gym|fitness_center|fitness_centre|sports_center|sports_centre"](around:${RADIUS},${lat},${lon});
  );
  out center;
  `;
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: query
  });
  const data = await res.json().catch(() => null);
  return data && Array.isArray(data.elements) ? data.elements : [];
}

function extractCenterFromOSM(el, city, country) {
  const name = el.tags && el.tags.name ? el.tags.name : el.id;
  const tags = el.tags || {};
  const lat = el.lat ?? (el.center?.lat ?? null);
  const lon = el.lon ?? (el.center?.lon ?? null);
  const houseNo = tags['addr:housenumber'] || '';
  const street  = tags['addr:street'] || '';
  const cityName = city || tags['addr:city'] || '';
  const postcode = tags['addr:postcode'] || tags['postcode'] || '';
  const state = tags['addr:state'] || tags['addr:ccaa'] || '';
  const address = [houseNo, street].filter(Boolean).join(' ').trim();
  const web = tags.website || tags['website'] || tags['url'] || '';
  const phone = tags.phone || tags['phone'] || '';
  // Clasificación tentativa
  const tkn = String(name || '').toLowerCase();
  let tipo = 'Multidisciplinar';
  if (tkn.includes('ocr')) tipo = 'OCR';
  else if (tkn.includes('hyrox')) tipo = 'HYROX';
  else if (tkn.includes('funcional') || tkn.includes('fitness')) tipo = 'Funcional';
  else if (tkn.includes('crossfit')) tipo = 'CrossFit';
  else if (tkn.includes('obstacle')) tipo = 'OCR';
  return {
    id: null,
    tipo,
    nombre: String(name),
    ciudad: cityName || city,
    codigo_postal: postcode,
    direccion: address,
    ccaa: state || '',
    telefono: phone,
    web: web,
    lat: lat,
    lng: lon,
    fuente: 'OSM-Overpass',
  };
}

async function run() {
  const seen = new Set(existing.map(e => [e.nombre, e.direccion, e.ciudad].join('|')));
  let added = [];
  for (const cityInfo of CITIES) {
    // Resolve coords: prefer provided lat/lon, else geocode via Nominatim
    let coords = null;
    if (cityInfo.lat != null && cityInfo.lon != null) {
      coords = { lat: cityInfo.lat, lon: cityInfo.lon };
    } else {
      const g = await geocodeCity(cityInfo.city).catch(() => null);
      if (g) coords = g;
    }
    if (!coords) {
      console.log(`OSS: no coords for ${cityInfo.city}, skipping.`);
      continue;
    }
    const osmNodes = await queryOverpass(coords.lat, coords.lon);
    for (const el of osmNodes) {
      const c = extractCenterFromOSM(el, cityInfo.city, 'ES');
      if (!c) continue;
      if (!c.lat || !c.lng) continue;
      if (!c.nombre) continue;
      const key = [c.nombre, c.direccion, c.ciudad].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      added.push({ ...c, id: lastId + added.length + 1, fuente: 'OSM-Overpass', precision: 'auto' });
    }
    // Pause between city queries to respect usage
    await new Promise(r => setTimeout(r, 2000));
  }
  if (added.length === 0) {
    console.log('No se encontraron nuevos centros con OSS en este ciclo.');
    process.exit(0);
  }
  // Merge into lib/centros-entrenamiento.json
  const updated = existing.concat(added);
  fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`OSS: añadidos ${added.length} centros verificados.`);
}

run().catch(err => {
  console.error('Error OSS scraping', err);
  process.exit(1);
});
