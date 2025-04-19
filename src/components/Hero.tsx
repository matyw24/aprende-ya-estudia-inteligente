
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="inline-block p-4 bg-primary/10 rounded-full">
            <Book className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
              Estudia Inteligente con AprendeYa
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl">
              Transforma tu material de estudio en exámenes personalizados y resúmenes estructurados con la ayuda de IA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link to="/cargar">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
                Comenzar Ahora
              </Button>
            </Link>
            <Link to="#como-funciona">
              <Button size="lg" variant="outline" className="text-base">
                Cómo Funciona
              </Button>
            </Link>
          </div>
          <div className="mt-8 p-4 bg-accent rounded-lg text-sm text-accent-foreground max-w-md">
            Sin registro necesario. Comienza a usar la plataforma inmediatamente.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
