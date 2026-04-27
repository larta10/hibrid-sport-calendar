-- ============================================================
-- Actualización URLs oficiales de eventos 2026
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================

-- SPARTAN RACE ESPAÑA 2026
-- URLs verificadas: es.spartan.com (redirigen a www.spartan.com/en/)
UPDATE public.races SET url = 'https://www.spartan.com/en/races/madrid'
  WHERE nombre ILIKE '%Spartan Race Madrid%';

UPDATE public.races SET url = 'https://www.spartan.com/en/races/santa-susanna-barcelona'
  WHERE nombre ILIKE '%Spartan Race Barcelona%';

UPDATE public.races SET url = 'https://www.spartan.com/en/races/tenerife'
  WHERE nombre ILIKE '%Spartan Race Tenerife%';

UPDATE public.races SET url = 'https://www.spartan.com/en/races/encamp-andorra'
  WHERE nombre ILIKE '%Spartan Race Andorra%';

-- HYROX ESPAÑA 2026
-- Portal oficial España: https://spain.hyrox.com/
-- Páginas por ciudad donde están confirmadas
UPDATE public.races SET url = 'https://hyrox.com/event/hyrox-barcelona/'
  WHERE nombre ILIKE '%HYROX Barcelona%';

UPDATE public.races SET url = 'https://spain.hyrox.com/event/hyrox-malaga-season-25-26-kn4lqo'
  WHERE nombre ILIKE '%HYROX Málaga%' OR nombre ILIKE '%HYROX Malaga%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Madrid%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Valencia%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Sevilla%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Bilbao%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Santiago%';

UPDATE public.races SET url = 'https://spain.hyrox.com/'
  WHERE nombre ILIKE '%HYROX Zaragoza%';

-- TOUGH MUDDER ESPAÑA 2026
-- No hay eventos confirmados para España 2026 en la web oficial
-- Se mantiene URL al listado de eventos de Europa
UPDATE public.races SET url = 'https://toughmudder.com/events/'
  WHERE nombre ILIKE '%Tough Mudder%';

-- CROSSFIT OPEN 2026
UPDATE public.races SET url = 'https://games.crossfit.com/open'
  WHERE nombre ILIKE '%CrossFit Open%';

-- Verificar resultados
SELECT nombre, url, estado FROM public.races ORDER BY fecha_iso ASC;
