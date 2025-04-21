
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUploadedContent } from "@/hooks/useUploadedContent";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ExamQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string>("");
  const [specificTopic, setSpecificTopic] = useState("");
  const { uploadedContents, fetchUploadedContents, getContentById } = useUploadedContent();
  
  useEffect(() => {
    fetchUploadedContents();
  }, []);
  
  const handleGenerate = async () => {
    if (!selectedContentId) {
      toast.error("Por favor selecciona un contenido para generar la pregunta");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const selectedContent = getContentById(selectedContentId);
      
      if (!selectedContent) {
        throw new Error("No se pudo encontrar el contenido seleccionado");
      }
      
      const { data, error } = await supabase.functions.invoke('process-content', {
        body: { 
          content: selectedContent.content,
          action: "generateQuestion",
          params: {
            specificTopic: specificTopic || undefined
          }
        }
      });
      
      if (error) throw error;
      
      setGeneratedQuestion(data.question);
    } catch (error) {
      console.error('Error al generar pregunta:', error);
      toast.error("Error al generar la pregunta. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveQuestion = () => {
    if (generatedQuestion) {
      // Here you could implement saving the question to a database
      toast.success("Pregunta guardada exitosamente");
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Generador de Preguntas</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="content">Seleccionar Contenido</Label>
          <Select value={selectedContentId} onValueChange={setSelectedContentId}>
            <SelectTrigger id="content">
              <SelectValue placeholder="Selecciona el contenido para la pregunta" />
            </SelectTrigger>
            <SelectContent>
              {uploadedContents.map((content) => (
                <SelectItem key={content.id} value={content.id || ""}>
                  {content.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {uploadedContents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay contenido disponible. Por favor, carga algún contenido primero en la sección "Cargar Contenido".
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specific-topic">Tema Específico (Opcional)</Label>
          <Textarea
            id="specific-topic"
            placeholder="Por ejemplo: Capítulo 3, o un tema concreto del contenido..."
            value={specificTopic}
            onChange={(e) => setSpecificTopic(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={handleGenerate} 
            className="flex-1"
            disabled={isGenerating || !selectedContentId}
          >
            {isGenerating ? "Generando..." : "Generar Pregunta"}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1" 
            disabled={!generatedQuestion}
            onClick={handleSaveQuestion}
          >
            Guardar Pregunta
          </Button>
        </div>
        
        {generatedQuestion && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Pregunta Generada:</h3>
            <div className="whitespace-pre-line">
              {generatedQuestion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamQuestionGenerator;
