// Lightweight SEO/Accessibility checks for modified pages
const fs = require('fs');

function hasTitle(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return /<title>[^<]+<\/title>/.test(content);
}

function main() {
  const results = {
    indexHasTitle: hasTitle('pages/index.js'),
    centrosHasTitle: hasTitle('pages/centros-entrenamiento.js'),
  };
  console.log('SEO report:');
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

main();
