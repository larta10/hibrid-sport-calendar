-- Actualizar carreras con información de Spartan Race
-- Ejecuta esto en el SQL Editor de Supabase

-- Madrid Spartan Weekend (9-10 Mayo 2026)
UPDATE public.races 
SET 
  distancia = '5K + 20 obstáculos',
  precio = '102€',
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  formato = 'Individual'
WHERE nombre ILIKE '%madrid%spartan%' AND fecha ILIKE '%2026%mayo%';

UPDATE public.races 
SET 
  distancia = '10K + 25 obstáculos',
  precio = '132€',
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  formato = 'Individual'
WHERE nombre ILIKE '%madrid%spartan%super%';

UPDATE public.races 
SET 
  distancia = '21K + 30 obstáculos',
  precio = '168€',
  url = 'https://www.spartan.com/en/race/detail/9509/overview',
  formato = 'Individual'
WHERE nombre ILIKE '%madrid%spartan%beast%';

-- Andorra Spartan (6-7 Junio 2026)
UPDATE public.races 
SET 
  distancia = '5K + 20 obstáculos',
  precio = '103€ (cod SPRING26)',
  url = 'https://es.spartan.com/es/races/encamp-andorra',
  formato = 'Individual'
WHERE nombre ILIKE '%andorra%spartan%';

-- Tenerife Spartan (28-29 Noviembre 2026)
UPDATE public.races 
SET 
  precio = '115€',
  url = 'https://es.spartan.com/es/races/tenerife',
  formato = 'Individual'
WHERE nombre ILIKE '%tenerife%spartan%';

-- Santa Susanna Barcelona (Octubre)
UPDATE public.races 
SET 
  precio = '70€',
  url = 'https://es.spartan.com/es/races/barcelona',
  formato = 'Individual'
WHERE nombre ILIKE '%barcelona%spartan%' OR nombre ILIKE '%santa%susanna%spartan%';

-- Actualizar format para todas las Spartan
UPDATE public.races SET formato = 'Individual' WHERE modalidad ILIKE '%spartan%';

-- Si hay Tough Mudder, actualizar también
UPDATE public.races SET url = 'https://toughmudder.com' WHERE modalidad ILIKE '%tough%mudder%';

-- Si hay HYROX
UPDATE public.races SET url = 'https://hyrox.com', formato = 'Individual' WHERE modalidad ILIKE '%hyrox%';

-- Si hay CrossFit
UPDATE public.races SET url = 'https://crossfit.com', formato = 'Individual' WHERE modalidad ILIKE '%crossfit%';