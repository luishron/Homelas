-- ============================================================================
-- MIGRACIÓN 04: Agregar columnas metadata JSONB para datos flexibles
-- ============================================================================
-- Esta migración agrega columnas metadata JSONB a todas las tablas principales
-- Esto permite agregar campos adicionales sin necesidad de crear nuevas migraciones
-- ============================================================================

-- Agregar metadata JSONB a categories
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar metadata JSONB a payment_methods
ALTER TABLE payment_methods
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar metadata JSONB a expenses
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar metadata JSONB a budgets
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar metadata JSONB a income_categories
ALTER TABLE income_categories
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Agregar metadata JSONB a incomes
ALTER TABLE incomes
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Crear índices GIN para búsquedas eficientes en metadata
-- Los índices GIN son ideales para columnas JSONB
CREATE INDEX IF NOT EXISTS idx_categories_metadata ON categories USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_payment_methods_metadata ON payment_methods USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_expenses_metadata ON expenses USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_budgets_metadata ON budgets USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_income_categories_metadata ON income_categories USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_incomes_metadata ON incomes USING GIN (metadata);

-- ============================================================================
-- VERIFICACIÓN: Mostrar las columnas metadata agregadas
-- ============================================================================
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE
  table_schema = 'public'
  AND column_name = 'metadata'
  AND table_name IN ('categories', 'payment_methods', 'expenses', 'budgets', 'income_categories', 'incomes')
ORDER BY table_name;

-- ============================================================================
-- NOTAS DE USO:
-- ============================================================================
-- Ahora puedes agregar cualquier campo adicional sin migraciones:
--
-- Ejemplo 1: Agregar datos a un gasto
-- UPDATE expenses
-- SET metadata = metadata || '{"tienda": "Amazon", "cuotas": 3}'::jsonb
-- WHERE id = 123;
--
-- Ejemplo 2: Buscar gastos por metadata
-- SELECT * FROM expenses
-- WHERE metadata->>'tienda' = 'Amazon';
--
-- Ejemplo 3: Buscar gastos que contengan un objeto
-- SELECT * FROM expenses
-- WHERE metadata @> '{"tienda": "Amazon"}'::jsonb;
--
-- Ejemplo 4: Buscar si existe una key
-- SELECT * FROM expenses
-- WHERE metadata ? 'numeroOrden';
-- ============================================================================
