# Guía de Migración - Sistema de Registro de Usuarios

## 🎯 Objetivo

Corregir el sistema de registro de usuarios en producción para que funcione correctamente con el tipo ENUM `user_plan` y los triggers de autenticación.

## 📋 Problema

El registro de usuarios fallaba con el error:
```
"Database error saving new user"
ERROR: type "user_plan" does not exist
```

**Causa:** La función `handle_new_user()` intentaba usar el tipo ENUM `user_plan` antes de que existiera, y la tabla `user_profiles` tenía `role text` en lugar de `plan user_plan`.

## ✅ Solución

Hemos creado una migración de Drizzle que:
1. Crea el ENUM `user_plan`
2. Migra la columna `role` → `plan` con el tipo correcto
3. Agrega la columna `email` si no existe
4. Crea la función `handle_new_user()` correctamente
5. Crea el trigger `on_auth_user_created` en `auth.users`

## 🚀 Aplicar en Producción

### Opción 1: Usando el script de migración automática (Recomendado)

```bash
# Asegúrate de tener las credenciales de producción
export DATABASE_URL="postgresql://postgres:PASSWORD@db.hcmyikosoayumtcnqrbv.supabase.co:5432/postgres"

# Ejecutar la migración de Drizzle
pnpm db:migrate
```

Esto ejecutará la migración `0001_add_user_plan_enum_and_triggers.sql` automáticamente.

### Opción 2: Ejecución manual con psql

```bash
psql "postgresql://postgres:CZk65a1^X^7&HZ@db.hcmyikosoayumtcnqrbv.supabase.co:5432/postgres" \
  -f lib/drizzle/migrations/0001_add_user_plan_enum_and_triggers.sql
```

### Opción 3: Supabase SQL Editor

1. Ir a: https://supabase.com/dashboard/project/hcmyikosoayumtcnqrbv/sql
2. Abrir el archivo: `lib/drizzle/migrations/0001_add_user_plan_enum_and_triggers.sql`
3. Copiar todo el contenido
4. Pegar en el SQL Editor
5. Click en "Run"

## 🔍 Verificación

Después de ejecutar la migración, verás un mensaje de verificación:

```
========================================
MIGRATION VERIFICATION
========================================
ENUM user_plan exists: true
Function handle_new_user exists: true
Trigger on_auth_user_created exists: true
Column user_profiles.plan exists: true
Column user_profiles.plan type: USER-DEFINED
Column user_profiles.email exists: true
========================================
✅ Migration completed successfully
```

## 🧪 Probar el Registro

Una vez aplicada la migración, prueba registrar un nuevo usuario:

1. Ve a: https://tu-dominio.com/registro
2. Completa el formulario de registro
3. Verifica que:
   - El usuario se crea en `auth.users`
   - El perfil se crea automáticamente en `user_profiles`
   - El campo `plan` tiene el valor `'free'`
   - El campo `email` tiene el email del usuario

## 📊 Consulta de Verificación Manual

```sql
-- Verificar que el trigger funciona
-- 1. Crear un usuario de prueba
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now()
);

-- 2. Verificar que el perfil se creó automáticamente
SELECT id, email, full_name, plan, created_at
FROM user_profiles
WHERE email = 'test@example.com';

-- 3. Limpiar (opcional)
DELETE FROM auth.users WHERE email = 'test@example.com';
```

## 🔮 Prevención Futura

### Principio: 100% Drizzle

De ahora en adelante, **TODAS** las migraciones deben hacerse a través de Drizzle:

#### Para cambios de schema:
```bash
# 1. Editar lib/drizzle/schema.ts
# 2. Generar migración
pnpm db:generate

# 3. Aplicar en dev
pnpm db:migrate

# 4. Aplicar en prod
DATABASE_URL="postgresql://..." pnpm db:migrate
```

#### Para triggers y funciones:

Incluir SQL raw en las migraciones de Drizzle (como hicimos en `0001_add_user_plan_enum_and_triggers.sql`):

```sql
-- En la migración de Drizzle
CREATE OR REPLACE FUNCTION my_function()
RETURNS trigger AS $$
BEGIN
  -- código
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER my_trigger
  AFTER INSERT ON my_table
  FOR EACH ROW
  EXECUTE FUNCTION my_function();
```

### Checklist para Nuevas Migraciones

- [ ] Los cambios están definidos en `lib/drizzle/schema.ts`
- [ ] La migración se generó con `pnpm db:generate`
- [ ] Los triggers/funciones están incluidos en la migración SQL
- [ ] La migración se probó en desarrollo primero
- [ ] Se creó un backup de producción antes de aplicar
- [ ] Se verificó que todo funciona después de aplicar

## 📝 Notas Adicionales

### Password en DATABASE_URL

Si tienes problemas con caracteres especiales en la contraseña, asegúrate de URL-encodearla:

```bash
# Original: CZk65a1^X^7&HZ
# URL-encoded: CZk65a1%5EX%5E7%26HZ

DATABASE_URL="postgresql://postgres:CZk65a1%5EX%5E7%26HZ@db.hcmyikosoayumtcnqrbv.supabase.co:5432/postgres"
```

### Orden de Ejecución

La migración maneja automáticamente todos los casos:
- ✅ Si `role` existe y `plan` no → Renombra y cambia tipo
- ✅ Si `plan` existe → Verifica y actualiza tipo si es necesario
- ✅ Si ninguno existe → Crea `plan` con tipo correcto
- ✅ Si el ENUM ya existe → No falla, continúa
- ✅ Si el trigger ya existe → Lo reemplaza

## 🆘 Troubleshooting

### Error: "permission denied for schema public"

```sql
-- Otorgar permisos necesarios
GRANT USAGE ON SCHEMA public TO postgres;
GRANT CREATE ON SCHEMA public TO postgres;
```

### Error: "cannot alter type of a column used by a view or rule"

```sql
-- Listar vistas que usan la columna
SELECT table_name, view_definition
FROM information_schema.views
WHERE view_definition LIKE '%user_profiles%';

-- Eliminar vistas temporalmente, ejecutar migración, recrear vistas
```

### Verificar estado actual

```sql
-- Ver estructura actual de user_profiles
\d+ user_profiles

-- Ver función handle_new_user
\df+ handle_new_user

-- Ver trigger on_auth_user_created
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

## 📞 Soporte

Si encuentras problemas, verifica:
1. Los logs de Supabase: https://supabase.com/dashboard/project/hcmyikosoayumtcnqrbv/logs
2. Los logs de auth service (service: auth)
3. Los logs de postgres (service: postgres)
