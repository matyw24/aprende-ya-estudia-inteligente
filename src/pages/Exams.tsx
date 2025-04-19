
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExamGenerator from "@/components/ExamGenerator";
import ExamQuestionGenerator from "@/components/ExamQuestionGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Exams = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Generador de Exámenes</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Crea exámenes personalizados con diferentes formatos de preguntas para evaluar tu conocimiento de manera efectiva.
          </p>
          
          <Tabs defaultValue="exam" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="exam">Examen Completo</TabsTrigger>
              <TabsTrigger value="question">Pregunta Individual</TabsTrigger>
            </TabsList>
            <TabsContent value="exam">
              <ExamGenerator />
            </TabsContent>
            <TabsContent value="question">
              <ExamQuestionGenerator />
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 max-w-3xl mx-auto p-4 bg-accent rounded-lg">
            <h3 className="font-semibold mb-2">¿Necesitas ver un ejemplo?</h3>
            <p>
              Mira nuestro <a href="/examen-demo" className="text-primary underline">examen de demostración</a> para entender cómo funcionará tu examen generado.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Exams;
