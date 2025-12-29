# Fundamentos científicos para una app de tracking de gastos
## Por qué registrar gastos funciona (y cuándo no)

Este documento resume **investigación académica relevante** sobre tracking financiero personal
y traduce esos hallazgos en **decisiones concretas de producto y UX** para una app de gastos
(como Tallify).

El objetivo no es “tener data”, sino **ayudar a las personas a decidir mejor antes de gastar**,
reducir ansiedad y sostener el hábito en el tiempo.

---

## 1. El problema real (por qué las personas fallan al llevar gastos)

La evidencia es consistente:

- Las personas **sí quieren** controlar sus gastos.
- Abandonan cuando el registro:
  - es costoso (tiempo, fricción),
  - genera culpa,
  - o no produce acciones claras.

Conclusión clave:
> El problema no es la motivación.  
> Es el diseño del sistema de tracking.

---

## 2. Modelo base: cómo funciona el tracking efectivo

### Paper clave (PRIORIDAD ALTA)
**Li, Dey & Forlizzi – “A Stage-Based Model of Personal Informatics Systems” (CHI 2010)**

Este trabajo define el modelo más citado para sistemas de tracking personal.

### Las 5 etapas del tracking

| Etapa | Qué pasa | Riesgo si falla |
|-----|---------|----------------|
| Preparación | Decidir empezar | Abandono temprano |
| Recolección | Registrar datos | Fricción mata el hábito |
| Integración | Ordenar / categorizar | Data inútil |
| Reflexión | Entender patrones | “Ok, ¿y ahora qué?” |
| Acción | Cambiar conducta | Sin impacto real |

### Implicación directa
> Si la **recolección es difícil**, todo el sistema fracasa.

---

## 3. Por qué los usuarios abandonan (y cómo evitarlo)

### Paper clave (PRIORIDAD ALTA)
**Epstein et al. – “Beyond Abandonment…” (2016)**

Analiza por qué las personas dejan apps de tracking (incluye finanzas).

### Hallazgos clave

1. El registro se siente como una **tarea administrativa**.
2. El sistema genera **culpa o juicio**.
3. Cuando el usuario “se atrasa”, prefiere abandonar antes que volver.

### Aplicación directa en la app

- Registro rápido (1–2 acciones).
- Lenguaje neutral:
  - ❌ “Gasto malo”
  - ✅ “Gasto no planificado”
- **Modo retorno**:
  - permitir completar días faltantes con estimaciones.
  - nunca castigar al usuario por volver tarde.

---

## 4. El hábito no se crea solo (recordatorios y refuerzo)

### Paper clave (PRIORIDAD MEDIA)
**Stawarz, Cox & Blandford – Habit formation (CHI 2015)**

### Idea central
Los hábitos requieren:
- **Señales** (prompts)
- **Refuerzo**
No solo “fuerza de voluntad”.

### Aplicación práctica

- Recordatorios con contexto:
  - “¿Cerramos los gastos de hoy en 20 segundos?”
- Refuerzo positivo:
  - “Balance actualizado”
  - “Semana cerrada correctamente”

Evitar:
- Notificaciones genéricas
- Frecuencia alta sin valor

---

## 5. De insight a acción (el punto donde muchas apps fallan)

### Paper clave (PRIORIDAD MEDIA)
**Kersten-van Dijk et al. – Self-insight & behavior change (2017)**

### Hallazgo clave
> Ver información **no cambia conducta** si no hay un puente claro hacia la acción.

### Regla de oro para producto
**Cada insight debe tener una acción inmediata asociada.**

Ejemplos:
- “Subió el gasto en delivery”
  → botón: “Definir tope semanal”
- “Esta suscripción pesa X por mes”
  → botón: “Pausar / revisar”

---

## 6. Psicología del gasto: el “dolor de pagar”

### Paper clásico (PRIORIDAD MEDIA)
**Prelec & Loewenstein – Mental Accounting (1998)**

### Idea clave
Las personas gastan más cuando:
- no perciben el impacto inmediato,
- el pago es abstracto (tarjeta, digital).

### Aplicación directa (muy alineada al diferencial de Tallify)

Antes de confirmar un gasto:
- Mostrar impacto futuro simple:
  - “Si gastás $X hoy, te quedan $Y hasta fin de mes (con gastos futuros incluidos).”

Esto no moraliza.
**Informa antes de decidir.**

---

## 7. Tabla de priorización (qué aplicar primero)

| Prioridad | Enfoque | Impacto |
|---------|--------|--------|
| Alta | Registro sin fricción | Retención |
| Alta | Lenguaje sin culpa | Confianza |
| Alta | Balance real futuro | Diferencial |
| Media | Prompts contextuales | Hábito |
| Media | Insight + acción | Cambio real |
| Media | Impacto previo al gasto | Decisiones mejores |

---

## 8. Checklist de producto (accionable)

### UX & Registro
- [ ] Agregar gasto en ≤ 2 acciones
- [ ] Plantillas de gastos frecuentes
- [ ] Gastos recurrentes automáticos
- [ ] Autocategorización editable

### Retención & Hábito
- [ ] Recordatorios con contexto
- [ ] Feedback positivo (no juicio)
- [ ] Modo retorno sin castigo

### Insights & Decisión
- [ ] Mostrar balance real (incluye futuros gastos)
- [ ] Un insight clave por período
- [ ] Insight → acción directa

### Lenguaje
- [ ] Neutral, empático
- [ ] Nunca moralizante
- [ ] Orientado a decidir, no a culpar

---

## 9. Conclusión

La evidencia es clara:

> Una app de gastos no triunfa por mostrar más datos,  
> sino por **reducir fricción, anticipar consecuencias y facilitar decisiones**.

Si el usuario:
- registra fácil,
- entiende su futuro financiero,
- y puede actuar sin ansiedad,

el producto se sostiene solo.

---

## Referencias principales

- Li, Dey & Forlizzi (2010). *A Stage-Based Model of Personal Informatics Systems*. CHI.
- Epstein et al. (2016). *Beyond Abandonment: Understanding Tracking Discontinuance*.
- Stawarz et al. (2015). *Habit formation in personal informatics*.
- Kersten-van Dijk et al. (2017). *Self-insight and behavior change*.
- Prelec & Loewenstein (1998). *Mental Accounting and Consumer Choice*.
