import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            >
              No podés mejorar{" "}
              <span className="text-primary">lo que no controlás</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mt-6 max-w-2xl mx-auto lg:mx-0">
              Homelas te muestra tu realidad financiera para que tomes mejores
              decisiones, todos los días.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Button
                size="lg"
                asChild
                className="h-12 px-8 text-base font-semibold"
                aria-label="Crear cuenta gratuita en Homelas"
              >
                <Link href="/login">Comenzar gratis →</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 px-8 text-base font-semibold"
                aria-label="Ver demo de Homelas"
              >
                <Link href="#pricing">Ver demo</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground mt-6">
              Gratis para siempre · Sin tarjeta de crédito · Sin trucos
            </p>
          </div>

          {/* Screenshot */}
          <div className="relative animate-fade-in-up lg:animate-fade-in-right">
            <div className="relative aspect-video rounded-xl border-2 border-border shadow-2xl overflow-hidden bg-card">
              <Image
                src="/screenshots/dashboard-light.png"
                alt="Dashboard de Homelas mostrando balance, gastos e ingresos en tiempo real con KPIs principales"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>

            {/* Decoración */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Pattern de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
