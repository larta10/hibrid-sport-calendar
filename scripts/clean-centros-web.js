// Clean external/unauthorized web URLs in lib/centros-entrenamiento.json
// Replaces any URL containing 'buscaunbox.com' with an empty string.
const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../lib/centros-entrenamiento.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse centros-entrenamiento.json');
  process.exit(1);
}

let changed = false;
const updated = data.map((c) => {
  if (typeof c.web === 'string') {
    if (c.web.includes('buscaunbox.com')) {
      // If there is any external URL, prefer empty (no substitute since we don't know the official URL)
      changed = true;
      return { ...c, web: '' };
    }
  }
  return c;
});

if (changed) {
  fs.writeFileSync(jsonPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log('Cleaned buscaunbox.com URLs in centros-entrenamiento.json');
} else {
  console.log('No buscaunbox.com URLs found in centros-entrenamiento.json');
}
