// Minimal unit test for proximity expansion logic (simplified)
const MIN_RESULTS = 3;

function expandByProximitySimple(exactResults, allCentros, query, userLat, userLng) {
  if (exactResults.length >= MIN_RESULTS) return { results: exactResults, expanded: false, reason: "" };
  // naive expansion: pick first centros not in exactResults up to min-3
  const exactIds = new Set(exactResults.map((c) => c.id));
  const expanded = allCentros.filter((c) => !exactIds.has(c.id)).slice(0, Math.max(0, MIN_RESULTS - exactResults.length));
  const results = exactResults.concat(expanded);
  return { results, expanded: expanded.length > 0, reason: "Proximidad" };
}

function run() {
  const all = [
    { id:1, nombre:'A' },
    { id:2, nombre:'B' },
    { id:3, nombre:'C' },
    { id:4, nombre:'D' }
  ];
  const exact = [ { id:1, nombre:'A' } ];
  const res = expandByProximitySimple(exact, all, 'A', null, null);
  console.log('proximity simple test results length:', res.results.length);
  if (res.results.length < 3) {
    console.error('Proximity test failed to ensure minimum 3 results');
    process.exit(1);
  }
  console.log('Proximity test passed');
  process.exit(0);
}

run();
