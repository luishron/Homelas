"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState } from "react";

type BillingPeriod = "monthly" | "annual";

const pricingPlans = [
  {
    name: "Gratis",
    price: "$0",
    period: "/mes",
    description: "Perfecto para empezar",
    features: [
      { text: "Gastos e ingresos ilimitados", included: true },
      { text: "10 categorías personalizables", included: true },
      { text: "3 métodos de pago", included: true },
      { text: "Dashboard con KPIs básicos", included: true },
      { text: "Gastos recurrentes básicos", included: true },
      { text: "Dark mode", included: true },
      { text: "Responsive mobile-first", included: true },
    ],
    cta: "Comenzar gratis",
    href: "/login",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 14.99,
    annualPrice: 149.9, // 10 meses (ahorra 2 meses)
    description: "Para profesionistas organizados",
    features: [
      { text: "Todo lo de Gratis", included: true },
      { text: "Categorías ilimitadas", included: true },
      { text: "Métodos de pago ilimitados", included: true },
      { text: "Gastos recurrentes avanzados", included: true },
      { text: "Búsqueda global instantánea (Cmd+K)", included: true },
      { text: "Filtros avanzados y presets", included: true },
      { text: "Dashboard completo con comparativas", included: true },
      { text: "Proyecciones de próximo mes", included: true },
      { text: "Soporte prioritario", included: true },
    ],
    cta: "Comenzar con Pro",
    href: "/login",
    popular: true,
  },
  {
    name: "Plus",
    monthlyPrice: 19.99,
    annualPrice: 199.9, // 10 meses (ahorra 2 meses)
    description: "Máximo control financiero",
    features: [
      { text: "Todo lo de Pro", included: true },
      { text: "Exportación de datos (CSV, PDF)", included: true },
      { text: "Reportes personalizados", included: true },
      { text: "Compartir dashboard", included: true },
      { text: "Múltiples monedas", included: true },
      { text: "Asesoría financiera", included: true },
    ],
    cta: "Próximamente",
    href: "#",
    popular: false,
    comingSoon: true,
  },
];

export function PricingTable() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");

  const getPrice = (plan: typeof pricingPlans[number]) => {
    if (plan.name === "Gratis") return { display: "$0", period: "/mes" };

    if (billingPeriod === "annual") {
      const monthlyEquivalent = plan.annualPrice! / 12;
      return {
        display: `$${monthlyEquivalent.toFixed(2)}`,
        period: "/mes",
      };
    }
    return {
      display: `$${plan.monthlyPrice!.toFixed(2)}`,
      period: "/mes",
    };
  };

  return (
    <section
      id="pricing"
      className="py-16 md:py-20 bg-background"
      aria-labelledby="pricing-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Planes para cada necesidad
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comienza gratis y escala cuando lo necesites. Al registrar y
            entender tus gastos,{" "}
            <span className="text-foreground font-medium">
              eliminás fugas de dinero que hacen que el plan se pague solo
            </span>
            .
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-pressed={billingPeriod === "monthly"}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                billingPeriod === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-pressed={billingPeriod === "annual"}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative animate-fade-in-up rounded-2xl p-8 ${
                plan.popular
                  ? "bg-card border-2 border-primary shadow-2xl scale-105"
                  : "bg-card border border-border shadow-lg"
              } ${plan.comingSoon ? "opacity-90" : ""}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                    Más popular
                  </Badge>
                </div>
              )}

              {/* Coming Soon Badge */}
              {plan.comingSoon && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge
                    variant="secondary"
                    className="px-4 py-1 text-sm font-semibold"
                  >
                    Próximamente
                  </Badge>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-foreground mb-2 mt-2">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">
                    {getPrice(plan).display}
                  </span>
                  {getPrice(plan).period && (
                    <span className="text-lg text-muted-foreground">
                      {getPrice(plan).period}
                    </span>
                  )}
                </div>
                {billingPeriod === "annual" && plan.name !== "Gratis" && !plan.comingSoon && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ${plan.annualPrice}/año • Ahorras ${((plan.monthlyPrice! * 12) - plan.annualPrice!).toFixed(2)}
                  </p>
                )}
                {billingPeriod === "monthly" && plan.name !== "Gratis" && !plan.comingSoon && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Facturado mensualmente
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className={`w-full h-11 ${
                  plan.popular
                    ? ""
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                disabled={plan.comingSoon}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">
              Todos los planes incluyen:
            </strong>{" "}
            Tus datos son tuyos. Sin letra chica. Cancela cuando quieras.
          </p>
        </div>
      </div>
    </section>
  );
}
