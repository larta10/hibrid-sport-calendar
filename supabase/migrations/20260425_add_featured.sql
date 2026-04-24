-- Añadir campo featured a races
ALTER TABLE public.races ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_races_featured ON public.races (featured) WHERE featured = true;