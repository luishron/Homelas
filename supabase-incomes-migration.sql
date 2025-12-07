-- ============================================================================
-- Migración: Sistema completo de Ingresos
-- ============================================================================
-- Este script actualiza la tabla de ingresos y crea categorías de ingresos
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- 1. Crear tabla de categorías de ingresos (separada de gastos)
CREATE TABLE IF NOT EXISTS income_categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10B981',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por usuario
CREATE INDEX IF NOT EXISTS idx_income_categories_user_id ON income_categories(user_id);

-- 2. Actualizar tabla de ingresos con nuevos campos
ALTER TABLE incomes
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES income_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS is_recurring INTEGER DEFAULT 0 CHECK (is_recurring IN (0, 1)),
  ADD COLUMN IF NOT EXISTS recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'yearly')),
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Índice para búsquedas de ingresos recurrentes
CREATE INDEX IF NOT EXISTS idx_incomes_recurring ON incomes(user_id, is_recurring) WHERE is_recurring = 1;

-- 3. Insertar categorías de ingresos por defecto (ejemplo)
-- Nota: Estas son sugerencias, el usuario puede crear las suyas

-- Categoría: Salario
INSERT INTO income_categories (user_id, name, color, icon, description)
SELECT DISTINCT user_id, 'Salario', '#10B981', '💼', 'Ingresos por trabajo fijo'
FROM incomes
WHERE NOT EXISTS (
  SELECT 1 FROM income_categories
  WHERE income_categories.user_id = incomes.user_id
  AND income_categories.name = 'Salario'
);

-- Categoría: Freelance
INSERT INTO income_categories (user_id, name, color, icon, description)
SELECT DISTINCT user_id, 'Freelance', '#3B82F6', '💡', 'Proyectos y consultoría'
FROM incomes
WHERE NOT EXISTS (
  SELECT 1 FROM income_categories
  WHERE income_categories.user_id = incomes.user_id
  AND income_categories.name = 'Freelance'
);

-- Categoría: Inversiones
INSERT INTO income_categories (user_id, name, color, icon, description)
SELECT DISTINCT user_id, 'Inversiones', '#F59E0B', '📈', 'Dividendos, rentas, intereses'
FROM incomes
WHERE NOT EXISTS (
  SELECT 1 FROM income_categories
  WHERE income_categories.user_id = incomes.user_id
  AND income_categories.name = 'Inversiones'
);

-- Categoría: Otros
INSERT INTO income_categories (user_id, name, color, icon, description)
SELECT DISTINCT user_id, 'Otros', '#6B7280', '🎁', 'Otros ingresos'
FROM incomes
WHERE NOT EXISTS (
  SELECT 1 FROM income_categories
  WHERE income_categories.user_id = incomes.user_id
  AND income_categories.name = 'Otros'
);

-- 4. Migrar datos existentes: asignar categoría por defecto basada en source
-- Si el source contiene "salario" o "sueldo", asignar categoría Salario
UPDATE incomes i
SET category_id = (
  SELECT id FROM income_categories ic
  WHERE ic.user_id = i.user_id
  AND ic.name = 'Salario'
  LIMIT 1
)
WHERE category_id IS NULL
AND (LOWER(source) LIKE '%salario%' OR LOWER(source) LIKE '%sueldo%');

-- Si el source contiene "freelance" o "proyecto", asignar categoría Freelance
UPDATE incomes i
SET category_id = (
  SELECT id FROM income_categories ic
  WHERE ic.user_id = i.user_id
  AND ic.name = 'Freelance'
  LIMIT 1
)
WHERE category_id IS NULL
AND (LOWER(source) LIKE '%freelance%' OR LOWER(source) LIKE '%proyecto%');

-- Si el source contiene "inversión" o "renta", asignar categoría Inversiones
UPDATE incomes i
SET category_id = (
  SELECT id FROM income_categories ic
  WHERE ic.user_id = i.user_id
  AND ic.name = 'Inversiones'
  LIMIT 1
)
WHERE category_id IS NULL
AND (LOWER(source) LIKE '%inversión%' OR LOWER(source) LIKE '%inversion%' OR LOWER(source) LIKE '%renta%');

-- Asignar "Otros" a los que no matchearon
UPDATE incomes i
SET category_id = (
  SELECT id FROM income_categories ic
  WHERE ic.user_id = i.user_id
  AND ic.name = 'Otros'
  LIMIT 1
)
WHERE category_id IS NULL;

-- 5. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_incomes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_incomes_updated_at ON incomes;
CREATE TRIGGER trigger_update_incomes_updated_at
  BEFORE UPDATE ON incomes
  FOR EACH ROW
  EXECUTE FUNCTION update_incomes_updated_at();

-- ============================================================================
-- Verificación: Consultas para verificar la migración
-- ============================================================================

-- Ver categorías de ingresos creadas
-- SELECT * FROM income_categories ORDER BY user_id, name;

-- Ver ingresos con sus categorías
-- SELECT i.*, ic.name as category_name, ic.icon
-- FROM incomes i
-- LEFT JOIN income_categories ic ON i.category_id = ic.id
-- ORDER BY i.date DESC
-- LIMIT 20;

-- Contar ingresos por categoría
-- SELECT ic.name, COUNT(i.id) as total_incomes, SUM(CAST(i.amount AS DECIMAL)) as total_amount
-- FROM income_categories ic
-- LEFT JOIN incomes i ON ic.id = i.category_id
-- GROUP BY ic.id, ic.name
-- ORDER BY total_amount DESC;
