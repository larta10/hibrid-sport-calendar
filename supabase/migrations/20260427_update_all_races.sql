-- ============================================
-- SCRIPT DE ACTUALIZACIÓN DE CARRERAS -Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. SPARTAN RACE ESPAÑA 2026 - Actualizar todas las Spartan
-- -----------------------------------------------------------

-- Madrid Spartan Weekend (9-10 Mayo 2026)
UPDATE public.races SET 
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  distancia = '5K + 20 obstáculos',
  precio = '102€',
  formato = 'Individual'
WHERE nombre ILIKE '%spartan%madrid%' AND fecha ILIKE '%2026%mayo%';

UPDATE public.races SET 
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  distancia = '10K + 25 obstáculos',
  precio = '132€',
  formato = 'Individual'
WHERE nombre ILIKE '%spartan%madrid%super%';

UPDATE public.races SET 
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  distancia = '21K + 30 obstáculos',
  precio = '168€',
  formato = 'Individual'
WHERE nombre ILIKE '%spartan%madrid%beast%';

-- Andorra Spartan Weekend (6-7 Junio 2026)
UPDATE public.races SET 
  url = 'https://es.spartan.com/es/races/encamp-andorra',
  distancia = '5K + 20 obstáculos',
  precio = '103€',
  formato = 'Individual'
WHERE nombre ILIKE '%spartan%andorra%' AND url IS NULL;

-- Tenerife Spartan (28-29 Noviembre 2026)
UPDATE public.races SET 
  url = 'https://es.spartan.com/es/races/tenerife',
  precio = '115€',
  formato = 'Individual'
WHERE nombre ILIKE '%tenerife%spartan%' AND url IS NULL;

-- Santa Susanna / Barcelona (Octubre)
UPDATE public.races SET 
  url = 'https://es.spartan.com/es/races/barcelona',
  precio = '70€',
  formato = 'Individual'
WHERE (nombre ILIKE '%barcelona%spartan%' OR nombre ILIKE '%santa%susanna%') AND url IS NULL;

-- DEKA eventos
UPDATE public.races SET 
  url = 'https://es.spartan.com/es/races',
  precio = 'Desde 59€',
  formato = 'Individual'
WHERE nombre ILIKE '%deka%' AND url IS NULL;

-- Spartan Sprint por defecto
UPDATE public.races SET 
  url = 'https://es.spartan.com/es/races',
  distancia = '5K + 20 obstáculos',
  precio = 'Desde 99€',
  formato = 'Individual'
WHERE modalidad ILIKE '%spartan%' AND url IS NULL;

-- 2. TOUGH MUDDER
-- -----------------------------------------------------------
UPDATE public.races SET 
  url = 'https://toughmudder.com/es',
  distancia = '10Millas + 25 obstáculos',
  precio = 'Desde 89€',
  formato = 'Individual'
WHERE modalidad ILIKE '%tough%mudder%' AND url IS NULL;

-- 3. HYROX
-- -----------------------------------------------------------
UPDATE public.races SET 
  url = 'https://hyrox.com/es',
  precio = 'Desde 69€',
  formato = 'Individual'
WHERE modalidad ILIKE '%hyrox%' AND url IS NULL;

-- 4. CROSSFIT
-- -----------------------------------------------------------
UPDATE public.races SET 
  url = 'https://crossfit.com',
  precio = 'Desde 50€',
  formato = 'Individual'
WHERE modalidad ILIKE '%crossfit%' AND url IS NULL;

-- 5. GENERAL - Si sin precio, añadir placeholder
-- -----------------------------------------------------------
UPDATE public.races SET precio = 'Consulta precio'
WHERE precio IS NULL OR precio = '';

-- 6. Ver resultado
-- -----------------------------------------------------------
SELECT 
  modalidad,
  COUNT(*) as total,
  SUM(CASE WHEN url IS NOT NULL AND url != '' THEN 1 ELSE 0 END) as con_url,
  SUM(CASE WHEN distancia IS NOT NULL AND distancia != '' THEN 1 ELSE 0 END) as con_distancia,
  SUM(CASE WHEN precio IS NOT NULL AND precio != '' AND precio != 'Consulta precio' THEN 1 ELSE 0 END) as con_precio
FROM public.races 
GROUP BY modalidad
ORDER BY total DESC;

-- Ver últimas carreras actualizadas
SELECT nombre, modalidad, distancia, precio, url 
FROM public.races 
WHERE url IS NOT NULL AND url != ''
ORDER BY fecha_iso DESC
LIMIT 20;