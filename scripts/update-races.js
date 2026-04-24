// Actualizador de carreras - ejecutar con node update-races.js

const supabaseUrl = 'https://ssyljhtganuaanczxeep.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI';

const updates = [
  { filter: 'modalidad_id=ilike.*spartan*', data: { url: 'https://es.spartan.com/es/races', formato: 'Individual', precio: 'Desde 99€' } },
  { filter: 'modalidad_id=ilike.*mudder*', data: { url: 'https://toughmudder.com/es', formato: 'Individual', precio: 'Desde 89€' } },
  { filter: 'modalidad_id=ilike.*hyrox*', data: { url: 'https://hyrox.com', formato: 'Individual', precio: 'Desde 69€' } },
  { filter: 'modalidad_id=ilike.*crossfit*', data: { url: 'https://crossfit.com', formato: 'Individual' } },
];

async function updateRaces() {
  console.log('🔄 Actualizando carreras en Supabase...\n');
  
  for (const update of updates) {
    const filter = encodeURIComponent(update.filter);
    console.log(`➤ Actualizando: ${update.filter}...`);
    
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/races?${filter}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(update.data)
      });
      
      if (res.ok) {
        console.log(`  ✓ Actualizado: ${update.filter}`);
      } else {
        const err = await res.text();
        console.log(`  ✗ Error: ${err}`);
      }
    } catch (e) {
      console.log(`  ✗ Error: ${e.message}`);
    }
  }
  
  // Ver resultados
  console.log('\n📊 Verificando resultados...');
  const check = await fetch(`${supabaseUrl}/rest/v1/races?select=modalidad,url,precio,formato&limit=5`, {
    headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }
  });
  const data = await check.json();
  console.log(`\n✅ Carreras actualizadas!`);
  console.table(data);
}

updateRaces();