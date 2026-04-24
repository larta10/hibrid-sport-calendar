// API route to fix formats in Supabase
const fetch = require('node-fetch');

const SUPABASE_URL = "https://ssyljhtganuaanczxeep.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI";

export default async function handler(req, res) {
  try {
    // Update HYROX formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*hyrox*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    // Update Spartan formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*spartan*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas, Equipos, Elite' })
    });
    
    // Update Tough Mudder formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*mudder*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    res.json({ success: true, message: 'Formats updated!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    // Update Spartan formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*spartan*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas, Equipos, Elite' })
    });
    
    // Update Tough Mudder formats
    await fetch(`${SUPABASE_URL}/rest/v1/races?modalidad_id=ilike.*mudder*`, {
      method: 'PATCH',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formato: 'Individual, Parejas' })
    });
    
    res.json({ success: true, message: 'Formats updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}