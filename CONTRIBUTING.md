# Contribuyendo a Tallify

## 🌟 ¡Gracias por tu interés en contribuir!

Este documento te guiará para contribuir efectivamente al proyecto Tallify. Valoramos todas las contribuciones, desde corrección de bugs hasta nuevas features.

---

## 📋 Tabla de Contenidos

- [Code of Conduct](#code-of-conduct)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Proponer Features](#proponer-features)
- [Recursos](#recursos)

---

## Code of Conduct

Al participar en este proyecto, te comprometes a:
- Ser respetuoso y considerado con otros colaboradores
- Aceptar críticas constructivas de manera profesional
- Enfocarte en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

---

## Cómo Contribuir

Hay muchas formas de contribuir a Tallify:

1. **Reportar bugs** - Encuentra y reporta problemas
2. **Proponer features** - Sugiere nuevas funcionalidades
3. **Mejorar documentación** - Ayuda a mantener los docs actualizados
4. **Escribir código** - Implementa features o corrige bugs
5. **Revisar PRs** - Ayuda a revisar pull requests de otros
6. **Mejorar accesibilidad** - Asegura que cumplimos WCAG 2.1 AA

---

## Configuración del Entorno

### Prerrequisitos

- **Node.js** 18.x o superior
- **npm** o **pnpm** (recomendado)
- **Git**
- Cuenta de **Supabase** (para base de datos y autenticación)

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub primero, luego:
git clone https://github.com/tu-usuario/gastos.git
cd gastos
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando pnpm (recomendado)
pnpm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el template
cp .env.example .env.local

# Editar .env.local con tus credenciales
```

**Variables requeridas:**
- `SUPABASE_URL` - URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY` - Anon key de Supabase

**Variables opcionales (producción):**
- `NEXT_PUBLIC_SITE_URL` - URL del sitio para Magic Links
- `DATABASE_URL` - URL de conexión para migraciones Drizzle

**Guías de setup:**
- [docs/setup/SUPABASE.md](./docs/setup/SUPABASE.md) - Configurar Supabase
- [docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md) - Sistema de autenticación con Magic Links

### 4. Crear Usuario de Prueba (Opcional)

```bash
# Ejecutar script para crear usuario de prueba
npx tsx create-test-user.ts
```

Este script creará un usuario con credenciales de prueba para desarrollo local.

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

---

## Convenciones de Código

### TypeScript

```typescript
// ✅ HACER: Usar tipos específicos
interface ExpenseFormProps {
  categories: Category[];
  paymentMethods: PaymentMethod[];
  onSubmit: (data: ExpenseData) => void;
}

// ❌ NO HACER: Usar 'any'
function handleData(data: any) { ... }

// ✅ HACER: Type-safe server actions
async function saveExpense(formData: FormData): Promise<ActionResult> {
  const validated = expenseSchema.safeParse({
    amount: formData.get('amount'),
    description: formData.get('description')
  });

  if (!validated.success) {
    return { error: 'Validación fallida' };
  }

  // ...
}
```

**Reglas:**
- ✅ Usar TypeScript strict mode
- ✅ Evitar `any`, usar tipos específicos
- ✅ Interfaces para props de componentes
- ✅ Type-safe server actions
- ✅ Exports nombrados en lugar de default exports

### React/Next.js

```typescript
// ✅ HACER: Server Components por defecto
export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div>
      <ExpensesList expenses={expenses} />
    </div>
  );
}

// ✅ HACER: "use client" solo cuando necesario
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}

// ✅ HACER: Server Actions para mutations
async function createExpense(formData: FormData) {
  'use server';

  const db = await getDB();
  // ...
}
```

**Best Practices:**
- ✅ Server Components por defecto
- ✅ `"use client"` solo cuando necesario (estado, efectos, eventos)
- ✅ Async/await para data fetching
- ✅ Server Actions para mutations
- ✅ Optimistic updates con `useOptimistic`

### Styling

```tsx
// ✅ HACER: Usar Tailwind con design tokens
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Guardar
</button>

// ✅ HACER: Usar paleta Tallify
<div className="text-foreground bg-background">
  {/* Verde vibrante #9FFF66 */}
  <span className="text-primary">Destacado</span>
</div>

// ✅ HACER: Asegurar accesibilidad
<button className="min-h-[44px] min-w-[44px]"> {/* Touch target */}
  <X className="h-5 w-5" />
</button>
```

**Reglas de estilo:**
- ✅ Tailwind CSS con design tokens de `globals.css`
- ✅ Paleta Tallify (ver [design-system.md](./docs/design-system.md))
- ✅ Touch targets ≥ 44px (WCAG 2.1 AA)
- ✅ Contraste de colores ≥ 4.5:1
- ✅ Dark mode support (automático con design tokens)

### Componentes

```tsx
// ✅ HACER: shadcn/ui como base
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// ✅ HACER: Props con TypeScript
interface TransactionItemProps {
  icon: string | ReactNode;
  title: string;
  amount: number;
  status?: 'paid' | 'pending' | 'overdue';
  onClick?: () => void;
}

export function TransactionItem({ icon, title, amount, status, onClick }: TransactionItemProps) {
  // ✅ HACER: ARIA labels completos
  return (
    <button
      onClick={onClick}
      aria-label={`${title}: ${amount}`}
      className="..."
    >
      {/* ... */}
    </button>
  );
}
```

**Reglas:**
- ✅ shadcn/ui como base para componentes UI
- ✅ Componentizar lógica reutilizable
- ✅ Props con TypeScript interfaces
- ✅ ARIA labels completos
- ✅ Keyboard navigation support
- ✅ Focus visible en elementos interactivos

### Accesibilidad (CRÍTICO)

Todos los componentes DEBEN cumplir WCAG 2.1 Nivel AA:

```tsx
// ✅ Touch targets ≥ 44px
<button className="h-11 px-4"> {/* 44px height */}
  Botón
</button>

// ✅ ARIA labels
<button aria-label="Cerrar diálogo">
  <X className="h-5 w-5" />
</button>

// ✅ Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }}
>
  {/* ... */}
</div>

// ✅ Focus visible
<input className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
```

**Checklist de accesibilidad:**
- [ ] Touch targets ≥ 44px
- [ ] Contraste ≥ 4.5:1 (texto normal)
- [ ] ARIA labels en elementos interactivos
- [ ] Keyboard navigation completa
- [ ] Focus visible en todos los elementos
- [ ] Semantic HTML (`<nav>`, `<main>`, `<header>`, etc.)

Ver [ACCESSIBILITY-AUDIT.md](./docs/ACCESSIBILITY-AUDIT.md) para más detalles.

### Formato de Código

Usamos Prettier con esta configuración:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**Formatear código:**
```bash
npm run format
```

---

## Proceso de Pull Request

### 1. Crear Branch

```bash
# Features
git checkout -b feature/nombre-descriptivo

# Bug fixes
git checkout -b fix/descripcion-del-bug

# Documentación
git checkout -b docs/descripcion

# Ejemplos
git checkout -b feature/global-search
git checkout -b fix/dark-mode-contrast
git checkout -b docs/update-contributing
```

### 2. Hacer Cambios

- Escribe código siguiendo las convenciones
- Asegura que cumple accesibilidad WCAG 2.1 AA
- Prueba en diferentes tamaños de pantalla
- Prueba dark mode y light mode

### 3. Commits Semánticos

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: agregar búsqueda global con Cmd+K"
git commit -m "feat(dashboard): agregar widget de próximos gastos"

# Bug fixes
git commit -m "fix: corregir contraste en dark mode"
git commit -m "fix(mobile): corregir overflow en navegación"

# Documentación
git commit -m "docs: actualizar README con instrucciones de setup"
git commit -m "docs(accessibility): agregar auditoría WCAG"

# Estilo (formato, sin cambios de lógica)
git commit -m "style: formatear con prettier"

# Refactor (sin cambios de funcionalidad)
git commit -m "refactor: optimizar TransactionItem component"

# Tests
git commit -m "test: agregar tests para FilterBar"

# Chores (cambios de build, deps, etc)
git commit -m "chore: actualizar dependencias"
```

**Formato:**
```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

### 4. Push y Crear PR

```bash
# Push tu branch
git push origin feature/nombre-descriptivo
```

En GitHub:
1. Abre un Pull Request
2. Usa un título descriptivo
3. Describe los cambios claramente
4. Referencia issues relacionados (`Closes #123`)
5. Adjunta screenshots si aplica (especialmente para UI)

### 5. Checklist del PR

Antes de marcar tu PR como listo para review, verifica:

#### Code Quality
- [ ] Código formateado con Prettier
- [ ] Sin errores de TypeScript (`npm run build`)
- [ ] Sin errores de ESLint
- [ ] Código sigue convenciones del proyecto

#### Accesibilidad (CRÍTICO)
- [ ] Touch targets ≥ 44px en elementos interactivos
- [ ] Contraste de colores WCAG AA (≥ 4.5:1 texto normal)
- [ ] ARIA labels en botones sin texto
- [ ] Keyboard navigation funciona correctamente
- [ ] Focus visible en todos los elementos interactivos
- [ ] Probado con lector de pantalla (si aplica)

#### Responsive Design
- [ ] Mobile (320px - 640px) funciona correctamente
- [ ] Tablet (640px - 1024px) funciona correctamente
- [ ] Desktop (1024px+) funciona correctamente
- [ ] Sin scroll horizontal en móvil

#### Temas
- [ ] Dark mode funciona correctamente
- [ ] Light mode funciona correctamente
- [ ] Transiciones de tema son suaves

#### Documentación
- [ ] README actualizado si añadiste features
- [ ] Comentarios en código complejo
- [ ] Props documentadas con TypeScript
- [ ] COMPONENT_GUIDE.md actualizado si añadiste componentes

#### Testing (cuando aplique)
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Probado manualmente en navegador

---

## Reportar Bugs

Usa [GitHub Issues](https://github.com/luishron/gastos/issues) con esta plantilla:

### Plantilla de Bug Report

```markdown
## Descripción
[Descripción clara y concisa del bug]

## Pasos para Reproducir
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado
[Qué debería suceder]

## Comportamiento Actual
[Qué sucede actualmente]

## Screenshots
[Si aplica, agrega screenshots]

## Entorno
- **OS:** [ej. macOS 14, Windows 11, Ubuntu 22.04]
- **Browser:** [ej. Chrome 120, Firefox 121, Safari 17]
- **Versión del proyecto:** [ej. 2.0.0]
- **Dispositivo:** [ej. iPhone 14, Desktop]

## Información Adicional
[Cualquier contexto adicional sobre el problema]
```

### Severidad

Marca tu issue con una de estas etiquetas:

- `critical` - La app no funciona, data loss, seguridad
- `high` - Feature principal rota, afecta muchos usuarios
- `medium` - Feature secundaria rota, workaround existe
- `low` - Issue cosmético, typo, mejora menor

---

## Proponer Features

### 1. Verificar Features Existentes

Revisa primero:
- [IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md) - Features planeadas
- [GitHub Issues](https://github.com/luishron/gastos/issues) - Propuestas existentes

### 2. Abrir Issue

Usa la etiqueta `enhancement`:

```markdown
## Problema que Resuelve
[Describe el problema o necesidad]

## Solución Propuesta
[Describe tu solución ideal]

## Alternativas Consideradas
[Otras soluciones que consideraste]

## Mockups/Diseño
[Si aplica, agrega mockups o wireframes]

## Impacto
- [ ] Mejora UX significativamente
- [ ] Resuelve problema común
- [ ] Mantiene accesibilidad WCAG AA
- [ ] Compatible con responsive design
- [ ] No rompe features existentes

## Información Adicional
[Contexto adicional, ejemplos, referencias]
```

### 3. Discusión

- Espera feedback de maintainers
- Discute implementación técnica
- Considera accesibilidad y responsive
- Valida con otros usuarios

---

## Recursos

### Documentación del Proyecto

- **[README.md](./README.md)** - Visión general y setup
- **[design-system.md](./docs/design-system.md)** - Sistema de diseño Tallify
- **[COMPONENT_GUIDE.md](./docs/COMPONENT_GUIDE.md)** - Guía de componentes
- **[ACCESSIBILITY-AUDIT.md](./docs/ACCESSIBILITY-AUDIT.md)** - Auditoría de accesibilidad
- **[IMPLEMENTATION_STATUS.md](./docs/IMPLEMENTATION_STATUS.md)** - Estado de features
- **[CLAUDE.md](./CLAUDE.md)** - Guía para Claude Code

### Tecnologías Principales

- **[Next.js 15](https://nextjs.org/docs)** - Framework React
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Lenguaje tipado
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[Supabase](https://supabase.com/docs)** - Backend as a Service
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticación

### Accesibilidad

- **[WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Estándar de accesibilidad
- **[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)** - Verificar contraste
- **[axe DevTools](https://www.deque.com/axe/devtools/)** - Testing de accesibilidad

### Herramientas

- **[Chrome DevTools](https://developer.chrome.com/docs/devtools/)** - Debugging
- **[React DevTools](https://react.dev/learn/react-developer-tools)** - React debugging
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Performance audit

---

## ¡Gracias por Contribuir!

Tu contribución hace que Tallify sea mejor para todos. Si tienes preguntas, no dudes en:

- Abrir un issue en GitHub
- Contactar a los maintainers
- Unirte a las discusiones

**Happy coding!** 🎉

---

**Proyecto:** Tallify - Expense Tracking App
**Versión:** 2.0.0
**Licencia:** MIT
**Última actualización:** 25 de Diciembre, 2025
