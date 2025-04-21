
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExamPreview from "@/components/ExamPreview";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ExamDemo = () => {
  const [hasExam, setHasExam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a generated exam
    const storedExam = sessionStorage.getItem('generatedExam');
    setHasExam(!!storedExam);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            {hasExam ? "Tu Examen Generado" : "Examen de Muestra"}
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            {hasExam 
              ? "Este examen ha sido generado automáticamente basado en el contenido que seleccionaste. Responde las preguntas y revisa los resultados."
              : "No hay un examen generado. Regresa a la sección de exámenes para crear uno basado en tu contenido."}
          </p>

          {!hasExam && (
            <div className="flex justify-center mb-8">
              <Button onClick={() => navigate('/examenes')}>
                Generar un Examen
              </Button>
            </div>
          )}

          <ExamPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamDemo;
