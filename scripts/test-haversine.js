// Simple unit test for haversine distance
const { haversine } = require('../lib/distance');

function approxEqual(a, b, tol=0.5) {
  return Math.abs(a - b) <= tol;
}

function run() {
  // Equator test: 1 degree longitude at equator ~111.195 km
  const d1 = haversine(0, 0, 0, 1);
  console.log('haversine(0,0,0,1) =', d1);
  if (!approxEqual(d1, 111.195, 1.0)) {
    console.error('Test 1 failed: expected ~111.195 km');
    process.exit(1);
  }

  // Known distance: (0,0) to (51.5074, -0.1278) around 5727 km (London)
  const d2 = haversine(0, 0, 51.5074, -0.1278);
  console.log('haversine(0,0,51.5074,-0.1278) =', d2);
  if (!approxEqual(d2, 5727, 100)) {
    // This rough check uses distance lat/lon; correct value ~ 5570 km
    console.error('Test 2 failed: expected ~5570 km');
    process.exit(1);
  }

  console.log('All haversine tests passed');
  process.exit(0);
}

run();
