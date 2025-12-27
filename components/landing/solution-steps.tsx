import { Edit3, BarChart3, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Edit3,
    title: "Registra en 10 segundos",
    description:
      'Click en el botón verde, "Café $45" → Listo. 15 segundos vs 20 minutos en Excel.',
    benefit: "30 horas/año ahorradas",
    color: "hsl(98 100% 70%)", // Verde vibrante (primary)
  },
  {
    number: "2",
    icon: BarChart3,
    title: "Ve tu balance real",
    description:
      "No solo el saldo bancario. Tu balance real descontando gastos pendientes y recurrentes.",
    benefit: "Paz mental financiera",
    color: "hsl(220 89% 61%)", // Azul
  },
  {
    number: "3",
    icon: CheckCircle2,
    title: "Decide con confianza",
    description:
      '"Tengo $3,500 hasta quincena. Puedo comprar los zapatos de $1,200." Sin ansiedad.',
    benefit: "~$250/mes en gastos identificados",
    color: "hsl(142 76% 55%)", // Verde
  },
];

export function SolutionSteps() {
  return (
    <section
      className="py-16 md:py-20 bg-background"
      aria-labelledby="solution-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2
            id="solution-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Tu control financiero en{" "}
            <span className="text-primary">3 pasos simples</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="animate-fade-in-up bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Number badge */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 font-bold text-xl"
                  style={{
                    backgroundColor: `${step.color}20`,
                    color: step.color,
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                  style={{
                    backgroundColor: `${step.color}15`,
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: step.color }}
                    aria-hidden="true"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Benefit Badge */}
                <div
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `${step.color}20`,
                    borderColor: `${step.color}50`,
                    color: step.color,
                  }}
                >
                  {step.benefit}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
