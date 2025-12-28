# Guía de Deployment a Producción

Esta guía explica cómo hacer deploy de la aplicación a producción con **migraciones automáticas de base de datos**.

**IMPORTANTE:** Asegúrate de que la migración crítica `0001_add_user_plan_enum_and_triggers.sql` esté aplicada para que el registro de usuarios funcione correctamente. Ver `MIGRATION-GUIDE.md` para detalles.

## Tabla de Contenidos

- [Configuración General](#configuración-general)
- [Deploy en Vercel](#deploy-en-vercel)
- [Deploy en Railway](#deploy-en-railway)
- [Deploy en Fly.io](#deploy-en-flyio)
- [Sistema de Migraciones](#sistema-de-migraciones)
- [Variables de Entorno](#variables-de-entorno)
- [Troubleshooting](#troubleshooting)

---

## Configuración General

### Requisitos Previos

1. **Base de datos Supabase** configurada
2. **Proyecto en Git** (GitHub, GitLab, etc.)
3. **Variables de entorno** preparadas (ver sección abajo)

### Sistema de Migraciones Automáticas

El proyecto usa **Drizzle ORM** con migraciones automáticas siguiendo un enfoque **100% Drizzle**:

```bash
pnpm build:prod    # Ejecuta migraciones + build de Next.js
```

**¿Cómo funciona?**

1. El script `scripts/migrate-auto.ts` se ejecuta antes del build
2. Valida la conexión a la base de datos
3. Aplica las migraciones de Drizzle (`lib/drizzle/migrations/*.sql`)
4. Incluye triggers y funciones SQL (ejemplo: `0001_add_user_plan_enum_and_triggers.sql`)
5. Si las migraciones fallan, el build continúa (configurable)
6. Next.js hace el build de producción

**Migraciones Críticas:**
- `0001_add_user_plan_enum_and_triggers.sql` - **REQUERIDA**: Corrige el sistema de registro de usuarios creando el ENUM `user_plan` y los triggers de autenticación

**Flujo en CI/CD:**

```
GitHub Push → Deploy Platform → pnpm build:prod → Migraciones Drizzle → Next.js Build → Deploy
```

---

## Deploy en Vercel

### 1. Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente Next.js

### 2. Configurar Build Command

**Build Command:**
```bash
pnpm build:prod
```

**Install Command:**
```bash
pnpm install
```

**Output Directory:** `.next` (default)

### 3. Variables de Entorno

Ve a **Settings → Environment Variables** y agrega:

#### Variables Requeridas

```bash
# Supabase Database (IMPORTANTE: Usar puerto 5432, NO pooler)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require

# Supabase Client
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui

# Next.js
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

#### Variables Opcionales

```bash
# Migración: Fallar build si migración falla (default: false)
FAIL_ON_MIGRATION_ERROR=false
```

**⚠️ IMPORTANTE:** Usa el puerto **5432** (conexión directa), NO el puerto **6543** (pooler). El pooler puede causar problemas con Drizzle.

### 4. Deploy

1. Click **Deploy**
2. Vercel ejecutará `pnpm build:prod` automáticamente
3. Las migraciones se aplicarán antes del build
4. Verifica los logs para confirmar que las migraciones se ejecutaron

### 5. Verificar Deployment

```bash
# Verifica que las tablas existan en Supabase SQL Editor
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

# Debe incluir: user_profiles, categories, expenses, incomes, etc.

# Verificar que la migración crítica se aplicó
SELECT EXISTS (
  SELECT 1 FROM pg_type WHERE typname = 'user_plan'
) AS user_plan_enum_exists;

SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

---

## Deploy en Railway

### 1. Crear Proyecto

1. Ve a [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Selecciona tu repositorio

### 2. Configurar Variables de Entorno

En **Variables**:

```bash
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require
SUPABASE_URL=https://PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SITE_URL=https://tu-app.up.railway.app
```

### 3. Configurar Build

Railway detecta Next.js automáticamente. Si necesitas personalizar:

**Build Command:**
```bash
pnpm build:prod
```

**Start Command:**
```bash
pnpm start
```

### 4. Deploy

Railway hará deploy automáticamente en cada push a la rama principal.

---

## Deploy en Fly.io

### 1. Instalar Flyctl

```bash
curl -L https://fly.io/install.sh | sh
```

### 2. Inicializar Proyecto

```bash
fly launch
```

Selecciona:
- App name: tu-app
- Region: closest to your users
- PostgreSQL: No (usamos Supabase)

### 3. Configurar Secrets

```bash
fly secrets set DATABASE_URL="postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require"
fly secrets set SUPABASE_URL="https://PROJECT_ID.supabase.co"
fly secrets set SUPABASE_ANON_KEY="tu_anon_key"
fly secrets set NEXT_PUBLIC_SITE_URL="https://tu-app.fly.dev"
```

### 4. Configurar `fly.toml`

```toml
app = "tu-app"
primary_region = "mia"

[build]
  [build.args]
    NODE_VERSION = "20"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512
```

### 5. Deploy

```bash
fly deploy
```

---

## Sistema de Migraciones

### Cómo Funciona

El script `scripts/migrate-auto.ts` se ejecuta automáticamente en cada deploy:

```typescript
// 1. Valida conexión a BD
await validateConnection()

// 2. Ejecuta drizzle-kit push
await runMigrations()

// 3. Build continúa si todo está OK
```

### Logs de Migración

Durante el deploy verás algo como:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🗄️  Sistema de Migraciones Automáticas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Validando conexión a la base de datos...
✅ Conexión exitosa a la base de datos

🚀 Aplicando migraciones de Drizzle...
✅ Migraciones aplicadas exitosamente

⏱️  Tiempo total: 2.34s
```

### Comportamiento en Caso de Error

Por defecto, si las migraciones fallan, el build **continúa** (para evitar romper deployments por errores menores).

Para **fallar el build** si las migraciones fallan:

```bash
# En Vercel/Railway/Fly.io
FAIL_ON_MIGRATION_ERROR=true
```

### Ejecutar Migraciones Manualmente

Si necesitas ejecutar migraciones localmente o en un script separado:

```bash
# Con el script automático
pnpm db:migrate

# Directo con drizzle-kit
pnpm db:push
```

---

## Variables de Entorno

### Formato de DATABASE_URL

**✅ Correcto (Puerto 5432 - Conexión directa):**
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

**❌ Incorrecto (Puerto 6543 - Pooler):**
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

### Obtener DATABASE_URL de Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. **Settings** → **Database**
3. En **Connection String** → **URI**
4. Copia y reemplaza `[YOUR-PASSWORD]` con tu password real

**Ejemplo:**
```bash
# Supabase te da:
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres

# Cambia a conexión directa (puerto 5432):
postgresql://postgres:TU_PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

### Codificar Password Especiales

Si tu password tiene caracteres especiales (`@`, `&`, `#`, etc.), codifícala:

```bash
# Node.js
node -e "console.log(encodeURIComponent('TU_PASSWORD'))"

# Ejemplo:
# Password: My&Pass@123
# Codificado: My%26Pass%40123
```

### Lista Completa de Variables

| Variable | Requerido | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `DATABASE_URL` | ✅ Sí | Conexión directa a Supabase (puerto 5432) | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require` |
| `SUPABASE_URL` | ✅ Sí | URL del proyecto Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ Sí | Anon key de Supabase | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | ✅ Sí | URL pública para Magic Link redirects | `https://app.vercel.app` |
| `FAIL_ON_MIGRATION_ERROR` | ❌ Opcional | Fallar build si migración falla | `true` o `false` (default) |

---

## Troubleshooting

### Error: "password authentication failed"

**Causa:** Password incorrecta o caracteres especiales mal codificados.

**Solución:**
```bash
# Codifica tu password
node -e "console.log(encodeURIComponent('TU_PASSWORD'))"

# Actualiza DATABASE_URL con el password codificado
DATABASE_URL=postgresql://postgres:PASSWORD_CODIFICADA@db.xxx.supabase.co:5432/postgres
```

### Error: "role 'postgres.xxx' does not exist"

**Causa:** Estás usando el formato de pooler en lugar de conexión directa.

**Solución:**
```bash
# Cambia de:
postgresql://postgres.xxx:pass@aws-0-us-west-2.pooler.supabase.com:6543/postgres

# A:
postgresql://postgres:pass@db.PROJECT_ID.supabase.co:5432/postgres?sslmode=require
```

### Error: "relation 'user_profiles' does not exist"

**Causa:** Las migraciones no se ejecutaron en producción.

**Solución:**
1. Verifica que `DATABASE_URL` esté configurada correctamente
2. Revisa los logs del build para ver si las migraciones se ejecutaron
3. Si no, ejecuta manualmente el SQL en Supabase SQL Editor

### Build Falla en Migraciones

**Si quieres que el build continúe:**
```bash
# NO configures FAIL_ON_MIGRATION_ERROR (default: false)
```

**Si quieres que falle para debuggear:**
```bash
FAIL_ON_MIGRATION_ERROR=true
```

### Migraciones se Ejecutan Pero Fallan

**Pasos de debug:**

1. Verifica logs del deploy:
```bash
# Vercel
vercel logs

# Railway
railway logs

# Fly.io
fly logs
```

2. Prueba la conexión localmente:
```bash
# Actualiza .env.local con el DATABASE_URL de producción
pnpm db:migrate
```

3. Ejecuta SQL manualmente en Supabase:
```bash
# Genera el SQL
pnpm db:generate

# Ejecuta en Supabase SQL Editor:
# lib/drizzle/migrations/XXXX_migration_name.sql
```

### Vercel Build Muy Lento

**Causa:** Las migraciones toman tiempo o hay problemas de red.

**Solución:**
1. Verifica que estés usando puerto 5432 (más rápido)
2. Considera ejecutar migraciones una sola vez manualmente antes del deploy
3. Usa regiones cercanas (Supabase + Vercel en la misma región)

---

## Checklist de Pre-Deploy

Antes de hacer deploy a producción, verifica:

- [ ] `DATABASE_URL` configurada (puerto 5432)
- [ ] `SUPABASE_URL` y `SUPABASE_ANON_KEY` configuradas
- [ ] `NEXT_PUBLIC_SITE_URL` configurada con tu dominio
- [ ] Password codificada si tiene caracteres especiales
- [ ] Build Command: `pnpm build:prod`
- [ ] Variables de entorno en **todas** las environments (Preview + Production)
- [ ] Trigger manual creado en Supabase (ver SQL abajo)
- [ ] RLS policies habilitadas en Supabase

### SQL del Trigger (Ejecutar en Supabase)

```sql
-- Trigger para auto-crear user_profiles
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, role, onboarding_completed)
  VALUES (NEW.id, 'free', false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();
```

---

## Próximos Pasos

Después del primer deploy exitoso:

1. **Verifica la aplicación:** Regístrate y completa el onboarding
2. **Monitorea errores:** Usa [Sentry](https://sentry.io) o [LogRocket](https://logrocket.com)
3. **Configura dominios personalizados:** En Vercel/Railway/Fly.io
4. **Habilita Analytics:** Vercel Analytics ya está integrado
5. **Configura CI/CD:** Los deploys automáticos ya funcionan con Git push

---

## Soporte

Si tienes problemas:

1. Revisa los logs del deploy en tu plataforma
2. Verifica las variables de entorno
3. Consulta la sección [Troubleshooting](#troubleshooting)
4. Revisa `/docs/AUTHENTICATION.md` para temas de auth
5. Abre un issue en el repositorio

**¡Happy deploying!** 🚀
