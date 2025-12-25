# 🔧 Configuración de Supabase (Modo Seguro)

## 🔒 Enfoque de Seguridad

Esta aplicación usa un enfoque **más seguro** donde:
- ✅ **Cero credenciales expuestas al navegador**
- ✅ **Todas las operaciones pasan por el servidor**
- ✅ **Variables de entorno privadas** (sin `NEXT_PUBLIC_`)

## Paso 1: Obtener credenciales de Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto
4. Ve a **Settings → API**
5. Copia los siguientes valores en tu archivo `.env`:
   - `SUPABASE_URL` → URL del proyecto (sin `NEXT_PUBLIC_`)
   - `SUPABASE_ANON_KEY` → Anon Key (sin `NEXT_PUBLIC_`)

## Paso 2: Configurar autenticación

1. Ve a **Authentication → Providers** en Supabase
2. Habilita **Email** como proveedor
3. Configura las opciones de email (puedes usar las predeterminadas para desarrollo)

## Paso 3: Crear usuario administrador

1. Ve a **Authentication → Users** en Supabase
2. Haz clic en **Add user** → **Create new user**
3. Ingresa tu email y contraseña
4. Confirma el usuario (o usa el link de confirmación del email)

## Paso 4: Crear las tablas

Ve a **SQL Editor** en Supabase y ejecuta el siguiente SQL:

```sql
-- Crear tabla de categorías
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Crear tabla de gastos
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  payment_method TEXT DEFAULT 'efectivo',
  notes TEXT,
  is_recurring INTEGER DEFAULT 0, -- 0 = único, 1 = recurrente
  recurrence_frequency TEXT, -- 'monthly', 'weekly', 'yearly', null
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de presupuestos
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id, month, year)
);

-- Crear tabla de ingresos
CREATE TABLE incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de estadísticas
CREATE TABLE statistics (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  total_expenses NUMERIC(10, 2) DEFAULT 0,
  total_income NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month, year)
);

-- Crear índices para mejor performance
CREATE INDEX expenses_user_id_idx ON expenses(user_id);
CREATE INDEX expenses_date_idx ON expenses(date);
CREATE INDEX expenses_category_id_idx ON expenses(category_id);
CREATE INDEX categories_user_id_idx ON categories(user_id);
CREATE INDEX budgets_user_id_idx ON budgets(user_id);
CREATE INDEX incomes_user_id_idx ON incomes(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para categories
CREATE POLICY "Users can view their own categories" ON categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
  FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas RLS para expenses
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas RLS para budgets
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas RLS para incomes
CREATE POLICY "Users can view their own incomes" ON incomes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incomes" ON incomes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incomes" ON incomes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incomes" ON incomes
  FOR DELETE USING (auth.uid() = user_id);

-- Crear políticas RLS para statistics
CREATE POLICY "Users can view their own statistics" ON statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics" ON statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics" ON statistics
  FOR UPDATE USING (auth.uid() = user_id);
```

## Paso 5: Instalar dependencias

```bash
pnpm install
```

## Paso 6: Ejecutar la app

```bash
pnpm dev
```

La app estará disponible en `http://localhost:3000`

## 📝 Variables de entorno requeridas

**IMPORTANTE:** No uses `NEXT_PUBLIC_` para mantener las credenciales seguras en el servidor.

```env
# Variables privadas (SOLO servidor)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui

# Variables públicas opcionales
NEXT_PUBLIC_ANALYTICS_ID=opcional
```

## ✅ Verificar que todo funciona

1. Abre [localhost:3000](http://localhost:3000)
2. Inicia sesión con el usuario que creaste en Supabase
3. Crea una categoría
4. Registra un gasto
5. Verifica los datos en Supabase

## 🔒 Ventajas de este enfoque de seguridad

- **Cero exposición de credenciales:** Las credenciales NUNCA llegan al navegador
- **Mejor seguridad:** Todo pasa por Server Actions con validaciones del servidor
- **Control total:** Todas las queries se ejecutan en el servidor
- **Compatible con RLS:** Funciona perfectamente con Row Level Security de Supabase
- **Prevención de abuso:** No se pueden hacer llamadas directas a Supabase desde el cliente

¡Listo! 🎉
