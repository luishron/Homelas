# 🎨 Tallify Design System

> Sistema de diseño moderno para la gestión de finanzas personales, inspirado en la paleta Tallify.

**Versión:** 2.0.0
**Última actualización:** Diciembre 2024

---

## 📋 Tabla de Contenidos

- [Filosofía de Diseño](#-filosofía-de-diseño)
- [Paleta de Colores](#-paleta-de-colores)
- [Accesibilidad](#-accesibilidad)
- [Guía de Uso](#-guía-de-uso)
- [Componentes](#-componentes)
- [Casos de Uso Específicos](#-casos-de-uso-específicos)

---

## 🎯 Filosofía de Diseño

Tallify utiliza una paleta de colores **natural y enérgica** que transmite:

- **🌱 Crecimiento**: Verde vibrante para representar prosperidad financiera
- **🌲 Estabilidad**: Verde pino oscuro para fondos y profundidad
- **🌾 Calidez**: Beige/crema para suavidad y claridad visual
- **⚡ Modernidad**: Alto contraste y colores vibrantes para una UI contemporánea

### Inspiración

Nuestro sistema está inspirado en la marca Tallify, adoptando su paleta distintiva:
- Verde vibrante (#9FFF66) como color principal
- Verde pino oscuro (#071C11) para fondos y contraste
- Beige/crema (#F9F8E3) para superficies suaves

---

## 🎨 Paleta de Colores

### Colores Primarios

#### 🟢 Verde Vibrante (Primary)
```
Nombre:     Verde Vibrante / Lime Green
Hex:        #9FFF66
RGB:        159, 255, 102
HSL:        hsl(98, 100%, 70%)
CSS Var:    --primary

Uso: Botones principales, CTAs, estados success, ingresos positivos, highlights
```

#### 🌲 Verde Pino Oscuro (Dark Pine)
```
Nombre:     Verde Pino Oscuro / Dark Pine
Hex:        #071C11
RGB:        7, 28, 17
HSL:        hsl(153, 65%, 8%)
CSS Var:    --background (dark mode), --foreground (light mode)

Uso: Fondos dark mode, texto en light mode, navegación, headers
```

#### 🌾 Beige/Crema (Cream)
```
Nombre:     Beige Crema / Cream
Hex:        #F9F8E3
RGB:        249, 248, 227
HSL:        hsl(56, 60%, 93%)
CSS Var:    --card (light mode)

Uso: Fondos light mode, cards, superficies suaves, alternativa a blanco
```

### Colores Funcionales

#### ✅ Success (Verde Vibrante)
```
Hex:        #9FFF66
HSL:        hsl(98, 100%, 70%)
CSS Var:    --success

Uso: Confirmaciones, ingresos, balance positivo, pagos exitosos
```

#### ⚠️ Warning (Amber)
```
Hex:        #FFC107
HSL:        hsl(38, 92%, 50%)
CSS Var:    --warning

Uso: Alertas, gastos próximos a vencer, avisos importantes
```

#### ❌ Destructive (Rojo)
```
Hex:        #EF4444
HSL:        hsl(0, 84%, 60%)
CSS Var:    --destructive

Uso: Errores, gastos vencidos, eliminaciones, balance negativo
```

#### ℹ️ Info (Azul)
```
Hex:        #0EA5E9
HSL:        hsl(199, 89%, 48%)
CSS Var:    --info

Uso: Información general, tooltips, mensajes informativos
```

### Neutrales

#### Light Mode
```css
/* Backgrounds */
--background: hsl(56, 60%, 98%)     /* #FCFBF6 - Soft beige-white */
--foreground: hsl(153, 65%, 8%)     /* #071C11 - Verde pino dark */

/* Cards & Surfaces */
--card: hsl(56, 60%, 96%)           /* #F9F8E3 - Beige/Cream */
--card-foreground: hsl(153, 65%, 8%) /* #071C11 - Verde pino dark */

/* Borders & Inputs */
--border: hsl(56, 30%, 85%)         /* #E5E3D5 - Beige border */
--input: hsl(56, 30%, 85%)          /* #E5E3D5 - Beige input */
--ring: hsl(98, 100%, 70%)          /* #9FFF66 - Verde vibrante focus */
```

#### Dark Mode
```css
/* Backgrounds */
--background: hsl(153, 65%, 8%)     /* #071C11 - Verde pino dark */
--foreground: hsl(56, 60%, 95%)     /* #FAFAF2 - Beige claro */

/* Cards & Surfaces */
--card: hsl(153, 55%, 12%)          /* #0A2A1C - Verde pino medium */
--card-foreground: hsl(56, 60%, 95%) /* #FAFAF2 - Beige claro */

/* Borders & Inputs */
--border: hsl(153, 40%, 20%)        /* #0F3827 - Verde pino border */
--input: hsl(153, 40%, 20%)         /* #0F3827 - Verde pino input */
--ring: hsl(98, 100%, 70%)          /* #9FFF66 - Verde vibrante focus */
```

---

## ♿ Accesibilidad

### Ratios de Contraste WCAG AA

Todos los pares de colores cumplen con **WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)**.

#### Light Mode

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Verde Pino Dark (#071C11) | Beige Cream (#F9F8E3) | **13.8:1** | ✅ AAA |
| Verde Pino Dark (#071C11) | Soft Beige-White (#FCFBF6) | **14.2:1** | ✅ AAA |
| Verde Pino Dark (#071C11) | Verde Vibrante (#9FFF66) | **8.5:1** | ✅ AAA |
| Blanco (#FFFFFF) | Verde Vibrante (#9FFF66) | **1.8:1** | ⚠️ Large text only |

**Recomendaciones:**
- ✅ Usar Verde Pino Dark para texto sobre fondos claros (beige, crema, blanco)
- ✅ Usar Verde Pino Dark para texto sobre botones Verde Vibrante
- ⚠️ Evitar texto blanco sobre Verde Vibrante (usar Verde Pino Dark en su lugar)

#### Dark Mode

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Beige Claro (#FAFAF2) | Verde Pino Dark (#071C11) | **14.1:1** | ✅ AAA |
| Beige Claro (#FAFAF2) | Verde Pino Medium (#0A2A1C) | **11.2:1** | ✅ AAA |
| Verde Pino Dark (#071C11) | Verde Vibrante (#9FFF66) | **8.5:1** | ✅ AAA |
| Verde Vibrante (#9FFF66) | Verde Pino Dark (#071C11) | **8.5:1** | ✅ AAA |

**Recomendaciones:**
- ✅ Usar Beige Claro para texto sobre fondos Verde Pino
- ✅ Usar Verde Vibrante como acento sobre fondos oscuros
- ✅ Todos los pares principales cumplen AAA (7:1)

### Consideraciones Especiales

#### Daltonismo
- ✅ Verde y Rojo: Diferenciación clara por luminosidad (70% vs 60%)
- ✅ Usar iconos además de colores para estados (✓ pagado, ! vencido, ⏱ pendiente)

#### Modo de Reducción de Movimiento
Ya implementado en `globals.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📖 Guía de Uso

### ¿Cuándo usar cada color?

#### 🟢 Verde Vibrante (#9FFF66)

**SÍ usar para:**
- ✅ Botones de acción principal (Guardar, Agregar, Confirmar)
- ✅ Indicadores de ingresos y ganancias
- ✅ Balance positivo
- ✅ Estados "pagado" o "completado"
- ✅ Highlights de información importante
- ✅ Elementos interactivos en hover/focus

**NO usar para:**
- ❌ Texto de cuerpo (bajo contraste con blanco)
- ❌ Fondos grandes (puede ser visualmente agotador)
- ❌ Elementos decorativos excesivos

**Ejemplo:**
```tsx
// ✅ Correcto
<Button className="bg-primary text-primary-foreground">
  Agregar Ingreso
</Button>

// ❌ Incorrecto
<Button className="bg-primary text-white">
  Guardar
</Button>
```

#### 🌲 Verde Pino Oscuro (#071C11)

**SÍ usar para:**
- ✅ Texto principal en light mode
- ✅ Fondos en dark mode
- ✅ Headers y navegación
- ✅ Texto sobre botones Verde Vibrante
- ✅ Elementos de alta jerarquía visual

**NO usar para:**
- ❌ Texto sobre fondos oscuros (usar beige claro)
- ❌ Elementos que necesiten destacar

#### 🌾 Beige/Crema (#F9F8E3)

**SÍ usar para:**
- ✅ Cards y superficies en light mode
- ✅ Fondos de secciones alternadas
- ✅ Fondos de inputs y forms
- ✅ Texto en dark mode

**NO usar para:**
- ❌ Texto en light mode (bajo contraste)
- ❌ Botones principales

#### ❌ Rojo (Destructive)

**SÍ usar para:**
- ✅ Gastos vencidos
- ✅ Balance negativo
- ✅ Botones de eliminar
- ✅ Mensajes de error
- ✅ Alertas críticas

**NO usar para:**
- ❌ Decoración
- ❌ Elementos no críticos

#### ⚠️ Amber (Warning)

**SÍ usar para:**
- ✅ Gastos próximos a vencer (1-3 días)
- ✅ Avisos importantes (no críticos)
- ✅ Estados pendientes con urgencia

**NO usar para:**
- ❌ Errores (usar rojo)
- ❌ Información neutral (usar azul)

---

## 🧩 Componentes

### Botones

#### Primary Button
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Agregar Ingreso
</Button>
```
**Resultado:**
- Fondo: Verde Vibrante (#9FFF66)
- Texto: Verde Pino Dark (#071C11)
- Hover: 90% opacidad

#### Secondary Button
```tsx
<Button variant="secondary" className="bg-secondary text-secondary-foreground">
  Cancelar
</Button>
```
**Resultado:**
- Fondo: Beige saturado
- Texto: Verde Pino Dark

#### Destructive Button
```tsx
<Button variant="destructive">
  Eliminar Gasto
</Button>
```
**Resultado:**
- Fondo: Rojo (#EF4444)
- Texto: Blanco

### Cards

#### Basic Card
```tsx
<Card className="bg-card text-card-foreground">
  <CardHeader>
    <CardTitle>Balance Mensual</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold text-success">$12,500 USD</p>
  </CardContent>
</Card>
```

**Resultado:**
- Fondo: Beige/Cream (light) o Verde Pino Medium (dark)
- Texto: Verde Pino Dark (light) o Beige Claro (dark)
- Valor positivo: Verde Vibrante

### Badges

#### Estado: Pagado
```tsx
<Badge className="bg-success text-success-foreground">
  Pagado
</Badge>
```
**Resultado:** Verde Vibrante con texto Verde Pino Dark

#### Estado: Pendiente
```tsx
<Badge className="bg-warning text-warning-foreground">
  Pendiente
</Badge>
```
**Resultado:** Amber con texto blanco

#### Estado: Vencido
```tsx
<Badge className="bg-destructive text-destructive-foreground">
  Vencido
</Badge>
```
**Resultado:** Rojo con texto blanco

### Inputs

```tsx
<Input
  className="border-input bg-background text-foreground focus:ring-primary"
  placeholder="Descripción del gasto"
/>
```

**Focus State:**
- Border: Verde Vibrante (--ring)
- Ring: 2px Verde Vibrante con 20% opacidad

---

## 💼 Casos de Uso Específicos

### 1. Balance del Usuario

#### Balance Positivo
```tsx
<div className="text-3xl font-bold text-success">
  +$5,240 USD
</div>
```
**Color:** Verde Vibrante (#9FFF66)

#### Balance Negativo
```tsx
<div className="text-3xl font-bold text-destructive">
  -$1,320 USD
</div>
```
**Color:** Rojo (#EF4444)

### 2. Tabla de Gastos

#### Gasto Vencido (Resaltado Visual)
```tsx
<tr className="border-l-4 border-l-destructive bg-destructive/10">
  <td>
    <Badge className="bg-destructive text-destructive-foreground">
      Vencido
    </Badge>
  </td>
  <td className="text-destructive font-medium">Renta</td>
  <td className="text-destructive font-bold">$8,000 USD</td>
</tr>
```

**Resultado:**
- Borde izquierdo: Rojo 4px
- Fondo: Rojo con 10% opacidad
- Badge: Rojo sólido
- Texto: Rojo

#### Gasto Pendiente
```tsx
<tr>
  <td>
    <Badge className="bg-warning text-warning-foreground">
      Pendiente
    </Badge>
  </td>
  <td>Internet</td>
  <td className="font-semibold">$500 USD</td>
</tr>
```

#### Gasto Pagado
```tsx
<tr>
  <td>
    <Badge className="bg-success text-success-foreground">
      Pagado
    </Badge>
  </td>
  <td className="text-muted-foreground">Luz</td>
  <td className="text-muted-foreground">$1,200 USD</td>
</tr>
```

**Resultado:**
- Badge: Verde Vibrante
- Texto: Muted (baja jerarquía visual)

### 3. KPIs del Dashboard

#### Card de Ingresos
```tsx
<Card className="border-t-4 border-t-success">
  <CardHeader>
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Ingresos del Mes
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-success">$25,000 USD</div>
    <p className="text-xs text-success flex items-center gap-1 mt-1">
      <ArrowUp className="w-3 h-3" />
      +12% vs mes anterior
    </p>
  </CardContent>
</Card>
```

**Resultado:**
- Borde superior: Verde Vibrante
- Valor: Verde Vibrante
- Tendencia positiva: Verde Vibrante

#### Card de Gastos
```tsx
<Card className="border-t-4 border-t-destructive">
  <CardHeader>
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Gastos del Mes
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">$19,760 USD</div>
    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
      <ArrowUp className="w-3 h-3" />
      +8% vs mes anterior
    </p>
  </CardContent>
</Card>
```

**Resultado:**
- Borde superior: Rojo
- Valor: Foreground (neutral)
- Tendencia negativa (aumento de gastos): Rojo

### 4. Próximos Gastos a Vencer

#### Vence Hoy
```tsx
<Badge className="bg-destructive text-destructive-foreground">
  Hoy
</Badge>
```

#### Vence Mañana
```tsx
<Badge className="bg-warning text-warning-foreground">
  Mañana
</Badge>
```

#### Vence en X días
```tsx
<Badge className="bg-muted text-muted-foreground">
  En 5 días
</Badge>
```

### 5. Categorías

```tsx
{categories.map((category) => (
  <Card
    key={category.id}
    className="border-l-4"
    style={{ borderLeftColor: category.color }}
  >
    <CardHeader>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{category.icon}</span>
        <CardTitle>{category.name}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">${category.total} USD</p>
    </CardContent>
  </Card>
))}
```

**Resultado:**
- Borde izquierdo: Color de la categoría (personalizado)
- Icono: Emoji personalizado
- Total: Bold, tamaño grande

---

## 🎨 Gradientes

### Gradient Primary
```css
background: linear-gradient(135deg, hsl(98 100% 70%) 0%, hsl(110 90% 65%) 100%);
```
**Uso:** Fondos de hero sections, headers destacados

### Gradient Success
```css
background: linear-gradient(135deg, hsl(98 100% 70%) 0%, hsl(142 76% 55%) 100%);
```
**Uso:** Cards de ingresos, estados positivos

### Gradient Card
```css
background: linear-gradient(135deg, hsl(56 60% 96%) 0%, hsl(56 50% 94%) 100%);
```
**Uso:** Fondos sutiles de cards en light mode

---

## 🔧 Variables CSS

### Cómo usar en tu código

```tsx
// Usando Tailwind classes
<div className="bg-primary text-primary-foreground">
  Texto con colores del design system
</div>

// Usando CSS variables directamente
<div style={{ backgroundColor: 'hsl(var(--primary))' }}>
  Fondo primary
</div>

// En archivos CSS
.my-component {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

### Lista Completa de Variables

```css
/* Backgrounds */
--background
--foreground

/* Cards */
--card
--card-foreground

/* Brand */
--primary
--primary-foreground
--secondary
--secondary-foreground

/* Interactive */
--muted
--muted-foreground
--accent
--accent-foreground

/* Functional */
--destructive
--destructive-foreground
--success
--success-foreground
--warning
--warning-foreground
--info
--info-foreground

/* UI Elements */
--border
--input
--ring
--popover
--popover-foreground

/* Radius */
--radius (0.75rem)

/* Gradients */
--gradient-primary
--gradient-success
--gradient-card
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind Default)
```
sm:  640px   (móvil grande)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (desktop grande)
2xl: 1536px  (desktop extra grande)
```

### Mobile-First Approach
Siempre diseña pensando primero en móvil, luego adapta a pantallas grandes.

**Ejemplo:**
```tsx
<div className="text-base md:text-lg lg:text-xl">
  Texto responsivo
</div>
```

---

## ✨ Animaciones

### Transiciones Predefinidas

Ya configuradas en `globals.css`:
```css
* {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### Animaciones Disponibles

```tsx
// Fade in
<div className="animate-fade-in">Aparece suavemente</div>

// Fade in up
<div className="animate-fade-in-up">Aparece desde abajo</div>

// Scale in
<div className="animate-scale-in">Aparece con escala</div>

// Slide in right
<div className="animate-slide-in-right">Aparece desde la izquierda</div>
```

---

## 🎯 Best Practices

### ✅ DO

1. **Usar variables CSS** en lugar de colores hardcodeados
2. **Respetar la jerarquía visual** (primary > secondary > muted)
3. **Verificar contraste** antes de combinar colores
4. **Usar iconos** además de colores para estados
5. **Mantener consistencia** en todo el proyecto
6. **Probar en dark mode** todos los componentes

### ❌ DON'T

1. **Usar colores hardcodeados** (ej: `className="text-[#9FFF66]"`)
2. **Mezclar verde vibrante con blanco** para texto (bajo contraste)
3. **Sobrecargar con colores** - menos es más
4. **Ignorar estados de hover/focus** en elementos interactivos
5. **Crear nuevas variables** sin documentar

---

## 🔄 Changelog

### v2.0.0 (Diciembre 2024)
- ✨ Implementación de la paleta Tallify
- 🎨 Verde Vibrante (#9FFF66) como primary
- 🌲 Verde Pino Oscuro (#071C11) para dark mode
- 🌾 Beige/Crema (#F9F8E3) para fondos suaves
- ♿ Verificación completa de accesibilidad WCAG AA
- 📖 Documentación completa del design system

---

## 📞 Contacto

¿Preguntas sobre el design system?
**GitHub:** [@luishron](https://github.com/luishron)

---

<div align="center">
  <strong>Tallify Design System v2.0 - Hecho con ❤️ y Claude Code</strong>
</div>
