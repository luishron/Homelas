# Configurar GitHub OAuth

## Paso 1: Crear OAuth App en GitHub

1. Ve a https://github.com/settings/developers
2. Click en "New OAuth App"
3. Llena el formulario:
   - **Application name**: Control de Gastos (o el nombre que quieras)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click en "Register application"

## Paso 2: Obtener credenciales

1. Copia el **Client ID**
2. Click en "Generate a new client secret"
3. Copia el **Client Secret** (solo se muestra una vez)

## Paso 3: Actualizar .env

Reemplaza en tu archivo `.env`:

```bash
GITHUB_ID=tu-client-id-aqui
GITHUB_SECRET=tu-client-secret-aqui
```

## Paso 4: Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copia el resultado y reemplázalo en `.env`:

```bash
NEXTAUTH_SECRET=el-secreto-generado
```

## Paso 5: Reiniciar servidor

```bash
pnpm dev
```
