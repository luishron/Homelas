import Link from "next/link";
import { Logo } from "./logo";

export function FooterLanding() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-card/50"
      aria-label="Footer del sitio"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Single row footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          {/* Copyright */}
          <p className="text-center md:text-left">
            © {currentYear} Homelas. Tu control financiero personal.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
