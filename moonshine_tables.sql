-- =====================================================================
-- TABLA DE SINCRONIZACIÓN EN TIEMPO REAL PARA MOONSHINE FLOW MANAGER
-- Pega y ejecuta este script en el SQL Editor de tu proyecto Supabase:
-- https://rutlzcimpvxjuimxpcxx.supabase.co
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.moonshine_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) con política abierta para lectura/escritura de la app
ALTER TABLE public.moonshine_store ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura y escritura publica moonshine_store" ON public.moonshine_store;
CREATE POLICY "Permitir lectura y escritura publica moonshine_store"
ON public.moonshine_store
FOR ALL
USING (true)
WITH CHECK (true);

-- Habilitar sincronización en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.moonshine_store;
