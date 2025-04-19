
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExamPreview from "@/components/ExamPreview";

const ExamDemo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Examen de Muestra</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Este es un ejemplo de cómo se ve un examen generado en AprendeYa. Intenta responder a las preguntas y revisa los resultados.
          </p>
          <ExamPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamDemo;
