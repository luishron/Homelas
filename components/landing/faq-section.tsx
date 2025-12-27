"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Es realmente gratis?",
    answer:
      "Sí, el plan Gratis es 100% gratis para siempre. Incluye gastos e ingresos ilimitados, 10 categorías, 3 métodos de pago y todas las funciones básicas. Sin tarjeta de crédito requerida.",
  },
  {
    question: "¿Qué pasa si necesito más de 10 categorías?",
    answer:
      "Puedes hacer upgrade al plan Pro ($9.99/mes) para obtener categorías ilimitadas, gastos recurrentes avanzados, búsqueda global y más. El plan Pro se paga solo: usuarios identifican ~$250/mes en gastos innecesarios.",
  },
  {
    question: "¿Se conecta con mi banco?",
    answer:
      "No. Homelas NO accede a tu cuenta bancaria. Tú registras manualmente tus gastos. Esto te da control total y funciona con cualquier banco o efectivo.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Usamos Supabase (infraestructura enterprise-grade) con encriptación y Row Level Security. Solo tú puedes ver tus datos. No vendemos ni compartimos tu información.",
  },
  {
    question: "¿Funciona en móvil?",
    answer:
      "Perfectamente. Homelas está diseñada mobile-first. 80% de usuarios la usan principalmente desde el celular. Funciona en cualquier navegador moderno.",
  },
  {
    question: "¿Cuánto tiempo toma configurar?",
    answer:
      "5 minutos hasta agregar tu primer gasto. No hay curva de aprendizaje. Es intuitivo desde el primer uso.",
  },
  {
    question: "¿Puedo exportar mis datos?",
    answer:
      "Sí, puedes exportar todo y eliminar tu cuenta cuando quieras. Tus datos son tuyos. Sin ataduras.",
  },
];

export function FAQSection() {
  return (
    <section
      className="py-16 md:py-20 bg-muted/30"
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Preguntas <span className="text-primary">frecuentes</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Todo lo que necesitas saber sobre Homelas
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
