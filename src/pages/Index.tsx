
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import FAQs from "@/components/FAQs";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <FAQs />
        
        <section className="w-full py-12 md:py-24 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Listo para Transformar tus Estudios
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Únete a miles de estudiantes que ya están mejorando su proceso de aprendizaje.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <a href="/cargar" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                    Comenzar Gratis
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
