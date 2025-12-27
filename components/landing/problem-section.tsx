import { AlertCircle, TrendingDown, Calendar } from "lucide-react";

const problems = [
  {
    icon: AlertCircle,
    title: "¿Puedo comprar esto?",
    description:
      "Ves algo que quieres comprar pero no sabes si afectará tu presupuesto del mes.",
    color: "hsl(45 93% 47%)", // Amarillo
  },
  {
    icon: TrendingDown,
    title: "¿Por qué siempre me falta dinero?",
    description:
      "Ganas bien pero nunca sabes en qué se te va el dinero.",
    color: "hsl(0 72% 50%)", // Rojo
  },
  {
    icon: Calendar,
    title: "Olvidé pagar... otra vez",
    description:
      "Los recargos por olvidos suman cientos de pesos al mes.",
    color: "hsl(280 83% 63%)", // Morado
  },
];

export function ProblemSection() {
  return (
    <section
      className="py-16 md:py-20 bg-muted/30"
      aria-labelledby="problem-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2
            id="problem-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            ¿Te suena <span className="text-primary">familiar?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Te identificas con alguno? Homelas es para ti.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.title}
                className="animate-fade-in-up bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${problem.color}20`,
                  }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: problem.color }}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {problem.title}
                </h3>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
