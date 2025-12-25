# Product Requirements Document - Homelas

**Versión:** 2.0.0
**Fecha:** 25 de Diciembre, 2025
**Autor:** Luis Naranja
**Estado:** Production Ready

---

## 📋 Tabla de Contenidos

- [1. Visión del Producto](#1-visión-del-producto)
- [2. User Personas](#2-user-personas)
- [3. Core Features & Justificación](#3-core-features--justificación)
- [4. User Flows Principales](#4-user-flows-principales)
- [5. Success Metrics](#5-success-metrics)
- [6. Roadmap & Priorización](#6-roadmap--priorización)
- [7. Decisiones de Producto](#7-decisiones-de-producto)

---

## 1. Visión del Producto

### 1.1 Problema que Resuelve

**El problema:**
La mayoría de los mexicanos no tiene visibilidad clara de sus finanzas personales. Las apps bancarias muestran transacciones pero no ayudan a entender patrones de gasto, planificar gastos recurrentes, o alcanzar metas financieras. Las soluciones existentes son:
- **Demasiado complejas** (ej. YNAB, Mint) - requieren conocimiento contable
- **Limitadas** (apps bancarias) - solo muestran transacciones sin contexto
- **Caras** (software empresarial) - no accesibles para personas individuales
- **No localizadas** (apps internacionales) - no entienden el contexto mexicano (MXN, cultura de efectivo, quincenas)

**La solución: Homelas**
Una aplicación web simple y elegante que permite a profesionistas mexicanos:
1. Registrar gastos e ingresos en segundos
2. Visualizar su situación financiera en tiempo real
3. Planificar gastos recurrentes (rentas, suscripciones, servicios)
4. Entender patrones de gasto por categoría
5. Alcanzar balance positivo mes a mes

### 1.2 Propuesta de Valor

**Para usuarios:** "Control financiero simple sin complicaciones contables"

**Diferenciadores clave:**
1. **Velocidad:** Agregar gasto en < 3 taps (QuickAddFAB)
2. **Claridad:** Dashboard visual al estilo Wise (no tablas abrumadoras)
3. **Inteligente:** Gastos recurrentes calculados automáticamente sin duplicar datos
4. **Localizado:** Diseñado para México (MXN, quincenas, cultura de efectivo)
5. **Accesible:** Interfaz WCAG 2.1 AA compliant, usable por todos
6. **Moderno:** UX/UI inspirada en Wise, mejor que apps bancarias tradicionales

### 1.3 Visión a 3 Años

**Corto plazo (6 meses):** App de gestión de gastos con reportes y presupuestos
**Medio plazo (1-2 años):** Plataforma de planificación financiera con metas de ahorro y predicciones
**Largo plazo (3 años):** Asistente financiero personal con IA que sugiere mejoras y detecta oportunidades de ahorro

---

## 2. User Personas

### Persona 1: "Ana la Profesionista Organizada"

**Demografía:**
- Edad: 28 años
- Ocupación: Marketing Manager en empresa tech
- Ingreso: $25,000-$35,000 MXN/mes
- Ubicación: Ciudad de México
- Dispositivos: iPhone + MacBook

**Contexto:**
- Recibe quincenas (días 15 y último del mes)
- Tiene gastos fijos: renta $8,000, servicios $1,500, gym $800
- Usa tarjetas de crédito y débito (poco efectivo)
- Le gusta Notion, apps bien diseñadas
- Sigue influencers de finanzas en Instagram

**Objetivos:**
- Saber cuánto puede gastar sin quedarse sin dinero antes de quincena
- Ahorrar $5,000/mes para viaje a Europa
- Entender en qué categorías gasta más (delivery, entretenimiento, etc.)
- No olvidar pagar servicios (luz, internet, Netflix)

**Frustraciones:**
- Excel es tedioso y se olvida de actualizarlo
- Apps bancarias solo muestran movimientos sin contexto
- Apps gringas como Mint no funcionan en México
- No quiere aprender contabilidad para usar YNAB

**Quote:** "Quiero saber si puedo comprar esto sin arruinar mi presupuesto del mes"

### Persona 2: "Carlos el Freelancer Impredecible"

**Demografía:**
- Edad: 32 años
- Ocupación: Diseñador freelance
- Ingreso: $15,000-$40,000 MXN/mes (variable)
- Ubicación: Guadalajara
- Dispositivos: Android + PC Windows

**Contexto:**
- Ingresos irregulares (proyectos cada 2-4 semanas)
- Mix de pagos: transferencias, PayPal, efectivo
- Gastos recurrentes: renta, software (Adobe), internet
- Gastos variables: comida, transporte, materiales
- No tiene prestaciones ni ahorro para el retiro

**Objetivos:**
- Proyectar si tiene suficiente dinero para los próximos 2 meses
- Separar gastos personales de gastos de negocio
- Recordar cobrar a clientes (tracking de ingresos pendientes)
- Ahorrar para periodos sin proyectos (colchón financiero)

**Frustraciones:**
- No sabe cuánto ganar al mes para vivir cómodo
- Olvida renovaciones de suscripciones que no usa
- Meses buenos gasta demás, meses malos sufre
- No tiene visibilidad de sus finanzas mes a mes

**Quote:** "Necesito saber si puedo sobrevivir el próximo mes si no me llega el proyecto"

### Persona 3: "Lupita la Estudiante Consciente"

**Demografía:**
- Edad: 22 años
- Ocupación: Estudiante universitaria + part-time
- Ingreso: $8,000 MXN/mes (beca + trabajo)
- Ubicación: Monterrey
- Dispositivos: Android mid-range

**Contexto:**
- Presupuesto ajustado, cada peso cuenta
- Gastos fijos: transporte $600, comida $3,000, materiales escolares
- Usa mucho efectivo (mercados, puestos)
- No tiene tarjeta de crédito
- Recibe apoyo familiar ocasional

**Objetivos:**
- No quedarse sin dinero antes de fin de mes
- Ahorrar $500/mes para emergencias
- Saber si puede salir con amigos sin afectar comida de la semana
- Llevar registro simple sin complicaciones

**Frustraciones:**
- Apps complejas con términos que no entiende
- No puede pagar suscripciones premium
- Olvida en qué gastó el efectivo
- Apps que requieren cuenta bancaria

**Quote:** "Solo quiero saber cuánto puedo gastar hoy sin quedarme sin dinero mañana"

---

## 3. Core Features & Justificación

### 3.1 Dashboard Inteligente
**Status:** ✅ Implementado (v2.0.0)

**Justificación:**
El 80% de los usuarios abre la app para responder: "¿Puedo gastar X cantidad hoy?". El dashboard debe responder esta pregunta en < 3 segundos sin scrolling.

**Features clave:**
- **KPIs principales:** Gastos, Ingresos, Balance del mes actual
  - *Por qué:* Responde "¿cómo voy este mes?" de un vistazo
- **Comparativa temporal:** Mes anterior vs actual vs proyección
  - *Por qué:* Da contexto ("¿estoy gastando más o menos que antes?")
- **Próximos gastos a vencer:** Urgencia visual (colores)
  - *Por qué:* Previene olvidos y cargos por pago tardío
- **Top categorías:** Ranking de gastos
  - *Por qué:* Identifica patrones ("gasto mucho en delivery")

**Métricas de éxito:**
- Time to answer "¿puedo gastar?" < 5 segundos
- % de usuarios que regresan al dashboard (engagement)

### 3.2 Quick Add (FAB)
**Status:** ✅ Implementado (v2.0.0)

**Justificación:**
El mayor bloqueador para tracking de gastos es la fricción. Si toma > 10 segundos agregar un gasto, los usuarios abandonan.

**Features clave:**
- **FAB siempre visible:** Bottom-right en todas las pantallas
  - *Por qué:* Acceso inmediato sin buscar botón
- **Formulario simplificado:** Solo campos esenciales visibles
  - *Por qué:* Reduce fricción cognitiva
- **Campos avanzados colapsados:** Método pago, notas, etc.
  - *Por qué:* Usuarios avanzados tienen opciones, principiantes no se abruman
- **Validación en tiempo real:** Feedback inmediato
  - *Por qué:* Previene errores sin bloquear flujo

**Métricas de éxito:**
- Tiempo promedio para agregar gasto: < 15 segundos
- % de gastos agregados desde FAB vs form completo
- Tasa de abandono del form

### 3.3 Gastos Recurrentes Virtuales
**Status:** ✅ Implementado (v2.0.0)

**Justificación:**
Duplicar registros de Netflix cada mes es tedioso y satura la base de datos. La solución: plantillas que generan instancias virtuales.

**Features clave:**
- **Generación virtual:** Calcular próximas fechas sin crear registros
  - *Por qué:* BD limpia, menos clutter
- **Pago anticipado:** Convertir instancia virtual en registro real
  - *Por qué:* Flexibilidad para usuarios que pagan antes
- **Mensajes de urgencia:** "Vence en 3 días" vs "Vence en 2 semanas"
  - *Por qué:* Priorización visual según urgencia
- **Proyección automática:** Incluir recurrentes en proyección mes siguiente
  - *Por qué:* Planificación realista

**Decisión de diseño:**
Inicialmente consideramos crear registros reales cada mes automáticamente, pero:
- ❌ Satura la BD innecesariamente
- ❌ Dificulta cambios retroactivos (ej. cambio de monto)
- ✅ Solución virtual: Limpio, flexible, escalable

**Métricas de éxito:**
- % de gastos marcados como recurrentes
- Reducción en tiempo para gestionar gastos mensuales fijos

### 3.4 Vista Wise-Style (Timeline + Cards)
**Status:** ✅ Implementado (v2.0.0)

**Justificación:**
Las tablas tradicionales son funcionales pero intimidantes. Wise demostró que transacciones pueden ser hermosas y escaneables.

**Features clave:**
- **TransactionItem component:** Cards vs filas de tabla
  - *Por qué:* Más amigable visualmente, mejor en móvil
- **Agrupación temporal:** Today, Yesterday, This Week
  - *Por qué:* Contexto temporal natural
- **Filtros horizontales:** Chips vs dropdowns
  - *Por qué:* Más rápido, no requiere clicks extras
- **Search con Cmd+K:** Power user feature
  - *Por qué:* Usuarios avanzados lo esperan

**Decisión de diseño:**
Comparamos tabla tradicional vs cards:
- Tabla: Más densa, mejor para desktop
- Cards: Más escaneables, mejor para móvil
- ✅ Decisión: Cards responsive (se adaptan a pantalla)

**Métricas de éxito:**
- Tiempo para encontrar transacción específica
- % de usuarios que usan filtros
- Satisfacción en encuestas UX

### 3.5 Accesibilidad WCAG 2.1 AA
**Status:** ✅ Implementado (v2.0.0)

**Justificación:**
Finanzas personales son para todos, no solo usuarios sin discapacidades. Además, accesibilidad mejora UX para todos.

**Features clave:**
- **Touch targets ≥ 44px:** Estándar AAA
  - *Por qué:* Usable en móvil sin zoom
- **Contraste ≥ 4.5:1:** Legible bajo sol
  - *Por qué:* Usuario puede ver app en exterior
- **Navegación por teclado:** Cmd+K, arrows, Enter, Escape
  - *Por qué:* Power users son más rápidos con teclado
- **ARIA labels:** Screen reader friendly
  - *Por qué:* Inclusividad

**Decisión de producto:**
Accesibilidad no es feature opcional, es requisito base. No lanzamos features que no cumplan WCAG AA.

**Métricas de éxito:**
- 100% compliance en auditorías WCAG
- Lighthouse Accessibility score > 95

---

## 4. User Flows Principales

### 4.1 Primer Uso (Onboarding)

```
1. Usuario hace login con GitHub
   ↓
2. Dashboard vacío con empty state
   "¡Bienvenido! Empieza agregando tu primer gasto"
   ↓
3. Click en QuickAddFAB
   ↓
4. Form guiado: "Café $45"
   ↓
5. Success toast: "¡Gasto agregado!"
   ↓
6. Dashboard actualizado con primer gasto visible
```

**Objetivos:**
- Time to first value < 60 segundos
- Usuario entiende cómo funciona la app
- No requiere tutorial largo

**Métricas:**
- % de usuarios que agregan ≥ 1 gasto en primera sesión
- Time to first expense

### 4.2 Check Diario (Core Loop)

```
Usuario abre app (mobile)
   ↓
Dashboard carga en < 2s
   ↓
Ve KPIs: "Balance: +$3,500 MXN 💚"
   ↓
Scroll a "Próximos Gastos"
   ↓
Ve "Internet vence en 2 días"
   ↓
Click "Marcar como pagado" o cierra app satisfecho
```

**Objetivos:**
- Responder "¿cómo estoy?" en < 10 segundos
- Reducir ansiedad financiera
- Recordar pendientes sin notification spam

**Métricas:**
- Daily Active Users (DAU)
- Session duration (target: 30s-2min)
- Bounce rate (objetivo: < 40%)

### 4.3 Análisis Mensual

```
Fin de mes, usuario quiere entender gastos
   ↓
Dashboard → Ve comparativa 3 meses
   ↓
"Este mes gasté $18,500, mes pasado $16,200"
   ↓
Scroll a Top Categorías
   ↓
"40% en Comida ($7,200) 😱"
   ↓
Click en categoría "Comida"
   ↓
Lista de todos los gastos de comida del mes
   ↓
Insight: "Gasté $2,400 en delivery apps"
   ↓
Decisión: "Próximo mes cocino más"
```

**Objetivos:**
- Facilitar auto-reflexión financiera
- Identificar patrones de gasto
- Motivar cambios de comportamiento

**Métricas:**
- % de usuarios que revisan dashboard al final de mes
- % de usuarios que cambian hábitos (proxy: reducción en categoría top)

### 4.4 Configuración de Gasto Recurrente

```
Usuario sabe que paga Netflix cada mes
   ↓
Gastos → Agregar Gasto
   ↓
Descripción: "Netflix"
Monto: "$139"
Tipo: "Recurrente"
Frecuencia: "Mensual"
   ↓
Guardar
   ↓
Sistema genera próximas 12 instancias virtuales
   ↓
Dashboard → Próximos Gastos muestra:
"Netflix - Vence en 15 días - $139"
   ↓
En 15 días, usuario hace click "Pagar"
   ↓
Se crea registro real, desaparece de pendientes
```

**Objetivos:**
- Setup once, forget
- No duplicar trabajo cada mes
- Proyecciones realistas

**Métricas:**
- % de gastos marcados como recurrentes
- Tiempo ahorrado vs registro manual mensual

---

## 5. Success Metrics

### 5.1 KPIs de Producto

**Métrica Norte Estrella:**
**Monthly Active Users (MAU) con ≥ 10 transacciones registradas**

*Por qué:* Solo usuarios que registran activamente están obteniendo valor. < 10 transacciones/mes = app no integrada en vida diaria.

**KPIs Secundarios:**

| Métrica | Target | Actual (v2.0.0) | Tracking |
|---------|--------|-----------------|----------|
| **Engagement** |  |  |  |
| DAU/MAU ratio | > 20% | TBD | Analytics |
| Avg session duration | 1-3 min | TBD | Analytics |
| Sessions per week | > 3 | TBD | Analytics |
| **Adoption** |  |  |  |
| Time to first expense | < 60s | TBD | Analytics |
| % users with ≥ 1 recurring expense | > 40% | TBD | Database |
| % users with ≥ 3 categories | > 60% | TBD | Database |
| **Retention** |  |  |  |
| Week 1 retention | > 50% | TBD | Analytics |
| Month 1 retention | > 30% | TBD | Analytics |
| Month 3 retention | > 20% | TBD | Analytics |
| **Performance** |  |  |  |
| Dashboard load time | < 2s | TBD | Lighthouse |
| Lighthouse Performance | > 90 | TBD | Lighthouse |
| Lighthouse Accessibility | > 95 | TBD | Lighthouse |
| **UX** |  |  |  |
| Add expense time | < 15s | TBD | User testing |
| Find transaction time | < 10s | TBD | User testing |

### 5.2 Métricas por Feature

**Dashboard:**
- % de sesiones que inician en dashboard: > 80%
- Scroll depth: > 50% ven "Próximos Gastos"

**QuickAddFAB:**
- % de gastos agregados desde FAB vs form: > 60%
- Abandono de form: < 20%

**Gastos Recurrentes:**
- Avg recurrentes por usuario: > 5
- % de usuarios que usan proyección: > 30%

**Search & Filters:**
- % de usuarios que usan search: > 20%
- % de usuarios que usan filters: > 40%

### 5.3 Indicadores de Éxito del Usuario

No solo métricas de app, sino impacto real:

1. **Reducción de ansiedad financiera**
   - Encuesta NPS: "¿Qué tan ansioso te sientes sobre tus finanzas?"
   - Target: Reducción de 30% en score de ansiedad después de 1 mes de uso

2. **Mejora en balance mensual**
   - % de usuarios con balance positivo (Ingresos > Gastos)
   - Target: > 60% de usuarios activos

3. **Reducción en gastos hormiga**
   - Comparar gastos en categorías "Delivery", "Café", "Antojos" mes 1 vs mes 3
   - Target: Reducción de 15% en gasto en estas categorías

4. **Incremento en ahorro**
   - % de usuarios que registran transferencia a ahorro cada mes
   - Target: > 40% de usuarios (feature futura: metas de ahorro)

---

## 6. Roadmap & Priorización

### 6.1 Metodología de Priorización

Framework: **RICE Score**
- **Reach:** ¿Cuántos usuarios impacta? (1-10)
- **Impact:** ¿Qué tan fuerte? (0.25, 0.5, 1, 2, 3)
- **Confidence:** ¿Qué tan seguros estamos? (50%, 80%, 100%)
- **Effort:** ¿Cuánto tiempo? (persona-semanas)

**Score RICE = (Reach × Impact × Confidence) / Effort**

### 6.2 Features Planeadas (Q1-Q2 2026)

#### 🏆 Alta Prioridad

**1. Presupuestos por Categoría**
- **Descripción:** Definir límite mensual por categoría (ej. "Comida: $5,000/mes")
- **User Story:** "Como Ana, quiero limitar mi gasto en delivery para no gastar > $2,000/mes"
- **RICE Score:** 8 × 2 × 100% / 3 = **5.3**
- **Justificación:** Más solicitado por usuarios. Clave para control de gasto.
- **Effort:** 3 semanas (UI + backend + notificaciones)
- **Success Metric:** 60% de usuarios definen ≥ 1 presupuesto

**2. Exportar Gastos (CSV/PDF)**
- **Descripción:** Exportar lista filtrada de gastos a CSV (Excel) o PDF
- **User Story:** "Como Carlos, quiero exportar mis gastos de 'Trabajo' para declaración de impuestos"
- **RICE Score:** 7 × 1 × 100% / 2 = **3.5**
- **Justificación:** Necesario para contadores, declaraciones fiscales
- **Effort:** 2 semanas (backend export + PDF generation)
- **Success Metric:** 30% de usuarios exportan ≥ 1 vez al mes

**3. Gráficos de Tendencias**
- **Descripción:** Line chart de gastos/ingresos por mes (últimos 6 meses)
- **User Story:** "Como Ana, quiero ver si mis gastos están bajando mes a mes"
- **RICE Score:** 9 × 1.5 × 80% / 3 = **3.6**
- **Justificación:** Visualización de progreso motiva cambio de comportamiento
- **Effort:** 3 semanas (recharts integration + data aggregation)
- **Success Metric:** 40% de usuarios acceden a gráficos ≥ 1 vez al mes

#### ⚙️ Media Prioridad

**4. Recordatorios Automáticos (Email)**
- **Descripción:** Email 2 días antes de vencimiento de gasto recurrente
- **User Story:** "Como Carlos, quiero recordatorio para pagar renta antes de penalización"
- **RICE Score:** 6 × 1 × 80% / 2 = **2.4**
- **Justificación:** Previene olvidos, reduce stress
- **Effort:** 2 semanas (Supabase cron + email templates)
- **Success Metric:** < 5% de gastos marcados vencidos

**5. Adjuntar Recibos (Imágenes)**
- **Descripción:** Upload de foto de ticket/recibo por gasto
- **User Story:** "Como Carlos, quiero guardar recibos de gastos deducibles"
- **RICE Score:** 5 × 1 × 100% / 3 = **1.7**
- **Justificación:** Útil para freelancers, declaraciones de impuestos
- **Effort:** 3 semanas (Supabase Storage + upload UI + image optimization)
- **Success Metric:** 20% de usuarios suben ≥ 1 recibo

#### 📋 Baja Prioridad (Backlog)

**6. Tags Personalizados**
- **Descripción:** Agregar tags a gastos (ej. "trabajo", "personal", "deducible")
- **User Story:** "Como Carlos, quiero separar gastos personales de trabajo"
- **RICE Score:** 4 × 0.5 × 80% / 2 = **0.8**
- **Effort:** 2 semanas

**7. Multi-moneda**
- **Descripción:** Soporte para USD, EUR con conversión automática
- **User Story:** "Como Ana, quiero registrar compras en dólares de viaje a USA"
- **RICE Score:** 3 × 0.5 × 80% / 4 = **0.3**
- **Effort:** 4 semanas

**8. Notificaciones Push**
- **Descripción:** Web push notifications para recordatorios
- **User Story:** "Como Lupita, quiero notificación cuando me queden < $500"
- **RICE Score:** 5 × 1 × 50% / 3 = **0.8**
- **Effort:** 3 semanas

### 6.3 Roadmap Visual (2026)

```
Q1 2026 (Ene-Mar)
├── ✅ v2.0.0 Launch (COMPLETADO)
├── 🔨 Unit Tests (en progreso)
└── 🎯 Presupuestos por Categoría

Q2 2026 (Abr-Jun)
├── 📊 Gráficos de Tendencias
├── 📤 Exportar Gastos (CSV/PDF)
└── 📧 Recordatorios Automáticos

Q3 2026 (Jul-Sep)
├── 📎 Adjuntar Recibos
├── 🏷️ Tags Personalizados
└── 🎯 Metas de Ahorro v1

Q4 2026 (Oct-Dic)
├── 🌍 Multi-moneda
├── 🔔 Notificaciones Push
└── 🤖 Sugerencias Inteligentes (IA)
```

---

## 7. Decisiones de Producto

### 7.1 Por Qué Wise-Inspired UX?

**Contexto:**
Inicialmente teníamos tablas tradicionales para gastos (v1.0). Funcionaban pero usuarios reportaban:
- "Se siente como Excel"
- "Difícil de ver en móvil"
- "No es intuitivo qué gasto es urgente"

**Opciones consideradas:**
1. **Mantener tabla tradicional** - Familiar, funcional
2. **Inspirarse en Wise** - Moderna, mobile-first
3. **Copiar Mint/YNAB** - Probado en mercado

**Decisión: Wise-inspired (Opción 2)**

**Razones:**
- ✅ Wise tiene mejor UX móvil del mercado (data: 4.8★ App Store)
- ✅ Cards son más escaneables que filas de tabla
- ✅ Agrupación temporal da contexto natural
- ✅ Target user (Ana) usa apps modernas (Notion, Spotify)
- ❌ Mint/YNAB son buenos pero UI anticuada (2015 design)

**Trade-offs aceptados:**
- Cards ocupan más espacio vertical → Más scroll
- Pero: Usuarios móviles scroll natural, vale la pena

**Resultado:**
- v2.0.0 implementó Wise-style completamente
- Feedback inicial: "Se siente más profesional"
- Métricas pendientes en producción

### 7.2 Por Qué Gastos Recurrentes Virtuales?

**Contexto:**
En v1.0, usuarios pedían "recordatorios de gastos mensuales como Netflix".

**Opciones consideradas:**
1. **Duplicar registro real cada mes automáticamente**
   - Pros: Simple, registro completo en DB
   - Cons: Satura BD, dificulta cambios retroactivos
2. **Plantilla que genera instancias virtuales**
   - Pros: BD limpia, flexible
   - Cons: Más complejo técnicamente
3. **Solo recordatorios (no crear registros)**
   - Pros: Muy simple
   - Cons: Usuario debe crear gasto manualmente cada mes

**Decisión: Plantilla virtual (Opción 2)**

**Razones:**
- ✅ Escalable (1 registro genera N instancias)
- ✅ Cambio de monto aplica a futuras instancias
- ✅ Proyecciones realistas sin saturar BD
- ✅ UX superior: "Pagar" convierte virtual → real
- ❌ Más complejo implementar, pero vale la pena

**Implementación:**
- Función `getUpcomingRecurringExpenses()` genera instancias on-the-fly
- Pago crea registro real con `is_recurring=0`
- Dashboard usa proyecciones para "Próximo Mes"

### 7.3 Por Qué MXN Only (No Multi-moneda en v2.0)?

**Contexto:**
Usuarios preguntaron: "¿Puedo registrar gastos en USD?"

**Decisión: No en v2.0, planear para v2.3**

**Razones:**
- 🎯 Focus en mercado mexicano primero (80% de target users usan solo MXN)
- 🎯 Multi-moneda agrega complejidad:
  - API de conversión (costo mensual)
  - ¿Convertir automáticamente o manual?
  - ¿Mostrar en moneda original o convertido?
  - Edge cases: fluctuaciones, tasas históricas
- 🎯 MVP debe ser simple, agregar complejidad después

**Plan futuro:**
- Q4 2026: Implementar multi-moneda si ≥ 20% de usuarios lo solicitan
- Usar exchangerate-api.com (free tier: 1,500 requests/mes)

### 7.4 Por Qué Server Actions (No API Routes)?

**Contexto:**
Next.js 15 ofrece dos patterns para mutaciones:
1. API Routes (`/api/expenses`)
2. Server Actions (`'use server'`)

**Decisión: Server Actions**

**Razones:**
- ✅ Menos boilerplate (no crear archivos `/api/`)
- ✅ Type-safe automático (TypeScript end-to-end)
- ✅ Colocation (actions.ts junto a componentes)
- ✅ Mejor DX (Developer Experience)
- ✅ Recomendado por Vercel para Next.js 15

**Trade-offs:**
- ❌ No compatible con clientes externos (mobile app futura)
- Pero: Si hacemos app móvil, crear API wrapper sobre Server Actions

### 7.5 Por Qué Supabase (No Vercel Postgres)?

**Contexto:**
Necesitábamos base de datos PostgreSQL.

**Opciones:**
1. Vercel Postgres (integrado con Vercel)
2. Supabase (Postgres + Auth + Storage)
3. PlanetScale (MySQL)

**Decisión: Supabase**

**Razones:**
- ✅ Auth incluido (GitHub OAuth)
- ✅ Storage para recibos futuros
- ✅ Realtime subscriptions (sync multi-device futuro)
- ✅ Free tier generoso (500MB, 2GB bandwidth)
- ✅ Row Level Security (RLS) nativo
- ❌ Vercel Postgres más rápido pero sin Auth/Storage

**Trade-offs aceptados:**
- Supabase tiene cold starts (~200ms), aceptable
- Si escalamos mucho, migrar a Vercel Postgres + NextAuth

---

## Apéndice: Métricas de Baseline

**Usuarios actuales:** TBD (v2.0.0 recién lanzada)
**Transacciones registradas:** TBD
**Gastos recurrentes promedio:** TBD

**Actualizar después de 1 mes en producción.**

---

**Fin del PRD**
**Próxima revisión:** Marzo 2026
**Owner:** Luis Naranja (@luishron)
