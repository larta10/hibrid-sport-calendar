// Validate formates in lib/centros-entrenamiento.json
const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../lib/centros-entrenamiento.json');
let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let ok = true;
const invalid = [];
data.forEach((c) => {
  if (c.codigo_postal && typeof c.codigo_postal === 'string') {
    // CP should be 5 digits or empty
    if (!/^[0-9]{5}$/.test(c.codigo_postal)) {
      invalid.push({ id: c.id, codigo_postal: c.codigo_postal, nombre: c.nombre });
    }
  }
});

if (invalid.length > 0) {
  ok = false;
  console.warn('Centros con CP no válido (5 dígitos):', invalid);
} else {
  console.log('Todos los CPs tienen formato válido (5 dígitos) o están vacíos.');
}

process.exit(ok ? 0 : 2);
