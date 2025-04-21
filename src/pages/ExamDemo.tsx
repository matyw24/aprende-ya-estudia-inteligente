
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExamPreview from "@/components/ExamPreview";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ExamDemo = () => {
  const [hasExam, setHasExam] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a generated exam
    const storedExam = sessionStorage.getItem('generatedExam');
    if (storedExam) {
      try {
        const examData = JSON.parse(storedExam);
        setExamTitle(examData.title || "Tu Examen Generado");
        setHasExam(true);
        toast.success("Examen cargado correctamente");
      } catch (error) {
        console.error("Error al analizar el examen guardado:", error);
        setHasExam(false);
      }
    } else {
      setHasExam(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            {hasExam ? examTitle : "Examen de Muestra"}
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            {hasExam 
              ? "Este examen ha sido generado automáticamente basado en el contenido que seleccionaste. Responde las preguntas y revisa los resultados."
              : "No hay un examen generado. Regresa a la sección de exámenes para crear uno basado en tu contenido."}
          </p>

          {!hasExam && (
            <div className="flex flex-col items-center mb-8 gap-4">
              <p className="text-center text-muted-foreground">
                Para generar un examen, primero debes cargar contenido y luego seleccionarlo en la sección de exámenes.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/cargar')}>
                  Cargar Contenido
                </Button>
                <Button onClick={() => navigate('/examenes')}>
                  Generar un Examen
                </Button>
              </div>
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
